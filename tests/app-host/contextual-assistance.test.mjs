import test from "node:test";
import assert from "node:assert/strict";
import { contextualAssistanceRequestV010, contextualRefreshDecisionV010, trackContextualFormDraftV010 } from "../../dist/app-host/contextual-assistance.js";

const source = { pageId: "mapping", route: "/imports/job-1", actionId: "ai-auto-map" };
const envelope = () => contextualAssistanceRequestV010("map fields", "request-1", {
  source, context: { taskKind: "data-import.mapping", importJobId: "job-1" }
});
const response = () => ({ ok: true, result: { run: { runId: "run-1", state: "SUCCEEDED" },
  assistanceResult: { contractVersion: "0.1.0", requestId: "request-1", taskKind: "data-import.mapping",
    source: { ...source }, runId: "run-1", runState: "SUCCEEDED", actionReceiptIds: [] } } });
const decide = (result, options = {}) => contextualRefreshDecisionV010({ result,
  requestId: "request-1", taskKind: "data-import.mapping", source, sameMount: true, dirty: false, ...options });

test("contextual envelope adapts generic page task without granting identity", () => {
  const e = envelope();
  assert.equal(e.context.importJobId, "job-1");
  assert.equal(e.userIntent, "map fields");
  assert.equal("principal" in e, false);
  e.source.route = "other";
  assert.equal(source.route, "/imports/job-1");
  assert.equal(contextualAssistanceRequestV010("x", "id", undefined), undefined);
  assert.equal(contextualAssistanceRequestV010("x", "id", { source, context: {} }), undefined);
});

test("only a correlated successful same-mount result refreshes; dirty forms are preserved", () => {
  assert.equal(decide(response()), "REFRESH");
  assert.equal(decide(response(), { dirty: true }), "PRESERVE_DRAFT");
  assert.equal(decide(response(), { sameMount: false }), "IGNORE");
  assert.equal(decide(undefined), "IGNORE");
  assert.equal(decide({ ok: false }), "IGNORE");
  assert.equal(decide({ ok: true, result: { message: "success" } }), "IGNORE");
});

for (const [key, value] of [["requestId", "other"], ["taskKind", "other"], ["contractVersion", "9"], ["runId", "other"], ["runState", "PAUSED"], ["runState", "BLOCKED"], ["runState", "FAILED"], ["runState", "CANCELLED"]]) {
  test(`refresh refuses mismatched ${key}=${value}`, () => {
    const r = response();r.result.assistanceResult[key] = value;
    assert.equal(decide(r), "IGNORE");
  });
}
for (const key of ["pageId", "route", "actionId"]) {
  test(`refresh refuses different source ${key}`, () => {
    const r = response();r.result.assistanceResult.source[key] = "other";
    assert.equal(decide(r), "IGNORE");
  });
}

test("draft tracker catches edits before/during assistance and disposes listeners", () => {
  const old = globalThis.Element;
  class Control { name = "field"; value = "initial"; checked = false;
    closest(selector) { return selector === "[data-eidos-chat-composer]" ? null : this; }
  }
  globalThis.Element = Control;
  try {
    const control = new Control();const listeners = new Map();
    const container = { querySelectorAll() { return [control]; },
      addEventListener(name, fn) { listeners.set(name, fn); },
      removeEventListener(name, fn) { if(listeners.get(name) === fn)listeners.delete(name); } };
    const tracker = trackContextualFormDraftV010(container);
    assert.equal(tracker.isDirty(), false);
    control.value = "unsaved"; // catches programmatic edits even without an input event
    assert.equal(tracker.isDirty(), true);
    control.value = "initial";
    listeners.get("input")({ target: control });
    assert.equal(tracker.isDirty(), true); // conservative even if user reverts after typing
    tracker.dispose();assert.equal(listeners.size, 0);
  } finally { globalThis.Element = old; }
});
