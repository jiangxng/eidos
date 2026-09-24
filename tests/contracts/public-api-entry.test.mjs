import test from "node:test";
import assert from "node:assert/strict";
import { renderToHtml, validateUidl } from "../../dist/index.js";

test("public package entry point exposes deterministic UIDL HTML rendering", () => {
  const document = {
    contractVersion: "0.1.1",
    kind: "form",
    id: "public-api-proof",
    title: "Public API Proof",
    purpose: "execute-command",
    command: { code: "proof.execute", inputVersion: "0.1.0" },
    fields: [
      { key: "quantity", label: "Quantity", semanticType: "quantity", control: "number", required: true }
    ],
    actions: [
      { id: "submit", label: "Submit", type: "submit", command: "proof.execute", requiresConfirmation: false }
    ]
  };

  assert.equal(validateUidl(document).ok, true);
  const html = renderToHtml(document);
  assert.match(html, /data-eidos-id="public-api-proof"/);
  assert.match(html, /data-command="proof.execute"/);
});
