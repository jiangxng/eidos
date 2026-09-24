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
