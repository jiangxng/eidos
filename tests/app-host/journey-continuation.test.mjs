import test from "node:test";
import assert from "node:assert/strict";

import {
  consumeJourneyContinuationV010,
  journeyContinuationStorageKeyV010,
  persistJourneyContinuationV010
} from "../../dist/app-host/page-controller.js";

function storage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    snapshot() {
      return new Map(values);
    }
  };
}

test("journey continuation waits for the declared destination action and then consumes once", () => {
  const state = storage();
  persistJourneyContinuationV010(
    "/settings/provider",
    "settings.save",
    "/agent/setup",
    state,
    1_000
  );

  assert.equal(
    consumeJourneyContinuationV010("/settings/provider", "status.refresh", state, 1_500),
    undefined
  );
  assert.equal(state.snapshot().size, 1);

  const continuation = consumeJourneyContinuationV010(
    "/settings/provider",
    "settings.save",
    state,
    2_000
  );
  assert.deepEqual(continuation, {
    targetRoute: "/settings/provider",
    onActionId: "settings.save",
    returnRoute: "/agent/setup",
    createdAt: 1_000
  });
  assert.equal(state.snapshot().size, 0);
  assert.equal(
    consumeJourneyContinuationV010("/settings/provider", "settings.save", state, 2_100),
    undefined
  );
});

test("journey continuation expires instead of causing a stale future redirect", () => {
  const state = storage();
  persistJourneyContinuationV010(
    "/providers/llm",
    "settings.save",
    "/agent/setup",
    state,
    1_000
  );
  assert.equal(
    consumeJourneyContinuationV010(
      "/providers/llm",
      "settings.save",
      state,
      1_000 + 31 * 60 * 1000
    ),
    undefined
  );
  assert.equal(state.snapshot().size, 0);
});

test("journey continuation keys are target-route scoped", () => {
  assert.equal(
    journeyContinuationStorageKeyV010("/settings/provider"),
    "eidos.journey.continuation:/settings/provider"
  );
});
