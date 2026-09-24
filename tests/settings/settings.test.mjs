import test from "node:test";
import assert from "node:assert/strict";

import {
  isSettingsEditorV010,
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
  assert.match(html, /name="enabled"/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, />Save</);
});
