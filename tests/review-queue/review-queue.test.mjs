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
  technicalDetailsLabel: "Technical details",
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
      localizationKey: "policy",
      title: "Policy",
      source: "System evidence",
      detail: "Supplier payment controls",
      route: "/policy/7"
    }],
    technicalDetails: [{
      key: "proposalId",
      label: "Proposal ID",
      value: "proposal:1"
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
  assert.match(html, /data-eidos-review-technical/);
  assert.match(html, /Technical details/);
  assert.match(html, /Proposal ID/);
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
        "review.memory.review.action.reject.label": "却下",
        "review.memory.review.technicalDetails.label": "技術情報",
        "review.memory.review.technicalDetail.proposalId.label": "提案 ID",
        "review.memory.review.evidence.policy.source": "システム証拠"
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
  assert.equal(ja.technicalDetailsLabel, "技術情報");
  assert.equal(ja.items[0].technicalDetails[0].label, "提案 ID");
  assert.equal(ja.items[0].technicalDetails[0].value, "proposal:1");
  assert.equal(ja.items[0].evidence[0].source, "システム証拠");

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


const ALL_STATES = ["pending", "attention", "accepted", "rejected"];

const withOverview = {
  ...definition,
  context: {
    title: "Authorized workbook",
    subtitle: "Sheet 1 · 172 rows",
    statusLabel: "Source received",
    facts: [
      {id:"columns",label:"Columns",value:"22"},
      {id:"owner",label:"Source",value:"Team workspace"}
    ]
  },
  overviewMetrics: [
    {id:"matched",label:"Matched",value:"16"},
    {id:"proposed",label:"Proposed",value:"4"},
    {id:"ignored",label:"Excluded",value:"0"},
    {id:"issues",label:"Needs review",value:"3",tone:"warning"}
  ],
  stateFilter: {
    label: "Show",
    selectedId: "attention",
    noMatchesMessage: "No items in this view.",
    options: [
      {id:"attention",label:"Needs attention",states:["pending","attention"]},
      {id:"all",label:"All items",states:[...ALL_STATES]},
      {id:"completed",label:"Completed",states:["accepted","rejected"]}
    ]
  },
  items:[
    {...definition.items[0],state:"attention",statusLabel:"Needs review"},
    {...definition.items[0],id:"proposal:2",title:"Completed review",
      state:"accepted",statusLabel:"Accepted"}
  ]
};

test("E1 Review Queue presents task context, truthful overall metrics and attention-first filter", () => {
  const html = renderReviewQueueToHtml(withOverview);
  assert.match(html,/data-eidos-review-context/);
  assert.match(html,/Authorized workbook/);
  assert.match(html,/Sheet 1 · 172 rows/);
  assert.match(html,/data-eidos-review-context-facts/);
  assert.match(html,/data-eidos-review-overview/);
  assert.equal((html.match(/data-eidos-review-overview-metric/g)||[]).length,4);
  assert.match(html,/Needs review/);
  assert.match(html,/data-eidos-review-state-filter/);
  assert.match(html,/value="attention"[^>]*selected/);
  assert.match(html,/data-eidos-review-filter-states="pending,attention"/);
  assert.match(html,/data-eidos-review-results role="status" aria-live="polite">1 \/ 2/);
  assert.match(html,/data-item-id="proposal:2" data-state="accepted" hidden/);
  assert.match(html,/data-eidos-review-action="accept"/,
    "View filter must never remove the Host action.");
  assert.match(html,/data-eidos-review-item.*data-item-id="proposal:1"/s);
  assert.equal(withOverview.items[1].state,"accepted",
    "Filtering must not change real business state.");
});

test("E1 Review Queue remains backward-compatible without an overview", () => {
  const html=renderReviewQueueToHtml(definition);
  assert.doesNotMatch(html,/data-eidos-review-context/);
  assert.doesNotMatch(html,/data-eidos-review-state-filter/);
  assert.doesNotMatch(html,/data-eidos-review-overview/);
  assert.match(html,/data-eidos-review-action="accept"/);
});

test("E1 Review Queue fails closed for missing full-data filter, bad context and metric IDs",()=>{
  assert.throws(()=>renderReviewQueueToHtml({...withOverview,stateFilter:{
    ...withOverview.stateFilter,options:withOverview.stateFilter.options.slice(0,1)
  }}),/EIDOS_REVIEW_STATE_FILTER_MISSING_ALL/);
  assert.throws(()=>renderReviewQueueToHtml({...withOverview,stateFilter:{
    ...withOverview.stateFilter,selectedId:"absent"
  }}),/EIDOS_REVIEW_STATE_FILTER_MISSING_ALL/);
  assert.throws(()=>renderReviewQueueToHtml({...withOverview,stateFilter:{
    ...withOverview.stateFilter,options:[...withOverview.stateFilter.options,
      withOverview.stateFilter.options[0]]
  }}),/EIDOS_REVIEW_STATE_FILTER_INVALID/);
  assert.throws(()=>renderReviewQueueToHtml({...withOverview,overviewMetrics:[
    withOverview.overviewMetrics[0],withOverview.overviewMetrics[0]
  ]}),/EIDOS_REVIEW_OVERVIEW_INVALID/);
  assert.throws(()=>renderReviewQueueToHtml({...withOverview,context:{
    title:"",facts:[]
  }}),/EIDOS_REVIEW_CONTEXT_INVALID/);
});

test("E1 Review Queue escapes untrusted content in context, metrics and filter labels",()=>{
  const html=renderReviewQueueToHtml({...withOverview,
    context:{...withOverview.context,title:"<img src=x onerror=alert(1)>"},
    overviewMetrics:[{id:"risk",label:"<script>alert(1)</script>",value:"<3"}],
    stateFilter:{...withOverview.stateFilter,
      label:'<svg onload=evil()>'}
  });
  assert.doesNotMatch(html,/<script>|<img|<svg onload/);
  assert.match(html,/&lt;img/);
  assert.match(html,/&lt;script/);
  assert.match(html,/&lt;svg/);
});

test("E1 localization translates labels, not technical or sourced values",()=>{
  const localized=localizeAppHostPageDefinition({...page,definition:withOverview},
    createLocalizationRuntime([{
      contractVersion:"0.1.0",namespace:"assistant",locale:"zh-CN",
      messages:{
        "review.memory.review.context.title":"当前文件",
        "review.memory.review.context.fact.columns.label":"来源列",
        "review.memory.review.overview.issues.label":"需要处理",
        "review.memory.review.filter.label":"显示",
        "review.memory.review.filter.option.attention.label":"需要关注",
        "review.memory.review.filter.empty":"没有匹配项"
      }
    }],{locale:"zh-CN"}));
  assert.equal(localized.context.title,"当前文件");
  assert.equal(localized.context.facts[0].label,"来源列");
  assert.equal(localized.context.facts[0].value,"22");
  assert.equal(localized.overviewMetrics[3].label,"需要处理");
  assert.equal(localized.stateFilter.options[0].id,"attention");
  assert.equal(localized.stateFilter.options[0].label,"需要关注");
  assert.equal(localized.stateFilter.options[0].states[0],"pending");
  assert.equal(localized.items[0].primaryAction.command,"memory.proposal.accept");
});
