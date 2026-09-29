import test from "node:test";
import assert from "node:assert/strict";

import {
  createAppHost,
  createClientSurfaceProfileV010,
  inferSurfaceTargetV010,
  resolveExperienceSurfaceV010,
  surfaceQueryValueV010,
  surfaceTargetFromUrlV010,
  validateEffectiveExperienceManifest
} from "../../dist/app-host/index.js";

function surfaceManifest(overrides = {}) {
  return {
    contractVersion: "0.1.0",
    experienceId: "orders",
    packageId: "orders",
    featureId: "orders.default",
    defaultRoute: "/orders",
    pages: [
      { id: "orders.desktop", source: "memory://orders/desktop" },
      { id: "orders.mobile", source: "memory://orders/mobile" }
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
    navigation: [
      {
        id: "orders.desktop.nav",
        label: "Orders",
        route: "/orders",
        surfaceIds: ["orders.desktop-surface"]
      },
      {
        id: "orders.mobile.nav",
        label: "Orders",
        route: "/m/orders",
        surfaceIds: ["orders.mobile-surface"]
      }
    ],
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
        entryRoute: "/m/orders",
        fallbackSurfaceId: "orders.desktop-surface"
      },
      {
        id: "orders.mobile-read",
        target: "MOBILE_READ",
        support: "UNSUPPORTED",
        fallbackSurfaceId: "orders.desktop-surface"
      }
    ],
    ...overrides
  };
}

test("surface capability inference is deterministic and does not use User-Agent", () => {
  assert.equal(
    inferSurfaceTargetV010({
      contractVersion: "0.1.0",
      viewportClass: "COMPACT",
      primaryPointer: "COARSE",
      hover: false,
      touch: true,
      reducedMotion: false,
      standalone: false
    }),
    "MOBILE_TASK"
  );

  assert.equal(
    inferSurfaceTargetV010({
      contractVersion: "0.1.0",
      viewportClass: "EXPANDED",
      primaryPointer: "FINE",
      hover: true,
      touch: false,
      reducedMotion: false,
      standalone: false
    }),
    "DESKTOP_WORKBENCH"
  );
});

test("explicit Surface target wins and semantic route maps to target-specific path", () => {
  const manifest = surfaceManifest();
  const result = resolveExperienceSurfaceV010(manifest, {
    path: "/orders",
    explicitTarget: "MOBILE_TASK",
    userTarget: "DESKTOP_WORKBENCH",
    profile: {
      contractVersion: "0.1.0",
      viewportClass: "EXPANDED",
      primaryPointer: "FINE",
      hover: true,
      touch: false,
      reducedMotion: false,
      standalone: false
    }
  });

  assert.equal(result.kind, "ROUTE");
  assert.equal(result.selectedBy, "EXPLICIT");
  assert.equal(result.target, "MOBILE_TASK");
  assert.equal(result.surfaceId, "orders.mobile-surface");
  assert.equal(result.support, "TASK_FOCUSED");
  assert.equal(result.semanticRouteId, "orders.home");
  assert.equal(result.route.path, "/m/orders");
});

test("unsupported mobile Surface produces deterministic handoff instead of desktop squeeze", () => {
  const result = resolveExperienceSurfaceV010(surfaceManifest(), {
    semanticRouteId: "orders.home",
    explicitTarget: "MOBILE_READ"
  });

  assert.deepEqual(result, {
    kind: "HANDOFF",
    target: "MOBILE_READ",
    reason: "TARGET_UNSUPPORTED",
    selectedBy: "EXPLICIT",
    semanticRouteId: "orders.home",
    availableTargets: ["DESKTOP_WORKBENCH", "MOBILE_TASK"],
    fallbackSurfaceId: "orders.desktop-surface"
  });
});

test("missing semantic route on an otherwise supported Surface fails into handoff", () => {
  const result = resolveExperienceSurfaceV010(surfaceManifest(), {
    semanticRouteId: "orders.bulk-editor",
    explicitTarget: "MOBILE_TASK"
  });

  assert.equal(result.kind, "HANDOFF");
  assert.equal(result.reason, "SEMANTIC_ROUTE_UNAVAILABLE");
  assert.equal(result.target, "MOBILE_TASK");
});

