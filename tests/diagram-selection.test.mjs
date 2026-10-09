import test from "node:test";
import assert from "node:assert/strict";
import { diagramNodesIntersectingRectV010 } from "../dist/diagram/selection.js";

const nodes = [
  { id: "left", x: -110, y: -40, width: 100, height: 60 },
  { id: "middle", x: 10, y: 5, width: 100, height: 60 },
  { id: "far", x: 500, y: 500, width: 100, height: 60 }
];

test("marquee selection includes intersecting nodes and preserves negative coordinates", () => {
  assert.deepEqual(diagramNodesIntersectingRectV010(nodes, {
    x: -15, y: 0, width: 55, height: 20
  }), ["middle"]);
  assert.deepEqual(diagramNodesIntersectingRectV010(nodes, {
    x: -150, y: -100, width: 200, height: 200
  }), ["left", "middle"]);
});

test("marquee direction is symmetric and selection order is stable", () => {
  const positive = diagramNodesIntersectingRectV010(nodes, {
    x: -150, y: -100, width: 200, height: 200
  });
  const reversed = diagramNodesIntersectingRectV010(nodes, {
    x: 50, y: 100, width: -200, height: -200
  });
  assert.deepEqual(reversed, positive);
});

test("bad bounds are rejected without selecting invalid nodes", () => {
  assert.throws(() => diagramNodesIntersectingRectV010(nodes, {
    x: 0, y: Number.NaN, width: 1, height: 1
  }), /RECT_INVALID/);
  assert.deepEqual(diagramNodesIntersectingRectV010([
    ...nodes, { id: "bad", x: Infinity, y: 0, width: 10, height: 10 }
  ], { x: -200, y: -200, width: 500, height: 500 }), ["left", "middle"]);
});
