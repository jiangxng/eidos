# Eidos v1 Reference — Status

**Release:** `1.0.0-candidate.1`  
**Architecture authority:** `CONSTITUTION.md`  
**Protected upstream baseline:** `jiangxng/eidos@55da1bd95a960132bbce10346b30cb40cafe51cf`

## Validation status

- TypeScript strict profile: PASS
- Runtime / UIDL contract tests: PASS
- JSON boundary tests: PASS
- VNode bridge tests: PASS
- TreeSelect state-machine tests: PASS
- Capability discovery tests: PASS
- Experience policy tests: PASS
- Customization invariant tests: PASS
- Collaboration boundary tests: PASS
- Repository deterministic validation: PASS

## Canonical candidate architecture

- Constitution
- LLM repository map and task protocol
- Capability Catalog
- ExperienceContext
- ExperienceComposition
- EC -> Eidos proposal boundary
- Attention semantics
- Motion semantics
- Experience stability classes
- Shared Core / Personal Periphery
- Constrained Page Customization
- Decision model
- deterministic standard fallback
- Runtime/Host business-truth boundary

## Candidate capabilities

- hierarchical-selection
- decision-panel
- evidence-stack
- impact-preview
- exception-queue
- diff-view
- confirmation
- timeline
- adaptive-layout
- shared-focus

`candidate` means the semantic boundary exists but not every renderer and production-hardening requirement is finished.

## Legacy/convergence assets

The existing core renderer/form implementation and the converged TreeSelect implementation are preserved as implementation assets. Historical implementation remains valuable but does not override Constitution.

## Known unresolved item

The supplied historical UIDL `0.1.0` artifact has an identity/hash inconsistency. Eidos does not silently claim compatibility. The corrected convergence profile uses UIDL `0.1.1` until cross-project identity is explicitly resolved.

## Important non-goals

- Eidos does not understand Human Intent.
- Eidos does not own long-term user learning.
- Eidos does not own business truth.
- Eidos does not execute arbitrary LLM/EC-generated executable code in Core Runtime.
- Personalization is not required for correctness.


## App Host foundation — 2026-09-23

Initial `src/app-host` implementation now exists on the pure-frontend positioning branch.

Implemented foundation:

- public ExperienceSource port;
- effective experience manifest contract;
- manifest validation;
- deterministic refresh/snapshot;
- navigation assembly;
- route resolution;
- lazy page loading;
- cross-package collision diagnostics;
- tests for discovery, refresh, loading and conflict rejection.

Not yet complete:

- browser shell/navigation renderer;
- live App Manager-backed ExperienceSource;
- integration with component registry/page renderer;
- Company Notes end-to-end proof;
- Enterprise Agent UI.


## App Manager source integration — 2026-09-23

CI-verified `AppManagerExperienceSource` now adapts the App Manager HTTP API to the backend-independent Eidos `ExperienceSource` port.

Verified flow:

```text
App Manager
→ /v1/experiences/effective
→ AppManagerExperienceSource
→ App Host refresh
→ navigation/routes
→ /v1/experience-pages
→ page definition
```

The adapter is replaceable by Memory/Mock/REST/custom sources and does not change Eidos Core.


## Browser Shell foundation — 2026-09-23

CI-verified minimal browser shell now exists under `src/app-host/browser-shell.ts`.

It provides:

- App Host navigation rendering;
- hash-route navigation;
- lazy route/page loading;
- default UIDL rendering through the existing Eidos HTML renderer;
- host refresh support so newly activated App experiences appear without Eidos source changes;
- backend independence through `ExperienceSource`.

Current next proof:

```text
start App Manager
→ open Eidos Browser Shell
→ install Company Notes
→ refresh App Host
→ Company Notes appears in navigation
→ open page
```

This is still a test/MVP shell, not a final product visual design.


## Enterprise Agent chat harness — 2026-09-23

The App Host MVP browser harness now exposes an Enterprise Agent chat input instead of a direct install button.

Current intended local proof:

```text
User types: 帮我安装 Company Notes
→ Enterprise Agent /v1/chat
→ app.catalog.list
→ app.install.plan
→ app.install.execute
→ App Manager lifecycle state changes
→ Eidos App Host refresh
→ Company Notes navigation appears
→ Company Notes UIDL page opens
```

The current backend model is explicitly a deterministic development adapter, not a production LLM. The Agent runtime is model-independent through the `AgentModel` contract.


## Local Agent-driven installation proof — PASS — 2026-09-23

The user successfully confirmed the current local MVP on branch `eidos/pure-frontend-positioning-v0.1`.

Verified user-visible path:

```text
Eidos Browser Shell
→ Enterprise Agent chat input
→ App Manager lifecycle
→ Company Notes Feature activation
→ effective Experience discovery
→ App Host refresh
→ Company Notes visible
```

A first-run static path defect was found:

```text
GET http://localhost:4200/main.js 404
```

Root cause: the root-served MVP HTML used a relative `./main.js` URL even though the actual module lives under `/examples/app-host-mvp/`.

Fixed by using:

```text
/examples/app-host-mvp/main.js
```

Fix commit:

```text
4e4d4ed3fc8cf2f61ccd9b80e1646e3249c8ff6c
```

CI after the fix: PASS.

This supersedes earlier status text that listed Browser Shell, live App Manager ExperienceSource, Company Notes proof, or Enterprise Agent UI as not yet implemented. Those MVP foundations now exist and have been exercised together locally.

Still not production-complete:

- visual/product-quality shell design;
- production authentication/security;
- durable App Manager lifecycle state;
- Company Notes domain persistence;
- live real-LLM local proof;
- Trading Lite → EVO dependency proof.
