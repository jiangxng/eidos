import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramEdgeGeometryV010,
  isDiagramEdgePathKindV010
} from "../dist/diagram/edge-paths.js";
import { validateDiagramEditorStateV010 } from "../dist/diagram/surface.js";

const a = { x: 0, y: 0 };
const b = { x: 180, y: 90 };

test("four path types yield distinct safe SVG geometry", () => {
  const paths = ["straight", "orthogonal", "rounded-orthogonal", "curve"]
    .map(kind => diagramEdgeGeometryV010(a, b, kind));
  assert.equal(new Set(paths.map(path => path.d)).size, 4);
  assert.match(paths[0].d, /^M .* L /);
  assert.match(paths[1].d, /^M .* L .* L .* L /);
  assert.match(paths[2].d, /\bQ\b/);
  assert.match(paths[3].d, /\bC\b/);
  for (const path of paths) {
    assert.ok(Number.isFinite(path.label.x));
    assert.ok(Number.isFinite(path.label.y));
    assert.ok(!path.d.includes("NaN"));
    assert.ok(!path.d.includes("Infinity"));
  }
});

test("legacy paths stay straight and orthogonal paths have square corners", () => {
  const legacy = diagramEdgeGeometryV010(a, b);
  assert.equal(legacy.kind, "straight");
  const orth = diagramEdgeGeometryV010(a, b, "orthogonal");
  assert.equal(orth.label.x, 90);
  assert.equal(orth.label.y, 45);
  assert.ok(!orth.d.includes("Q"));
  assert.ok(!orth.d.includes("C"));
  const round = diagramEdgeGeometryV010({ x: -200, y: -100 }, { x: 40, y: 100 }, "rounded-orthogonal");
  assert.match(round.d, /-200 -100/);
  assert.ok(!round.d.includes("NaN"));
});

test("invalid and nonfinite edge paths fail closed", () => {
  assert.equal(isDiagramEdgePathKindV010("straight"), true);
  assert.equal(isDiagramEdgePathKindV010("arc"), false);
  assert.throws(() => diagramEdgeGeometryV010(a, { x: Infinity, y: 1 }), /COORDINATES_INVALID/);
  assert.throws(() => diagramEdgeGeometryV010(a, b, "malicious<svg>"), /PATH_KIND_INVALID/);
});

test("diagram validates optional geometry enum independent from texture and arrow", () => {
  const base = {
    contractVersion: "0.1.0",
    resourceId: "diagram:test",
    revision: 1,
    nodes: [
      { id: "a", kind: "object", label: "A", shape: "rounded-rectangle", x: -100, y: 0, width: 100, height: 64 },
      { id: "b", kind: "object", label: "B", shape: "rounded-rectangle", x: 200, y: 100, width: 100, height: 64 }
    ],
    edges: [{ id: "edge", source: "a", target: "b", kind: "relation", style: "dashed", arrow: "end" }]
  };
  assert.equal(validateDiagramEditorStateV010(base).ok, true);
  for (const kind of ["straight", "orthogonal", "rounded-orthogonal", "curve"]) {
    assert.equal(validateDiagramEditorStateV010({
      ...base, edges: [{ ...base.edges[0], pathKind: kind }]
    }).ok, true);
  }
  const failed = validateDiagramEditorStateV010({
    ...base, edges: [{ ...base.edges[0], pathKind: "unknown" }]
  });
  assert.equal(failed.ok, false);
  assert.match(failed.issues.join(" "), /edges\[0\] is invalid/);
});
