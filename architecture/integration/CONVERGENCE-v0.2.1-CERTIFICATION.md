# Eidos — Architecture Convergence v0.2.1 Upstream Certification

Status: PARTIAL (fixture-backed Eidos slice implemented; additional canonical invalid evidence pending)

Convergence source: `jiangxng/EVO-EC-Eidos-Convergence@certification/v0.2.1-proof`, `fixtures/v0.2.1/`.

This document does not redefine frozen Architecture / Ownership / Contract Semantics. Canonical fixtures remain in Convergence and are consumed by path at test time; Eidos does not copy them.

## Implemented consumer/provider boundary

`src/convergence/v021.ts` provides an Eidos-owned implementation adapter only:
- canonical Experience Proposal v1 consumer validation;
- capability ID/version negotiation;
- mandatory-evidence, Stability, Shared Core, accessibility and Decision Integrity checks;
- deterministic standard fallback validation and diagnostics;
- Host-neutral ActionRequest v1 validation and producer;
- trusted authorization-result rejection;
- explicit EcExperienceProposalV010 adapter with no silent version guessing.

The Convergence proof fixture uses `decision-panel@1.0.0`, while Eidos implementation catalog remains `decision-panel@0.1.0`. This branch therefore declares a narrow executable convergence compatibility profile `decision-panel canonical 1.0.0 -> current Eidos decision-panel implementation 0.1.0`. It does not rewrite the Eidos catalog or claim arbitrary version equivalence.

## Canonical fixture evidence currently available to Eidos

Expected ACCEPT:
- `shared-envelope/human-context.valid.json`
- `experience-proposal/decision-experience.valid.json`
- `action-request/approve-action.valid.json`
- `integration/apm-causal-chain.valid.json`

Expected FAIL CLOSED:
- `experience-proposal/shared-core-override.invalid.json` -> `EIDOS_XP_SHARED_CORE_OVERRIDE`
- `action-request/tampered-confirmation.invalid.json` -> trusted authorization claim rejection

The requested invalid cases `unsupported capability/version` and `missing mandatory evidence` are implemented in the Eidos validator but no corresponding canonical files are present in the current `experience-proposal/` fixture directory on the proof branch. They cannot be claimed as canonical-fixture-passed until Convergence publishes those evidence files. The same applies to standalone accessibility violation, invalid fallback, and EC business-authorization/execution invalid fixtures.

## v0.1 -> canonical adapter mapping

PRESERVED:
- proposalId, producedAt;
- composition experience identity;
- region identity and Stability;
- context;
- rationale/evidence where representable.

TRANSFORMED:
- `composition` -> canonical `experience`;
- legacy `region.capability` -> `capabilityId + capabilityVersion` only through an explicit supplied/certified map.

DEFAULTED:
- `fallback.mode=standard` only because this is existing deterministic Eidos policy.

UNSUPPORTED / FAIL CLOSED:
- capability version when no explicit certified map exists;
- mandatoryEvidence when not explicit in v0.1;
- explicit Shared Core partition absent from v0.1;
- canonical action contract identity absent from v0.1;
- canonical Decision Integrity semantics that cannot be proved from v0.1;
- any business authorization/execution assertion.

No silent guessing is allowed.

## ActionRequest provider properties

The new v1 producer is Host-neutral and does not use the historical command-shaped `ActionRequestV010`. It preserves Experience and Capability versions, targetRef, confirmation evidence, correlation/optional causation, submitted values, `presentedStateEtag`, and `presentedDefinitionVersion`. Recursive trusted-authorization fields are rejected. Confirmation evidence is never converted into authorization.

Historical `ActionRequestV010` remains unchanged for compatibility; EVO-specific mapping stays outside Eidos core.

## Test harness

`tests/compat/convergence-v021-canonical.test.mjs` reads the canonical fixture root directly through `CONVERGENCE_FIXTURES_DIR`.

`tools/convergence-fixture-harness.mjs` walks that external root and treats `.valid.json` as accept evidence and `.invalid.json` as fail-closed evidence. Non-Eidos contract families are skipped rather than reimplemented.

`tools/convergence-v021-fixture-adapter.mjs` binds only the Eidos-owned/shared integration slice.

Run after mounting/checking out the Convergence fixture directory:

`CONVERGENCE_FIXTURES_DIR=/path/to/EVO-EC-Eidos-Convergence/fixtures/v0.2.1 npm run test:convergence:v0.2.1`

## Certification state

- Experience Proposal consumer: PARTIAL -> available canonical golden + Shared Core invalid covered; additional requested canonical invalid fixtures pending.
- Capability/version negotiation: READY for currently published proof (`decision-panel@1.0.0`) through explicit compatibility profile.
- Mandatory evidence: PARTIAL -> implementation exists, canonical negative fixture pending.
- Experience Stability: READY.
- Shared Core / Personal Periphery: PARTIAL -> Shared Core override canonical invalid covered; broader periphery cases not yet evidenced.
- Accessibility: PARTIAL -> implementation exists, canonical invalid fixture pending.
- Deterministic fallback/diagnostics: PARTIAL -> implementation exists, canonical invalid fixture pending.
- Host-neutral ActionRequest producer: READY for current canonical golden shape.
- Confirmation != authorization / trusted auth rejection: READY for current canonical tampered-confirmation fixture.
- TOCTOU evidence preservation: READY for current canonical ActionRequest golden.
- APM Eidos causal segment: READY for current canonical integration fixture.

Overall: PARTIAL.

## Contract semantic conflict

NONE discovered.

The missing invalid fixtures are executable-evidence coverage gaps, not semantic conflicts. No CRCP is opened from Eidos at this stage.
