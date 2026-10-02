# Eidos Multi-Core Architecture

> One Constitution. Multiple specialized cores. Many capabilities. Many renderers. One deterministic language for LLMs.

## Cores

- `experience-core`: contracts, stability, context, deterministic resolution.
- `web-core`: VNode/DOM/web events and browser lifecycle.
- `data-core`: tabular/reference/query presentation contracts; never business truth ownership.
- `visualization-core`: chart/BI semantic models and renderer selection.
- `2d-core` (compatibility lineage: `diagram-core`): reusable 2D graph/diagram interaction contracts; no product/domain truth.
- `reporting-core`: paged reports, sections, grouping, export/print semantics.
- `collaboration-core`: shared focus, presenter/follow, presence and annotation contracts.
- `3d-core` (compatibility lineage: `spatial-core`): reusable scene, object, camera, picking, annotation and 3D interaction contracts; no product/domain truth.
- `customization-core`: constrained drag/drop/reorder/resize/hide/pin/save/reset behavior.
- `accessibility-core`: accessibility constraints and renderer negotiation.

All cores obey the same Constitution. No core may redefine business truth, Human Intent intelligence, or Host execution ownership.


## 2D / 3D convergence

The authoritative responsibility split is defined in `docs/architecture/EIDOS-2D-3D-CORE-v0.1.md`.

`src/diagram/**` and `src/spatial/**` remain protected implementation assets during compatibility-preserving convergence. Directory names do not override the 2D Core / 3D Core ownership model.
