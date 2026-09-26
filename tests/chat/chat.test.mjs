import test from "node:test";
import assert from "node:assert/strict";

import {
  isChatExperienceV010,
  isChatExperienceV020,
  renderChatExperienceToHtml,
  renderChatMessageToHtml
} from "../../dist/chat/index.js";
import {
  createLocalizationRuntime,
  localizeAppHostPageDefinition
} from "../../dist/localization/index.js";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

const definition = {
  contractVersion: "0.1.0",
  kind: "chat",
  id: "assistant.home",
  title: "Assistant",
  command: { code: "assistant.chat", inputVersion: "0.1.0" },
  composer: {
    key: "message",
    placeholder: "Ask anything",
    sendLabel: "Send"
  },
  emptyState: "Start a conversation."
};

const page = {
  experienceId: "assistant",
  packageId: "assistant",
  featureId: "assistant.default",
  route: { id: "assistant.home", path: "/assistant", pageId: "assistant.home" },
  page: { id: "assistant.home", source: "memory://assistant" },
  definition
};

test("Chat Experience has a small provider-neutral public contract", () => {
  assert.equal(isChatExperienceV010(definition), true);
  assert.equal(isChatExperienceV010({ ...definition, kind: "form" }), false);
});

test("Chat Experience renderer emits transcript and composer semantics", () => {
  const html = renderChatExperienceToHtml(definition);
  assert.match(html, /data-eidos-chat="assistant\.home"/);
  assert.match(html, /data-eidos-chat-transcript/);
  assert.match(html, /data-eidos-chat-composer/);
  assert.match(html, /name="message"/);
  assert.match(html, />Send</);
});

test("App Host renderer recognizes Chat Experience without pretending it is a form", () => {
  const html = renderAppHostPageToHtml(page);
  assert.match(html, /data-eidos-chat=/);
  assert.doesNotMatch(html, /data-eidos-id=/);
});

test("Chat Experience chrome is localized through the owning package namespace", () => {
  const runtime = createLocalizationRuntime([
    {
      contractVersion: "0.1.0",
      namespace: "assistant",
      locale: "zh-CN",
      messages: {
        "page.assistant.home.title": "企业助手",
        "chat.assistant.home.composer.placeholder": "告诉我你要完成什么",
        "chat.assistant.home.composer.sendLabel": "发送",
        "chat.assistant.home.emptyState": "开始一段对话。"
      }
    }
  ], { locale: "zh-CN" });

  const localized = localizeAppHostPageDefinition(page, runtime);
  assert.equal(localized.title, "企业助手");
  assert.equal(localized.composer.placeholder, "告诉我你要完成什么");
  assert.equal(localized.composer.sendLabel, "发送");
  assert.equal(localized.emptyState, "开始一段对话。");
});


const definitionV020 = {
  contractVersion: "0.2.0",
  kind: "chat",
  id: "assistant.home",
  title: "Personal Agent",
  command: { code: "assistant.chat", inputVersion: "0.1.0" },
  context: {
    label: "Context",
    value: "Personal",
    selector: {
      key: "activeContext",
      ariaLabel: "Choose context",
      selectedId: "personal",
      options: [
        {
          id: "personal",
          label: "Personal",
          value: { kind: "PERSONAL", contextId: "personal:default" }
        },
        {
          id: "enterprise-acme",
          label: "Acme",
          value: { kind: "ENTERPRISE", contextId: "enterprise:acme", enterpriseId: "acme" }
        }
      ]
    }
  },
  readiness: {
    state: "setup-required",
    label: "Needs setup",
    message: "Configure a provider.",
    action: { id: "setup", label: "Set up", type: "navigate", route: "/setup" }
  },
  composer: {
    key: "message",
    placeholder: "Ask or describe a task",
    sendLabel: "Send"
  },
  emptyState: {
    title: "How can I help?",
    description: "I can inspect your current context and prepare an opinion.",
    suggestions: [
      { id: "attention", label: "What needs attention?", prompt: "What needs my attention?" }
    ]
  }
};

