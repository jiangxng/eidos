import test from "node:test";
import assert from "node:assert/strict";
import {
  createAppHost,
  inferSurfaceTargetV010,
  resolveExperienceSurfaceV010,
  validateEffectiveExperienceManifest
} from "../../dist/app-host/index.js";

function manifest(overrides = {}) {
  return {
    contractVersion: "0.1.0",
    experienceId: "company-notes",
    packageId: "company-notes",
    featureId: "company-notes.default",
    defaultRoute: "/notes",
    pages: [
      { id: "company-notes.home", title: "Company Notes", source: "memory://company-notes/home" }
    ],
    routes: [
      { id: "company-notes.home", path: "/notes", pageId: "company-notes.home" }
    ],
    navigation: [
      { id: "company-notes.nav", label: "Company Notes", route: "/notes", order: 20 }
    ],
    ...overrides
  };
}

test("validates effective experience manifest", () => {
  const result = validateEffectiveExperienceManifest(manifest());
  assert.equal(result.ok, true);
  assert.equal(result.value?.featureId, "company-notes.default");
});

test("rejects route to unknown page", () => {
  const result = validateEffectiveExperienceManifest(manifest({
    routes: [{ id: "bad", path: "/bad", pageId: "missing" }]
  }));
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(x => x.code === "EIDOS_APP_HOST_ROUTE_PAGE"));
});

test("discovers, resolves and loads active experience contributions", async () => {
  let manifests = [manifest()];
  const pages = new Map([
    ["memory://company-notes/home", { contractVersion: "0.1.1", kind: "form", id: "notes-page" }]
  ]);

  const source = {
    async listEffectiveExperienceManifests() {
      return manifests;
    },
    async loadPage(page) {
      return pages.get(page.source);
    }
  };

  const host = createAppHost(source);
  const first = await host.refresh();

  assert.equal(first.status, "ready");
  assert.equal(first.manifests.length, 1);
  assert.equal(first.navigation[0].id, "company-notes.nav");

  const route = host.resolveRoute("/notes");
  assert.equal(route?.page.id, "company-notes.home");
  assert.equal(route?.packageId, "company-notes");

  const loaded = await host.loadRoute("/notes");
  assert.deepEqual(loaded?.definition, {
    contractVersion: "0.1.1",
    kind: "form",
    id: "notes-page"
  });

  manifests = [
    manifest(),
    manifest({
      experienceId: "agent",
      packageId: "enterprise-agent",
      featureId: "enterprise-agent.experience",
      defaultRoute: "/agent",
      pages: [{ id: "enterprise-agent.home", source: "memory://agent/home" }],
      routes: [{ id: "enterprise-agent.home", path: "/agent", pageId: "enterprise-agent.home" }],
      navigation: [{ id: "enterprise-agent.nav", label: "Enterprise Agent", route: "/agent", order: 10 }]
    })
  ];

  const second = await host.refresh();
  assert.equal(second.status, "ready");
  assert.equal(second.revision, 2);
  assert.deepEqual(second.navigation.map(x => x.id), [
    "enterprise-agent.nav",
    "company-notes.nav"
  ]);

  host.dispose();
});

test("rejects ambiguous cross-package route conflicts deterministically", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [
        manifest(),
        manifest({
          experienceId: "other",
          packageId: "other-package",
          featureId: "other.default",
          pages: [{ id: "other.home", source: "memory://other" }],
          routes: [{ id: "other.home", path: "/notes", pageId: "other.home" }],
          navigation: [{ id: "other.nav", label: "Other", route: "/notes" }]
        })
      ];
    },
    async loadPage() {
      return {};
    }
  };

  const host = createAppHost(source);
  const snapshot = await host.refresh();

  assert.equal(snapshot.status, "error");
  assert.equal(snapshot.manifests.length, 0);
  assert.ok(snapshot.diagnostics.some(x => x.code === "EIDOS_APP_HOST_ROUTE_PATH_CONFLICT"));
});


function surfacedManifest(overrides = {}) {
  return manifest({
    pages: [
      { id: "orders.desktop", source: "memory://orders/desktop" },
      { id: "orders.mobile", source: "memory://orders/mobile" }
    ],
    routes: [
      {
        id: "orders.desktop",
        path: "/orders",
        pageId: "orders.desktop",
        semanticId: "orders.home",
        surfaceId: "desktop"
      },
      {
        id: "orders.mobile",
        path: "/m/orders",
        pageId: "orders.mobile",
        semanticId: "orders.home",
        surfaceId: "mobile-task"
      }
    ],
    navigation: [
      {
        id: "orders.desktop.nav",
        label: "Orders",
        route: "/orders",
        surfaceIds: ["desktop"]
      },
      {
        id: "orders.mobile.nav",
        label: "Orders",
        route: "/m/orders",
        surfaceIds: ["mobile-task"]
      }
    ],
    surfaces: [
      {
        id: "desktop",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/orders"
      },
      {
        id: "mobile-task",
        target: "MOBILE_TASK",
        support: "TASK_FOCUSED",
        entryRoute: "/m/orders",
        fallbackSurfaceId: "desktop"
      },
      {
        id: "mobile-read",
        target: "MOBILE_READ",
        support: "UNSUPPORTED",
        fallbackSurfaceId: "desktop"
      }
    ],
    defaultRoute: "/orders",
    ...overrides
  });
}

