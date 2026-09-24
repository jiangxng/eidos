import test from "node:test";
import assert from "node:assert/strict";
import { createAppManagerActionHost } from "../../dist/app-host/index.js";

test("AppManagerActionHost sends generic ActionRequest without backend semantics", async () => {
  let captured;
  const host = createAppManagerActionHost({
    baseUrl: "http://app-manager.test/",
    fetchImpl: async (url, init) => {
      captured = { url: String(url), init };
      return new Response(JSON.stringify({
        ok: true,
        correlationId: "corr-1",
        result: { businessDataId: "bd-1" }
      }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
  });

  const result = await host.execute({
    contractVersion: "0.1.0",
    type: "command",
    command: { code: "trading-lite.create-order", inputVersion: "0.1.0" },
    values: { customer: "ACME", quantity: 3 },
    sourceInteractionId: "trading-lite.home",
    actionId: "create-order",
    requiresConfirmation: false
  });

  assert.equal(captured.url, "http://app-manager.test/v1/actions");
  assert.equal(captured.init.method, "POST");
  assert.deepEqual(JSON.parse(captured.init.body), {
    contractVersion: "0.1.0",
    type: "command",
    command: { code: "trading-lite.create-order", inputVersion: "0.1.0" },
    values: { customer: "ACME", quantity: 3 },
    sourceInteractionId: "trading-lite.home",
    actionId: "create-order",
    requiresConfirmation: false
  });
  assert.deepEqual(result, {
    ok: true,
    correlationId: "corr-1",
    result: { businessDataId: "bd-1" }
  });
});