test("Assistant Chat v0.2 renders context readiness and suggested prompts", () => {
  assert.equal(isChatExperienceV020(definitionV020), true);
  const html = renderChatExperienceToHtml(definitionV020);
  assert.match(html, /data-chat-version="0\.2\.0"/);
  assert.match(html, /data-eidos-chat-context/);
  assert.match(html, /data-eidos-chat-context-selector/);
  assert.match(html, /data-eidos-chat-context-value=/);
  assert.match(html, /<option[^>]+selected[^>]*>Personal<\/option>/);
  assert.match(html, /data-eidos-chat-readiness/);
  assert.match(html, /data-eidos-chat-action="setup"/);
  assert.match(html, /data-eidos-chat-suggestion="attention"/);
  assert.match(html, /textarea[^>]+disabled/);
});

test("Assistant Chat v0.2 renders observable activity evidence and proposal parts", () => {
  const html = renderChatMessageToHtml({
    id: "assistant-1",
    contractVersion: "0.2.0",
    role: "assistant",
    parts: [
      { type: "text", text: "I reviewed the current context." },
      { type: "activity", label: "Checked current Context", state: "complete" },
      { type: "evidence", title: "Inventory balance", context: "Enterprise A", route: "/inventory" },
      {
        type: "proposal",
        title: "Review purchase exception",
        reasons: ["Inventory cover is low"],
        actions: [{ id: "review", label: "Review", type: "navigate", route: "/purchase/1", primary: true }]
      }
    ]
  });
  assert.match(html, /data-eidos-chat-part="activity"/);
  assert.match(html, /data-eidos-chat-part="evidence"/);
  assert.match(html, /data-eidos-chat-part="proposal"/);
  assert.match(html, /data-eidos-primary="true"/);
});

test("Assistant Chat v0.2 localizes Japanese and Traditional Chinese chrome without changing machine ids", () => {
  const bundles = [
    {
      contractVersion: "0.1.0",
      namespace: "assistant",
      locale: "ja",
      messages: {
        "page.assistant.home.title": "パーソナルエージェント",
        "chat.assistant.home.composer.placeholder": "相談内容やタスクを入力",
        "chat.assistant.home.composer.sendLabel": "送信",
        "chat.assistant.home.context.label": "コンテキスト",
        "chat.assistant.home.context.selector.ariaLabel": "コンテキストを選択",
        "chat.assistant.home.readiness.setup-required.label": "セットアップが必要",
        "chat.assistant.home.readiness.setup-required.message": "プロバイダーを設定してください。",
        "chat.assistant.home.action.setup.label": "設定する",
        "chat.assistant.home.empty.title": "何をお手伝いしましょうか？",
        "chat.assistant.home.empty.description": "現在のコンテキストを確認して意見を整理できます。",
        "chat.assistant.home.suggestion.attention.label": "注意が必要な項目"
      }
    },
    {
      contractVersion: "0.1.0",
      namespace: "assistant",
      locale: "zh-TW",
      messages: {
        "page.assistant.home.title": "個人 Agent",
        "chat.assistant.home.composer.placeholder": "輸入問題或工作內容",
        "chat.assistant.home.composer.sendLabel": "傳送"
      }
    }
  ];

  const ja = localizeAppHostPageDefinition(page, createLocalizationRuntime(bundles, { locale: "ja" }));
  assert.equal(ja.title, "パーソナルエージェント");
  assert.equal(ja.command.code, "assistant.chat");
  assert.equal(ja.context.selector.ariaLabel, "コンテキストを選択");

  const twPage = { ...page, definition: definitionV020 };
  const tw = localizeAppHostPageDefinition(twPage, createLocalizationRuntime(bundles, { locale: "zh-TW" }));
  assert.equal(tw.title, "個人 Agent");
  assert.equal(tw.composer.sendLabel, "傳送");
  assert.equal(tw.command.code, "assistant.chat");
});


test("Assistant Chat v0.2 context selector keeps machine values opaque to presentation", () => {
  const html = renderChatExperienceToHtml(definitionV020);
  assert.match(html, /value="enterprise-acme"/);
  assert.match(html, /Acme/);
  assert.match(html, /enterprise:acme/);
  assert.match(html, /enterpriseId/);
});
