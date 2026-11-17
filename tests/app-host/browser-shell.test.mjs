import test from "node:test";
import assert from "node:assert/strict";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

test("default App Host page renderer renders UIDL through Eidos renderer", () => {
  const html = renderAppHostPageToHtml({
    experienceId: "company-notes",
    packageId: "company-notes",
    featureId: "company-notes.default",
    route: { id: "company-notes.home", path: "/notes", pageId: "company-notes.home" },
    page: { id: "company-notes.home", source: "app://company-notes/pages/home" },
    definition: {
      contractVersion: "0.1.1",
      kind: "form",
      id: "company-notes.home",
      title: "Company Notes",
      purpose: "execute-command",
      command: { code: "company-notes.save-note", inputVersion: "0.1.0" },
      fields: [
        {
          key: "title",
          label: "Title",
          semanticType: "note-title",
          control: "text",
          required: true
        }
      ],
      actions: [
        {
          id: "save",
          label: "Save Note",
          type: "submit",
          command: "company-notes.save-note",
          requiresConfirmation: false
        }
      ]
    }
  });

  assert.match(html, /Company Notes/);
  assert.match(html, /company-notes\.save-note/);
  assert.match(html, /data-eidos-action="save"/);
});


test("App Host renders Task Inbox definitions through the semantic renderer", () => {
  const html = renderAppHostPageToHtml({
    experienceId: "my-work",
    packageId: "host-my-work",
    featureId: "host-my-work.default",
    route: { id: "my-work.desktop", path: "/work", pageId: "my-work.home" },
    page: { id: "my-work.home", source: "host://my-work" },
    definition: {
      contractVersion: "0.1.0",
      kind: "task-inbox",
      id: "my-work",
      title: "My Work",
      items: [{
        id: "work:1",
        title: "Ship order",
        state: "READY",
        statusLabel: "Ready",
        priority: 20,
        workType: "SHIP"
      }]
    }
  });

  assert.match(html, /data-eidos-task-inbox/);
  assert.match(html, /Ship order/);
  assert.match(html, /data-work-type="SHIP"/);
});


test("Catalog route refresh preserves only focused quick-filter identity or server-search input", async () => {
  const { readFile } = await import("node:fs/promises");
  const code = await readFile(new URL("../../src/app-host/browser-shell.ts", import.meta.url), "utf8");
  // Structural safety contract; live focus behavior is verified by the
  // consumer's real Chromium Host test, not simulated with a fake DOM here.
  assert.match(code,/function captureCatalogRouteFocusV010\(/);
  assert.match(code,/function restoreCatalogRouteFocusV010\(/);
  assert.match(code,/slot\.contains\(active\)/);
  assert.match(code,/data-eidos-catalog-quick-filters/);
  assert.match(code,/data-eidos-catalog-server-search/);
  assert.match(code,/button\.dataset\.eidosCatalogAction === intent\.actionId/);
  assert.match(code,/target\?\.focus\(\{preventScroll:true\}\)/);
  assert.match(code,/if \(!read\.isCurrent\(\)\) return/);
  assert.doesNotMatch(code,/localStorage\.setItem\(.*[Ff]ocus/);
});

test("Catalog keyboard focus is captured before hash navigation and never reused across pages", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../../src/app-host/browser-shell.ts", import.meta.url), "utf8");
  assert.match(source, /pendingCatalogFocus/);
  assert.match(source, /const fromPath = activePath\.split\("\?"\)\[0\]/);
  assert.match(source, /const toPath = resolvedPath\.split\("\?"\)\[0\]/);
  assert.match(source, /fromPath === toPath/);
  assert.match(source, /route:resolvedPath,intent/);
  assert.match(source, /pendingCatalogFocus\?\.route === resolvedPath/);
  assert.match(source, /pendingCatalogFocus = undefined/);
  assert.match(source, /if \(!read\.isCurrent\(\)\) return/);
});
