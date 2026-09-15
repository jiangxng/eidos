# Eidos Convergence Upstream Readiness — v0.2.1

Status: WORKING BRANCH / consumer-readiness input

Baseline main commit: `52f8923ab2b4ee833ae5b05623bfd180f554570a`

Scope: Eidos upstream readiness for Architecture Convergence G4/G5 executable certification. This document does not define or freeze canonical cross-repository schemas. Canonical schemas and fixtures remain governed by the Convergence Workspace.

## Guardrails

- Do not expand architecture vocabulary in this phase.
- Do not copy/fork canonical Convergence schemas or fixtures into Eidos.
- Eidos consumes canonical fixtures from an externally supplied fixture root.
- EC must not depend on Eidos renderers or internal implementation.
- EVO Command semantics must not be written into the Eidos core ActionRequest contract.
- Unknown/unsupported canonical semantics fail closed; adapters do not guess.

## 1. Convergence Adoption Inventory

| Area | Status | Current real implementation | Readiness note |
|---|---|---|---|
| Experience Proposal consumer/validator | PARTIAL | `src/ec/contracts.ts`, `src/experience/validate.ts` | v0.1 proposal is typed, but no single canonical proposal validator exists yet. Composition/context validation is real. |
| Experience Capability Catalog/version negotiation | PARTIAL | `src/capabilities/catalog.ts`, capability docs/catalog | Catalog exists; canonical cross-contract negotiation profile is not yet consumed. |
| Experience Stability | READY | `ExperienceStability`, region/constraint stability classes | `invariant/shared-stable/personal-stable/adaptive` are explicit. |
| Experience Integrity | PARTIAL | Constitution + `src/experience/policy.ts` | Some integrity rules are enforced (decision-critical attention, reduce-motion); full canonical invalid-case enforcement is incomplete. |
| Shared Core / Personal Periphery | PARTIAL | collaboration context + shared-mode diagnostics | Shared reference is represented; personalization-overrides-shared-core rejection is not yet a complete validator rule. |
| Decision Experience | PARTIAL | decision capability family exists | Capabilities exist, but canonical Decision Integrity validation is not centralized in proposal validation. |
| mandatory evidence | GAP | capability-level concepts only | No canonical proposal-level machine rule proving required evidence is present. |
| attention semantics | READY | `AttentionSemantic`, validator, resolver | Enum validation and decision-critical escalation are deterministic. |
| motion semantics | READY | `MotionSemantic`, validator, reduce-motion enforcement | Deterministic semantic validation and accessibility override exist. |
| direct manipulation semantics | PARTIAL | customization/direct-manipulation capability assets/tests | Semantics exist in Eidos, but not yet mapped from canonical Experience Proposal intent by one consumer boundary. |
| accessibility constraints | PARTIAL | `AccessibilityContext`, reduce-motion policy | Accessibility context exists; canonical accessibility violation set is not fully validated. |
| deterministic fallback/diagnostics | PARTIAL | structured diagnostics in validators; resolver diagnostics | Diagnostic machinery exists; canonical fallback admissibility/unsupported capability behavior needs explicit consumer rules. |
| Host-neutral ActionRequest producer | GAP | current `ActionRequestV010` is `type: command` and contains `command` | Current v0.1 producer is EVO/command-shaped. Must be adapted/replaced behind a new upstream consumer/producer slice once Convergence schema is available. |

Status meanings: READY = current implementation directly supports the semantic; PARTIAL = real supporting implementation exists but canonical boundary enforcement/mapping is incomplete; GAP = implementation absent or current contract shape is incompatible; BLOCKED = cannot proceed without external canonical artifact/decision.

## 2. Experience Proposal -> Eidos Runtime Mapping

The canonical Experience Proposal is consumed semantically, never by binding EC to renderer implementation.

