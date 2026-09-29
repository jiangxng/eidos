import test from "node:test";
import assert from "node:assert/strict";

import {
  createBrowserLifecycleControllerV010,
  createFetchSseRealtimeSourceV010,
  createSupersedingRequestGateV010
} from "../../dist/realtime/index.js";
import {
  createAppManagerExperienceSource
} from "../../dist/app-host/index.js";

function fakeDocument(initial = "visible") {
  const listeners = new Set();
  return {
    visibilityState: initial,
    addEventListener(type, handler) {
      if (type === "visibilitychange") listeners.add(handler);
    },
    removeEventListener(type, handler) {
      if (type === "visibilitychange") listeners.delete(handler);
    },
    setVisibility(value) {
      this.visibilityState = value;
      for (const handler of listeners) handler();
    }
  };
}

test("fetch SSE parses events and pauses while document is hidden", async () => {
  const doc = fakeDocument("hidden");
  let fetchCalls = 0;
  let source;
  const got = new Promise(resolve => {
    source = createFetchSseRealtimeSourceV010({
      url:"https://host.test/v1/events",
      documentRef:doc,
      fetchImpl:async () => {
        fetchCalls += 1;
        const payload = {
          contractVersion:"0.1.0",
          eventId:"evt:1",
          sequence:1,
          topic:"resource.eog",
          type:"RESOURCE_INVALIDATED",
          occurredAt:"2026-09-29T00:00:00.000Z",
          resource:{kind:"eog",resourceId:"eog:primary",version:2}
        };
        return new Response(new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(
              "id: evt:1\nevent: resource_invalidated\ndata: "
              + JSON.stringify(payload) + "\n\n"
            ));
          }
        }), {status:200,headers:{"content-type":"text/event-stream"}});
      }
    });
    source.subscribe(event => {
      resolve(event);
      source.dispose();
    });
  });

  source.connect();
  assert.equal(fetchCalls, 0);
  assert.equal(source.snapshot().state, "PAUSED_HIDDEN");
  doc.setVisibility("visible");
  const event = await got;
  assert.equal(fetchCalls, 1);
  assert.equal(event.resource.resourceId, "eog:primary");
});

test("App Manager source revalidates JSON with ETag and uses cached body on 304", async () => {
  const requests = [];
  const source = createAppManagerExperienceSource({
    baseUrl:"https://host.test",
    fetchImpl:async (_url, init) => {
      requests.push(init?.headers ?? {});
      if (requests.length === 1) {
        return new Response(JSON.stringify([{contractVersion:"0.1.0"}]), {
          status:200,
          headers:{"content-type":"application/json","etag":"\"abc\""}
        });
      }
      return new Response(null,{status:304});
    }
  });
  const first = await source.listEffectiveExperienceManifests();
  const second = await source.listEffectiveExperienceManifests();
  assert.deepEqual(second, first);
  assert.equal(requests[1]["if-none-match"], "\"abc\"");
});


function fakeWindow() {
  const listeners = new Map();
  return {
    addEventListener(type, handler) {
      const set = listeners.get(type) ?? new Set();
      set.add(handler);
      listeners.set(type, set);
    },
    removeEventListener(type, handler) {
      listeners.get(type)?.delete(handler);
    },
    dispatch(type, event = { type }) {
      for (const handler of listeners.get(type) ?? []) {
        if (typeof handler === "function") handler(event);
        else handler.handleEvent?.(event);
      }
    }
  };
}

test("browser lifecycle distinguishes bfcache freeze from real disposal", () => {
  const doc = fakeDocument("visible");
  const win = fakeWindow();
  const nav = { onLine: true };
  const states = [];
  const lifecycle = createBrowserLifecycleControllerV010({
    documentRef: doc,
    windowRef: win,
    navigatorRef: nav
  });
  const unsubscribe = lifecycle.subscribe(snapshot => states.push(snapshot.state));

  win.dispatch("pagehide", { type: "pagehide", persisted: true });
  assert.equal(lifecycle.snapshot().state, "BFCACHE_FROZEN");

  win.dispatch("pageshow", { type: "pageshow", persisted: true });
  assert.equal(lifecycle.snapshot().state, "ACTIVE_VISIBLE");

  nav.onLine = false;
  win.dispatch("offline");
  assert.equal(lifecycle.snapshot().state, "OFFLINE");

  nav.onLine = true;
  win.dispatch("online");
  assert.equal(lifecycle.snapshot().state, "ACTIVE_VISIBLE");

  unsubscribe();
  lifecycle.dispose();
  assert.equal(lifecycle.snapshot().state, "DISPOSED");
  assert.ok(states.includes("BFCACHE_FROZEN"));
  assert.ok(states.includes("OFFLINE"));
});

