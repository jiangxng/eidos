import test from "node:test";
import assert from "node:assert/strict";

import {
  eidosDesignTokensV010,
  eidosDesignTokenCss,
  eidosProductiveWorkbenchCss
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
