import test from "node:test";
import assert from "node:assert/strict";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

test("App Host renders catalog-browser through the Eidos catalog capability", () => {
  const html = renderAppHostPageToHtml({
    experienceId: "plugin-store",
    packageId: "evo-app-platform",
    featureId: "plugin-store.system",
    route: { id: "plugin-store.home", path: "/store", pageId: "plugin-store.home" },
    page: { id: "plugin-store.home", source: "app://platform/plugin-store" },
    definition: {
      contractVersion: "0.1.0",
      kind: "catalog-browser",
      id: "plugin-store",
      title: "Plugin Store",
      items: [{
        id: "ledger-configurator",
        title: "Ledger Runtime Configurator",
        primaryAction: {
          id: "plan",
          label: "Plan Install",
          type: "command",
          command: "app-platform.plan-install"
        }
      }]
    }
  });

  assert.match(html, /data-eidos-capability="catalog-browser"/);
  assert.match(html, /data-eidos-command="app-platform\.plan-install"/);
  assert.match(html, /data-eidos-item-id="ledger-configurator"/);
});


test("Catalog Browser renders secondary actions before the single trailing primary action", () => {
  const html = renderAppHostPageToHtml({
    experienceId: "templates",
    packageId: "templates",
    featureId: "templates.default",
    route: { id: "templates.home", path: "/templates", pageId: "templates.home" },
    page: { id: "templates.home", source: "app://templates/home" },
    definition: {
      contractVersion: "0.1.0",
      kind: "catalog-browser",
      id: "templates",
      title: "Templates",
      items: [{
        id: "baseline",
        title: "Baseline",
        primaryAction: {
          id: "use",
          label: "Use template",
          type: "command",
          command: "template.use"
        },
        secondaryActions: [{
          id: "preview",
          label: "Preview",
          type: "command",
          command: "template.preview",
          enabled: false,
          disabledReason: "Viewer required",
          helpText: "Install Viewer to preview."
        }]
      }]
    }
  });

  assert.ok(
    html.indexOf('data-eidos-catalog-action="preview"')
      < html.indexOf('data-eidos-catalog-action="use"')
  );
  assert.match(html, /data-eidos-disabled-reason="Viewer required"/);
  assert.match(html, /data-eidos-action-help/);
});
