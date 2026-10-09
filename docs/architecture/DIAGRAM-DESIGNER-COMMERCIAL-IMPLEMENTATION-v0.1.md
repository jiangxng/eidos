# 2D Designer Commercial Experience — Implementation Ledger

**Date:** 2026-10-09  
**Origin:** EVO 2D Designer 商业化交互与视觉实施要求 v1.0 (owner-supplied specification).  
**Ownership:** Eidos owns generic diagram geometry and interaction. EVO-App-Platform owns projection storage, authorization, version checks, and business meaning.

## Baseline and non-regression

- Eidos reviewed from main `df6b09c8b21f15bdd5b96c4983a54f21f49e7ccb`.
- App Platform reviewed after merged mobile login PR #525. The embedded `vendor/eidos/src/diagram/surface.ts` differs from upstream in context-navigation behavior; **never overwrite the vendor file wholesale**.
- Old edge data without `pathKind` remains a straight line. The existing `style: solid | dashed` and `arrow` keep their meanings. Route shape is a separate presentation field, never business direction.

## Phase A1 delivered in this branch

- Declarative, deterministic route geometry for `straight`, `orthogonal`, `rounded-orthogonal` and `curve`.
- SVG render path and selectable stroke share the same geometry; no straight-line ghost hitbox on a curve.
- Captions use points on the path instead of the center-to-center midpoint.
- Per-mounted-diagram SVG marker ids avoid collisions.
- Node drag previews incident edges without remounting the canvas; cancelled gestures roll back the preview.
- Finite coordinate validation and a closed enum for `pathKind`.
- Tests for geometry, old-data compatibility and invalid input.

## Outstanding: **do not call this the completed upgrade**

Phase A2: device-specific gesture state machine, desktop select/pan tools, box/multiselect and group move; explicit permission gates and undo/redo; path style editing UI and projection save/reload through EVO App Platform. Phase B: obstacle avoidance, self-loops/parallel routing, waypoint editing and anchors, alignment/snapping, accessible touch alternatives, concurrency conflict recovery and full device/performance testing.

A1 performs rendering for data carrying an explicit pathKind, but **does not yet introduce a save action or UI for changing pathKind**. The App Platform vendored integration and Viewer/preview adapters are deliberately untouched until a separate cross-project compatibility patch is reviewed.

## Verification and acceptance guidance

- Run `npm run typecheck && npm test && npm run validate:repo` in Eidos.
- For a downstream integration, first diff the current vendor file, preserve its context navigation and any intervening mainline changes, and test old/new template preview/Designer/Viewer paths end-to-end.
- Required acceptance cases from the owner document are V01–V06, M01–M09, T01–T07, E01–E07, D01–D06, A01–A02, P01–P02. Mark unexecuted checks **NOT TESTED**, not PASS.

## Phase A2 work-in-progress (stacked on A1)

- View-only bounded 50-step undo/redo for positions and visibility; selection and camera navigation are not written into history.
- Select/Hand switch, Shift multi-select, canvas marquee by rectangle intersection, grouped local node movement, and connected-edge preview.
- Right/middle drag navigation path is distinct from primary selection; temporary Space hand tool; continuous wheel delta scaling with an explicit Mouse/Trackpad preference.
- This is an Eidos-only interaction slice, not end-to-end projection save validation. Touch multi-pointer conversion, context menus, editable edge-path control panels, per-edge persistence, and cross-project Viewer round trips remain later gates.

**Known verification limit:** Node test suite validates pure selection geometry; real browser multi-pointer behavior, mobile controls and 200/400-node performance have not been observed and must be tested before production certification.

## Phase A3 — Eidos opt-in route editing

An opted-in `viewInteraction.localEdgePathEdit` exposes four connector path presets for an explicitly selected edge. This is **presentation-only**: `source`, `target`, arrow semantics and relationship identity are never changed. Every path edit enters the bounded undo/redo snapshot history. Captured view-state includes a closed `edgePaths` collection keyed by edge identity; edges without a path kind remain legacy straight lines. This PR alone does not persist those fields; downstream App Platform requires a separate reviewed contract/storage integration before claiming refresh consistency.
