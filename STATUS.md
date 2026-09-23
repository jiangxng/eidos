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
