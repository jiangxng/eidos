# Eidos Public API — Converged

## Existing APIs
Existing `createStore`, `createApp`, `createRouter`, `renderIf`, `createErrorBoundary`, form/components/data/auth/layout and generator exports remain compatibility assets. Their signatures are not replaced by UIDL.

## New runtime API

### `validateUidl(document: unknown): ValidationResult`
Strictly validates the supported UIDL contract and fails closed with structured diagnostics.

### `assertValidUidl(document: unknown): UidlFormV011`
Returns a typed document or throws `UidlValidationError` containing structured diagnostics.

### `toRenderModel(document: unknown): FormRenderModelV010`
Produces a deterministic, versioned serializable model. No DOM or network effects.

### `validateValues(document: unknown, values: unknown): ValueValidationResult`
Checks UI-contract constraints only: required/type/min/max/pattern/select membership/read-only submission policy/unknown keys.

### `createActionRequest(document: unknown, values: unknown, context?): ActionRequestV010`
Creates a deep JSON snapshot for exactly one submit action. It never performs business execution.

### `renderToHtml(document: unknown): string`
Reference renderer for the supported form profile only.

### `renderToVNode(model, registry, context)`
Bridge contract for existing VNode/components. The initial overlay defines the port/types; project-specific binding is implemented without importing EVO/XC internals.

### `ActionHost`
Host execution port. Confirmation/authorization/execution occur outside runtime.


## App Host API

### `createAppHost(source)`
Creates a backend-independent App Host runtime for effective active Eidos experiences.

The supplied `ExperienceSource` exposes only:

- `listEffectiveExperienceManifests()`
- `loadPage(page)`

The returned host exposes:

- `refresh()`
- `getSnapshot()`
- `resolveRoute(path)`
- `loadRoute(path)`
- `subscribe(listener)`
- `dispose()`

App Host validates manifests, assembles deterministic navigation/routes, rejects ambiguous cross-package conflicts and lazily loads page definitions. It does not install Packages or activate Features.
