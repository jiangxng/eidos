import test from "node:test";
import assert from "node:assert/strict";

import {
  createDiagramCameraTransformV010,
  diagramCameraScreenToWorldV010,
  diagramCameraWorldToScreenV010,
  diagramViewportScreenToWorldV010,
  diagramViewportWorldToScreenV010,
  fitDiagramCameraToBoundsV010,
  panDiagramCameraByScreenDeltaV010,
  panDiagramViewportByScreenDeltaV010,
  zoomDiagramCameraAtScreenPointV010,
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


test("free camera pan is not clamped by content or origin boundaries", () => {
  const camera = panDiagramCameraByScreenDeltaV010(
    createDiagramCameraTransformV010(),
    { x: 420, y: 280 }
  );
  assert.deepEqual(camera, {
    scale: 1,
    translateX: 420,
    translateY: 280
  });

  const opposite = panDiagramCameraByScreenDeltaV010(
    camera,
    { x: -900, y: -700 }
  );
  assert.deepEqual(opposite, {
    scale: 1,
    translateX: -480,
    translateY: -420
  });
});

test("free camera world/screen transforms remain invertible outside the origin", () => {
  const camera = {
    scale: 1.75,
    translateX: -360,
    translateY: 240
  };
  const world = { x: 640, y: 180 };
  const screen = diagramCameraWorldToScreenV010(camera, world);
  assert.deepEqual(diagramCameraScreenToWorldV010(camera, screen), world);
});

test("camera zoom keeps the world point under the pointer stable", () => {
  const before = {
    scale: 1,
    translateX: 180,
    translateY: -90
  };
  const anchor = { x: 320, y: 240 };
  const worldBefore = diagramCameraScreenToWorldV010(before, anchor);
  const after = zoomDiagramCameraAtScreenPointV010(before, 2.2, anchor);
  const worldAfter = diagramCameraScreenToWorldV010(after, anchor);
  assert.deepEqual(worldAfter, worldBefore);
});

test("fit camera centers true graph bounds without assuming a zero origin", () => {
  const camera = fitDiagramCameraToBoundsV010(
    { x: 400, y: 300, width: 600, height: 300 },
    { width: 1200, height: 800 },
    40,
    { min: 0.1, max: 3 }
  );
  const center = diagramCameraWorldToScreenV010(camera, {
    x: 700,
    y: 450
  });
  assert.ok(Math.abs(center.x - 600) < 1e-9);
  assert.ok(Math.abs(center.y - 400) < 1e-9);
});
