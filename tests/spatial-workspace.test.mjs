import test from "node:test";
import assert from "node:assert/strict";

import {
  isSpatialWorkspacePageV010,
  mountSpatialWorkspacePageV010,
  mountSpatialObservatoryPageV010
} from "@eidos/reference/3d";

test("neutral 3D Workspace accepts a spatial Viewer without Observatory semantics", () => {
  assert.equal(
    isSpatialWorkspacePageV010({
      contractVersion: "0.1.0",
      kind: "spatial-workspace",
      id: "spatial:viewer",
      title: "3D Viewer",
      resourceId: "graph:1",
      readCommand: {
        code: "graph.spatial.read",
        inputVersion: "0.1.0"
      }
    }),
    true
  );
});

test("neutral Workspace reuses the established spatial interaction runtime", () => {
  assert.equal(
    mountSpatialWorkspacePageV010,
    mountSpatialObservatoryPageV010
  );
});