test("legacy manifest remains desktop-compatible but does not claim implicit mobile support", () => {
  const legacy = {
    contractVersion: "0.1.0",
    experienceId: "legacy",
    packageId: "legacy",
    featureId: "legacy.default",
    defaultRoute: "/legacy",
    pages: [{ id: "legacy.home", source: "memory://legacy" }],
    routes: [{ id: "legacy.home", path: "/legacy", pageId: "legacy.home" }]
  };

  assert.equal(
    resolveExperienceSurfaceV010(legacy, {
      path: "/legacy",
      explicitTarget: "DESKTOP_WORKBENCH"
    }).kind,
    "ROUTE"
  );

  const mobile = resolveExperienceSurfaceV010(legacy, {
    path: "/legacy",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "HANDOFF");
  assert.equal(mobile.reason, "LEGACY_DESKTOP_ONLY");
});

test("manifest validation accepts and preserves explicit Surface metadata", async () => {
  const validated = validateEffectiveExperienceManifest(surfaceManifest());
  assert.equal(validated.ok, true);
  assert.equal(validated.value?.surfaces?.length, 3);
  assert.equal(validated.value?.routes[0].semanticId, "orders.home");
  assert.deepEqual(
    validated.value?.navigation?.[0].surfaceIds,
    ["orders.desktop-surface"]
  );

  const source = {
    async listEffectiveExperienceManifests() {
      return [surfaceManifest()];
    },
    async loadPage() {
      return {};
    }
  };
  const host = createAppHost(source);
  const snapshot = await host.refresh();
  assert.equal(snapshot.status, "ready");
  assert.equal(snapshot.manifests[0].surfaces?.[1].target, "MOBILE_TASK");
  host.dispose();
});

test("manifest validation rejects invalid Surface references", () => {
  const invalid = surfaceManifest({
    routes: [
      {
        id: "orders.desktop",
        semanticId: "orders.home",
        surfaceId: "missing-surface",
        path: "/orders",
        pageId: "orders.desktop"
      }
    ]
  });
  const result = validateEffectiveExperienceManifest(invalid);
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(item => item.code === "EIDOS_APP_HOST_ROUTE_SURFACE")
  );
});


test("browser capability profile and URL Surface selector are deterministic", () => {
  const profile = createClientSurfaceProfileV010({
    viewportWidth: 390,
    coarsePointer: true,
    finePointer: false,
    hover: false,
    touchPoints: 5,
    reducedMotion: true,
    standalone: true
  });
  assert.deepEqual(profile, {
    contractVersion: "0.1.0",
    viewportClass: "COMPACT",
    primaryPointer: "COARSE",
    hover: false,
    touch: true,
    reducedMotion: true,
    standalone: true
  });

  const url = new URL("https://example.test/orders?surface=mobile-read#details");
  assert.equal(surfaceTargetFromUrlV010(url), "MOBILE_READ");
  assert.equal(surfaceQueryValueV010("TABLET_WORKBENCH"), "tablet");
  assert.equal(
    surfaceTargetFromUrlV010(new URL("https://example.test/?surface=unknown")),
    undefined
  );
});


test("manifest validation rejects Surface fallback cycles and cross-Surface entry routes", () => {
  const result = validateEffectiveExperienceManifest(surfaceManifest({
    surfaces: [
      {
        id: "orders.desktop-surface",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/m/orders",
        fallbackSurfaceId: "orders.mobile-surface"
      },
      {
        id: "orders.mobile-surface",
        target: "MOBILE_TASK",
        support: "TASK_FOCUSED",
        entryRoute: "/m/orders",
        fallbackSurfaceId: "orders.desktop-surface"
      }
    ]
  }));

  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      item => item.code === "EIDOS_APP_HOST_SURFACE_ENTRY_ROUTE_SCOPE"
    )
  );
  assert.ok(
    result.diagnostics.some(
      item => item.code === "EIDOS_APP_HOST_SURFACE_FALLBACK_CYCLE"
    )
  );
});
