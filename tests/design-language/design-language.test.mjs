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
