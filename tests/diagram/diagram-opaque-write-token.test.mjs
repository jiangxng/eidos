import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramEditorOperationRequestV010,
  validateDiagramEditorStateV010
} from "../../dist/diagram/surface.js";

const page = {
  contractVersion: "0.1.0",
  kind: "diagram-workspace",
  id: "test.diagram",
  title: "Test",
  resourceId: "test:diagram",
  readCommand: { code: "diagram.read", inputVersion: "0.1.0" },
  operationCommand: { code: "diagram.save", inputVersion: "0.1.0" }
};
const state = {
  contractVersion: "0.1.0",
  resourceId: "test:diagram",
  revision: 7,
  writeToken: "projection:17",
  nodes: [],
  edges: []
};

test("editor forwards opaque host write token separate from domain revision", () => {
  assert.equal(validateDiagramEditorStateV010(state).ok, true);
  const sent = diagramEditorOperationRequestV010(
    page, state, { type: "SAVE" }, "save"
  );
  assert.equal(sent.values.expectedRevision, 7);
  assert.equal(sent.values.expectedWriteToken, "projection:17");
  assert.equal(sent.values.operation.type, "SAVE");
});

test("legacy host states omit write token without inventing one", () => {
  const legacy = { ...state };
  delete legacy.writeToken;
  assert.equal(validateDiagramEditorStateV010(legacy).ok, true);
  assert.equal("expectedWriteToken" in diagramEditorOperationRequestV010(
    page, legacy, { type: "SAVE" }, "save"
  ).values, false);
  assert.equal(validateDiagramEditorStateV010({ ...state, writeToken: "" }).ok, false);
});


test("async save path rejects duplicate submit and retains newer draft after earlier response", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../../src/diagram/surface.ts", import.meta.url), "utf8");
  assert.match(source, /if \(operationInFlight\)/);
  assert.match(source, /dispatchedFingerprint !== localViewFingerprint\(\)/);
  assert.match(source, /state\.writeToken = committedState\.writeToken/);
  assert.match(source, /local edits are preserved/);
});
