import test from "node:test";
import assert from "node:assert/strict";

import {
  getCapability,
  renderCatalogDetailToHtml
} from "../../dist/index.js";

test("Catalog Detail is a reusable Eidos capability", () => {
  const capability = getCapability("catalog-detail");
  assert.equal(capability?.category, "navigation");
  assert.deepEqual(capability?.renderers, ["html"]);
});

test("Catalog Detail renders primary media plus alternate actionable gallery items", () => {
  const html = renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "template-detail",
    itemId: "template:ledger",
    title: "Ledger Runtime",
    description: "Interactive projections",
    version: "3",
    gallery: {
      primaryItemId: "projection:main",
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: {
          src: "/main.svg",
          alt: "Main projection"
        },
        action: {
          id: "preview-main",
          label: "Open Main",
          type: "command",
          command: "template.preview",
          values: {
            templateId: "template:ledger",
            templateVersion: 3,
            projectionId: "projection:main"
          }
        }
      }, {
        id: "projection:finance",
        title: "Finance",
        thumbnail: {
          src: "/finance.svg",
          alt: "Finance projection"
        },
        action: {
          id: "preview-finance",
          label: "Open Finance",
          type: "command",
          command: "template.preview",
          values: {
            projectionId: "projection:finance"
          }
        }
      }]
    }
  });

  assert.match(html, /data-eidos-capability="catalog-detail"/);
  assert.match(html, /data-eidos-catalog-detail-media="primary"/);
  assert.match(html, /data-eidos-catalog-detail-media="thumbnail"/);
  assert.match(html, /data-eidos-media-id="projection:main"/);
  assert.match(html, /data-eidos-media-id="projection:finance"/);
  assert.match(html, /data-eidos-command="template.preview"/);
  assert.match(html, /data-eidos-action-values=/);
  assert.match(html, /projection:finance/);
});

test("Catalog Detail rejects a missing primary gallery item", () => {
  assert.throws(() => renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "template-detail",
    itemId: "template:ledger",
    title: "Ledger Runtime",
    gallery: {
      primaryItemId: "projection:missing",
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: { src: "/main.svg", alt: "Main" }
      }]
    }
  }), /EIDOS_CATALOG_DETAIL_PRIMARY_MEDIA_NOT_FOUND/);
});
