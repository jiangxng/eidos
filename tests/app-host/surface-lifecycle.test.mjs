import test from "node:test";
import assert from "node:assert/strict";

import {
  createSurfaceInstanceIdentityV010,
  requiresSurfaceRemountV010,
  sameSurfaceInstanceV010,
  validateEffectiveExperienceManifest
} from "../../dist/app-host/index.js";

test("Surface instance identity is deterministic across parameter key order", () => {
  const first = createSurfaceInstanceIdentityV010({
    surfaceId: "orders.desktop",
    semanticId: "orders.detail",
    routePath: "/orders/SO001",
    structuralVersion: "3",
    params: { tab: "summary", id: "SO001" }
  });
  const second = createSurfaceInstanceIdentityV010({
    surfaceId: "orders.desktop",
    semanticId: "orders.detail",
    routePath: "/orders/SO001",
    structuralVersion: "3",
    params: { id: "SO001", tab: "summary" }
  });

  assert.equal(first.instanceKey, second.instanceKey);
  assert.equal(sameSurfaceInstanceV010(first, second), true);
  assert.equal(requiresSurfaceRemountV010(first, second), false);
});

test("Surface remount decision is limited to identity or structural contract changes", () => {
  const current = createSurfaceInstanceIdentityV010({
    surfaceId: "orders.desktop",
    semanticId: "orders.detail",
    routePath: "/orders/SO001",
    structuralVersion: "3"
  });
  const newRecord = createSurfaceInstanceIdentityV010({
    surfaceId: "orders.desktop",
    semanticId: "orders.detail",
    routePath: "/orders/SO002",
    structuralVersion: "3"
  });
  const newStructure = createSurfaceInstanceIdentityV010({
    surfaceId: "orders.desktop",
    semanticId: "orders.detail",
    routePath: "/orders/SO001",
    structuralVersion: "4"
  });

  assert.equal(requiresSurfaceRemountV010(current, newRecord), true);
  assert.equal(requiresSurfaceRemountV010(current, newStructure), true);
});

test("manifest validation preserves Surface structuralVersion", () => {
  const result = validateEffectiveExperienceManifest({
    contractVersion: "0.1.0",
    experienceId: "orders",
    packageId: "orders",
    featureId: "orders.default",
    defaultRoute: "/orders",
    pages: [{ id: "orders.home", source: "memory://orders" }],
    routes: [{
      id: "orders.home",
      semanticId: "orders.home",
      surfaceId: "orders.desktop",
      path: "/orders",
      pageId: "orders.home"
    }],
    navigation: [],
    surfaces: [{
      id: "orders.desktop",
      target: "DESKTOP_WORKBENCH",
      support: "FULL",
      entryRoute: "/orders",
      structuralVersion: "7"
    }]
  });

  assert.equal(result.ok, true);
  assert.equal(result.value?.surfaces?.[0].structuralVersion, "7");
});
