import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramEditorOperationRequestV010,
  diagramEditorReadRequestV010,
  diagramEditorSelectionReadRequestV010,
  isDiagramEditorPageV010,
  mergeDiagramInspectorPropertiesV010,
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
  },
  selectionReadCommand: {
    code: "graph.selection.inspect",
    inputVersion: "0.1.0"
  },
  requestValues: {
    activeContext: {
      contractVersion: "0.1.0",
      kind: "ENTERPRISE",
      contextId: "enterprise:demo",
      enterpriseId: "enterprise:demo"
    }
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
      height: 64,
      properties: [
        { key: "owner", label: "Owner", value: "Sales Ops" },
        { key: "active", label: "Active", value: true }
      ]
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
      style: "dashed",
      properties: [
        { key: "authority", label: "Authority", value: "GUIDANCE" }
      ]
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
  assert.match(html, /data-eidos-diagram-selection-properties/);
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
    values: {
      activeContext: {
        contractVersion: "0.1.0",
        kind: "ENTERPRISE",
        contextId: "enterprise:demo",
        enterpriseId: "enterprise:demo"
      },
      resourceId: "eog:primary"
    },
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

  assert.deepEqual(request.values.activeContext, {
    contractVersion: "0.1.0",
    kind: "ENTERPRISE",
    contextId: "enterprise:demo",
    enterpriseId: "enterprise:demo"
  });
  assert.equal(request.values.expectedRevision, 4);
  assert.deepEqual(request.values.operation, {
    type: "MOVE_NODE",
    nodeId: "app",
    x: 120,
    y: 96
  });
  assert.equal(request.command.code, "graph.view.operation");
});


test("diagram editor carries renderer-independent observation badges and read presets", () => {
  const observatoryPage = {
    ...page,
    readPresets: [
      {
        id: "4h",
        label: "4 hours",
        values: {
          timeLens: {
            contractVersion: "0.2.0",
            primary: {
              startAt: "2026-09-28T08:00:00.000Z",
              endAt: "2026-09-28T12:00:00.000Z"
            }
          }
        }
      }
    ]
  };
  assert.equal(isDiagramEditorPageV010(observatoryPage), true);

  const request = diagramEditorReadRequestV010(
    observatoryPage,
    observatoryPage.readPresets[0].values
  );
  assert.deepEqual(request.values.timeLens, {
    contractVersion: "0.2.0",
    primary: {
      startAt: "2026-09-28T08:00:00.000Z",
      endAt: "2026-09-28T12:00:00.000Z"
    }
  });

  const observed = structuredClone(state);
  observed.nodes[1].observations = [
    {
      id: "frequency",
      label: "Frequency",
      value: "12.5/h"
    },
    {
      id: "balance",
      label: "Balance",
      value: "180"
    }
  ];
  assert.deepEqual(validateDiagramEditorStateV010(observed), {
    ok: true,
    issues: []
  });

  observed.nodes[1].observations[0].value = "";
  assert.equal(validateDiagramEditorStateV010(observed).ok, false);
});


test("diagram editor accepts structured node and edge inspector properties", () => {
  assert.deepEqual(validateDiagramEditorStateV010(state), {
    ok: true,
    issues: []
  });

  const duplicate = structuredClone(state);
  duplicate.nodes[0].properties.push({
    key: "owner",
    label: "Duplicate owner",
    value: "Other"
  });
  assert.equal(validateDiagramEditorStateV010(duplicate).ok, false);

  const invalid = structuredClone(state);
  invalid.edges[0].properties[0].value = Number.NaN;
  assert.equal(validateDiagramEditorStateV010(invalid).ok, false);
});


test("Inspector property editors are optional field-level capabilities", () => {
  const editable = structuredClone(state);
  editable.nodes[0].properties[0].editor = {
    kind: "TEXT",
    actionId: "node.owner.set",
    valueField: "value",
    operation: {
      type: "PROPERTY_SET",
      targetKind: "NODE",
      targetId: "app",
      propertyKey: "owner"
    }
  };
  editable.edges[0].properties[0].editor = {
    kind: "SELECT",
    actionId: "relation.authority.set",
    valueField: "value",
    operation: {
      type: "PROPERTY_SET",
      targetKind: "EDGE",
      targetId: "guidance",
      propertyKey: "authority"
    },
    options: [
      { label: "Guidance", value: "GUIDANCE" },
      { label: "Enterprise", value: "ENTERPRISE" }
    ]
  };
  assert.equal(validateDiagramEditorStateV010(editable).ok, true);

  const invalid = structuredClone(editable);
  invalid.edges[0].properties[0].editor.options = [];
  assert.equal(validateDiagramEditorStateV010(invalid).ok, false);

  const readOnly = structuredClone(state);
  assert.equal(
    readOnly.nodes[0].properties.every(property => property.editor === undefined),
    true
  );
});


test("Inspector property editors may route writes directly to the owning ActionHost command", () => {
  const editable = structuredClone(state);
  editable.nodes[0].properties[0].editor = {
    kind: "TEXT",
    actionId: "application.owner.set",
    command: {
      code: "application.definition.property.set",
      inputVersion: "0.1.0"
    },
    valueField: "value",
    operation: {
      type: "PROPERTY_SET",
      definitionId: "application:sales",
      propertyKey: "owner"
    }
  };

  assert.equal(validateDiagramEditorStateV010(editable).ok, true);

  const request = diagramEditorOperationRequestV010(
    page,
    editable,
    {
      type: "PROPERTY_SET",
      definitionId: "application:sales",
      propertyKey: "owner",
      value: "Sales Ops"
    },
    "application.owner.set",
    false,
    editable.nodes[0].properties[0].editor.command
  );
  assert.equal(request.command.code, "application.definition.property.set");
  assert.equal(request.command.inputVersion, "0.1.0");

  const invalid = structuredClone(editable);
  invalid.nodes[0].properties[0].editor.command.code = "";
  assert.equal(validateDiagramEditorStateV010(invalid).ok, false);
});


