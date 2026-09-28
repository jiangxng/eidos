import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramEditorOperationRequestV010,
  diagramEditorReadRequestV010,
  isDiagramEditorPageV010,
  renderDiagramEditorPageShellToHtmlV010,
  validateDiagramEditorStateV010
} from "../../dist/diagram/surface.js";

const page = {
  contractVersion: "0.1.0",
  kind: "diagram-editor",
  id: "operating-graph",
  title: "Operating Graph",
  resourceId: "eog:primary",
  readCommand: {
    code: "graph.view.get",
    inputVersion: "0.1.0"
  },
  operationCommand: {
    code: "graph.view.operation",
    inputVersion: "0.1.0"
  }
};

const state = {
  contractVersion: "0.1.0",
  resourceId: "eog:primary",
  revision: 4,
  lifecycleState: "DRAFT",
  nodes: [
    {
      id: "app",
      kind: "application",
      label: "Sales",
      shape: "rectangle",
      x: 80,
      y: 80,
      width: 140,
      height: 64
    },
    {
      id: "ledger",
      kind: "ledger",
      label: "Receivable",
      shape: "rounded-rectangle",
      x: 340,
      y: 80,
      width: 140,
      height: 64
    }
  ],
  edges: [
    {
      id: "guidance",
      source: "app",
      target: "ledger",
      kind: "guidance",
      style: "dashed"
    }
  ],
  actions: [
    {
      id: "confirm-guidance",
      label: "Confirm",
      target: { kind: "edge", id: "guidance" },
      operation: {
        type: "CONFIRM_EDGE",
        edgeId: "guidance"
      },
      requiresConfirmation: true
    }
  ]
};

test("diagram editor page is a renderer-independent App Host definition", () => {
  assert.equal(isDiagramEditorPageV010(page), true);
  const html = renderDiagramEditorPageShellToHtmlV010(page);
  assert.match(html, /data-eidos-diagram-canvas/);
  assert.match(html, /data-eidos-diagram-inspector/);
});

test("diagram editor validates positioned nodes and semantic edge references", () => {
  assert.deepEqual(validateDiagramEditorStateV010(state), {
    ok: true,
    issues: []
  });

  const invalid = structuredClone(state);
  invalid.edges[0].target = "missing";
  assert.equal(validateDiagramEditorStateV010(invalid).ok, false);
});

test("diagram editor READ and operation commands preserve Host authority", () => {
  assert.deepEqual(diagramEditorReadRequestV010(page), {
    contractVersion: "0.1.0",
    type: "command",
    command: {
      code: "graph.view.get",
      inputVersion: "0.1.0"
    },
    values: { resourceId: "eog:primary" },
    sourceInteractionId: "operating-graph",
    actionId: "diagram.read",
    requiresConfirmation: false
  });

  const request = diagramEditorOperationRequestV010(
    page,
    state,
    {
      type: "MOVE_NODE",
      nodeId: "app",
      x: 120,
      y: 96
    },
    "diagram.node.move"
  );

  assert.equal(request.values.expectedRevision, 4);
  assert.deepEqual(request.values.operation, {
    type: "MOVE_NODE",
    nodeId: "app",
    x: 120,
    y: 96
  });
  assert.equal(request.command.code, "graph.view.operation");
});
