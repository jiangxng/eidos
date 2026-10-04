import test from "node:test";
import assert from "node:assert/strict";

import {
  diagramViewportScreenToWorldV010,
  diagramViewportWorldToScreenV010,
  panDiagramViewportByScreenDeltaV010,
  zoomDiagramViewportAtScreenPointV010
} from "@eidos/reference/2d";

test("2D viewport keeps screen and world coordinates invertible", () => {
  const viewport = {
    scale: 2,
    scrollLeft: 100,
    scrollTop: 60
  };
  const screen = { x: 200, y: 140 };
  const world = diagramViewportScreenToWorldV010(viewport, screen);
  assert.deepEqual(world, { x: 150, y: 100 });
  assert.deepEqual(
    diagramViewportWorldToScreenV010(viewport, world),
    screen
  );
});

test("pointer-centered zoom preserves the world point under the pointer", () => {
  const before = {
    scale: 1,
    scrollLeft: 240,
    scrollTop: 120
  };
  const anchor = { x: 300, y: 200 };
  const worldBefore = diagramViewportScreenToWorldV010(before, anchor);
  const after = zoomDiagramViewportAtScreenPointV010(before, 2, anchor);
  const worldAfter = diagramViewportScreenToWorldV010(after, anchor);
  assert.deepEqual(worldAfter, worldBefore);
});

test("pan is a pure viewport operation", () => {
  assert.deepEqual(
    panDiagramViewportByScreenDeltaV010(
      { scale: 1, scrollLeft: 300, scrollTop: 200 },
      { x: 40, y: -25 }
    ),
    { scale: 1, scrollLeft: 260, scrollTop: 225 }
  );
});
