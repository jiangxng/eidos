import test from "node:test";
import assert from "node:assert/strict";

import {
  createLocalizationRuntime,
  localizeAppHostPageDefinition
} from "../../dist/localization/index.js";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

test("localization runtime resolves locale, language fallback and literal fallback deterministically", () => {
  const runtime = createLocalizationRuntime([
    {
      contractVersion: "0.1.0",
      namespace: "sample",
      locale: "en",
      messages: { greeting: "Hello {name}" }
    },
    {
      contractVersion: "0.1.0",
      namespace: "sample",
      locale: "zh-CN",
      messages: { greeting: "你好，{name}" }
    }
  ], { locale: "zh-CN", fallbackLocales: ["en"] });

  assert.equal(runtime.resolve("sample", "greeting", "Fallback", { name: "EVO" }), "你好，EVO");
  runtime.setLocale("en-US");
  assert.equal(runtime.resolve("sample", "greeting", "Fallback", { name: "EVO" }), "Hello EVO");
  assert.equal(runtime.resolve("sample", "missing", "Fallback"), "Fallback");
});

test("UIDL 0.1.1 remains unchanged while stable slots are localized before rendering", () => {
  const runtime = createLocalizationRuntime([
    {
      contractVersion: "0.1.0",
      namespace: "enterprise-agent",
      locale: "zh-CN",
      messages: {
        "page.enterprise-agent.home.title": "企业智能体",
        "field.enterprise-agent.home.message.label": "告诉企业智能体你要完成什么",
        "action.enterprise-agent.home.send.label": "发送"
      }
    }
  ], { locale: "zh-CN" });

  const page = {
    experienceId: "enterprise-agent",
    packageId: "enterprise-agent",
    featureId: "enterprise-agent.default",
    route: { id: "enterprise-agent.home", path: "/enterprise-agent", pageId: "enterprise-agent.home" },
    page: { id: "enterprise-agent.home", source: "memory://agent/home" },
    definition: {
      contractVersion: "0.1.1",
      kind: "form",
      id: "enterprise-agent.home",
      title: "Enterprise Agent",
      purpose: "execute-command",
      command: { code: "enterprise-agent.chat", inputVersion: "0.1.0" },
      fields: [{
        key: "message",
        label: "Tell Enterprise Agent what to do",
        semanticType: "agent-message",
        control: "text",
        required: true
      }],
      actions: [{
        id: "send",
        label: "Send",
        type: "submit",
        command: "enterprise-agent.chat",
        requiresConfirmation: false
      }]
    }
  };

  const localized = localizeAppHostPageDefinition(page, runtime);
  assert.equal(localized.contractVersion, "0.1.1");
  assert.equal(localized.title, "企业智能体");
  assert.equal(localized.fields[0].label, "告诉企业智能体你要完成什么");
  assert.equal(localized.actions[0].label, "发送");

  const html = renderAppHostPageToHtml(page, runtime);
  assert.match(html, /企业智能体/);
  assert.match(html, /告诉企业智能体你要完成什么/);
  assert.match(html, />发送</);
});

test("catalog chrome localizes without taking ownership of package display names", () => {
  const runtime = createLocalizationRuntime([
    {
      contractVersion: "0.1.0",
      namespace: "evo-app-platform",
      locale: "en",
      messages: {
        "catalog.evo.plugin-store.title": "EVO Plugin Store",
        "catalog.evo.plugin-store.description": "Discover and manage plugins.",
        "catalog.evo.plugin-store.item.enterprise-agent.status": "Not installed",
        "catalog.evo.plugin-store.item.enterprise-agent.action.install.label": "Install"
      }
    }
  ], { locale: "en" });

  const page = {
    experienceId: "evo-plugin-store",
    packageId: "evo-app-platform",
    featureId: "evo-plugin-store.system",
    route: { id: "evo-plugin-store.home", path: "/store", pageId: "evo-plugin-store.home" },
    page: { id: "evo-plugin-store.home", source: "memory://store" },
    definition: {
      contractVersion: "0.1.0",
      kind: "catalog-browser",
      id: "evo.plugin-store",
      title: "插件商店",
      description: "发现插件",
      items: [{
        id: "enterprise-agent",
        title: "Enterprise Agent",
        status: { label: "未安装" },
        primaryAction: { id: "install", label: "安装", type: "command", command: "install" }
      }]
    }
  };

  const localized = localizeAppHostPageDefinition(page, runtime);
  assert.equal(localized.title, "EVO Plugin Store");
  assert.equal(localized.items[0].title, "Enterprise Agent");
  assert.equal(localized.items[0].status.label, "Not installed");
  assert.equal(localized.items[0].primaryAction.label, "Install");
});
