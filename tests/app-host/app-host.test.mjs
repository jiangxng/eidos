import test from "node:test";
import assert from "node:assert/strict";
import { createAppHost, validateEffectiveExperienceManifest } from "../../dist/app-host/index.js";

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
