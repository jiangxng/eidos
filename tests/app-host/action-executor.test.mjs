import test from "node:test";
import assert from "node:assert/strict";
import { executeAppHostPageAction } from "../../dist/app-host/index.js";

test("App Host action execution uses existing ActionHost port", async () => {
  let captured;
  const page = {
    experienceId: "trading-lite",
    packageId: "trading-lite",
    featureId: "trading-lite.default",
    route: { id: "trading-lite.home", path: "/trading", pageId: "trading-lite.home" },
    page: { id: "trading-lite.home", source: "app://trading-lite/pages/home" },
    definition: {
      contractVersion: "0.1.1",
      kind: "form",
      id: "trading-lite.home",
      title: "Trading Lite",
      purpose: "execute-command",
      command: { code: "trading-lite.create-order", inputVersion: "0.1.0" },
      fields: [
        {
          key: "customer",
          label: "Customer",
          semanticType: "customer-name",
          control: "text",
          required: true
        },
        {
          key: "quantity",
          label: "Quantity",
          semanticType: "quantity",
          control: "number",
          required: true
        }
      ],
      actions: [
        {
          id: "create-order",
          label: "Create Order",
          type: "submit",
          command: "trading-lite.create-order",
          requiresConfirmation: false
        }
      ]
    }
  };

  const execution = await executeAppHostPageAction(
    page,
    { customer: "ACME", quantity: 3 },
    {
      async execute(request) {
        captured = request;
        return {
          ok: true,
          correlationId: "corr-1",
          result: { businessDataId: "bd-1" }
        };
      }
    }
  );

  assert.equal(captured.command.code, "trading-lite.create-order");
  assert.deepEqual(captured.values, { customer: "ACME", quantity: 3 });
  assert.equal(execution.result.ok, true);
  assert.deepEqual(execution.result.result, { businessDataId: "bd-1" });
});
