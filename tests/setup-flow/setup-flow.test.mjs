import test from "node:test";
import assert from "node:assert/strict";

import {
  isSetupFlowV010,
  renderSetupFlowToHtml
} from "../../dist/setup-flow/index.js";
import {
  createLocalizationRuntime,
  localizeAppHostPageDefinition
} from "../../dist/localization/index.js";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

const definition = {
  contractVersion: "0.1.0",
  kind: "setup-flow",
  id: "personal-agent.setup",
  title: "Personal Agent setup",
  description: "Complete the required steps.",
  steps: [
    {
      id: "provider",
      title: "LLM Provider",
      description: "Choose a provider.",
      state: "current",
      statusDetail: "Required",
      primaryAction: {
        id: "choose-provider",
        label: "Choose provider",
        type: "navigate",
        route: "/plugins"
      }
    },
    {
      id: "credential",
      title: "Provider credentials",
      state: "pending"
    }
  ],
  completionAction: {
    id: "open-agent",
    label: "Open Personal Agent",
    type: "navigate",
    route: "/enterprise-agent"
  }
};

const page = {
  experienceId: "personal-agent-setup",
  packageId: "enterprise-agent",
  featureId: "enterprise-agent.default",
  route: { id: "personal-agent.setup", path: "/enterprise-agent/setup", pageId: "personal-agent.setup" },
  page: { id: "personal-agent.setup", source: "memory://personal-agent/setup" },
  definition
};

test("Setup Flow contract and renderer express one current actionable step", () => {
  assert.equal(isSetupFlowV010(definition), true);
  const html = renderSetupFlowToHtml(definition);
  assert.match(html, /data-eidos-setup-flow/);
  assert.match(html, /data-step-id="provider"/);
  assert.match(html, /aria-current="step"/);
  assert.match(html, /data-eidos-setup-action="choose-provider"/);
  assert.match(html, /data-eidos-setup-action="open-agent"/);
});

test("App Host renders Setup Flow as a first-class Eidos capability", () => {
  const html = renderAppHostPageToHtml(page);
  assert.match(html, /data-eidos-setup-flow/);
});

test("Setup Flow localizes Japanese and Traditional Chinese without changing actions/routes", () => {
  const bundles = [
    {
      contractVersion: "0.1.0",
      namespace: "enterprise-agent",
      locale: "ja",
      messages: {
        "setup.personal-agent.setup.title": "パーソナルエージェントのセットアップ",
        "setup.personal-agent.setup.description": "必要な手順を完了してください。",
        "setup.personal-agent.setup.step.provider.title": "LLMプロバイダー",
        "setup.personal-agent.setup.step.provider.description": "プロバイダーを選択してください。",
        "setup.personal-agent.setup.step.provider.status.current": "必須",
        "setup.personal-agent.setup.action.choose-provider.label": "プロバイダーを選ぶ",
        "setup.personal-agent.setup.action.open-agent.label": "パーソナルエージェントを開く"
      }
    },
    {
      contractVersion: "0.1.0",
      namespace: "enterprise-agent",
      locale: "zh-TW",
      messages: {
        "setup.personal-agent.setup.title": "個人 Agent 設定",
        "setup.personal-agent.setup.step.provider.title": "LLM Provider",
        "setup.personal-agent.setup.action.choose-provider.label": "選擇 Provider"
      }
    }
  ];
  const ja = localizeAppHostPageDefinition(page, createLocalizationRuntime(bundles, { locale: "ja" }));
  assert.equal(ja.title, "パーソナルエージェントのセットアップ");
  assert.equal(ja.steps[0].primaryAction.route, "/plugins");

  const tw = localizeAppHostPageDefinition(page, createLocalizationRuntime(bundles, { locale: "zh-TW" }));
  assert.equal(tw.title, "個人 Agent 設定");
  assert.equal(tw.steps[0].primaryAction.label, "選擇 Provider");
});

test("Setup Flow rejects duplicate step ids at render time", () => {
  assert.throws(
    () => renderSetupFlowToHtml({ ...definition, steps: [definition.steps[0], definition.steps[0]] }),
    /EIDOS_SETUP_STEP_DUPLICATE/
  );
});


test("Setup Flow localizes status by the current state instead of a fixed step label", () => {
  const bundles = [{
    contractVersion: "0.1.0",
    namespace: "enterprise-agent",
    locale: "ja",
    messages: {
      "setup.personal-agent.setup.step.provider.status.current": "必須",
      "setup.personal-agent.setup.step.provider.status.complete": "完了"
    }
  }];
  const runtime = createLocalizationRuntime(bundles, { locale: "ja" });
  const current = localizeAppHostPageDefinition(page, runtime);
  assert.equal(current.steps[0].statusDetail, "必須");

  const completePage = {
    ...page,
    definition: {
      ...definition,
      steps: [{
        ...definition.steps[0],
        state: "complete",
        statusDetail: "Complete"
      }, definition.steps[1]]
    }
  };
  const complete = localizeAppHostPageDefinition(completePage, runtime);
  assert.equal(complete.steps[0].statusDetail, "完了");
});
