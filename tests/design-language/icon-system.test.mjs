import test from "node:test";
import assert from "node:assert/strict";

import {
  eidosIconDefinitionsV010,
  eidosIconSystemMetadataV010,
  renderEidosIconToSvg,
  resolveEidosIconName
} from "../../dist/design-language/icons/index.js";

test("Eidos owns a production Workbench core icon registry", () => {
  assert.equal(eidosIconSystemMetadataV010.contractVersion, "0.1.0");
  assert.equal(eidosIconSystemMetadataV010.externalIconLibraryDependency, false);
  assert.ok(Object.keys(eidosIconDefinitionsV010).length >= 24);
  for (const required of [
    "dashboard", "workspace", "plugins", "settings", "agent",
    "sidebar", "arrowRight", "externalLink"
  ]) {
    assert.ok(required in eidosIconDefinitionsV010, required);
  }
});

test("semantic aliases preserve stable Workbench intent", () => {
  assert.equal(resolveEidosIconName("apps"), "dashboard");
  assert.equal(resolveEidosIconName("plugin"), "plugins");
  assert.equal(resolveEidosIconName("arrow-right"), "arrowRight");
  assert.equal(resolveEidosIconName("unknown-icon"), undefined);
});

test("SVG rendering is self-contained and uses Eidos semantic attributes", () => {
  const svg = renderEidosIconToSvg("settings", { size: 20 });
  assert.match(svg, /^<svg /);
  assert.match(svg, /data-eidos-icon="settings"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.doesNotMatch(svg, /fontawesome|codicon|material|heroicon/i);
});
