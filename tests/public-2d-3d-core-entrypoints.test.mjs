import test from "node:test";
import assert from "node:assert/strict";

import * as root from "@eidos/reference";
import * as twoD from "@eidos/reference/2d";
import * as threeD from "@eidos/reference/3d";

test("2D Core public subpath preserves existing diagram implementation identity", () => {
  assert.equal(typeof twoD.validateDiagram, "function");
  assert.equal(typeof twoD.applyDiagramCommand, "function");
  assert.equal(typeof twoD.mountDiagramEditorPageV010, "function");

  assert.equal(twoD.validateDiagram, root.validateDiagram);
  assert.equal(twoD.applyDiagramCommand, root.applyDiagramCommand);
  assert.equal(twoD.mountDiagramEditorPageV010, root.mountDiagramEditorPageV010);
});

test("3D Core public subpath preserves existing spatial implementation identity", () => {
  assert.equal(typeof threeD.reduceSpatial, "function");
  assert.equal(typeof threeD.projectPerspective, "function");
  assert.equal(typeof threeD.realizeWithThreeAdapter, "function");
  assert.equal(typeof threeD.mountSpatialObservatoryPageV010, "function");

  assert.equal(threeD.reduceSpatial, root.reduceSpatial);
  assert.equal(threeD.projectPerspective, root.projectPerspective);
  assert.equal(threeD.realizeWithThreeAdapter, root.realizeWithThreeAdapter);
  assert.equal(
    threeD.mountSpatialObservatoryPageV010,
    root.mountSpatialObservatoryPageV010
  );
});

test("2D and 3D public cores remain separate visual namespaces", () => {
  assert.equal("reduceSpatial" in twoD, false);
  assert.equal("validateDiagram" in threeD, false);
});
