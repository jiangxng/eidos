# Web Runtime Stability Baseline v0.1

Status: Implemented baseline  
Owner: Eidos  
Scope: App Host, Workbench, Surface lifecycle, realtime reconciliation, browser runtime performance

## 1. Stage objective

Close the browser-runtime foundation required for an LLM-native enterprise UI so that communication, caching and rendering are not coupled through shell remounts.

This stage treats the following as one runtime problem:

- stable Surface identity and lifecycle;
- desktop/mobile Surface separation;
- resource-scoped realtime invalidation;
- reconnect / event-sequence recovery;
- browser hidden/offline lifecycle;
- browser/HTTP cache-friendly reads;
- observable idle-performance invariants.

The stage does not attempt to build every future dependency-graph optimization. It establishes the contract boundaries that those optimizations can extend without replacing the runtime.

## 2. Completed runtime baseline

### 2.1 Surface identity

A mounted Surface is identified by:

```text
surfaceId
+ semanticId
+ deterministic instanceKey
+ structuralVersion
```

`instanceKey` is canonical and deterministic. Object key ordering does not affect it.

`structuralVersion` belongs to the Surface declaration and changes only when an existing mounted implementation is structurally incompatible.

### 2.2 Stable App Host lifecycle

Ordinary App Host refresh now reuses a mounted page when Surface identity is unchanged.

Remount remains allowed for:

- navigation to another instance;
- Surface change;
- structuralVersion change;
- explicit action-result reload where the current generic page contract does not expose an incremental refresh;
- locale/presentation reset;
- unrecoverable rendering failure.

This preserves existing compatibility while removing refresh -> dispose -> mount loops from ordinary Host synchronization.

### 2.3 Stable Workbench lifecycle

Side Panel and Main Workspace keep independent Surface identities.

Closing the Side Panel no longer destroys its mounted Surface. Switching to another semantic Surface disposes the old instance.

A Workbench Host refresh reuses the Side Panel/Main Workspace when their identities remain stable.

External web iframes are also retained when the target URL is unchanged.

### 2.4 Resource-scoped realtime refresh

Mounted pages may declare `resourceIds` and a local `refresh()`.

Realtime invalidation:

```text
event
 -> resourceId
 -> mounted consumers
 -> coalesced local refresh
```

It does not imply shell remount.

Multiple invalidations are coalesced before refreshing mounted consumers.

### 2.5 Event sequence recovery

The realtime sequence guard provides:

- duplicate event rejection;
- monotonic sequence acceptance;
- gap detection;
- a recovery-pending state;
- a high-water sequence;
- explicit canonical-recovery completion.

Workbench uses this guard before resource invalidation. A sequence gap suspends speculative application and triggers canonical Host reconciliation.

If events continue to arrive during reconciliation, Workbench performs another bounded reconciliation pass before completing recovery.

### 2.6 Resource cache foundation

The versioned resource cache provides a stable cache key derived from:

```text
enterprise scope
+ context scope
+ principal scope
+ resource kind
+ resource id
```

It supports:

- snapshot/value storage;
- resource version;
- stale marking;
- event-sequence watermark;
- subscriptions;
- event-driven invalidation.

An invalidation carrying the same known resource version does not mark the resource stale.

### 2.7 Browser lifecycle

The existing Browser Lifecycle and Fetch-SSE baseline remains authoritative:

- visible/hidden separation;
- bfcache freeze/resume;
- offline/online pause/resume;
- AbortController cancellation;
- `Last-Event-ID` reconnect cursor;
- no hidden fixed polling.

The new Surface lifecycle rules ensure lifecycle transitions no longer need a UI remount as a synchronization mechanism.

### 2.8 Runtime performance counters

The Runtime activity monitor exposes counters for:

- Surface mount/unmount/reuse/patch;
- resource invalidation/refresh;
- HTTP/conditional requests;
- SSE messages/reconnects;
- structural DOM mutations.

The default idle budget requires zero:

- Surface mounts;
- Surface unmounts;
- application HTTP requests;
- SSE reconnects;
- structural DOM mutations.

Products can compare two snapshots around an idle observation interval and fail acceptance when the budget is exceeded.

## 3. Runtime invariants

This baseline is governed by `EIDOS-35` through `EIDOS-38` in the repository root `INVARIANTS.md`.

In short:

```text
server change
 -> event/version
 -> resource reconciliation
 -> local consumer refresh/patch
 -> scheduled rendering
```

not:

```text
server change
 -> refresh shell
 -> dispose Surface
 -> mount Surface
 -> fetch again
```

## 4. Communication model

The transport baseline remains:

```text
Command       HTTP request/response
Query         versioned HTTP + ETag/If-None-Match
Event         SSE + event id/sequence
LLM stream    streamed Fetch
WebSocket     opt-in only for genuine bidirectional realtime
```

Browser HTTP cache and the Eidos resource cache are complementary:

- HTTP cache avoids retransmitting unchanged bytes;
- Eidos resource cache preserves semantic identity/version/subscription state.

## 5. Acceptance matrix

| Requirement | Acceptance |
|---|---|
| Stable Surface | Same Surface identity survives ordinary Host refresh without remount |
| Structural change | structuralVersion change requires remount |
| Side Panel | Hide/show preserves mounted Surface instance |
| Resource event | Only mounted consumers declaring the resource refresh |
| Event duplicate | Duplicate event is ignored |
| Event gap | Gap enters recovery; speculative resource update is not applied |
| Hidden/offline | SSE pauses and resumes from cursor |
| Conditional query | ETag request may return 304 and reuse cached body |
| Idle | Default idle budget reports zero mounts/unmounts/HTTP/reconnects/structural mutations |
| Mobile | Surface selection happens through resolver/semantic mapping rather than component-level responsive branching |

## 6. Explicit non-goals for v0.1

The following remain later optimizations, not blockers for this baseline:

- fine-grained field/expression dependency graph;
- shared-worker/BroadcastChannel single-SSE ownership across tabs;
- generic DOM patching for every UIDL page type;
- offline command queue/conflict resolution;
- mandatory WebSocket transport;
- Service Worker application-shell caching policy.

These can now be added behind stable Surface/resource/realtime contracts.

## 7. Completion definition

This stage is complete when:

1. TypeScript typecheck succeeds.
2. Unit/integration tests succeed.
3. repository validation succeeds.
4. release build succeeds.
5. CI verifies the branch.
6. the stable-lifecycle, sequence-gap, resource-cache and idle-budget tests remain in the permanent suite.