test("superseding request gate aborts old work and rejects stale completions", () => {
  const gate = createSupersedingRequestGateV010();
  const first = gate.begin();
  assert.equal(first.signal.aborted, false);
  assert.equal(first.isCurrent(), true);

  const second = gate.begin();
  assert.equal(first.signal.aborted, true);
  assert.equal(first.isCurrent(), false);
  assert.equal(second.isCurrent(), true);

  gate.cancel();
  assert.equal(second.signal.aborted, true);
  assert.equal(second.isCurrent(), false);

  gate.dispose();
  assert.throws(() => gate.begin(), /EIDOS_REQUEST_GATE_DISPOSED/);
});

test("SSE pauses for bfcache/offline and reconnects with last event id", async () => {
  const doc = fakeDocument("visible");
  const win = fakeWindow();
  const nav = { onLine: true };
  const requestHeaders = [];
  const controllers = [];

  const source = createFetchSseRealtimeSourceV010({
    url: "https://host.test/v1/events",
    documentRef: doc,
    windowRef: win,
    navigatorRef: nav,
    reconnectDelaysMs: [1],
    fetchImpl: async (_url, init) => {
      requestHeaders.push(init?.headers ?? {});
      let streamController;
      const body = new ReadableStream({
        start(controller) {
          streamController = controller;
          controllers.push(controller);
          if (requestHeaders.length === 1) {
            const payload = {
              contractVersion: "0.1.0",
              eventId: "evt:cursor-1",
              sequence: 1,
              topic: "resource.test",
              type: "RESOURCE_INVALIDATED",
              occurredAt: "2026-09-29T00:00:00.000Z"
            };
            controller.enqueue(new TextEncoder().encode(
              "id: evt:cursor-1\ndata: " + JSON.stringify(payload) + "\n\n"
            ));
          }
        },
        cancel() {}
      });
      return new Response(body, {
        status: 200,
        headers: { "content-type": "text/event-stream" }
      });
    }
  });

  const firstEvent = new Promise(resolve => {
    const stop = source.subscribe(event => {
      stop();
      resolve(event);
    });
  });

  source.connect();
  await firstEvent;
  assert.equal(source.snapshot().lastEventId, "evt:cursor-1");

  win.dispatch("pagehide", { type: "pagehide", persisted: true });
  assert.equal(source.snapshot().state, "PAUSED_BFCACHE");

  win.dispatch("pageshow", { type: "pageshow", persisted: true });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(requestHeaders.length, 2);
  assert.equal(requestHeaders[1]["last-event-id"], "evt:cursor-1");

  nav.onLine = false;
  win.dispatch("offline");
  assert.equal(source.snapshot().state, "PAUSED_OFFLINE");
  const callsBefore = requestHeaders.length;
  await new Promise(resolve => setTimeout(resolve, 5));
  assert.equal(requestHeaders.length, callsBefore);

  nav.onLine = true;
  win.dispatch("online");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.ok(requestHeaders.length > callsBefore);

  source.dispose();
  for (const controller of controllers) {
    try { controller.close(); } catch {}
  }
});

test("App Manager Experience reads propagate AbortSignal to fetch", async () => {
  let seenSignal;
  const source = createAppManagerExperienceSource({
    baseUrl: "https://host.test",
    fetchImpl: async (_url, init) => {
      seenSignal = init?.signal;
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
  });

  const controller = new AbortController();
  await source.listEffectiveExperienceManifests({ signal: controller.signal });
  assert.equal(seenSignal, controller.signal);
});
