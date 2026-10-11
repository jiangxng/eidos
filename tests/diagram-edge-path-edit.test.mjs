import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isDiagramEditorPageV010 } from "../dist/diagram/surface.js";

const page = {
  contractVersion: "0.1.0",
  kind: "diagram-editor",
  id: "projection",
  title: "Projection",
  resourceId: "definition:test",
  readCommand: { code: "diagram.read", inputVersion: "0.1.0" }
};

test("connector presentation editing requires explicit opt-in", () => {
  assert.equal(isDiagramEditorPageV010(page), true);
  assert.equal(isDiagramEditorPageV010({
    ...page, viewInteraction: { localNodeDrag: true, localEdgePathEdit: true }
  }), true);
  assert.equal(isDiagramEditorPageV010({
    ...page, viewInteraction: { localEdgePathEdit: "yes" }
  }), false);
});

test("view-state capture keeps edge identities and path kinds separate from business relations", async () => {
  const source = await readFile(new URL("../src/diagram/surface.ts", import.meta.url), "utf8");
  assert.match(source, /edgePaths\?: Array<\{ edgeId: string; pathKind: DiagramEdgePathKindV010 \}>/);
  assert.match(source, /edgePaths: \(state\.edges \?\? \[\]\)\.filter\(edge => edge\.pathKind !== undefined\)/);
  assert.match(source, /data-eidos-diagram-edge-path-kind/);
  assert.match(source, /if \(selected\.kind === "edge" && page\.viewInteraction\?\.localEdgePathEdit === true\)/);
  assert.doesNotMatch(source, /edge\.source\s*=\s*select\.value/);
  assert.doesNotMatch(source, /edge\.target\s*=\s*select\.value/);
});
