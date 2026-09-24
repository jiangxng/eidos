import test from "node:test";
import assert from "node:assert/strict";
import { getCapability, renderCatalogBrowserToHtml } from "../../dist/index.js";

test("catalog browser is a declared reusable Eidos capability", () => {
  const capability = getCapability("catalog-browser");
  assert.equal(capability?.category, "navigation");
  assert.deepEqual(capability?.renderers, ["html"]);
});

test("catalog browser renderer exposes semantic Eidos item/action markers", () => {
  const html = renderCatalogBrowserToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-browser",
    id: "plugin-store",
    title: "Plugin Store",
    items: [{
      id: "demo",
      title: "Demo",
      version: "1.0.0",
      status: { label: "Not installed", tone: "neutral" },
      primaryAction: { id: "install", label: "Install", requiresConfirmation: true }
    }]
  });
  assert.match(html, /data-eidos-capability="catalog-browser"/);
  assert.match(html, /data-eidos-catalog-item="demo"/);
  assert.match(html, /data-eidos-catalog-action="install"/);
});
