# Web Delivery and Surface Architecture v0.1

**Status:** Architecture Baseline  
**Owner:** Eidos  
**Scope:** Browser delivery, caching, routing, lifecycle, surface targeting, mobile/desktop experience separation

## 1. North star

Eidos must treat the browser as an execution platform with durable capabilities, not as a dumb terminal.

The frontend delivery model is:

~~~text
Shared semantic contract
        |
        +--> Desktop Surface
        |
        +--> Mobile Surface
        |
        +--> Future Voice / Wearable / Embedded Surface
~~~

These surfaces may share Eidos Core, Action/Data contracts, identity, authorization and business semantics without sharing one page implementation.

The governing principle is:

> **Same truth and actions; surface-specific experience.**

A business capability is not required to expose every feature on every surface.

## 2. Why one responsive page is not the default

Classic responsive web design often assumes:

~~~text
one page
  -> CSS breakpoints
  -> progressively squeeze/reflow the same interaction
~~~

That is not sufficient for an LLM-native enterprise system.

A desktop process designer, a 3D enterprise observatory, a mobile approval card and a phone-first Agent conversation may represent the same enterprise truth but require fundamentally different interaction models.

Eidos therefore MUST NOT require one page implementation to serve all device classes.

Responsive layout remains useful inside a Surface, but it is not the architectural mechanism for cross-device product coverage.

## 3. Surface Target

A Surface Target is a deterministic experience target.

Initial target classes:

~~~text
DESKTOP_WORKBENCH
MOBILE_TASK
MOBILE_READ
TABLET_WORKBENCH
~~~

Future targets may be added only through versioned contracts.

A target describes expected interaction capabilities, not a vendor user-agent string.

Conceptual capability profile:

~~~ts
interface ClientSurfaceProfileV010 {
  contractVersion: "0.1.0";
  viewportClass: "COMPACT" | "MEDIUM" | "EXPANDED";
  primaryPointer: "COARSE" | "FINE" | "NONE";
  hover: boolean;
  touch: boolean;
  reducedMotion: boolean;
  standalone: boolean;
}
~~~

Network/device-memory hints MAY inform optimization but MUST NOT become authorization or business logic.

## 4. Experience Surface declaration

An Experience may publish multiple independently versioned surfaces.

Conceptual contract:

~~~ts
interface ExperienceSurfaceV010 {
  surfaceId: string;
  target:
    | "DESKTOP_WORKBENCH"
    | "MOBILE_TASK"
    | "MOBILE_READ"
    | "TABLET_WORKBENCH";

  support:
    | "FULL"
    | "TASK_FOCUSED"
    | "READ_ONLY"
    | "UNSUPPORTED";

  entryRoute: string;
  compatibleActions: string[];
  compatibleResources?: string[];
  fallbackSurfaceId?: string;
}
~~~

The exact contract will be frozen when implementation begins.

Important invariant:

> Surface support is explicit metadata, not inferred from whether CSS happens to fit.

## 5. Surface Resolver

The App Host owns deterministic Surface selection.

Resolution order:

1. explicit URL Surface target;
2. explicit user override;
3. Experience-declared support;
4. client capability profile;
5. deterministic host default.

The resolver MUST avoid redirect loops and MUST preserve the semantic navigation target when switching surfaces.

Example:

~~~text
/app/eog/observatory?id=order:123
        |
        +-- DESKTOP_WORKBENCH --> /desktop/eog/observatory?id=order:123
        |
        +-- MOBILE_READ -------> /mobile/eog/order?id=order:123
~~~

The URL structure is illustrative. The public contract is the Surface resolution rule, not these exact prefixes.

User-Agent sniffing alone is not sufficient. Browser capability evidence and explicit user preference take precedence.

## 6. Unsupported mobile experiences

Not every page must support mobile.

An Experience may explicitly declare:

~~~text
DESKTOP_WORKBENCH = FULL
MOBILE_READ       = READ_ONLY
MOBILE_TASK       = UNSUPPORTED
~~~

When the requested capability is unsupported, Eidos MUST render a deterministic handoff experience rather than forcing a broken compressed desktop UI.

A handoff may provide:

- explanation that this operation requires a desktop Surface;
- copyable canonical deep link;
- "open desktop version" when technically viable;
- later, device handoff or QR/share mechanisms.

Unsupported does not mean unavailable data. A mobile-specific summary or read-only Surface may still exist.

## 7. Recommended mobile product shape

Mobile is not a miniature ERP desktop.

High-value mobile-first Surfaces typically include:

- Personal / Enterprise Agent;
- approval and decision queue;
- notifications and exceptions;
- assigned tasks;
- KPI / operational summary;
- entity lookup;
- compact evidence inspection;
- camera/document capture where explicitly supported;
- lightweight status updates through governed Actions.

Heavy authoring Surfaces may remain desktop-only, for example:

- large graph editing;
- complex rules/configuration;
- dense accounting configuration;
- 3D operational exploration;
- bulk data management.

This is a product declaration per Experience, not a global rule.