| Canonical semantic intent | Eidos public/runtime handling | Current status |
|---|---|---|
| proposal identity/version | Convergence consumer adapter -> Eidos validation entrypoint | GAP until canonical schema fixture exists |
| capability id | Capability Catalog discovery/lookup | READY/PARTIAL for versioned negotiation |
| capability version | Capability Catalog + compatibility check | PARTIAL |
| Experience Stability | `ExperienceRegion.stability`, presentation constraints, policy resolver | READY |
| shared/personal/adaptive regions | Experience context + collaboration context + policy resolver | PARTIAL |
| Decision Experience | public decision capabilities + Experience validation | PARTIAL |
| mandatory evidence | decision/evidence capability validation | GAP at canonical proposal boundary |
| attention semantics | `AttentionSemantic` validator + `enforceAttention()` | READY |
| motion semantics | `MotionSemantic` validator + `enforceMotion()` | READY |
| accessibility requirements | `AccessibilityContext` + deterministic resolver policies | PARTIAL |
| direct manipulation | public customization/direct-manipulation capabilities | PARTIAL |
| fallback requirements | validator diagnostics + explicit deterministic fallback policy | PARTIAL |
| renderer support | capability/terminal compatibility layer, not EC renderer selection | PARTIAL |
| diagnostics | `Diagnostic`/`ValidationResult` plus experience resolver diagnostics | READY/PARTIAL |
| business authorization/execution attempt | reject at consumer boundary; never realize as business side effect | REQUIRED GAP rule for canonical adapter |

Renderer classes/components are deliberately absent from this mapping. EC targets semantic capability contracts only.

## 3. Consumer Contract Test Harness

Eidos must read canonical fixtures from the Convergence checkout/artifact directly. No fixture copy is committed here.

Harness convention:

```text
CONVERGENCE_FIXTURES_DIR=/path/to/EVO-EC-Eidos-Convergence/<canonical-fixture-root>
node tools/convergence-fixture-harness.mjs
```

The harness loader:

- recursively reads canonical JSON fixtures from the supplied external root;
- never rewrites them;
- requires explicit fixture expectation metadata or an explicit test manifest supplied by Convergence;
- refuses unknown contract identity/version rather than guessing;
- separates adapter result from Eidos validation result;
- can be used by CI after Convergence publishes canonical fixture locations.

Until canonical v0.2.1 schemas/fixtures are published, this harness is infrastructure-ready but certification remains externally BLOCKED.

## 4. Host-neutral ActionRequest Producer Readiness

Current v0.1 implementation is intentionally classified GAP for canonical Host-neutral requirements.

Current `ActionRequestV010` includes:

- `type: "command"`
- `command.code`
- `command.inputVersion`
- values/source interaction/action/runtime instance/requiresConfirmation

Canonical readiness requires a producer/adapter that can prove:

- no EVO assumption in Eidos core contract;
- neutral `action_target_ref`;
- Experience/capability/action contract version references;
- confirmation evidence when confirmation is required;
- `presented_state_etag` / `presented_definition_version` support;
- no trusted `authorized=true` / `permission_granted=true` assertions;
- submitted-value integrity can be checked/rejected when confirmation evidence binds to values/state;
- deterministic interaction semantics.

The first implementation slice must not mutate the historical `ActionRequestV010` meaning. A new upstream adapter/producer is introduced only after consuming the Convergence-owned canonical schema.

## 5. EVO Integration Profile Compatibility Requirements

Eidos core knows only Host-neutral ActionRequest semantics.

Certified EVO mapping profile requirements:

1. Host maps neutral `action_target_ref` to a published/versioned EVO Command target.
2. Host/EVO independently authenticate and authorize.
3. Human confirmation evidence is not authorization.
4. correlation/causation and relevant presentation-state evidence survive mapping.
5. unsupported target/version fails closed.
6. mapping is versioned and testable independently of Eidos renderers.
7. no EVO Command field is made mandatory in the Eidos core ActionRequest solely for the EVO profile.

Canonical chain remains:

