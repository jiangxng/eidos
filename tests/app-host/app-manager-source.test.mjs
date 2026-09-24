import test from "node:test";
import assert from "node:assert/strict";
import {
  createAppHost,
  createAppManagerExperienceSource
} from "../../dist/app-host/index.js";

test("AppManagerExperienceSource connects effective manifests and page loading", async () => {
  const requests = [];
  let installed = false;

  const fetchImpl = async (input) => {
    const url = input instanceof URL ? input : new URL(String(input));
    requests.push(url.toString());

    if (url.pathname === "/v1/experiences/effective") {
      return Response.json(installed ? [{
        contractVersion: "0.1.0",
        experienceId: "company-notes",
        packageId: "company-notes",
        featureId: "company-notes.default",
        defaultRoute: "/notes",
        pages: [{
          id: "company-notes.home",
          title: "Company Notes",
          source: "app://company-notes/pages/home"
        }],
        routes: [{
          id: "company-notes.home",
          path: "/notes",
          pageId: "company-notes.home"
        }],
        navigation: [{
          id: "company-notes.nav",
          label: "Company Notes",
          route: "/notes",
          order: 20
        }]
      }] : []);
    }

    if (url.pathname === "/v1/experience-pages") {
      assert.equal(url.searchParams.get("source"), "app://company-notes/pages/home");
      return Response.json({
        contractVersion: "0.1.1",
        kind: "form",
        id: "company-notes.home"
      });
    }

    return new Response("not found", { status: 404 });
  };

  const source = createAppManagerExperienceSource({
    baseUrl: "http://app-manager.test/",
    fetchImpl
  });
  const host = createAppHost(source);

  const before = await host.refresh();
  assert.equal(before.manifests.length, 0);

  installed = true;
  const after = await host.refresh();
  assert.equal(after.manifests.length, 1);
  assert.equal(after.navigation[0].label, "Company Notes");

  const page = await host.loadRoute("/notes");
  assert.equal(page.definition.id, "company-notes.home");
  assert.ok(requests.some(x => x.includes("/v1/experiences/effective")));
  assert.ok(requests.some(x => x.includes("/v1/experience-pages?source=")));
});
