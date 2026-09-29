import test from "node:test";
import assert from "node:assert/strict";

import {
  createFetchSseRealtimeSourceV010
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
