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


function surfaceManifest(overrides = {}) {
  return manifest({
    experienceId: "orders",
    packageId: "orders",
    featureId: "orders.default",
    defaultRoute: "/orders",
    pages: [
      { id: "orders.desktop", source: "memory://orders/desktop" },
      { id: "orders.mobile", source: "memory://orders/mobile" }
    ],
    surfaces: [
      {
        id: "orders.desktop",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/orders"
      },
      {
        id: "orders.mobile",
        target: "MOBILE_TASK",
        support: "TASK_FOCUSED",
        entryRoute: "/m/orders",
        fallbackSurfaceId: "orders.desktop"
      },
      {
        id: "orders.mobile-read",
        target: "MOBILE_READ",
        support: "UNSUPPORTED",
        fallbackSurfaceId: "orders.desktop"
      }
    ],
    routes: [
      {
        id: "orders.desktop.list",
        path: "/orders",
        pageId: "orders.desktop",
        semanticId: "orders.list",
        surfaceId: "orders.desktop"
      },
      {
        id: "orders.mobile.list",
        path: "/m/orders",
        pageId: "orders.mobile",
        semanticId: "orders.list",
        surfaceId: "orders.mobile"
      }
    ],
    navigation: [
      {
        id: "orders.nav",
        label: "Orders",
        route: "/orders",
        surfaceIds: ["orders.desktop", "orders.mobile"]
      }
    ],
    ...overrides
  });
}

test("surface manifest remains backward compatible while validating explicit surfaces", () => {
  assert.equal(validateEffectiveExperienceManifest(manifest()).ok, true);

  const result = validateEffectiveExperienceManifest(surfaceManifest());
  assert.equal(result.ok, true);
  assert.deepEqual(
    result.value?.surfaces?.map(surface => [
      surface.id,
      surface.target,
      surface.support
    ]),
    [
      ["orders.desktop", "DESKTOP_WORKBENCH", "FULL"],
      ["orders.mobile", "MOBILE_TASK", "TASK_FOCUSED"],
      ["orders.mobile-read", "MOBILE_READ", "UNSUPPORTED"]
    ]
  );
});

test("surface resolver preserves semantic route across desktop and mobile implementations", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [surfaceManifest()];
    },
    async loadPage(page) {
      return { id: page.id };
    }
  };
  const host = createAppHost(source);
  await host.refresh();

  const desktop = host.resolveSurface({
    experienceId: "orders",
    semanticRouteId: "orders.list",
    explicitTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(desktop.kind, "ROUTE");
  assert.equal(desktop.resolved.route.path, "/orders");
  assert.equal(desktop.resolved.semanticRouteId, "orders.list");
  assert.equal(desktop.resolved.selectedBy, "EXPLICIT");

  const mobile = host.resolveSurface({
    experienceId: "orders",
    path: "/orders",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "ROUTE");
  assert.equal(mobile.resolved.route.path, "/m/orders");
  assert.equal(mobile.resolved.surfaceSupport, "TASK_FOCUSED");
  assert.equal(mobile.resolved.semanticRouteId, "orders.list");

  const loaded = await host.loadSurface({
    experienceId: "orders",
    semanticRouteId: "orders.list",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(loaded.kind, "ROUTE");
  assert.deepEqual(loaded.page.definition, { id: "orders.mobile" });

  host.dispose();
});

test("surface resolution order is explicit then user then capability then default", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [surfaceManifest()];
    },
    async loadPage() {
      return {};
    }
  };
  const host = createAppHost(source);
  await host.refresh();

  const explicit = host.resolveSurface({
    experienceId: "orders",
    explicitTarget: "DESKTOP_WORKBENCH",
    userTarget: "MOBILE_TASK",
    profile: {
      contractVersion: "0.1.0",
      viewportClass: "COMPACT",
      primaryPointer: "COARSE",
      hover: false,
      touch: true,
      reducedMotion: false,
      standalone: false
    }
  });
  assert.equal(explicit.kind, "ROUTE");
  assert.equal(explicit.resolved.selectedBy, "EXPLICIT");
  assert.equal(explicit.resolved.surfaceTarget, "DESKTOP_WORKBENCH");

  const user = host.resolveSurface({
    experienceId: "orders",
    userTarget: "DESKTOP_WORKBENCH",
    profile: {
      contractVersion: "0.1.0",
      viewportClass: "COMPACT",
      primaryPointer: "COARSE",
      hover: false,
      touch: true,
      reducedMotion: false,
      standalone: false
    }
  });
  assert.equal(user.kind, "ROUTE");
  assert.equal(user.resolved.selectedBy, "USER");

  const capability = host.resolveSurface({
    experienceId: "orders",
    profile: {
      contractVersion: "0.1.0",
      viewportClass: "COMPACT",
      primaryPointer: "COARSE",
      hover: false,
      touch: true,
      reducedMotion: false,
      standalone: false
    }
  });
  assert.equal(capability.kind, "ROUTE");
  assert.equal(capability.resolved.selectedBy, "CAPABILITY");
  assert.equal(capability.resolved.surfaceTarget, "MOBILE_TASK");

  const defaulted = host.resolveSurface({ experienceId: "orders" });
  assert.equal(defaulted.kind, "ROUTE");
  assert.equal(defaulted.resolved.selectedBy, "DEFAULT");
  assert.equal(defaulted.resolved.surfaceTarget, "DESKTOP_WORKBENCH");

  host.dispose();
});

