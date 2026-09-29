import test from "node:test";
import assert from "node:assert/strict";

import {
  createSurfaceHandoffViewModelV010,
  renderSurfaceHandoffToHtmlV010
} from "../../dist/app-host/index.js";

test("Surface handoff view preserves semantic reason and safe alternatives", () => {
  const model = createSurfaceHandoffViewModelV010(
    {
      kind: "HANDOFF",
      target: "MOBILE_TASK",
      reason: "SEMANTIC_ROUTE_UNAVAILABLE",
      selectedBy: "CAPABILITY",
      semanticRouteId: "orders.bulk-editor",
      requestedPath: "/orders/bulk",
      availableTargets: ["DESKTOP_WORKBENCH"],
      fallbackSurfaceId: "orders.desktop"
    },
    [
      {
        target: "DESKTOP_WORKBENCH",
        label: "Open desktop",
        route: "/orders/bulk"
      }
    ]
  );

  assert.equal(model.kind, "SURFACE_HANDOFF");
  assert.equal(model.reason, "SEMANTIC_ROUTE_UNAVAILABLE");
  assert.equal(model.semanticRouteId, "orders.bulk-editor");
  assert.equal(model.alternatives[0].route, "/orders/bulk");

  const html = renderSurfaceHandoffToHtmlV010(model);
  assert.match(html, /data-eidos-surface-handoff="0\.1\.0"/);
  assert.match(html, /Open desktop/);
  assert.match(html, /orders\/bulk/);
});

test("Surface handoff renderer escapes route and labels", () => {
  const model = createSurfaceHandoffViewModelV010(
    {
      kind: "HANDOFF",
      target: "MOBILE_READ",
      reason: "TARGET_UNSUPPORTED",
      selectedBy: "EXPLICIT",
      availableTargets: ["DESKTOP_WORKBENCH"]
    },
    [
      {
        target: "DESKTOP_WORKBENCH",
        label: "<Desktop>",
        route: "/x?name=<script>"
      }
    ]
  );

  const html = renderSurfaceHandoffToHtmlV010(model);
  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;Desktop&gt;/);
  assert.match(html, /&lt;script&gt;/);
});
