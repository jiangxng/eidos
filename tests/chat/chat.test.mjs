import test from "node:test";
import assert from "node:assert/strict";

import {
  isChatExperienceV010,
  renderChatExperienceToHtml
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