`Eidos ActionRequest -> Host Adapter -> EVO Command`

## 6. Required Invalid Experience Proposal Cases

The Eidos consumer certification suite must reject or deterministically constrain the following canonical fixtures as specified by Convergence:

- unknown capability;
- unsupported capability version;
- mandatory evidence missing;
- Shared Core overridden by personalization;
- accessibility violation;
- Decision Integrity violation;
- unsupported renderer/capability combination;
- invalid fallback;
- EC proposal attempting business authorization or execution.

The exact JSON paths/error codes are not frozen here. They are derived from Convergence canonical schemas/fixtures when published.

## 7. `EcExperienceProposalV010` -> Future Canonical Adapter Feasibility

Current v0.1 fields:

- `proposalId`
- `producedAt`
- `composition`
- `context`
- optional `adaptation`
- optional `rationale[]`

### PRESERVED

Can be preserved when canonical equivalents exist:

- proposal identity;
- produced timestamp;
- composition experience id/title/regions;
- region capability identifier;
- region stability;
- attention semantics;
- motion semantics;
- context mode/role/task/locale/device/accessibility/collaboration;
- adaptation density/explanation preferences;
- rationale text/evidence references as provenance/rationale material.

### TRANSFORMED

Requires explicit deterministic mapping rule:

- unversioned `region.capability` -> canonical capability id + version. Version cannot be invented; a registry mapping/pin is required.
- v0.1 `stableRegionIds` -> canonical stability/adaptive-region representation.
- v0.1 collaboration/shared-reference context -> canonical shared-core semantics.
- v0.1 rationale evidence strings -> canonical evidence/provenance references, only if reference type mapping is explicit.

### DEFAULTED

May be defaulted only if the canonical contract explicitly publishes a deterministic default:

- fallback behavior;
- diagnostic preference/profile;
- renderer negotiation preference;
- optional accessibility attributes not present in v0.1.

No Eidos-local default is allowed to masquerade as a canonical default.

### UNSUPPORTED / CANNOT BE INFERRED SAFELY

- mandatory-evidence obligations not represented in v0.1;
- Decision Integrity constraints not represented explicitly;
- action contract ids/versions;
- canonical capability version where only a string capability id exists;
- explicit business-authorization prohibition fields if canonical schema requires declaration;
- full Shared Core / Personal Periphery partition where v0.1 only has stability hints;
- canonical fallback contract if not derivable from existing fields;
- canonical renderer-support negotiation if a proposal requires explicit negotiated support.

Unsupported semantics must fail adapter validation or require a Convergence-certified mapping profile. Silent guessing is prohibited.

## 8. Proposed First Upstream Implementation Slice

After Convergence publishes candidate schemas + golden/invalid fixtures:

1. Add `src/convergence/` consumer adapter boundary that imports no Convergence source code at runtime and accepts parsed canonical payloads through a versioned adapter interface.
2. Implement canonical Experience Proposal -> current Eidos Experience validation/resolution mapping for semantics classified PRESERVED/TRANSFORMED with explicit registry pins.
3. Add missing deterministic invalid rules: unknown/versioned capability, mandatory evidence, shared-core integrity, Decision Integrity, invalid fallback, business-execution attempt.
4. Add Host-neutral ActionRequest producer/adapter without changing historical `ActionRequestV010` semantics.
5. Bind tests directly to Convergence canonical fixtures via external fixture root.
6. Add separately certified EVO mapping-profile tests without importing EVO internals.

## 9. Blocking Cross-repo Issues

Architecture/ownership blocker: NONE.

Executable certification dependency: canonical Convergence schemas/fixture manifest and golden/invalid fixtures are not yet available. This is an expected G4 dependency, not an architecture blocker.

Eidos implementation blocker discovered internally: current `ActionRequestV010` is command-specific, so Host-neutral production cannot be certified until the new canonical ActionRequest schema/fixture is available for an explicit adapter/producer implementation.
