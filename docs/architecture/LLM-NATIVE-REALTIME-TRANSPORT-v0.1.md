# LLM-Native Realtime Transport v0.1

Status: Architecture Baseline  
Owner: Eidos  
Scope: Browser/App Host transport, realtime state delivery, LLM streaming, render scheduling

## 1. Problem

LLM-native enterprise software has several traffic patterns that are different from classic page-based CRUD:

- long-lived Agent runs;
- streamed model output;
- tool execution progress;
- server-side state changes not initiated by the current browser;
- observatory / monitoring surfaces;
- multiple browser tabs and mobile clients;
- large semantic snapshots whose unchanged bytes should not be retransmitted.

A shell-wide refresh after every successful action is not an acceptable synchronization mechanism. It creates unnecessary network traffic, destroys mounted DOM state, can trigger read -> remount -> read loops, and is especially harmful on mobile networks.

The transport and rendering model must therefore separate:

1. command execution;
2. state queries;
3. asynchronous event notification;
4. long-running response streaming;
5. local state reconciliation;
6. DOM rendering.

## 2. Core invariants

### RT-01 — Idle means idle

A stable foreground page with no server-side state change MUST NOT continuously issue application actions or queries.

A hidden/background page MUST NOT use fixed-interval polling for non-critical state.

### RT-02 — Commands are not polling

`POST /actions` or any equivalent command boundary is for explicit user/Agent intent, not for asking repeatedly whether state changed.

A successful local read/update MUST NOT cause a shell-level remount that automatically reissues the same action.

### RT-03 — State has identity and version

Every subscribable or cacheable resource SHOULD expose:

- stable resource identity;
- monotonically comparable resource version/revision;
- snapshot validator such as ETag where HTTP semantics apply.

Clients reconcile by version, not by timing assumptions.

### RT-04 — Events invalidate or carry deltas; they do not carry pages

Realtime events SHOULD contain enough information to identify:

- what changed;
- which resource changed;
- the new resource version;
- correlation / causation;
- an optional compact delta.

Events MUST NOT instruct the client to rebuild an entire page unless the page contract itself has materially changed.

### RT-05 — Network cadence and render cadence are independent

Incoming chunks/events MAY arrive faster than UI rendering.

The client MUST coalesce high-frequency updates and commit UI work on an appropriate render boundary, normally `requestAnimationFrame` for visual updates.

LLM token/chunk delivery MUST NOT imply one DOM rebuild per chunk.

### RT-06 — Mounted surfaces own their local view state

Self-updating surfaces such as Diagram, Spatial Observatory and Chat own their local mounted state.

Host chrome refresh, package/catalog refresh and resource refresh are separate operations.

A child surface that has locally applied a result MUST be able to declare that the shell should preserve the mounted page.

### RT-07 — Recoverable realtime delivery

Realtime transports MUST support reconnect and replay/resume semantics.

If the client detects a sequence gap, it MUST re-read a canonical snapshot instead of guessing missing state.

### RT-08 — Mobile and background efficiency

When the document is hidden or the application is backgrounded:

- suspend non-critical polling;
- suspend non-critical visual work;
- downgrade or close optional realtime subscriptions;
- retain only transports required for active user-visible work;
- resume from event/version cursor when visible again.

## 3. Transport lanes

Eidos defines four transport lanes. They are semantic roles, not implementation-specific endpoints.

### 3.1 Command lane — HTTP request/response

Use for:

- human actions;
- Agent tool calls;
- approvals;
- publishing;
- mutations;
- explicit cancellations.

Recommended transport:

- HTTP POST;
- idempotency key for retry-safe commands where appropriate;
- correlationId;
- explicit result / accepted run identity.

Commands MUST NOT be used for fixed polling.

### 3.2 Query lane — versioned HTTP

Use for:

- initial snapshots;
- explicit navigation loads;
- recovery after event gaps;
- low-frequency on-demand reads.

Recommended features:

- ETag / If-None-Match;
- resource revision in payload;
- `304 Not Modified` for unchanged resources where practical;
- delta query by version when supported;
- AbortController for superseded requests.

