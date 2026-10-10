# 2D Designer B5a — Manual route visual handles

**Date:** 2026-10-10. **Branch:** `feat/diagram-commercial-visual-waypoint-drag-b5a-20261010`, stacked on #136. **Status:** implementation and CI; browser and physical device acceptance NOT TESTED.

## Scope and ownership

- Eidos owns route geometry, input handling, on-canvas affordances, local preview and view undo. No business relationship source/target/arrow values change.
- App Platform owns permission to edit a projection, persistence, revision and the Viewer. Its vendor copy is synchronized only by narrowly matched patches; Host context navigation is intentionally retained.
- Existing manual path coordinates remain declarative world-space waypoints, max 24, finite in [-10,000,000, 10,000,000]. No new public serialized field or migration.
- Only explicitly selected edges with non-empty manual waypoints receive point handles. Orthogonal or rounded-orthogonal manual routes also show constrained segment handles. No handles for auto routes, loops, legacy straight edges or Viewer.
- Non-gesture numeric editing/add/remove/reset from B3 remains available, including touch and keyboard.

## Runtime handling

1. Draw a small themed point/segment indicator, with 44px diameter transparent pointer hit target (adjusted for camera scale).
2. Pointerdown captures the pointer, maintains original route snapshot; pointermove converts CSS screen delta to world coordinates using camera scale and previews SVG visual/hit/label from the same geometry.
3. Pointerup commits one `checkpoint()` and assigns only `edge.waypoints`; user must Save projection.
4. On `pointercancel`, lost capture, blur, Escape or second touch, restore the visual preview and do not write state/undo. Second touch hands navigation to the canvas with current pointer position.
5. Orthogonal segment movement is normal-axis only; it may create needed elbows near fixed endpoints. Route is validated before preview or commit.

## Automatic testing

- `tests/diagram-visual-handles.test.mjs` — waypoint immutability, segment handle direction, endpoint invariance, right-angle validity, finite bounds and error behavior.
- Eidos `npm run typecheck && npm test && npm run validate:repo` via PR CI; actual commit/workflow state must be checked live, not inferred from this document.

## Known limitations and next implementation

- **E03 is NOT TESTED on hardware.** Real SVG pointer capture, focus restoration, pinch conversion, narrow and overlapping handles, 10%/300% scale, keyboard focus and mobile layout need browser execution.
- Synthetic segment handles apply only when a route already has manual points; automatic obstacle route editing requires explicit convert-to-manual UX and segment disambiguation.
- Current UI previews one manipulated handle and the full path; all sibling handles refresh at commit, not every pointer frame.
- This slice does not add snapping, label drag, persisted lock, conflict-safe projection save, large graph performance or new business commands.
- No permission to merge into `main` or deploy is implied. See App Platform 39-case evidence matrix in its B5a PR.