test("diagram workspace creates lazy selection inspection requests", () => {
  assert.deepEqual(
    diagramEditorSelectionReadRequestV010(page, {
      kind: "node",
      id: "app"
    }),
    {
      contractVersion: "0.1.0",
      type: "command",
      command: {
        code: "graph.selection.inspect",
        inputVersion: "0.1.0"
      },
      values: {
        activeContext: {
          contractVersion: "0.1.0",
          kind: "ENTERPRISE",
          contextId: "enterprise:demo",
          enterpriseId: "enterprise:demo"
        },
        resourceId: "eog:primary",
        target: {
          kind: "node",
          id: "app"
        }
      },
      sourceInteractionId: "operating-graph",
      actionId: "diagram.selection.read",
      requiresConfirmation: false
    }
  );
});


test("Viewer-safe view interaction and directed edge metadata stay renderer-neutral", () => {
  const viewerPage = {
    contractVersion: "0.1.0",
    kind: "diagram-workspace",
    id: "viewer",
    title: "Viewer",
    resourceId: "graph:viewer",
    readCommand: { code: "graph.read", inputVersion: "0.1.0" },
    viewInteraction: {
      zoom: true,
      localNodeDrag: true
    }
  };
  assert.equal(isDiagramEditorPageV010(viewerPage), true);

  const directed = structuredClone(state);
  directed.nodes[0].typeLabel = "Type A";
  directed.nodes[1].typeLabel = "Type B";
  directed.edges[0].arrow = "end";
  assert.deepEqual(validateDiagramEditorStateV010(directed), {
    ok: true,
    issues: []
  });

  directed.edges[0].arrow = "sideways";
  assert.equal(validateDiagramEditorStateV010(directed).ok, false);
});


test("diagram workspace supports explicit viewer-to-editor toolbar navigation", () => {
  const viewer = {
    contractVersion: "0.1.0",
    kind: "diagram-workspace",
    id: "definition-viewer",
    title: "Relationship map",
    resourceId: "definition:ledger",
    readCommand: {
      code: "definition.read",
      inputVersion: "0.1.0"
    },
    toolbarActions: [{
      id: "edit",
      label: "Edit projection",
      route: "/definition-preview/2d/edit",
      primary: true
    }]
  };

  assert.equal(isDiagramEditorPageV010(viewer), true);

  const invalid = structuredClone(viewer);
  invalid.toolbarActions[0].route = "relative";
  assert.equal(isDiagramEditorPageV010(invalid), false);
});

test("diagram workspace may expose local projection pruning without semantic deletion", () => {
  const editable = {
    ...page,
    viewInteraction: {
      zoom: true,
      pan: true,
      localNodeDrag: true,
      localSelectionHide: true,
      localSelectionHideLabel: "Remove from projection",
      localSelectionHideNotice: "Removed from this projection."
    }
  };
  assert.equal(isDiagramEditorPageV010(editable), true);

  const invalid = structuredClone(editable);
  invalid.viewInteraction.localSelectionHideLabel = "";
  assert.equal(isDiagramEditorPageV010(invalid), false);
});

test("diagram operation request may capture local placements and camera once at explicit save", () => {
  const request = diagramEditorOperationRequestV010(
    page,
    state,
    { type: "SAVE_PROJECTION_VIEW" },
    "projection.save",
    false,
    undefined,
    {
      hiddenNodeIds: ["ledger"],
      hiddenEdgeIds: ["guidance"],
      placements: [
        { nodeId: "app", x: 144, y: 120 }
      ],
      camera: {
        scale: 1.25,
        translateX: 18,
        translateY: -12
      }
    }
  );

  assert.deepEqual(request.values.viewState, {
    hiddenNodeIds: ["ledger"],
    hiddenEdgeIds: ["guidance"],
    placements: [
      { nodeId: "app", x: 144, y: 120 }
    ],
    camera: {
      scale: 1.25,
      translateX: 18,
      translateY: -12
    }
  });
});

test("diagram graph actions may request captured view state without changing semantic operation shape", () => {
  const editable = structuredClone(state);
  editable.actions.push({
    id: "projection.save",
    label: "Save projection",
    operation: { type: "SAVE_PROJECTION_VIEW" },
    captureViewState: true
  });

  assert.deepEqual(validateDiagramEditorStateV010(editable), {
    ok: true,
    issues: []
  });

  editable.actions.at(-1).captureViewState = "yes";
  assert.equal(validateDiagramEditorStateV010(editable).ok, false);
});


test("diagram page may declare a validated initial camera", () => {
  const restored = {
    ...page,
    initialCamera: {
      scale: 1.25,
      translateX: 18,
      translateY: -12
    }
  };
  assert.equal(isDiagramEditorPageV010(restored), true);

  const invalid = structuredClone(restored);
  invalid.initialCamera.scale = 0;
  assert.equal(isDiagramEditorPageV010(invalid), false);
});


test("lazy inspector refresh replaces matching base properties instead of failing", () => {
  const merged = mergeDiagramInspectorPropertiesV010(
    [
      { key: "kind", label: "Kind", value: "application" },
      { key: "owner", label: "Owner", value: "Old owner" }
    ],
    [
      { key: "owner", label: "Owner", value: "Current owner" },
      { key: "rules", label: "Posting rules", value: 5 }
    ]
  );

  assert.deepEqual(merged, [
    { key: "kind", label: "Kind", value: "application" },
    { key: "owner", label: "Owner", value: "Current owner" },
    { key: "rules", label: "Posting rules", value: 5 }
  ]);
});