test("unsupported or legacy mobile targets produce deterministic handoff instead of squeezed desktop UI", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [surfaceManifest(), manifest({
        experienceId: "legacy",
        packageId: "legacy",
        featureId: "legacy.default",
        defaultRoute: "/legacy",
        pages: [{ id: "legacy.home", source: "memory://legacy" }],
        routes: [{ id: "legacy.home", path: "/legacy", pageId: "legacy.home" }],
        navigation: []
      })];
    },
    async loadPage() {
      return {};
    }
  };
  const host = createAppHost(source);
  await host.refresh();

  const unsupported = host.resolveSurface({
    experienceId: "orders",
    semanticRouteId: "orders.list",
    explicitTarget: "MOBILE_READ"
  });
  assert.equal(unsupported.kind, "HANDOFF");
  assert.equal(unsupported.reason, "TARGET_UNSUPPORTED");
  assert.equal(unsupported.fallbackSurfaceId, "orders.desktop");
  assert.deepEqual(
    unsupported.availableTargets.sort(),
    ["DESKTOP_WORKBENCH", "MOBILE_TASK"].sort()
  );

  const legacy = host.resolveSurface({
    experienceId: "legacy",
    path: "/legacy",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(legacy.kind, "HANDOFF");
  assert.equal(legacy.reason, "LEGACY_DESKTOP_ONLY");
  assert.deepEqual(legacy.availableTargets, ["DESKTOP_WORKBENCH"]);

  host.dispose();
});

test("surface validation rejects ambiguous semantic routes and fallback cycles", () => {
  const duplicateSemantic = validateEffectiveExperienceManifest(surfaceManifest({
    routes: [
      {
        id: "orders.desktop.list-a",
        path: "/orders/a",
        pageId: "orders.desktop",
        semanticId: "orders.list",
        surfaceId: "orders.desktop"
      },
      {
        id: "orders.desktop.list-b",
        path: "/orders/b",
        pageId: "orders.desktop",
        semanticId: "orders.list",
        surfaceId: "orders.desktop"
      }
    ]
  }));
  assert.equal(duplicateSemantic.ok, false);
  assert.ok(duplicateSemantic.diagnostics.some(
    item => item.code === "EIDOS_APP_HOST_ROUTE_SEMANTIC_DUPLICATE"
  ));

  const cycle = validateEffectiveExperienceManifest(surfaceManifest({
    surfaces: [
      {
        id: "orders.desktop",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/orders",
        fallbackSurfaceId: "orders.mobile"
      },
      {
        id: "orders.mobile",
        target: "MOBILE_TASK",
        support: "TASK_FOCUSED",
        entryRoute: "/m/orders",
        fallbackSurfaceId: "orders.desktop"
      }
    ]
  }));
  assert.equal(cycle.ok, false);
  assert.ok(cycle.diagnostics.some(
    item => item.code === "EIDOS_APP_HOST_SURFACE_FALLBACK_CYCLE"
  ));
});