test("Surface resolver preserves one semantic route across desktop and mobile implementations", () => {
  const value = surfacedManifest();

  const desktop = resolveExperienceSurfaceV010(value, {
    semanticRouteId: "orders.home",
    explicitTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(desktop.kind, "ROUTE");
  assert.equal(desktop.route.path, "/orders");
  assert.equal(desktop.surfaceId, "desktop");
  assert.equal(desktop.support, "FULL");
  assert.equal(desktop.selectedBy, "EXPLICIT");

  const mobile = resolveExperienceSurfaceV010(value, {
    semanticRouteId: "orders.home",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "ROUTE");
  assert.equal(mobile.route.path, "/m/orders");
  assert.equal(mobile.surfaceId, "mobile-task");
  assert.equal(mobile.support, "TASK_FOCUSED");
});

test("Surface resolver precedence is explicit target then user target then capability then desktop default", () => {
  const value = surfacedManifest();
  const compactProfile = {
    contractVersion: "0.1.0",
    viewportClass: "COMPACT",
    primaryPointer: "COARSE",
    hover: false,
    touch: true,
    reducedMotion: false,
    standalone: false
  };

  assert.equal(inferSurfaceTargetV010(compactProfile), "MOBILE_TASK");

  const explicit = resolveExperienceSurfaceV010(value, {
    semanticRouteId: "orders.home",
    explicitTarget: "DESKTOP_WORKBENCH",
    userTarget: "MOBILE_TASK",
    profile: compactProfile
  });
  assert.equal(explicit.kind, "ROUTE");
  assert.equal(explicit.target, "DESKTOP_WORKBENCH");
  assert.equal(explicit.selectedBy, "EXPLICIT");

  const user = resolveExperienceSurfaceV010(value, {
    semanticRouteId: "orders.home",
    userTarget: "DESKTOP_WORKBENCH",
    profile: compactProfile
  });
  assert.equal(user.kind, "ROUTE");
  assert.equal(user.target, "DESKTOP_WORKBENCH");
  assert.equal(user.selectedBy, "USER");

  const capability = resolveExperienceSurfaceV010(value, {
    semanticRouteId: "orders.home",
    profile: compactProfile
  });
  assert.equal(capability.kind, "ROUTE");
  assert.equal(capability.target, "MOBILE_TASK");
  assert.equal(capability.selectedBy, "CAPABILITY");

  const fallback = resolveExperienceSurfaceV010(value, {
    semanticRouteId: "orders.home"
  });
  assert.equal(fallback.kind, "ROUTE");
  assert.equal(fallback.target, "DESKTOP_WORKBENCH");
  assert.equal(fallback.selectedBy, "DEFAULT");
});

test("unsupported mobile Surface returns deterministic handoff instead of compressed desktop fallback", () => {
  const resolution = resolveExperienceSurfaceV010(surfacedManifest(), {
    semanticRouteId: "orders.home",
    explicitTarget: "MOBILE_READ"
  });

  assert.deepEqual(resolution, {
    kind: "HANDOFF",
    target: "MOBILE_READ",
    reason: "TARGET_UNSUPPORTED",
    selectedBy: "EXPLICIT",
    semanticRouteId: "orders.home",
    availableTargets: ["DESKTOP_WORKBENCH", "MOBILE_TASK"],
    fallbackSurfaceId: "desktop"
  });
});

test("legacy manifests are desktop-only and hand off on mobile", () => {
  const resolution = resolveExperienceSurfaceV010(manifest(), {
    path: "/notes",
    explicitTarget: "MOBILE_TASK"
  });

  assert.equal(resolution.kind, "HANDOFF");
  assert.equal(resolution.reason, "LEGACY_DESKTOP_ONLY");
  assert.deepEqual(resolution.availableTargets, ["DESKTOP_WORKBENCH"]);
});

test("validates Surface metadata and rejects unknown route Surface references", () => {
  const valid = validateEffectiveExperienceManifest(surfacedManifest());
  assert.equal(valid.ok, true);
  assert.deepEqual(valid.value?.surfaces?.map(item => item.id), [
    "desktop",
    "mobile-task",
    "mobile-read"
  ]);
  assert.equal(valid.value?.routes[1].semanticId, "orders.home");
  assert.equal(valid.value?.routes[1].surfaceId, "mobile-task");

  const invalid = validateEffectiveExperienceManifest(surfacedManifest({
    routes: [
      {
        id: "orders.desktop",
        path: "/orders",
        pageId: "orders.desktop",
        semanticId: "orders.home",
        surfaceId: "missing"
      }
    ],
    navigation: []
  }));
  assert.equal(invalid.ok, false);
  assert.ok(invalid.diagnostics.some(item =>
    item.code === "EIDOS_APP_HOST_ROUTE_SURFACE"
  ));
});
