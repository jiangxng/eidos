import test from "node:test";
import assert from "node:assert/strict";

import {
  layoutLayeredDiagramV010
} from "../../dist/diagram/layered-layout.js";

test("layered layout is deterministic and follows directed left-to-right flow", () => {
  const input = {
    nodes: [
      { id: "order", width: 140, height: 64 },
      { id: "ship", width: 140, height: 64 },
      { id: "receivable", width: 140, height: 64 },
      { id: "cash", width: 140, height: 64 }
    ],
    edges: [
      { id: "e1", source: "order", target: "ship" },
      { id: "e2", source: "ship", target: "receivable" },
      { id: "e3", source: "receivable", target: "cash" }
    ]
  };

  const first = layoutLayeredDiagramV010(input);
  const second = layoutLayeredDiagramV010(input);
  assert.deepEqual(first, second);

  const byId = new Map(
    first.placements.map(item => [item.nodeId, item])
  );
  assert.ok(byId.get("order").x < byId.get("ship").x);
  assert.ok(byId.get("ship").x < byId.get("receivable").x);
  assert.ok(byId.get("receivable").x < byId.get("cash").x);
});

test("layered layout handles cycles without collapsing the whole graph", () => {
  const result = layoutLayeredDiagramV010({
    nodes: [
      { id: "a", width: 120, height: 60 },
      { id: "b", width: 120, height: 60 },
      { id: "c", width: 120, height: 60 },
      { id: "d", width: 120, height: 60 }
    ],
    edges: [
      { id: "ab", source: "a", target: "b" },
      { id: "bc", source: "b", target: "c" },
      { id: "ca", source: "c", target: "a" },
      { id: "cd", source: "c", target: "d" }
    ]
  });

  assert.equal(result.placements.length, 4);
  assert.ok(new Set(result.placements.map(item => item.x)).size >= 2);
  assert.ok(result.width > 0);
  assert.ok(result.height > 0);
});

test("layered layout separates disconnected components and avoids node overlap", () => {
  const nodes = [
    { id: "a", width: 150, height: 70 },
    { id: "b", width: 150, height: 70 },
    { id: "x", width: 150, height: 70 },
    { id: "y", width: 150, height: 70 }
  ];
  const result = layoutLayeredDiagramV010({
    nodes,
    edges: [
      { id: "ab", source: "a", target: "b" },
      { id: "xy", source: "x", target: "y" }
    ]
  });
  const byId = new Map(result.placements.map(item => [item.nodeId, item]));
  const boxes = nodes.map(node => ({
    id: node.id,
    x: byId.get(node.id).x,
    y: byId.get(node.id).y,
    width: node.width,
    height: node.height
  }));

  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      const overlap =
        a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y;
      assert.equal(overlap, false, a.id + " overlaps " + b.id);
    }
  }
});

test("layered layout supports top-to-bottom direction without domain semantics", () => {
  const result = layoutLayeredDiagramV010({
    nodes: [
      { id: "a", width: 120, height: 60 },
      { id: "b", width: 120, height: 60 }
    ],
    edges: [{ id: "ab", source: "a", target: "b" }],
    options: { direction: "DOWN" }
  });
  const byId = new Map(result.placements.map(item => [item.nodeId, item]));
  assert.ok(byId.get("a").y < byId.get("b").y);
});
