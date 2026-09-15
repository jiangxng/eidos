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
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function fail(message) { console.error(`[EIDOS_CONVERGENCE_HARNESS] ${message}`); process.exitCode = 1; }

const root = process.env.CONVERGENCE_FIXTURES_DIR;
const adapterPath = process.env.EIDOS_CONVERGENCE_ADAPTER;
if (!root) fail('CONVERGENCE_FIXTURES_DIR is required and must point to the Convergence-owned canonical fixture root. Fixtures are not copied into Eidos.');
else if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) fail(`Fixture root does not exist or is not a directory: ${root}`);
else if (!adapterPath) fail('EIDOS_CONVERGENCE_ADAPTER is required. The adapter must explicitly understand canonical evidence; the harness will not guess field mappings.');
else {
  const resolvedAdapter = path.resolve(adapterPath);
  if (!fs.existsSync(resolvedAdapter)) fail(`Adapter module not found: ${resolvedAdapter}`);
  else {
    const mod = await import(pathToFileURL(resolvedAdapter).href);
    if (typeof mod.validateConvergenceFixture !== 'function') fail('Adapter module must export validateConvergenceFixture({file, fixture}).');
    else {
      const files = walkJson(path.resolve(root)).filter(f=>!f.endsWith(`${path.sep}MANIFEST.json`));
      if (!files.length) fail(`No JSON fixtures found under ${root}`);
      let passed = 0, failed = 0, skipped = 0;
      for (const file of files) {
        const rel=path.relative(root,file);
        const expected = file.endsWith('.invalid.json') ? false : file.endsWith('.valid.json') ? true : null;
        if(expected===null){skipped++;console.log(`SKIP ${rel} (no .valid/.invalid evidence suffix)`);continue;}
        try {
          const result = await mod.validateConvergenceFixture({ file, fixture: readJson(file) });
          if (!result || typeof result.ok !== 'boolean') throw new Error('adapter returned no {ok:boolean} result');
          if (result.ok === expected) { passed++; console.log(`PASS ${rel} expected=${expected?'accept':'fail-closed'}`); }
          else { failed++; console.error(`FAIL ${rel} expected=${expected?'accept':'fail-closed'} actual=${result.ok?'accept':'reject'}`); for (const d of result.diagnostics ?? []) console.error(`  ${d.code ?? 'EIDOS'} ${d.path ?? '$'} ${d.message ?? String(d)}`); }
        } catch (error) { failed++; console.error(`ERROR ${rel}: ${error?.message ?? error}`); }
      }
      console.log(`Eidos Convergence fixture harness: ${passed} passed, ${failed} failed, ${skipped} skipped`);
      if (failed) process.exitCode = 1;
    }
  }
}
