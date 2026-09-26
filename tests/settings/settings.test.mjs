import test from "node:test";
import assert from "node:assert/strict";

import {
  isSettingsEditorV010,
  isSettingsEditorV020,
  renderSettingsEditorToHtml
} from "../../dist/settings/index.js";

const document = {
  contractVersion: "0.1.0",
  kind: "settings-editor",
  id: "provider.settings",
  namespace: "provider",
  title: "Provider Settings",
  command: { code: "settings.save", inputVersion: "0.1.0" },
  settings: [
    {
      key: "model",
      label: "Model",
      type: "string",
      value: "gpt-test",
      defaultValue: "gpt-test"
    },
    {
      key: "adminToken",
      label: "Admin token",
      type: "secret",
      value: ""
    },
    {
      key: "enabled",
      label: "Enabled",
      type: "boolean",
      value: true,
      defaultValue: true
    }
  ],
  saveLabel: "Save"
};

test("Settings Editor contract is provider-neutral", () => {
  assert.equal(isSettingsEditorV010(document), true);
});

test("Settings Editor renders typed controls and save action", () => {
  const html = renderSettingsEditorToHtml(document);
  assert.match(html, /data-eidos-settings-editor="provider\.settings"/);
  assert.match(html, /name="model"/);
  assert.match(html, /data-setting-type="string"/);
  assert.match(html, /name="adminToken"/);
  assert.match(html, /type="password"/);
  assert.match(html, /data-setting-type="secret"/);
  assert.match(html, /name="enabled"/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, />Save</);
});


test("Settings Editor v0.2 groups provider settings and keeps advanced administration collapsed", () => {
  const grouped = {
    contractVersion: "0.2.0",
    kind: "settings-editor",
    id: "provider.settings",
    namespace: "provider",
    title: "Provider Settings",
    command: { code: "settings.save", inputVersion: "0.1.0" },
    groups: [
      {
        id: "general",
        title: "General",
        settings: [{
          key: "model",
          label: "Model",
          type: "string",
          value: "gpt-test"
        }]
      },
      {
        id: "credentials",
        title: "Credentials",
        settings: [{
          key: "apiKey",
          label: "API Key",
          type: "secret",
          value: "",
          status: { label: "Configured", tone: "positive" }
        }]
      },
      {
        id: "advanced",
        title: "Advanced",
        advanced: true,
        settings: [{
          key: "adminToken",
          label: "Administrator authorization",
          type: "secret",
          value: ""
        }]
      }
    ],
    saveLabel: "Save"
  };
  assert.equal(isSettingsEditorV020(grouped), true);
  const html = renderSettingsEditorToHtml(grouped);
  assert.match(html, /data-settings-version="0\.2\.0"/);
  assert.match(html, /data-eidos-settings-group/);
  assert.match(html, /data-advanced="true"/);
  assert.match(html, /data-eidos-setting-status/);
  assert.match(html, /Configured/);
});
