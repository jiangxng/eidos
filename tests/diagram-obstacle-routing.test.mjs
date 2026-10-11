import test from "node:test";
import assert from "node:assert/strict";
import { diagramEdgeGeometryV010 } from "../dist/diagram/edge-paths.js";
import { routeDiagramOrthogonalV010 } from "../dist/diagram/obstacle-routing.js";

const start = { x: 0, y: 0 };
const end = { x: 280, y: 0 };
const middle = { x: 120, y: -40, width: 40, height: 80 };

function insideExpanded(x, y, box, clearance = 14) {
  return x > box.x - clearance && x < box.x + box.width + clearance
    && y > box.y - clearance && y < box.y + box.height + clearance;
}

function isSafe(points, obstacles) {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    assert.ok(a.x === b.x || a.y === b.y, "all segments must be orthogonal");
    const intervals = 40;
    for (let n = 0; n <= intervals; n++) {
      const t = n / intervals;
      const x = a.x * (1 - t) + b.x * t;
      const y = a.y * (1 - t) + b.y * t;
      assert.ok(obstacles.every(o => !insideExpanded(x, y, o)), "path must avoid inflated node interior");
    }
  }
}

test("orthogonal route avoids a real middle-node obstacle", () => {
  const points = routeDiagramOrthogonalV010(start, end, [middle]);
  assert.ok(points);
  assert.deepEqual(points[0], start);
  assert.deepEqual(points.at(-1), end);
  assert.ok(points.length >= 4);
  isSafe(points, [middle]);
  const straight = diagramEdgeGeometryV010(start, end, "straight", { obstacles: [middle] });
  const orthogonal = diagramEdgeGeometryV010(start, end, "orthogonal", { obstacles: [middle] });
  const rounded = diagramEdgeGeometryV010(start, end, "rounded-orthogonal", { obstacles: [middle] });
  assert.match(straight.d, /^M 0 0 L 280 0$/);
  assert.ok(!straight.congested);
  assert.ok(!orthogonal.congested);
  assert.ok(!rounded.congested);
  assert.match(rounded.d, / Q /);
  assert.notEqual(orthogonal.d, straight.d);
});

test("router handles multiple obstacles, negative coordinates and deterministic output", () => {
  const a = { x: -180, y: -40 };
  const b = { x: 240, y: 90 };
  const obstacles = [
    { x: -25, y: -85, width: 90, height: 120 },
    { x: 90, y: 5, width: 50, height: 115 }
  ];
  const first = routeDiagramOrthogonalV010(a, b, obstacles);
  assert.ok(first);
  assert.deepEqual(first, routeDiagramOrthogonalV010(a, b, [...obstacles]));
  isSafe(first, obstacles);
});

test("unrelated far-away obstacles preserve a simple route", () => {
  const route = routeDiagramOrthogonalV010(start, end,
    [{ x: 10000, y: 12000, width: 90, height: 70 }]);
  assert.ok(route);
  isSafe(route, []);
});

test("congested routing returns an explicit fallback status, not a false success", () => {
  const obstacles = Array.from({ length: 25 }, (_, i) =>
    ({ x: 110 + i % 5 * 8, y: -38 + Math.floor(i / 5) * 12, width: 4, height: 4 }));
  assert.equal(routeDiagramOrthogonalV010(start, end, obstacles), undefined);
  const geometry = diagramEdgeGeometryV010(start, end, "rounded-orthogonal", { obstacles });
  assert.equal(geometry.congested, true);
  assert.match(geometry.d, /^M /);
});

test("malformed obstacle metadata and non-finite inputs fail closed", () => {
  assert.throws(() => routeDiagramOrthogonalV010(start, end,
    [{ x: 0, y: 0, width: -1, height: 20 }]), /OBSTACLE_INVALID/);
  assert.throws(() => routeDiagramOrthogonalV010(start, end,
    [{ x: 0, y: NaN, width: 10, height: 20 }]), /OBSTACLE_INVALID/);
  assert.throws(() => routeDiagramOrthogonalV010({ x: Infinity, y: 0 }, end, []), /INPUT_INVALID/);
  assert.throws(() => routeDiagramOrthogonalV010(start, end, [], -2), /INPUT_INVALID/);
});