Large graph and observatory resources SHOULD prefer versioned snapshot + delta semantics over repeated full snapshots.

### 3.3 Event lane — SSE by default

Server-Sent Events are the default browser realtime notification transport for one-way Host -> client state events.

Good fits:

- resource invalidation;
- Agent run state changes;
- tool execution lifecycle;
- approval required;
- workflow state changes;
- observatory fact availability;
- background completion notices.

Why SSE is the default:

- server -> browser direction matches most state notification traffic;
- persistent HTTP connection;
- browser-native reconnect behavior;
- event ids can support resume;
- simpler authorization and infrastructure than a bidirectional socket.

An event stream SHOULD support a logical cursor / event id so the client can recover after reconnect.

### 3.4 Stream lane — request-bound Fetch streaming

For a single user request that produces a streamed LLM response, prefer a streamed HTTP response when the lifecycle is naturally request-bound.

Example:

```text
POST user turn
  -> response headers
  -> assistant.delta
  -> assistant.delta
  -> tool.activity
  -> assistant.delta
  -> final
```

This avoids polling for completion and avoids requiring a global realtime connection for every chat turn.

If the run may outlive the request or must survive page reconnect, create a durable run and deliver subsequent progress over the Event lane.

## 4. When WebSocket is appropriate

WebSocket is not the default transport.

Use WebSocket only when the feature genuinely requires frequent bidirectional low-latency traffic, for example:

- collaborative graph editing;
- presence / cursor sharing;
- live co-editing;
- future realtime voice/control channels;
- high-frequency bidirectional interaction that would be inefficient as separate HTTP commands plus server events.

A WebSocket implementation MUST include application-level flow control, bounded queues and reconnect/resume rules. Classic browser WebSocket has no built-in backpressure guarantee.

## 5. Event envelope

Recommended baseline:

```ts
interface RealtimeEventV010 {
  contractVersion: "0.1.0";
  eventId: string;
  sequence: number;
  topic: string;

  scope: {
    principalId?: string;
    contextId?: string;
    enterpriseId?: string;
  };

  resource: {
    kind: string;
    resourceId: string;
    previousVersion?: string | number;
    version?: string | number;
  };

  type:
    | "RESOURCE_INVALIDATED"
    | "RESOURCE_DELTA"
    | "RUN_STATE_CHANGED"
    | "OUTPUT_DELTA"
    | "TOOL_ACTIVITY"
    | "APPROVAL_REQUIRED"
    | "NOTICE";

  correlationId?: string;
  causationId?: string;
  occurredAt: string;
  payload?: unknown;
}
```

The event envelope carries semantic change, not presentation markup.

## 6. Client reconciliation model

The client keeps a resource store keyed by:

```text
scope + resourceKind + resourceId
```

Each entry has:

```text
snapshot
version
lastEventSequence
fetchState
subscriptionState
```

On event:

1. reject duplicate event ids;
2. reject already-applied sequence/version;
3. if the event contains a valid contiguous delta, apply it;
4. otherwise mark the resource stale;
5. fetch the latest version only when needed;
6. coalesce multiple invalidations for the same resource;
7. render changed entities only.

A sequence gap triggers snapshot recovery.

## 7. LLM-native streaming rules

### 7.1 Separate run state from output text

An Agent run produces distinct channels of information:

- run lifecycle;
- assistant output;
- tool lifecycle;
- approval requests;
- durable final result.

They MUST NOT be flattened into repeated full transcript payloads.

### 7.2 Output delta contract

A streamed assistant message SHOULD have a stable message id.

Example:

```text
messageId = assistant:run-123
deltaSeq = 42
append = "..."
```

The browser updates only that message.

### 7.3 Render coalescing

Model/network chunks are collected in a small in-memory buffer.

Recommended default:

- flush no more often than one animation frame;
- for expensive Markdown/layout work, coalesce to approximately 50–100 ms while output is rapidly arriving;
- flush immediately on terminal/final event;
- preserve selection, scroll and historical message DOM.

### 7.4 Durable runs

Long Agent work SHOULD return a durable `runId`.

The browser then observes run events instead of calling resume/status endpoints in a tight loop.

