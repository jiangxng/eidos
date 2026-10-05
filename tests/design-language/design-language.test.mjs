import test from "node:test";
import assert from "node:assert/strict";

import {
  eidosDesignTokensV010,
  eidosDesignTokenCss,
  eidosProductiveWorkbenchCss,
  eidosDesignPolicyV010,
  eidosMobileDesignLanguageV010,
  eidosTextScalePreferencesV010,
  normalizeEidosTextScalePreferenceV010
} from "../../dist/design-language/index.js";

test("design language uses a productive 4px-derived rhythm and mobile touch target", () => {
  assert.equal(eidosDesignTokensV010.contractVersion, "0.1.0");
  assert.equal(eidosDesignTokensV010.spacing.xs, 4);
  assert.equal(eidosDesignTokensV010.spacing.md, 8);
  assert.equal(eidosDesignTokensV010.size.activityBarDesktop, 48);
  assert.equal(eidosDesignTokensV010.size.touchTarget, 44);
  assert.equal(eidosDesignTokensV010.type.unit, "rem");
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


test("Catalog Browser follows Eidos trailing-primary and disabled-help styling", () => {
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-catalog-item\] \[data-eidos-action-help\]/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-catalog-item\] button:disabled/
  );
});


test("mobile design language is a normative plugin contract", () => {
  assert.equal(eidosMobileDesignLanguageV010.contractVersion, "0.1.0");
  assert.equal(eidosMobileDesignLanguageV010.navigation.primaryPlacement, "bottom");
  assert.equal(eidosMobileDesignLanguageV010.content.primaryFlow, "single-column");
  assert.equal(eidosMobileDesignLanguageV010.navigation.destinationTouchTargetPx, 44);
  assert.equal(eidosMobileDesignLanguageV010.plugin.customMobileShellForbidden, true);
  assert.equal(eidosMobileDesignLanguageV010.plugin.customBreakpointForbidden, true);
  assert.equal(eidosMobileDesignLanguageV010.accessibility.touchTargetMinimumPx, 44);
  assert.equal(eidosDesignPolicyV010.mobile.normativeReference, "Eidos Mobile Design Language v0.1");
  assert.equal(eidosDesignPolicyV010.plugin.inheritResponsiveRealization, true);
  assert.ok(eidosDesignPolicyV010.plugin.forbiddenByDefault.includes("custom-mobile-shell"));
});

test("productive Workbench realizes phone navigation, safe areas and mobile sheets", () => {
  assert.match(eidosDesignTokenCss, /--eidos-mobile-nav-height:56px/);
  assert.match(eidosDesignTokenCss, /--eidos-safe-area-bottom:env\(safe-area-inset-bottom,0px\)/);
  assert.match(eidosProductiveWorkbenchCss, /Eidos Mobile Design Language v0\.1 reference realization/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-activity-bar\][\s\S]*grid-row:2[\s\S]*flex-direction:row/
  );
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-status-bar\]\{display:none\}/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-account-menu\][\s\S]*position:fixed[\s\S]*bottom:calc/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-catalog-detail-thumbnails\][\s\S]*overflow-x:auto[\s\S]*scroll-snap-type/
  );
});


test("system text scaling is part of the mobile contract", () => {
  assert.equal(eidosMobileDesignLanguageV010.typography.preferenceAuthority, "os-and-user-agent");
  assert.equal(eidosMobileDesignLanguageV010.typography.defaultPreference, "system");
  assert.deepEqual(eidosMobileDesignLanguageV010.typography.userScalePresets, ["system", "small", "standard", "large"]);
  assert.equal(eidosMobileDesignLanguageV010.typography.userScaleComposesWithSystem, true);
  assert.equal(eidosMobileDesignLanguageV010.typography.fixedPixelFontSizesForbidden, true);
  assert.equal(eidosDesignPolicyV010.accessibility.systemTextScaleRequired, true);
  assert.equal(eidosDesignPolicyV010.typography.sizing, "root-relative");
  assert.match(eidosDesignTokenCss, /--eidos-font-body:\.875rem/);
  assert.match(eidosProductiveWorkbenchCss, /html\{font-size:100%;-webkit-text-size-adjust:auto;text-size-adjust:auto\}/);
  assert.doesNotMatch(eidosProductiveWorkbenchCss, /font-size:\s*\d+(?:\.\d+)?px/);
});


test("text scale presets compose with system preference", () => {
  assert.deepEqual(
    eidosTextScalePreferencesV010.map(item => [item.id, item.additionalScale]),
    [["system", 1], ["small", 0.9], ["standard", 1], ["large", 1.15]]
  );
  assert.equal(normalizeEidosTextScalePreferenceV010("large"), "large");
  assert.equal(normalizeEidosTextScalePreferenceV010("unknown"), "system");
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale="small"\]\{font-size:90%\}/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale="standard"\]\{font-size:100%\}/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale="large"\]\{font-size:115%\}/);
});
