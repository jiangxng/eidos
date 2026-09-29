import test from "node:test";
import assert from "node:assert/strict";

import {
  canonicalResourceCacheKeyV010,
  createRealtimeEventSequenceGuardV010,
  createResourceCacheV010,
  createRuntimeActivityMonitorV010,
  evaluateIdleRuntimeBudgetV010
} from "../../dist/realtime/index.js";

test("Realtime sequence guard detects gaps and blocks speculative application until recovery", () => {
  const guard = createRealtimeEventSequenceGuardV010();

  assert.equal(guard.observe({ eventId: "evt:10", sequence: 10 }).kind, "APPLY");
  assert.equal(guard.observe({ eventId: "evt:10", sequence: 10 }).kind, "DUPLICATE");

  const gap = guard.observe({ eventId: "evt:12", sequence: 12 });
  assert.equal(gap.kind, "GAP");
  assert.equal(gap.expectedSequence, 11);
  assert.equal(guard.snapshot().recoveryRequired, true);

  assert.equal(
    guard.observe({ eventId: "evt:13", sequence: 13 }).kind,
    "RECOVERY_PENDING"
  );
  assert.equal(guard.snapshot().highWaterSequence, 13);

  guard.completeRecovery();
  assert.equal(guard.snapshot().lastAppliedSequence, 13);
  assert.equal(guard.snapshot().recoveryRequired, false);
  assert.equal(guard.observe({ eventId: "evt:14", sequence: 14 }).kind, "APPLY");
});

test("Resource cache uses scoped canonical identity and invalidates only changed versions", () => {
  const cache = createResourceCacheV010();
  const input = {
    scope: {
      enterpriseId: "ent:1",
      contextId: "ctx:1",
      principalSubjectId: "user:1"
    },
    resource: {
      kind: "sales-order",
      resourceId: "SO001"
    }
  };
  const key = canonicalResourceCacheKeyV010(input);
  cache.set(key, { total: 100 }, { version: 18 });

  cache.invalidateFromEvent({
    contractVersion: "0.1.0",
    eventId: "evt:18",
    sequence: 18,
    topic: "resource.sales-order",
    type: "RESOURCE_INVALIDATED",
    occurredAt: "2026-09-30T00:00:00.000Z",
    scope: input.scope,
    resource: { ...input.resource, version: 18 }
  });
  assert.equal(cache.get(key)?.stale, false);

  cache.invalidateFromEvent({
    contractVersion: "0.1.0",
    eventId: "evt:19",
    sequence: 19,
    topic: "resource.sales-order",
    type: "RESOURCE_INVALIDATED",
    occurredAt: "2026-09-30T00:00:01.000Z",
    scope: input.scope,
    resource: { ...input.resource, version: 19 }
  });
  assert.equal(cache.get(key)?.stale, true);
  assert.equal(cache.get(key)?.version, 19);
  assert.equal(cache.get(key)?.lastEventSequence, 19);
});

test("Idle runtime budget passes silent intervals and reports structural churn", () => {
  const monitor = createRuntimeActivityMonitorV010();
  const before = monitor.snapshot();
  const silent = monitor.snapshot();
  assert.equal(evaluateIdleRuntimeBudgetV010(before, silent).ok, true);

  monitor.mark("surfaceMounts");
  monitor.mark("structuralDomMutations");
  const noisy = evaluateIdleRuntimeBudgetV010(before, monitor.snapshot());
  assert.equal(noisy.ok, false);
  assert.ok(noisy.violations.some(item => item.startsWith("surfaceMounts=")));
  assert.ok(
    noisy.violations.some(item => item.startsWith("structuralDomMutations="))
  );
});