Explicit resume remains a command only when the run semantics genuinely require client authorization or continuation.

## 8. Workbench rendering contract

Workbench must distinguish:

```text
refreshChrome()
refreshResource(resourceId)
remountRoute(route)
refreshEverything()
```

These are not interchangeable.

`refreshEverything()` is a last-resort operation for:

- package/route topology changes;
- locale/runtime contract replacement;
- unrecoverable client state divergence.

A normal successful query/action MUST NOT call it.

Self-updating page surfaces use a render hint equivalent to:

```ts
{ preserveMountedPage: true }
```

The Workbench MAY refresh lightweight Host chrome, but MUST retain:

- side-panel mounted surface;
- workspace mounted surface;
- local scroll;
- selection;
- camera state;
- composer state;
- current streaming message DOM.

## 9. Background and mobile policy

When `document.visibilityState !== "visible"`:

- pause visual frame work;
- stop fallback polling;
- abort superseded non-critical fetches;
- coalesce invalidations without fetching every intermediate version;
- optionally close non-critical event streams after a grace period;
- resume with event cursor / resource version.

When returning visible:

1. reconnect if needed;
2. provide last event id / cursor;
3. if replay is complete, apply deltas;
4. if replay is unavailable or a gap exists, fetch one canonical snapshot.

No mobile client should spend bandwidth repeatedly downloading an unchanged graph.

## 10. Multi-tab policy

Multiple same-origin tabs SHOULD avoid duplicating expensive realtime work.

A future optimization MAY use BroadcastChannel or SharedWorker so that:

- one elected tab/worker owns the upstream event connection;
- other tabs receive local notifications;
- leadership transfers when the owner closes.

This is an optimization, not an MVP dependency.

## 11. Fallback polling

Polling is a compatibility fallback, not the primary architecture.

If required:

- exponential backoff;
- jitter;
- maximum frequency;
- Page Visibility aware;
- ETag / revision conditional requests;
- stop after inactivity;
- immediate cancellation on newer request;
- no fixed sub-second polling for idle enterprise state.

## 12. Performance and traffic SLOs

The platform SHOULD measure:

- requests per active user per minute;
- bytes received/sent per active user;
- bytes per Agent turn;
- idle bytes per hour;
- event reconnect count;
- duplicate event count;
- snapshot recovery count;
- DOM patch count;
- full remount count;
- render time per frame;
- long tasks;
- stale-response discard count.

Baseline product goals:

- idle EOG page: zero application actions after initial load unless server state changes;
- background EOG page: zero fallback polling;
- one server change: one logical event, not a cascade of repeated reads;
- unchanged resource refresh: zero or minimal payload via cache/version semantics;
- LLM stream: history DOM remains stable; only the active message and activity indicators change;
- no shell-wide remount for ordinary realtime updates.

## 13. Migration sequence

### Phase A — stop pathological traffic

- eliminate action-success -> global refresh -> remount -> action loops;
- preserve mounted self-updating surfaces;
- cancel stale/superseded requests;
- remove tight client run-resume/status loops where they are only acting as polling.

### Phase B — versioned queries

- add resource version / ETag to graph, observatory, conversations and other large snapshots;
- conditional reads;
- delta-friendly contracts.

### Phase C — Host event lane

- add authenticated SSE endpoint;
- event envelope v0.1;
- reconnect cursor;
- resource invalidation;
- Agent run events.

### Phase D — LLM streaming lane

- streamed Fetch for request-bound turns;
- durable-run SSE for long jobs;
- stable message ids and delta sequence;
- renderer coalescing.

### Phase E — selective WebSocket

Only add WebSocket where measured product requirements demand frequent bidirectional realtime interaction.

## 14. Architectural rule

The platform must never use rendering as a synchronization protocol.

```text
server state changes
  -> event/version
  -> client reconciliation
  -> minimal local state patch
  -> scheduled render
```

not:

```text
action success
  -> refresh shell
  -> remount page
  -> reload data
  -> action success
  -> ...
```

This distinction is mandatory for Eidos to remain efficient on desktop, mobile and future LLM-native enterprise workloads.
