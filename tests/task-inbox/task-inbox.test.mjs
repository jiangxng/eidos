import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  isTaskInboxV010,
  renderTaskInboxToHtml
} from "../../dist/task-inbox/index.js";

function inbox(overrides = {}) {
  return {
    contractVersion: "0.1.0",
    kind: "task-inbox",
    id: "my-work",
    title: "My Work",
    emptyMessage: "Nothing waiting.",
    items: [
      {
        id: "task:ready",
        title: "Receive order",
        state: "READY",
        statusLabel: "Ready",
        priority: 20,
        workType: "RECEIVE",
        metrics: [{ id: "qty", label: "Quantity", value: "12" }]
      },
      {
        id: "task:assigned",
        title: "Ship order",
        state: "ASSIGNED",
        statusLabel: "Assigned",
        priority: 30,
        workType: "SHIP",
        assignee: { actorType: "HUMAN", actorId: "worker-1" }
      }
    ],
    ...overrides
  };
}

test("Task Inbox validates its semantic envelope", () => {
  assert.equal(isTaskInboxV010(inbox()), true);
  assert.equal(isTaskInboxV010({ kind: "task-inbox" }), false);
});

test("Task Inbox renders priority-ordered work without inventing completion controls", () => {
  const html = renderTaskInboxToHtml(inbox());

  assert.match(html, /data-eidos-task-inbox/);
  assert.match(html, /data-work-type="SHIP"/);
  assert.match(html, /HUMAN · worker-1/);
  assert.match(html, /Quantity/);
  assert.ok(html.indexOf("Ship order") < html.indexOf("Receive order"));
  assert.doesNotMatch(html, />Done</);
  assert.doesNotMatch(html, /complete-task/);
});

test("Task Inbox renders explicit empty state", () => {
  const html = renderTaskInboxToHtml(inbox({ items: [] }));
  assert.match(html, /data-eidos-task-empty/);
  assert.match(html, /Nothing waiting/);
});

test("Task Inbox rejects duplicate item identity", () => {
  const duplicate = inbox();
  duplicate.items.push({ ...duplicate.items[0] });
  assert.throws(
    () => renderTaskInboxToHtml(duplicate),
    /EIDOS_TASK_INBOX_ITEM_DUPLICATE/
  );
});


test("Task Inbox renders explicit command/navigation authority metadata", () => {
  const html = renderTaskInboxToHtml(inbox({
    items: [{
      id: "task:actionable",
      title: "Review exception",
      state: "EXCEPTION",
      statusLabel: "Needs attention",
      priority: 100,
      primaryAction: {
        id: "resolve",
        label: "Resolve",
        type: "command",
        command: "task.resolve",
        inputVersion: "0.1.0",
        requiresConfirmation: true
      },
      secondaryActions: [{
        id: "inspect",
        label: "Inspect",
        type: "navigate",
        route: "/inspect/task:actionable"
      }]
    }]
  }));

  assert.match(html, /data-eidos-task-action="resolve"/);
  assert.match(html, /data-eidos-command="task.resolve"/);
  assert.match(html, /data-eidos-confirm="true"/);
  assert.match(html, /data-eidos-task-action="inspect"/);
  assert.match(html, /data-eidos-route="\/inspect\/task:actionable"/);
});

test("App Host delegates Task Inbox actions through the shared ActionHost path", async () => {
  const controller = await readFile(
    new URL("../../dist/app-host/page-controller.js", import.meta.url),
    "utf8"
  );
  assert.match(controller, /data-eidos-task-action/);
  assert.match(controller, /eidosTaskAction/);
});