test("resolves the same semantic route to desktop and mobile surfaces", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [{
        contractVersion: "0.1.0",
        experienceId: "orders",
        packageId: "orders",
        featureId: "orders.default",
        defaultRoute: "/orders",
        pages: [
          { id: "orders.desktop", source: "memory://orders/desktop" },
          { id: "orders.mobile", source: "memory://orders/mobile" }
        ],
        surfaces: [
          {
            id: "orders.desktop",
            target: "DESKTOP_WORKBENCH",
            support: "FULL",
            entryRoute: "/orders"
          },
          {
            id: "orders.mobile",
            target: "MOBILE_TASK",
            support: "TASK_FOCUSED",
            entryRoute: "/m/orders",
            fallbackSurfaceId: "orders.desktop"
          }
        ],
        routes: [
          {
            id: "orders.desktop",
            path: "/orders",
            pageId: "orders.desktop",
            semanticId: "orders.home",
            surfaceId: "orders.desktop"
          },
          {
            id: "orders.mobile",
            path: "/m/orders",
            pageId: "orders.mobile",
            semanticId: "orders.home",
            surfaceId: "orders.mobile"
          }
        ],
        navigation: [
          {
            id: "orders.nav.desktop",
            label: "Orders",
            route: "/orders",
            surfaceIds: ["orders.desktop"]
          },
          {
            id: "orders.nav.mobile",
            label: "Orders",
            route: "/m/orders",
            surfaceIds: ["orders.mobile"]
          }
        ]
      }];
    },
    async loadPage(page) {
      return { id: page.id };
    }
  };

  const host = createAppHost(source);
  const snapshot = await host.refresh();
  assert.equal(snapshot.status, "ready");

  const mobile = host.resolveSurface({
    path: "/orders",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "ROUTE");
  assert.equal(mobile.resolved.route.path, "/m/orders");
  assert.equal(mobile.resolved.semanticRouteId, "orders.home");
  assert.equal(mobile.resolved.surfaceSupport, "TASK_FOCUSED");

  const desktop = host.resolveSurface({
    semanticRouteId: "orders.home",
    explicitTarget: "DESKTOP_WORKBENCH",
    experienceId: "orders"
  });
  assert.equal(desktop.kind, "ROUTE");
  assert.equal(desktop.resolved.route.path, "/orders");

  const loaded = await host.loadSurface({
    semanticRouteId: "orders.home",
    explicitTarget: "MOBILE_TASK",
    experienceId: "orders"
  });
  assert.equal(loaded.kind, "ROUTE");
  assert.deepEqual(loaded.page.definition, { id: "orders.mobile" });
});

test("returns deterministic handoff for unsupported mobile surface", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [{
        contractVersion: "0.1.0",
        experienceId: "eog-editor",
        packageId: "eog",
        featureId: "eog.editor",
        defaultRoute: "/eog",
        pages: [{ id: "eog.desktop", source: "memory://eog" }],
        surfaces: [
          {
            id: "eog.desktop",
            target: "DESKTOP_WORKBENCH",
            support: "FULL",
            entryRoute: "/eog"
          },
          {
            id: "eog.mobile",
            target: "MOBILE_TASK",
            support: "UNSUPPORTED",
            fallbackSurfaceId: "eog.desktop"
          }
        ],
        routes: [{
          id: "eog.desktop",
          path: "/eog",
          pageId: "eog.desktop",
          semanticId: "eog.editor",
          surfaceId: "eog.desktop"
        }]
      }];
    },
    async loadPage() { return {}; }
  };

  const host = createAppHost(source);
  await host.refresh();
  const result = host.resolveSurface({
    path: "/eog",
    explicitTarget: "MOBILE_TASK"
  });

  assert.equal(result.kind, "HANDOFF");
  assert.equal(result.reason, "TARGET_UNSUPPORTED");
  assert.equal(result.fallbackSurfaceId, "eog.desktop");
  assert.deepEqual(result.availableTargets, ["DESKTOP_WORKBENCH"]);
});

