import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveWorkbenchSurfaceRouteV010
} from "../../dist/workbench/index.js";

function snapshot() {
  return {
    contractVersion: "0.1.0",
    revision: 1,
    status: "ready",
    pages: [
      { id: "orders.desktop", source: "memory://desktop" },
      { id: "orders.mobile", source: "memory://mobile" }
    ],
    routes: [
      {
        id: "orders.desktop",
        semanticId: "orders.home",
        surfaceId: "orders.desktop-surface",
        path: "/orders",
        pageId: "orders.desktop"
      },
      {
        id: "orders.mobile",
        semanticId: "orders.home",
        surfaceId: "orders.mobile-surface",
        path: "/m/orders",
        pageId: "orders.mobile"
      }
    ],
    navigation: [],
    diagnostics: [],
    manifests: [{
      contractVersion: "0.1.0",
      experienceId: "orders",
      packageId: "orders",
      featureId: "orders.default",
      defaultRoute: "/orders",
      pages: [
        { id: "orders.desktop", source: "memory://desktop" },
        { id: "orders.mobile", source: "memory://mobile" }
      ],
      routes: [
        {
          id: "orders.desktop",
          semanticId: "orders.home",
          surfaceId: "orders.desktop-surface",
          path: "/orders",
          pageId: "orders.desktop"
        },
        {
          id: "orders.mobile",
          semanticId: "orders.home",
          surfaceId: "orders.mobile-surface",
          path: "/m/orders",
          pageId: "orders.mobile"
        }
      ],
      navigation: [],
      surfaces: [
        {
          id: "orders.desktop-surface",
          target: "DESKTOP_WORKBENCH",
          support: "FULL",
          entryRoute: "/orders"
        },
        {
          id: "orders.mobile-surface",
          target: "MOBILE_TASK",
          support: "TASK_FOCUSED",
          entryRoute: "/m/orders"
        }
      ]
    }]
  };
}

test("Workbench Surface routing keeps desktop default when no target/profile is supplied", () => {
  const result = resolveWorkbenchSurfaceRouteV010(snapshot(), {
    path: "/orders"
  });
  assert.equal(result?.resolution.kind, "ROUTE");
  assert.equal(result?.resolution.target, "DESKTOP_WORKBENCH");
  assert.equal(result?.resolution.route.path, "/orders");
});

test("Workbench Surface routing maps semantic route to explicit mobile target", () => {
  const result = resolveWorkbenchSurfaceRouteV010(snapshot(), {
    path: "/orders",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(result?.resolution.kind, "ROUTE");
  assert.equal(result?.resolution.target, "MOBILE_TASK");
  assert.equal(result?.resolution.route.path, "/m/orders");
});

test("Workbench root uses selected Surface entry route", () => {
  const result = resolveWorkbenchSurfaceRouteV010(snapshot(), {
    path: "/",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(result?.resolution.kind, "ROUTE");
  assert.equal(result?.resolution.route.path, "/m/orders");
});

test("legacy configured Surface id maps to its declared target", () => {
  const result = resolveWorkbenchSurfaceRouteV010(snapshot(), {
    path: "/orders",
    configuredSurfaceId: "orders.mobile-surface"
  });
  assert.equal(result?.resolution.kind, "ROUTE");
  assert.equal(result?.resolution.target, "MOBILE_TASK");
  assert.equal(result?.resolution.route.path, "/m/orders");
});

test("configured Surface id wins over user target but URL explicit target remains highest", () => {
  const configured = resolveWorkbenchSurfaceRouteV010(snapshot(), {
    path: "/orders",
    configuredSurfaceId: "orders.mobile-surface",
    userTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(configured?.resolution.target, "MOBILE_TASK");

  const explicit = resolveWorkbenchSurfaceRouteV010(snapshot(), {
    path: "/orders",
    configuredSurfaceId: "orders.mobile-surface",
    userTarget: "MOBILE_TASK",
    explicitTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(explicit?.resolution.target, "DESKTOP_WORKBENCH");
  assert.equal(explicit?.resolution.route.path, "/orders");
});
