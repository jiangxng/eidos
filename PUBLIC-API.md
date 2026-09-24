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

## Package entry point

The repository package exports the converged public API from `@eidos/reference`. Git/package consumers must use the public package entry point instead of importing private source paths. The public entry point includes `renderToHtml` for the supported UIDL form profile.

### `renderCatalogBrowserToHtml(model)`
Reference HTML renderer for the generic `catalog-browser` capability. The host supplies catalog truth/status/actions and remains responsible for executing requested actions.