test("legacy manifests remain desktop-compatible and fail closed on mobile", async () => {
  const source = {
    async listEffectiveExperienceManifests() { return [manifest()]; },
    async loadPage() { return {}; }
  };
  const host = createAppHost(source);
  await host.refresh();

  const desktop = host.resolveSurface({
    path: "/notes",
    explicitTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(desktop.kind, "ROUTE");
  assert.equal(desktop.resolved.surfaceId, "legacy:desktop");

  const mobile = host.resolveSurface({
    path: "/notes",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "HANDOFF");
  assert.equal(mobile.reason, "LEGACY_DESKTOP_ONLY");
});

test("surface manifest validation rejects ambiguous or cyclic declarations", () => {
  const duplicateTarget = validateEffectiveExperienceManifest(manifest({
    surfaces: [
      {
        id: "a",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/notes"
      },
      {
        id: "b",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/notes"
      }
    ]
  }));
  assert.equal(duplicateTarget.ok, false);
  assert.ok(duplicateTarget.diagnostics.some(
    x => x.code === "EIDOS_APP_HOST_SURFACE_TARGET_DUPLICATE"
  ));

  const cyclic = validateEffectiveExperienceManifest({
    ...manifest(),
    surfaces: [
      {
        id: "desktop",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/notes",
        fallbackSurfaceId: "mobile"
      },
      {
        id: "mobile",
        target: "MOBILE_TASK",
        support: "UNSUPPORTED",
        fallbackSurfaceId: "desktop"
      }
    ],
    routes: [{
      id: "company-notes.home",
      path: "/notes",
      pageId: "company-notes.home",
      surfaceId: "desktop"
    }]
  });
  assert.equal(cyclic.ok, false);
  assert.ok(cyclic.diagnostics.some(
    x => x.code === "EIDOS_APP_HOST_SURFACE_FALLBACK_CYCLE"
  ));
});


test("Surface resolver preserves semantic route identity across desktop and mobile implementations", async () => {
  const surfaceManifest = manifest({
    experienceId: "orders",
    packageId: "orders",
    featureId: "orders.experience",
    defaultRoute: "/orders",
    pages: [
      { id: "orders.desktop", source: "memory://orders/desktop" },
      { id: "orders.mobile", source: "memory://orders/mobile" }
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
        entryRoute: "/m/orders"
      }
    ],
    routes: [
      {
        id: "orders.desktop",
        path: "/orders",
        pageId: "orders.desktop",
        semanticId: "orders.home",
        surfaceId: "orders.desktop-surface"
      },
      {
        id: "orders.mobile",
        path: "/m/orders",
        pageId: "orders.mobile",
        semanticId: "orders.home",
        surfaceId: "orders.mobile-surface"
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
    ]
  });

  const source = {
    async listEffectiveExperienceManifests() {
      return [surfaceManifest];
    },
    async loadPage(page) {
      return { id: page.id };
    }
  };

  const host = createAppHost(source);
  const snapshot = await host.refresh();
  assert.equal(snapshot.status, "ready");

  const desktop = host.resolveSurface({
    experienceId: "orders",
    path: "/orders",
    explicitTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(desktop.kind, "ROUTE");
  assert.equal(desktop.resolved.route.path, "/orders");
  assert.equal(desktop.resolved.semanticRouteId, "orders.home");
  assert.equal(desktop.resolved.surfaceId, "orders.desktop-surface");

  const mobile = host.resolveSurface({
    experienceId: "orders",
    semanticRouteId: desktop.resolved.semanticRouteId,
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "ROUTE");
  assert.equal(mobile.resolved.route.path, "/m/orders");
  assert.equal(mobile.resolved.semanticRouteId, "orders.home");
  assert.equal(mobile.resolved.surfaceSupport, "TASK_FOCUSED");
});

test("Surface resolver returns deterministic handoff for explicitly unsupported mobile target", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [manifest({
        experienceId: "eog",
        packageId: "eog",
        featureId: "eog.experience",
        defaultRoute: "/eog",
        pages: [
          { id: "eog.desktop", source: "memory://eog/desktop" }
        ],
        surfaces: [
          {
            id: "eog.desktop-surface",
            target: "DESKTOP_WORKBENCH",
            support: "FULL",
            entryRoute: "/eog"
          },
          {
            id: "eog.mobile-surface",
            target: "MOBILE_TASK",
            support: "UNSUPPORTED",
            fallbackSurfaceId: "eog.desktop-surface"
          }
        ],
        routes: [
          {
            id: "eog.desktop",
            path: "/eog",
            pageId: "eog.desktop",
            semanticId: "eog.primary",
            surfaceId: "eog.desktop-surface"
          }
        ],
        navigation: []
      })];
    },
    async loadPage() {
      return {};
    }
  };

  const host = createAppHost(source);
  await host.refresh();

  const result = host.resolveSurface({
    experienceId: "eog",
    semanticRouteId: "eog.primary",
    explicitTarget: "MOBILE_TASK"
  });

  assert.deepEqual(result, {
    kind: "HANDOFF",
    experienceId: "eog",
    packageId: "eog",
    featureId: "eog.experience",
    target: "MOBILE_TASK",
    reason: "TARGET_UNSUPPORTED",
    selectedBy: "EXPLICIT",
    semanticRouteId: "eog.primary",
    availableTargets: ["DESKTOP_WORKBENCH"],
    fallbackSurfaceId: "eog.desktop-surface"
  });
});

test("legacy manifest remains desktop-compatible and fails closed to handoff on mobile", async () => {
  const source = {
    async listEffectiveExperienceManifests() {
      return [manifest()];
    },
    async loadPage() {
      return {};
    }
  };
  const host = createAppHost(source);
  await host.refresh();

  const desktop = host.resolveSurface({
    experienceId: "company-notes",
    path: "/notes",
    explicitTarget: "DESKTOP_WORKBENCH"
  });
  assert.equal(desktop.kind, "ROUTE");
  assert.equal(desktop.resolved.surfaceId, "legacy:desktop");

  const mobile = host.resolveSurface({
    experienceId: "company-notes",
    path: "/notes",
    explicitTarget: "MOBILE_TASK"
  });
  assert.equal(mobile.kind, "HANDOFF");
  assert.equal(mobile.reason, "LEGACY_DESKTOP_ONLY");
  assert.deepEqual(mobile.availableTargets, ["DESKTOP_WORKBENCH"]);
});

test("manifest validation rejects invalid Surface references and fallback cycles", () => {
  const result = validateEffectiveExperienceManifest(manifest({
    pages: [
      { id: "page.a", source: "memory://a" }
    ],
    routes: [
      {
        id: "route.a",
        path: "/a",
        pageId: "page.a",
        surfaceId: "missing"
      }
    ],
    navigation: [],
    surfaces: [
      {
        id: "surface.a",
        target: "DESKTOP_WORKBENCH",
        support: "FULL",
        entryRoute: "/a",
        fallbackSurfaceId: "surface.b"
      },
      {
        id: "surface.b",
        target: "MOBILE_TASK",
        support: "TASK_FOCUSED",
        entryRoute: "/a",
        fallbackSurfaceId: "surface.a"
      }
    ]
  }));

  assert.equal(result.ok, false);
  const codes = new Set(result.diagnostics.map(item => item.code));
  assert.ok(codes.has("EIDOS_APP_HOST_ROUTE_SURFACE"));
  assert.ok(codes.has("EIDOS_APP_HOST_SURFACE_FALLBACK_CYCLE"));
});
