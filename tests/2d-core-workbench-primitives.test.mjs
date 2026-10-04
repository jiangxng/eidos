import test from "node:test";
import assert from "node:assert/strict";

import {
  addToDiagramSelectionV010,
  alignDiagramRectsV010,
  centerDiagramViewportOnV010,
  createDiagramSelectionV010,
  createDiagramViewportV010,
  diagramBoundsFromRectsV010,
  diagramMarqueeSelectionV010,
  diagramScreenToWorldV010,
  diagramWorldToScreenV010,
  fitDiagramViewportV010,
  normalizeDiagramRectV010,
  panDiagramViewportV010,
  replaceDiagramSelectionV010,
  snapDiagramPointV010,
  toggleDiagramSelectionV010,
  zoomDiagramViewportAtV010
} from "@eidos/reference/2d";

test("2D viewport keeps world/screen transforms explicit and invertible", () => {
  const viewport = createDiagramViewportV010({
    scale: 2,
    translateX: 40,
    translateY: -20
  });
  const screen = diagramWorldToScreenV010(viewport, { x: 15, y: 30 });
  assert.deepEqual(screen, { x: 70, y: 40 });
  assert.deepEqual(diagramScreenToWorldV010(viewport, screen), { x: 15, y: 30 });
});

test("zoom-at-point preserves the world coordinate under the pointer", () => {
  const viewport = createDiagramViewportV010({
    scale: 1,
    translateX: 20,
    translateY: 30
  });
  const anchor = { x: 300, y: 180 };
  const before = diagramScreenToWorldV010(viewport, anchor);
  const zoomed = zoomDiagramViewportAtV010(viewport, 2, anchor);
  const after = diagramScreenToWorldV010(zoomed, anchor);
  assert.deepEqual(after, before);
});

test("viewport supports pan, fit and center as view-state operations", () => {
  const panned = panDiagramViewportV010(
    createDiagramViewportV010(),
    { x: 25, y: -10 }
  );
  assert.deepEqual(panned, {
    scale: 1,
    translateX: 25,
    translateY: -10
  });

  const bounds = diagramBoundsFromRectsV010([
    { x: 100, y: 100, width: 200, height: 100 },
    { x: 500, y: 400, width: 100, height: 100 }
  ]);
  assert.ok(bounds);
  const fitted = fitDiagramViewportV010(
    bounds,
    { width: 1000, height: 700 },
    50
  );
  assert.ok(fitted.scale > 0);
  const centered = centerDiagramViewportOnV010(
    fitted,
    { x: 350, y: 300 },
    { width: 1000, height: 700 }
  );
  assert.equal(
    diagramWorldToScreenV010(centered, { x: 350, y: 300 }).x,
    500
  );
});

test("selection core supports single, toggle, additive and marquee selection", () => {
  let selection = replaceDiagramSelectionV010({ kind: "node", id: "a" });
  selection = toggleDiagramSelectionV010(selection, { kind: "node", id: "b" });
  assert.deepEqual(selection.items.map(item => item.id), ["a", "b"]);
  selection = addToDiagramSelectionV010(selection, [
    { kind: "node", id: "c" },
    { kind: "node", id: "c" }
  ]);
  assert.deepEqual(selection.items.map(item => item.id), ["a", "b", "c"]);

  const marquee = normalizeDiagramRectV010(
    { x: 0, y: 0 },
    { x: 250, y: 120 }
  );
  const selected = diagramMarqueeSelectionV010([
    { id: "a", x: 20, y: 20, width: 80, height: 40 },
    { id: "b", x: 220, y: 80, width: 80, height: 40 },
    { id: "c", x: 400, y: 300, width: 80, height: 40 }
  ], marquee, "intersect");
  assert.deepEqual(selected.map(item => item.id), ["a", "b"]);
  assert.deepEqual(createDiagramSelectionV010().items, []);
});

test("geometry core provides grid snapping and alignment primitives", () => {
  assert.deepEqual(
    snapDiagramPointV010({ x: 27, y: 44 }, 10),
    { x: 30, y: 40 }
  );
  assert.deepEqual(
    alignDiagramRectsV010([
      { id: "a", x: 10, y: 20, width: 100, height: 50 },
      { id: "b", x: 80, y: 100, width: 80, height: 30 }
    ], "left"),
    {
      a: { x: 10, y: 20 },
      b: { x: 10, y: 100 }
    }
  );
});
