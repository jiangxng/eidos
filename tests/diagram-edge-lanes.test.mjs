import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramOffsetNodeAttachmentV010,
  diagramParallelLaneOffsetsV010,
  diagramSelfLoopGeometryV010
} from "../dist/diagram/edge-lanes.js";

test("parallel and reverse relations have distinct and deterministic lanes", () => {
  const edges = [
    { id: "b", source: "left", target: "right" },
    { id: "a", source: "right", target: "left" },
    { id: "c", source: "left", target: "right" },
    { id: "single", source: "p", target: "q" }
  ];
  const first = diagramParallelLaneOffsetsV010(edges);
  const reversed = diagramParallelLaneOffsetsV010([...edges].reverse());
  assert.deepEqual([...first].sort(), [...reversed].sort());
  assert.equal(new Set(["a", "b", "c"].map(id => first.get(id))).size, 3);
  assert.equal(first.get("single"), 0);
});

test("edge grouping is collision-safe for arbitrary business identifiers", () => {
  const edges = [
    { id: "e1", source: "a|b", target: "c" },
    { id: "e2", source: "a", target: "b|c" }
  ];
  const offsets = diagramParallelLaneOffsetsV010(edges);
  assert.equal(offsets.get("e1"), 0);
  assert.equal(offsets.get("e2"), 0);
  assert.throws(() => diagramParallelLaneOffsetsV010([...edges, edges[0]]), /EDGE_INVALID/);
});

test("lane attachments stay on source node boundary and are bounded", () => {
  const node = { x: -100, y: 20, width: 160, height: 72 };
  const endpoint = { x: 60, y: 56 };
  const toward = { x: 350, y: 56 };
  const upper = diagramOffsetNodeAttachmentV010(node, endpoint, toward, -14);
  const lower = diagramOffsetNodeAttachmentV010(node, endpoint, toward, 14);
  assert.equal(upper.x, 60);
  assert.equal(lower.x, 60);
  assert.ok(upper.y < lower.y);
  assert.equal(diagramOffsetNodeAttachmentV010(node, endpoint, toward, 1e5).y, 82);
});

test("self relations render visible right-side paths and preserve endpoint identity", () => {
  const node = { x: -220, y: -80, width: 140, height: 70 };
  const geometries = ["straight", "orthogonal", "rounded-orthogonal", "curve"]
    .map(kind => diagramSelfLoopGeometryV010(node, kind));
  assert.equal(new Set(geometries.map(g => g.d)).size, 3); // straight and right-angle share their loop silhouette
  assert.ok(geometries.every(g => g.d.startsWith("M -80 ")));
  assert.ok(geometries.every(g => g.label.x > -80));
  assert.match(geometries[2].d, / Q /);
  assert.match(geometries[3].d, / C /);
  assert.notEqual(diagramSelfLoopGeometryV010(node, "curve", -7).d,
    diagramSelfLoopGeometryV010(node, "curve", 7).d);
});

test("malformed node and lane data fail closed", () => {
  assert.throws(() => diagramSelfLoopGeometryV010(
    { x: 0, y: 0, width: 0, height: 10 }), /LOOP_INVALID/);
  assert.throws(() => diagramSelfLoopGeometryV010(
    { x: 0, y: 0, width: 20, height: NaN }), /LOOP_INVALID/);
  assert.throws(() => diagramParallelLaneOffsetsV010([], -1), /GAP_INVALID/);
});
