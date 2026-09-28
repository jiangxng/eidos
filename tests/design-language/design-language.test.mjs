import test from "node:test";
import assert from "node:assert/strict";

import {
  eidosDesignTokensV010,
  eidosDesignTokenCss,
  eidosProductiveWorkbenchCss,
  eidosDesignPolicyV010
} from "../../dist/design-language/index.js";

test("design language uses a productive 4px-derived rhythm and mobile touch target", () => {
  assert.equal(eidosDesignTokensV010.contractVersion, "0.1.0");
  assert.equal(eidosDesignTokensV010.spacing.xs, 4);
  assert.equal(eidosDesignTokensV010.spacing.md, 8);
  assert.equal(eidosDesignTokensV010.size.activityBarDesktop, 48);
  assert.equal(eidosDesignTokensV010.size.touchTarget, 44);
});

test("productive Workbench CSS exposes stable semantic tokens and shell selectors", () => {
  assert.match(eidosDesignTokenCss, /--eidos-space-xs:4px/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-app-host-layout="workbench"/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-extension-manager-header/);
  assert.match(eidosProductiveWorkbenchCss, /justify-content:flex-end/);
  assert.match(eidosProductiveWorkbenchCss, /min-height:44px/);
});


test("design policy encodes toolbar and action hierarchy for LLM/plugin generation", () => {
  assert.equal(eidosDesignPolicyV010.actions.maxPrimaryPerScope, 1);
  assert.equal(eidosDesignPolicyV010.actions.primaryPlacement, "trailing");
  assert.deepEqual(eidosDesignPolicyV010.toolbar.leading, ["navigation", "back", "sidebar-structure"]);
  assert.equal(eidosDesignPolicyV010.plugin.inheritHostTokens, true);
  assert.equal(eidosDesignPolicyV010.accessibility.ariaRoleRequiresKeyboardBehavior, true);
});


test("productive design language includes modern agent chat and grouped settings patterns", () => {
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-thread-controls/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-thread-selector/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-composer\]:focus-within/);
  assert.match(eidosProductiveWorkbenchCss, /scrollbar-gutter:stable/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-settings-version="0\.2\.0"\][^{]*\[data-eidos-setting\]/
  );
  assert.match(eidosProductiveWorkbenchCss, /grid-template-columns:minmax\(180px/);
  assert.match(eidosProductiveWorkbenchCss, /details\[data-eidos-settings-group\]/);
});


test("productive design language includes a first-class Review / Decision pattern", () => {
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-queue/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-item/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-technical/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-actions/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /button\[data-eidos-primary="true"\][^{]*\{[\s\S]*margin-left:auto/
  );
});
