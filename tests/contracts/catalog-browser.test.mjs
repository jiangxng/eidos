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

test("catalog browser action may be disabled with a human-readable reason", () => {
  const html = renderCatalogBrowserToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-browser",
    id: "plugin-store-state",
    title: "Plugin Store",
    items: [{
      id: "demo",
      title: "Demo",
      primaryAction: {
        id: "install",
        label: "Install",
        type: "command",
        command: "install",
        enabled: false,
        disabledReason: "Generate the installation plan first.",
        helpText: "Review dependencies before installation."
      }
    }]
  });
  assert.match(html, /data-eidos-catalog-action="install"/);
  assert.match(html, /disabled/);
  assert.match(html, /data-eidos-disabled-reason="Generate the installation plan first\."/);
  assert.match(html, /data-eidos-action-help/);
});


test("catalog browser may expose deterministic local search metadata", () => {
  const html = renderCatalogBrowserToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-browser",
    id: "help-index",
    title: "Help",
    search: {
      placeholder: "Search help",
      noResultsMessage: "No matching help."
    },
    items: [{
      id: "provider-binding",
      title: "Provider Binding",
      summary: "Choose a Provider by capability and scope.",
      category: "How-to",
      metadata: { errorCode: "PROVIDER_RESOLUTION_AMBIGUOUS" },
      primaryAction: {
        id: "open",
        label: "Open",
        type: "navigate",
        route: "/help/provider-binding"
      }
    }]
  });

  assert.match(html, /data-eidos-catalog-search-input/);
  assert.match(html, /placeholder="Search help"/);
  assert.match(html, /data-eidos-catalog-search-text="[^"]*provider binding/);
  assert.match(html, /provider_resolution_ambiguous/i);
  assert.match(html, /data-eidos-catalog-search-empty/);
});
