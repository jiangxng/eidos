import test from "node:test";
import assert from "node:assert/strict";
import { createLocalizationRuntime, eidosAppHostLocalizationBundles } from "../../dist/localization/index.js";
import {
  isSpatialObservatoryPageV010,
  renderSpatialObservatoryPageShellToHtmlV010,
  spatialObservatoryReadRequestV010,
  validateSpatialObservatoryStateV010
} from "../../dist/spatial/surface.js";

const page = {
  contractVersion: "0.1.0",
  kind: "spatial-observatory",
  id: "enterprise-observatory-3d",
  title: "Enterprise Observatory 3D",
  resourceId: "eog:primary",
  readCommand: {
    code: "enterprise.operating-graph.observatory.spatial.get",
    inputVersion: "0.2.0"
  },
  requestValues: {
    activeContext: {
      contractVersion: "0.1.0",
      kind: "ENTERPRISE",
      contextId: "enterprise:demo",
      enterpriseId: "enterprise:demo"
    }
  },
  readPresets: [
    {
      id: "4h",
      label: "4h",
      values: {
        timeLens: {
          contractVersion: "0.2.0",
          primary: {
            startAt: "2026-09-28T20:00:00.000Z",
            endAt: "2026-09-29T00:00:00.000Z"
          }
        }
      }
    }
  ]
};

const state = {
  contractVersion: "0.1.0",
  resourceId: "eog:primary",
  revision: 3,
  objects: [
    {
      id: "app:sales",
      kind: "application",
      label: "Sales",
      position: { x: -180, y: 0, z: 140 }
    },
    {
      id: "ledger:wip",
      kind: "ledger",
      label: "Pending Production",
      position: { x: 180, y: 0, z: -140 },
      observations: [
        {
          id: "frequency",
          label: "Frequency",
          value: "12.5/h"
        }
      ]
    }
  ],
  links: [
    {
      id: "relation:1",
      source: "app:sales",
      target: "ledger:wip",
      kind: "enterprise-confirmed"
    }
  ],
  camera: {
    position: { x: 700, y: 460, z: 900 },
    target: { x: 0, y: 0, z: 0 }
  }
};

test("Spatial Observatory is a generic Host-backed page contract", () => {
  assert.equal(isSpatialObservatoryPageV010(page), true);
  const html = renderSpatialObservatoryPageShellToHtmlV010(page);
  assert.match(html, /data-eidos-spatial-canvas/);
  assert.match(html, /data-eidos-spatial-inspector/);
});

test("Spatial Observatory validates 3D positions, links and observation badges", () => {
  assert.deepEqual(validateSpatialObservatoryStateV010(state), {
    ok: true,
    issues: []
  });
  const invalid = structuredClone(state);
  invalid.links[0].target = "missing";
  assert.equal(validateSpatialObservatoryStateV010(invalid).ok, false);
});

test("Spatial Observatory read presets remain Host query values, not Eidos semantics", () => {
  const request = spatialObservatoryReadRequestV010(
    page,
    page.readPresets[0].values
  );
  assert.equal(
    request.command.code,
    "enterprise.operating-graph.observatory.spatial.get"
  );
  assert.equal(request.values.resourceId, "eog:primary");
  assert.deepEqual(request.values.timeLens, {
    contractVersion: "0.2.0",
    primary: {
      startAt: "2026-09-28T20:00:00.000Z",
      endAt: "2026-09-29T00:00:00.000Z"
    }
  });
});


test("Spatial Observatory localizes platform chrome without translating plugin or runtime text", () => {
  const runtime = createLocalizationRuntime(eidosAppHostLocalizationBundles, {
    locale: "zh-CN",
    fallbackLocales: ["en"]
  });
  const html = renderSpatialObservatoryPageShellToHtmlV010(page, runtime);
  assert.match(html, />选择</);
  assert.match(html, /拖动画布可旋转视角/);
  assert.match(html, /Enterprise Observatory 3D/);
});
