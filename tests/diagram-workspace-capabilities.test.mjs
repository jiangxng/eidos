import test from "node:test";
import assert from "node:assert/strict";

import {
  diagramWorkspaceOperationRequestV010,
  isDiagramWorkspacePageV010
} from "@eidos/reference/2d";

const viewer = {
  contractVersion: "0.1.0",
  kind: "diagram-workspace",
  id: "workspace:viewer",
  title: "Viewer",
  resourceId: "graph:1",
  readCommand: { code: "graph.read", inputVersion: "0.1.0" },
  selectionReadCommand: {
    code: "graph.selection.read",
    inputVersion: "0.1.0"
  }
};

test("neutral 2D Workspace supports interactive Viewer without edit command", () => {
  assert.equal(isDiagramWorkspacePageV010(viewer), true);
  assert.throws(
    () => diagramWorkspaceOperationRequestV010(
      viewer,
      {
        contractVersion: "0.1.0",
        resourceId: "graph:1",
        revision: 0,
        nodes: [],
        edges: []
      },
      { type: "EDIT" },
      "edit"
    ),
    /EIDOS_DIAGRAM_OPERATION_COMMAND_REQUIRED/
  );
});

test("Designer is the same Workspace plus explicit operation capability", () => {
  const designer = {
    ...viewer,
    id: "workspace:designer",
    title: "Designer",
    operationCommand: { code: "graph.write", inputVersion: "0.1.0" }
  };
  assert.equal(isDiagramWorkspacePageV010(designer), true);
  const request = diagramWorkspaceOperationRequestV010(
    designer,
    {
      contractVersion: "0.1.0",
      resourceId: "graph:1",
      revision: 3,
      nodes: [],
      edges: []
    },
    { type: "EDIT" },
    "edit"
  );
  assert.equal(request.command.code, "graph.write");
  assert.equal(request.values.expectedRevision, 3);
});
