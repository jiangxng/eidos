import test from "node:test";
import assert from "node:assert/strict";
import { executeAppHostPageAction } from "../../dist/app-host/index.js";

test("App Host action execution uses Eidos ActionRequest and a replaceable Host executor", async () => {
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
      command: { code: "sales_order.approve-sales-order", inputVersion: "1" },
      fields: [
        {
          key: "orderNo",
          label: "Order No",
          semanticType: "sales-order-number",
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
          command: "sales_order.approve-sales-order",
          requiresConfirmation: false
        }
      ]
    }
  };

  const execution = await executeAppHostPageAction(
    page,
    { orderNo: "SO-1", quantity: 3 },
    {
      async execute(request, context) {
        captured = { request, context };
        return { ok: true, businessDataId: "bd-1" };
      }
    }
  );

  assert.equal(captured.request.command.code, "sales_order.approve-sales-order");
  assert.deepEqual(captured.request.values, { orderNo: "SO-1", quantity: 3 });
  assert.deepEqual(captured.context, {
    experienceId: "trading-lite",
    packageId: "trading-lite",
    featureId: "trading-lite.default",
    pageId: "trading-lite.home",
    routePath: "/trading"
  });
  assert.deepEqual(execution.result, { ok: true, businessDataId: "bd-1" });
});