## 8. Browser cache hierarchy

Eidos adopts explicit cache classes.

### 8.1 Immutable build assets

Examples:

- JavaScript modules;
- extracted CSS;
- icons/fonts owned by the build;
- deterministic static images.

Requirement:

~~~text
content/versioned URL
+ Cache-Control: public, max-age=31536000, immutable
~~~

A URL that may change bytes MUST NOT be marked immutable.

Build/deployment revision may be used as the URL version while content-hash packaging is not yet available.

### 8.2 App shell HTML

The shell is the pointer to the current immutable asset graph.

Requirement:

~~~text
Cache-Control: no-cache
ETag: <representation validator>
~~~

or equivalent immediate revalidation.

The shell should be small and should not embed large cacheable CSS/JS long term.

### 8.3 Public/static metadata

Static metadata that is not Principal-specific MAY use public cache semantics with validators.

### 8.4 Principal/Context-specific queries

Authenticated enterprise snapshots MUST default to:

~~~text
Cache-Control: private, max-age=0, must-revalidate
ETag: <representation validator>
~~~

The browser may reuse the representation after validation, but shared intermediaries must not accidentally serve one Principal's data to another.

### 8.5 Sensitive/non-reusable responses

Secrets, one-time credentials, highly sensitive exports and equivalent responses MUST use:

~~~text
Cache-Control: no-store
~~~

No-store is a security policy, not a general default for all application traffic.

### 8.6 Realtime streams

SSE/WebSocket/streaming responses are not snapshot caches.

SSE keeps:

~~~text
Cache-Control: no-cache, no-transform
~~~

with replay/version recovery handled by the realtime protocol.

## 9. Browser Back/Forward Cache (bfcache)

Eidos SHOULD remain compatible with browser bfcache.

Rules:

- avoid unnecessary unload handlers;
- use pagehide / pageshow and visibility lifecycle;
- suspend realtime/visual work when a page is frozen or hidden;
- reconnect/revalidate from cursor/version after restoration;
- preserve mounted UI state when the browser can restore the page safely.

A browser-native bfcache restore is preferable to reconstructing the entire application.

## 10. Local storage hierarchy

Browser storage is non-authoritative unless a Host contract explicitly states otherwise.

Recommended responsibilities:

~~~text
Memory
  current mounted resource/session state

sessionStorage
  short-lived navigation/handoff hints

localStorage
  tiny non-sensitive preferences only

IndexedDB
  bounded larger local caches when a proven feature needs them

Cache Storage / Service Worker
  optional offline/static delivery layer, introduced only for an accepted vertical
~~~

Enterprise truth, authorization grants and material write status MUST NOT depend on browser local storage.

## 11. Service Worker policy

A global Service Worker is NOT required by default.

Reason:

- stale shell/version bugs are costly;
- authenticated enterprise data requires careful partitioning;
- mobile/offline needs differ by Experience.

Service Worker/PWA support should be introduced only for Surfaces that have a concrete offline/installability requirement.

Initial cache correctness should rely on ordinary HTTP cache semantics first.

## 12. Offline and weak-network behavior

Eidos does not assume all enterprise operations are safe offline.

Default rules:

- cached READ state may be displayed only with visible freshness/evidence semantics when necessary;
- material WRITEs fail closed when authority/current-state requirements cannot be satisfied;
- browser-side write queues are not created generically;
- offline mutation is admitted only through an explicit idempotent/synchronizable Action contract.

Mobile Surfaces SHOULD degrade to smaller snapshots and task-focused data rather than repeatedly retrying large desktop resources.

## 13. Navigation and deep-link contract

Every supported Surface should have stable deep links.

Navigation must preserve semantic identity:

~~~text
Experience + route + subject/resource
~~~

Surface identity is presentation context, not enterprise truth.

Cross-Surface navigation may map one semantic route to a different page composition.

A desktop editor deep link may therefore resolve on mobile to:

- a mobile inspector;
- a read-only summary;
- a handoff page.

It does not need to resolve to the identical DOM/page.

## 14. Version skew across deployments

Immutable assets create a deliberate condition:

> An already-open tab may continue running an older frontend bundle after a new deployment.

Therefore:

- public frontend/backend contracts are versioned;
- backend compatibility must cover a bounded frontend skew window;
- event/query contracts must fail closed on unsupported versions;
- the shell points new navigations to the new asset revision;
- emergency incompatible deployments require an explicit reload/version gate, not accidental runtime breakage.

## 15. Code and data loading

The default loading model is:

~~~text
small shell
  -> selected Surface
  -> route code
  -> page definition
  -> required data
~~~

Do not load desktop-only 3D/editor code into a mobile Agent Surface.

Eidos SHOULD evolve toward:

- route/surface code splitting;
- lazy component capability loading;
- resource-level data loading;
- intent-aware prefetch.

Prefetch must respect mobile cost.

Aggressive speculative prefetch is forbidden when:

- Save-Data is enabled;
- network quality is poor;
- payload is large;
- user intent is weak.

## 16. Compression and transport reuse

