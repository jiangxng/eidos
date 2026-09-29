import test from "node:test";
import assert from "node:assert/strict";

import {
  isEntityInspectorV010,
  renderEntityInspectorToHtml
} from "../../dist/entity-inspector/index.js";

function document() {
  return {
    contractVersion: "0.1.0",
    kind: "entity-inspector",
    id: "enterprise-runtime",
    title: "Enterprise runtime",
    description: "Read-only operational evidence.",
    freshness: {
      label: "Observed runtime",
      observedAt: "2026-09-29T15:00:00.000Z",
      windowStartAt: "2026-09-29T14:00:00.000Z",
      windowEndAt: "2026-09-29T15:00:00.000Z",
      stale: false
    },
    items: [{
      id: "app:o2c-order",
      title: "Product Sales Order",
      kind: "APPLICATION",
      status: "INSUFFICIENT_EVIDENCE",
      summary: "Stable ApplicationAnchor",
      metrics: [{
        id: "event.count",
        label: "Events",
        value: "0",
        tone: "neutral",
        detail: "EVO runtime"
      }],
      evidence: [{
        id: "fact:1",
        title: "Runtime fact",
        source: "evo-runtime-observatory",
        detail: "application anchor",
        observedAt: "2026-09-29T15:00:00.000Z"
      }]
    }]
  };
}

test("Entity Inspector recognizes and renders read-only entity evidence", () => {
  const value = document();
  assert.equal(isEntityInspectorV010(value), true);

  const html = renderEntityInspectorToHtml(value);
  assert.match(html, /data-eidos-entity-inspector/);
  assert.match(html, /data-entity-inspector-id="enterprise-runtime"/);
  assert.match(html, /data-item-id="app:o2c-order"/);
  assert.match(html, /data-metric-id="event.count"/);
  assert.match(html, /data-evidence-id="fact:1"/);
  assert.match(html, /Observed runtime/);
  assert.doesNotMatch(html, /data-eidos-action/);
});

test("Entity Inspector escapes entity and evidence content", () => {
  const value = document();
  value.items[0].title = "<script>alert(1)</script>";
  value.items[0].evidence[0].detail = "<img src=x onerror=alert(1)>";

  const html = renderEntityInspectorToHtml(value);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img/);
});

test("Entity Inspector rejects duplicate stable entity identity", () => {
  const value = document();
  value.items.push(structuredClone(value.items[0]));
  assert.throws(
    () => renderEntityInspectorToHtml(value),
    /EIDOS_ENTITY_INSPECTOR_ITEM_DUPLICATE/
  );
});
