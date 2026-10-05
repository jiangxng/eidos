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


test("Catalog Detail renders same-origin native download actions", () => {
  const html = renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "template-detail-download",
    itemId: "template:ledger",
    title: "Ledger Runtime",
    gallery: {
      primaryItemId: "projection:main",
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: { src: "/main.svg", alt: "Main" }
      }]
    },
    secondaryActions: [{
      id: "download",
      label: "Download",
      type: "download",
      href: "/v1/templates/download?id=template%3Aledger&version=3",
      downloadFileName: "ledger-v3.evo-template.json"
    }]
  });

  assert.match(html, /data-eidos-catalog-download="download"/);
  assert.match(html, /href="\/v1\/templates\/download\?id=template%3Aledger&amp;version=3"/);
  assert.match(html, /download="ledger-v3\.evo-template\.json"/);
});

test("Catalog Detail refuses cross-origin download hrefs", () => {
  assert.throws(() => renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "unsafe-download",
    itemId: "template:ledger",
    title: "Ledger Runtime",
    gallery: {
      primaryItemId: "projection:main",
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: { src: "/main.svg", alt: "Main" }
      }]
    },
    secondaryActions: [{
      id: "download",
      label: "Download",
      type: "download",
      href: "https://example.invalid/file.json"
    }]
  }), /EIDOS_CATALOG_DOWNLOAD_HREF_INVALID/);
});


test("Catalog Detail gallery items may expose a separate secondary action without replacing thumbnail open behavior", () => {
  const html = renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "projection-gallery",
    itemId: "software:runtime",
    title: "Enterprise Software",
    gallery: {
      primaryItemId: "projection:main",
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: { src: "/main.svg", alt: "Main" },
        action: {
          id: "view-main",
          label: "View",
          type: "command",
          command: "projection.view"
        },
        secondaryActions: [{
          id: "edit-main",
          label: "Edit projection",
          type: "command",
          command: "projection.edit"
        }]
      }]
    }
  });

  assert.match(html, /data-eidos-command="projection\.view"/);
  assert.match(html, /data-eidos-command="projection\.edit"/);
  assert.match(html, /data-eidos-catalog-detail-media-actions/);
});


test("Catalog Detail supports a nine-item interactive projection gallery", () => {
  const items = Array.from({ length: 9 }, (_, index) => ({
    id: `projection:${index + 1}`,
    title: index === 0 ? "Main" : `View ${index + 1}`,
    thumbnail: {
      src: `/projection-${index + 1}.svg`,
      alt: `Projection ${index + 1}`
    },
    action: {
      id: `view-${index + 1}`,
      label: `Open view ${index + 1}`,
      type: "command",
      command: "projection.view",
      values: {
        projectionId: `projection:${index + 1}`
      }
    }
  }));

  const html = renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "template-projection-gallery",
    itemId: "template:manufacturing",
    title: "Manufacturing Template",
    gallery: {
      primaryItemId: "projection:1",
      maxItems: 9,
      requireItemActions: true,
      items
    }
  });

  assert.equal(
    (html.match(/data-eidos-catalog-detail-media="thumbnail"/g) ?? []).length,
    9
  );
  assert.equal(
    (html.match(/data-eidos-command="projection\.view"/g) ?? []).length,
    10
  );
});

test("Catalog Detail rejects projection galleries above the declared limit", () => {
  assert.throws(() => renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "too-many-projections",
    itemId: "template:manufacturing",
    title: "Manufacturing Template",
    gallery: {
      primaryItemId: "projection:1",
      maxItems: 9,
      items: Array.from({ length: 10 }, (_, index) => ({
        id: `projection:${index + 1}`,
        title: `Projection ${index + 1}`,
        thumbnail: {
          src: `/projection-${index + 1}.svg`,
          alt: `Projection ${index + 1}`
        }
      }))
    }
  }), /EIDOS_CATALOG_DETAIL_GALLERY_LIMIT_INVALID/);
});

test("Catalog Detail can require every projection thumbnail to open a viewer", () => {
  assert.throws(() => renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "non-interactive-projection",
    itemId: "template:manufacturing",
    title: "Manufacturing Template",
    gallery: {
      primaryItemId: "projection:main",
      maxItems: 9,
      requireItemActions: true,
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: { src: "/main.svg", alt: "Main" }
      }]
    }
  }), /EIDOS_CATALOG_DETAIL_GALLERY_ITEM_ACTION_REQUIRED/);
});

test("Catalog Detail exposes download, edit, create-version and share lifecycle actions together", () => {
  const html = renderCatalogDetailToHtml({
    contractVersion: "0.1.0",
    kind: "catalog-detail",
    id: "template-lifecycle",
    itemId: "template:manufacturing",
    title: "Manufacturing Template",
    gallery: {
      primaryItemId: "projection:main",
      maxItems: 9,
      requireItemActions: true,
      items: [{
        id: "projection:main",
        title: "Main",
        thumbnail: { src: "/main.svg", alt: "Main" },
        action: {
          id: "view-main",
          label: "View",
          type: "command",
          command: "projection.view"
        },
        secondaryActions: [{
          id: "edit-main",
          label: "Edit projection",
          type: "command",
          command: "projection.edit"
        }]
      }]
    },
    secondaryActions: [{
      id: "download",
      label: "Download",
      type: "download",
      href: "/v1/templates/download?id=template%3Amanufacturing"
    }, {
      id: "edit",
      label: "Edit",
      type: "command",
      command: "template.edit"
    }, {
      id: "create-version",
      label: "Create version",
      type: "command",
      command: "template.version.create"
    }, {
      id: "share",
      label: "Share",
      type: "command",
      command: "template.share"
    }]
  });

  assert.match(html, /data-eidos-catalog-download="download"/);
  assert.match(html, /data-eidos-command="template\.edit"/);
  assert.match(html, /data-eidos-command="template\.version\.create"/);
  assert.match(html, /data-eidos-command="template\.share"/);
  assert.match(html, /data-eidos-command="projection\.edit"/);
});
