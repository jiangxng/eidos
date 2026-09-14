#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

function walkJson(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJson(full));
    else if (entry.isFile() && entry.name.endsWith('.json')) out.push(full);
  }
  return out.sort();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function fail(message) {
  console.error(`[EIDOS_CONVERGENCE_HARNESS] ${message}`);
  process.exitCode = 1;
}

const root = process.env.CONVERGENCE_FIXTURES_DIR;
const adapterPath = process.env.EIDOS_CONVERGENCE_ADAPTER;

if (!root) {
  fail('CONVERGENCE_FIXTURES_DIR is required and must point to the Convergence-owned canonical fixture root. Fixtures are not copied into Eidos.');
} else if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  fail(`Fixture root does not exist or is not a directory: ${root}`);
} else if (!adapterPath) {
  fail('EIDOS_CONVERGENCE_ADAPTER is required. The adapter must explicitly understand the canonical contract version; the harness will not guess field mappings.');
} else {
  const resolvedAdapter = path.resolve(adapterPath);
  if (!fs.existsSync(resolvedAdapter)) {
    fail(`Adapter module not found: ${resolvedAdapter}`);
  } else {
    const mod = await import(pathToFileURL(resolvedAdapter).href);
    if (typeof mod.validateConvergenceFixture !== 'function') {
      fail('Adapter module must export validateConvergenceFixture({file, fixture}).');
    } else {
      const files = walkJson(path.resolve(root));
      if (!files.length) fail(`No JSON fixtures found under ${root}`);
      let passed = 0;
      let failed = 0;
      for (const file of files) {
        const fixture = readJson(file);
        try {
          const result = await mod.validateConvergenceFixture({ file, fixture });
          if (!result || typeof result.ok !== 'boolean') {
            throw new Error('adapter returned no {ok:boolean} result');
          }
          if (result.ok) {
            passed += 1;
            console.log(`PASS ${path.relative(root, file)}`);
          } else {
            failed += 1;
            console.error(`FAIL ${path.relative(root, file)}`);
            for (const d of result.diagnostics ?? []) console.error(`  ${d.code ?? 'EIDOS'} ${d.path ?? '$'} ${d.message ?? String(d)}`);
          }
        } catch (error) {
          failed += 1;
          console.error(`ERROR ${path.relative(root, file)}: ${error?.message ?? error}`);
        }
      }
      console.log(`Eidos Convergence fixture harness: ${passed} passed, ${failed} failed, ${files.length} total`);
      if (failed) process.exitCode = 1;
    }
  }
}
