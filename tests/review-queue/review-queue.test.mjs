import test from "node:test";
import assert from "node:assert/strict";

import {
  isReviewQueueV010,
  renderReviewQueueToHtml
} from "../../dist/review-queue/index.js";
import {
  createLocalizationRuntime,
  localizeAppHostPageDefinition
} from "../../dist/localization/index.js";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

const definition = {
  contractVersion: "0.1.0",
  kind: "review-queue",
  id: "memory.review",
  title: "Memory review",
  description: "Review proposed durable knowledge.",
  emptyMessage: "Nothing to review.",
  items: [{
    id: "proposal:1",
    title: "Supplier account changes need two-person review",
    summary: "Proposed practice",
    state: "pending",
    statusLabel: "Pending",
    metrics: [
      { id: "confidence", label: "Confidence", value: "High", tone: "positive" },
      { id: "conflicts", label: "Conflicts", value: "1", tone: "warning" }
    ],
    fields: [
      { key: "kind", label: "Kind", control: "select", value: "PRACTICE", options: [
        { label: "Practice", value: "PRACTICE" },
        { label: "Experience", value: "EXPERIENCE" }
      ]},
      { key: "summary", label: "Summary", control: "textarea", value: "Use two-person review." }
    ],
    evidence: [{
      id: "e1",
      title: "Policy",
      source: "ACME",
      detail: "Supplier payment controls",
      route: "/policy/7"
    }],
    primaryAction: {
      id: "accept",
      label: "Accept",
      type: "command",
      command: "memory.proposal.accept",
      requiresConfirmation: true
    },
    secondaryActions: [{
      id: "reject",
      label: "Reject",
      type: "command",
      command: "memory.proposal.reject"
    }]
  }]
};

const page = {
  experienceId: "memory-review",
  packageId: "assistant",
  featureId: "assistant.default",
  route: { id: "memory.review", path: "/memory-review", pageId: "memory.review" },
  page: { id: "memory.review", source: "memory://assistant/review" },
  definition
};

test("Review Queue contract and renderer expose review semantics without domain-specific code", () => {
  assert.equal(isReviewQueueV010(definition), true);
  const html = renderReviewQueueToHtml(definition);
  assert.match(html, /data-eidos-review-queue/);
  assert.match(html, /data-eidos-review-item/);
  assert.match(html, /data-eidos-review-field="summary"/);
  assert.match(html, /data-eidos-review-evidence/);
  assert.match(html, /data-eidos-review-metric/);
  assert.match(html, /data-eidos-review-action="accept"/);
  assert.match(html, /data-eidos-confirm="true"/);
  assert.match(html, /data-eidos-primary="true"/);
});

test("App Host renders Review Queue as a first-class Eidos capability", () => {
  const html = renderAppHostPageToHtml(page);
  assert.match(html, /data-eidos-review-queue/);
  assert.doesNotMatch(html, /data-eidos-id=/);
});

test("Review Queue localizes chrome while preserving machine ids commands and values", () => {
  const bundles = [
    {
      contractVersion: "0.1.0",
      namespace: "assistant",
      locale: "ja",
      messages: {
        "review.memory.review.title": "メモリーレビュー",
        "review.memory.review.description": "永続化する知識候補を確認します。",
        "review.memory.review.empty": "確認項目はありません。",
        "review.memory.review.status.pending.label": "確認待ち",
        "review.memory.review.metric.confidence.label": "信頼度",
        "review.memory.review.field.kind.label": "種類",
        "review.memory.review.field.kind.option.PRACTICE.label": "プラクティス",
        "review.memory.review.field.summary.label": "要約",
        "review.memory.review.action.accept.label": "承認",
        "review.memory.review.action.reject.label": "却下"
      }
    },
    {
      contractVersion: "0.1.0",
      namespace: "assistant",
      locale: "zh-TW",
      messages: {
        "review.memory.review.title": "記憶審核",
        "review.memory.review.action.accept.label": "接受",
        "review.memory.review.action.reject.label": "拒絕"
      }
    }
  ];

  const ja = localizeAppHostPageDefinition(
    page,
    createLocalizationRuntime(bundles, { locale: "ja" })
  );
  assert.equal(ja.title, "メモリーレビュー");
  assert.equal(ja.items[0].fields[0].label, "種類");
  assert.equal(ja.items[0].fields[0].options[0].value, "PRACTICE");
  assert.equal(ja.items[0].primaryAction.command, "memory.proposal.accept");

  const tw = localizeAppHostPageDefinition(
    page,
    createLocalizationRuntime(bundles, { locale: "zh-TW" })
  );
  assert.equal(tw.title, "記憶審核");
  assert.equal(tw.items[0].primaryAction.label, "接受");
  assert.equal(tw.items[0].id, "proposal:1");
});

test("Review Queue rejects duplicate item ids", () => {
  assert.throws(
    () => renderReviewQueueToHtml({
      ...definition,
      items: [definition.items[0], definition.items[0]]
    }),
    /EIDOS_REVIEW_ITEM_DUPLICATE/
  );
});

test("Review Queue empty state remains compact", () => {
  const html = renderReviewQueueToHtml({
    ...definition,
    items: []
  });
  assert.match(html, /data-eidos-review-empty/);
  assert.match(html, /Nothing to review/);
});
