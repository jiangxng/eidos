#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const forbiddenTrustedClaims = new Set(['authorized', 'permission_granted', 'permissionGranted']);

function collectForbidden(value, current = '$', hits = []) {
  if (!value || typeof value !== 'object') return hits;
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectForbidden(v, `${current}[${i}]`, hits));
    return hits;
  }
  for (const [key, child] of Object.entries(value)) {
    const p = `${current}.${key}`;
    if (forbiddenTrustedClaims.has(key) && child === true) hits.push(p);
    collectForbidden(child, p, hits);
  }
  return hits;
}

export function validateHostNeutralActionRequestSemantic(value) {
  const diagnostics = [];
  const req = (key) => {
    if (!(key in value) || value[key] === null || value[key] === '') diagnostics.push({ code: 'EIDOS_ACTION_REQUIRED', path: `$.${key}`, message: `${key} is required for convergence readiness` });
  };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, diagnostics: [{ code: 'EIDOS_ACTION_TYPE', path: '$', message: 'ActionRequest must be an object' }] };

  for (const key of ['action_request_id','contract_version','experience_instance_id','experience_contract_version','capability_id','capability_version','action_semantic','action_contract_id','action_contract_version','action_target_ref','interaction_context','submitted_values','correlation_id','causation_id','occurred_at']) req(key);

  if ('command' in value || value.type === 'command') diagnostics.push({ code: 'EIDOS_ACTION_HOST_NEUTRAL', path: '$', message: 'Core ActionRequest must not require EVO/command-shaped semantics' });
  for (const p of collectForbidden(value)) diagnostics.push({ code: 'EIDOS_ACTION_TRUSTED_AUTH_CLAIM', path: p, message: 'Client-originated trusted authorization assertions are forbidden' });

  if (value.confirmation_evidence !== undefined) {
    const c = value.confirmation_evidence;
    if (!c || typeof c !== 'object' || Array.isArray(c)) diagnostics.push({ code: 'EIDOS_ACTION_CONFIRMATION_TYPE', path: '$.confirmation_evidence', message: 'confirmation_evidence must be an object' });
    else for (const key of ['confirmed_at','interaction_instance_id','actor_ref','confirmation_method','presented_contract_version']) {
      if (!(key in c) || c[key] === null || c[key] === '') diagnostics.push({ code: 'EIDOS_ACTION_CONFIRMATION_REQUIRED', path: `$.confirmation_evidence.${key}`, message: `${key} is required when confirmation evidence is present` });
    }
  }

  if (!('presented_state_etag' in value) && !('presented_definition_version' in value)) diagnostics.push({ code: 'EIDOS_ACTION_TOCTOU_EVIDENCE', path: '$', message: 'At least one presentation-state/version evidence field should be available for stale-state checks when target semantics require it' });

  return { ok: diagnostics.length === 0, diagnostics };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2] ?? process.env.EIDOS_ACTION_REQUEST_FIXTURE;
  if (!file) {
    console.error('Usage: node tools/action-request-readiness-harness.mjs <canonical-action-request-fixture.json>');
    process.exit(2);
  }
  const full = path.resolve(file);
  const value = JSON.parse(fs.readFileSync(full, 'utf8'));
  const result = validateHostNeutralActionRequestSemantic(value);
  if (result.ok) console.log(`PASS ${full}`);
  else {
    console.error(`FAIL ${full}`);
    for (const d of result.diagnostics) console.error(`${d.code} ${d.path}: ${d.message}`);
    process.exitCode = 1;
  }
}