Production delivery SHOULD support:

- Brotli/gzip where appropriate;
- HTTP/2 or HTTP/3 through the serving platform;
- persistent connection reuse;
- compact JSON/event envelopes;
- binary formats only when measurement proves material benefit.

Compression does not replace cache/version design.

## 17. Rendering and scheduling

The realtime transport architecture remains authoritative:

~~~text
network cadence != render cadence
~~~

In addition:

- route changes should abort superseded fetches;
- visual updates should coalesce to render frames;
- hidden Surfaces suspend non-critical animation/render loops;
- expensive desktop visualizations should not initialize on unsupported mobile Surfaces.

## 18. Cross-tab coordination

Multiple tabs are valid.

A future cross-tab coordinator MAY use:

- BroadcastChannel;
- SharedWorker where support is adequate;
- one elected realtime connection with tab fan-out.

This is an optimization, not a correctness dependency.

Every tab must remain correct if coordination is unavailable.

## 19. Security delivery baseline

Web delivery architecture must include:

- Content Security Policy;
- safe HTML/Markdown rendering;
- no arbitrary script injection from Experience content;
- secure cookie/token handling;
- CSRF protection where cookie-based write authentication applies;
- clickjacking/frame policy;
- CORS scoped to intended hosts;
- secret responses marked no-store;
- dependency/integrity governance.

Browser cache policy MUST NOT weaken authorization isolation.

## 20. Accessibility baseline

Surface specialization does not reduce accessibility requirements.

Supported Surfaces must define:

- keyboard operation where applicable;
- focus continuity;
- screen-reader semantics;
- reduced-motion behavior;
- sufficient target sizes for coarse-pointer/mobile Surfaces;
- no pointer-only critical workflow.

A page may be desktop-only, but a desktop-only page still must be accessible on desktop.

## 21. Observability and performance budgets

Frontend delivery needs measurable SLOs.

Initial metrics:

- shell bytes;
- initial JavaScript bytes transferred;
- cache validation / 304 rate;
- immutable asset cache hit behavior;
- route data bytes;
- idle application request count;
- realtime bytes while idle;
- long tasks;
- first usable Surface time;
- route transition time;
- error/recovery count.

Mobile and desktop budgets are independent.

A mobile Surface MUST NOT inherit a desktop payload budget merely because the business capability is the same.

## 22. Testing matrix

Required browser delivery tests should progressively cover:

- first load;
- second load with warm cache;
- deployment revision change;
- back/forward navigation and bfcache;
- foreground/background/resume;
- offline/online transition;
- high latency;
- packet loss/interrupted stream;
- Save-Data / constrained network where available;
- desktop fine-pointer;
- mobile coarse-pointer;
- unsupported Surface handoff;
- old frontend bundle against compatible current Host.

## 23. LLM-native generation rule

The LLM/Experience Compiler should reason from:

~~~text
goal
+ semantic resources/actions
+ responsibility
+ Surface Target
+ device capabilities
+ network constraints
+ accessibility
+ current task context
~~~

and produce the appropriate Experience Surface.

It should NOT begin from:

~~~text
take desktop page
-> shrink it until it fits
~~~

This allows the same enterprise capability to yield radically different but semantically aligned mobile and desktop experiences.

## 24. Implementation sequence

### P0 — Cache correctness

- revisioned immutable JS asset URL space;
- shell ETag + revalidation;
- legacy non-versioned asset validator path;
- tests proving warm-cache 304 / immutable policy.

### P1 — Surface contract and resolver

- freeze Surface metadata contract;
- explicit support matrix;
- deterministic Surface Resolver;
- explicit user override;
- canonical cross-Surface deep links;
- unsupported Surface handoff.

### P2 — Surface-scoped loading

- route/surface code splitting;
- lazy desktop-heavy capabilities;
- intent-aware prefetch;
- mobile transfer budgets.

### P3 — Browser lifecycle

- bfcache certification;
- freeze/background recovery;
- weak-network behavior;
- stale read presentation rules.

### P4 — First mobile verticals

Prioritize:

1. Agent;
2. approvals/review queue;
3. notifications/exceptions;
4. KPI/entity inspection.

Do not port every desktop page.

### P5 — Advanced delivery

Only when measured need exists:

- selected PWA/offline Surfaces;
- cross-tab realtime coordinator;
- edge/CDN tuning;
- advanced streaming;
- surface-specific installability.

## 25. Core acceptance

This architecture is correctly adopted when:

1. browser static assets are not globally no-store;
2. a warm reload does not redownload unchanged JS bytes;
3. new deployments produce new immutable asset URLs;
4. authenticated snapshots remain Principal-safe;
5. desktop and mobile can resolve to different Experience Surfaces;
6. mobile support is explicit per Experience;
7. unsupported mobile operations fail into a useful handoff instead of broken responsive layout;
8. mobile and desktop share semantic Actions/resources without requiring identical page code;
9. bfcache/background lifecycle does not create polling or remount loops;
10. performance/network behavior is measurable by Surface.
