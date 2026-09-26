import test from "node:test";
import assert from "node:assert/strict";

import {
  assertHelpDocumentV010,
  isHelpDocumentV010,
  renderHelpDocumentToHtml
} from "../../dist/help/index.js";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

function document(overrides = {}) {
  return {
    contractVersion: "0.1.0",
    kind: "help-document",
    id: "evo.providers.binding",
    title: "Bind a Provider",
    summary: "Create an explicit Provider binding.",
    owner: { packageId: "evo-app-platform" },
    locale: "en",
    helpKind: "how-to",
    audiences: ["admin"],
    tags: ["provider", "binding"],
    appliesTo: { appPlatformVersion: ">=0.1.0 <0.2.0" },
    lastReviewedAt: "2026-09-26",
    breadcrumbs: [
      { label: "Help", route: "/help" },
      { label: "Providers" }
    ],
    blocks: [
      { type: "paragraph", text: "Bindings are explicit Host policy." },
      { type: "heading", level: 2, id: "steps", text: "Steps" },
      {
        type: "steps",
        items: [
          { title: "Choose capability", text: "Select the capability to bind." },
          { title: "Choose Provider" }
        ]
      },
      {
        type: "callout",
        tone: "warning",
        title: "No silent failover",
        text: "An unavailable explicit binding fails closed."
      },
      {
        type: "code",
        language: "text",
        text: "PROVIDER_RESOLUTION_AMBIGUOUS"
      }
    ],
    related: [
      { id: "evo.providers.health", title: "Provider health", route: "/help/evo.providers.health" }
    ],
    ...overrides
  };
}

test("Help document validates and renders deterministic safe semantic HTML", () => {
  const input = document();
  assert.equal(isHelpDocumentV010(input), true);
  assert.equal(assertHelpDocumentV010(input).id, "evo.providers.binding");

  const html = renderHelpDocumentToHtml(input);
  assert.match(html, /data-eidos-help-document="evo\.providers\.binding"/);
  assert.match(html, /data-help-kind="how-to"/);
  assert.match(html, /data-eidos-help-owner>owner: evo-app-platform/);
  assert.match(html, /data-eidos-help-steps/);
  assert.match(html, /data-tone="warning"/);
  assert.match(html, /PROVIDER_RESOLUTION_AMBIGUOUS/);
  assert.match(html, /data-eidos-help-route="\/help\/evo\.providers\.health"/);
});

test("Help document escapes untrusted text instead of executing HTML", () => {
  const html = renderHelpDocumentToHtml(document({
    title: "<script>alert(1)</script>",
    blocks: [{ type: "paragraph", text: "<img src=x onerror=alert(1)>" }]
  }));
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
});

test("Help document rejects empty or unsupported content structures", () => {
  assert.throws(
    () => assertHelpDocumentV010(document({ blocks: [] })),
    /EIDOS_HELP_DOCUMENT_BLOCKS_REQUIRED/
  );
  assert.throws(
    () => assertHelpDocumentV010(document({ audiences: [] })),
    /EIDOS_HELP_DOCUMENT_AUDIENCE_INVALID/
  );
  assert.throws(
    () => assertHelpDocumentV010(document({
      blocks: [{ type: "heading", level: 1, text: "Invalid" }]
    })),
    /EIDOS_HELP_DOCUMENT_HEADING_LEVEL_INVALID/
  );
});

test("App Host renders help-document through the Eidos Help capability", () => {
  const html = renderAppHostPageToHtml({
    experienceId: "help",
    packageId: "evo-app-platform",
    featureId: "help.system",
    route: { id: "help.provider-binding", path: "/help/evo.providers.binding", pageId: "help.provider-binding" },
    page: { id: "help.provider-binding", source: "app://platform/help/evo.providers.binding" },
    definition: document()
  });

  assert.match(html, /data-eidos-help-document=/);
  assert.match(html, /Bind a Provider/);
});
