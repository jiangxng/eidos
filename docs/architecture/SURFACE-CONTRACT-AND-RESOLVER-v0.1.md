# Surface Contract and Resolver v0.1

**Status:** Architecture + implementation baseline  
**Owner:** Eidos App Host  
**Parent authority:** `WEB-DELIVERY-AND-SURFACE-ARCHITECTURE-v0.1.md`

## 1. Purpose

Eidos separates enterprise semantics from device-specific presentation.

A single Experience may expose multiple Surface implementations that share the same Host Resources and Actions while using different routes, pages and interaction models.

This contract exists so that desktop/mobile divergence is deterministic rather than CSS-accidental.

## 2. Surface Targets

Initial targets:

- `DESKTOP_WORKBENCH`
- `MOBILE_TASK`
- `MOBILE_READ`
- `TABLET_WORKBENCH`

Targets are presentation/runtime targets only. They MUST NOT be used as authorization or business truth.

## 3. Support levels

Each declared Surface has one support level:

- `FULL`
- `TASK_FOCUSED`
- `READ_ONLY`
- `UNSUPPORTED`

`UNSUPPORTED` is a valid declaration. It means the Host should produce a deterministic handoff rather than force another Surface implementation.

## 4. Manifest extension

`EffectiveExperienceManifestV010` may optionally contain `surfaces[]`.

Each Surface declares:

- stable `id`;
- target;
- support level;
- `entryRoute` when supported;
- optional `fallbackSurfaceId`.

Legacy manifests without `surfaces` remain valid and are treated as desktop-only for Surface resolution.

## 5. Route semantic identity

`AppHostRouteV010` may optionally contain:

- `surfaceId`;
- `semanticId`.

`semanticId` identifies the logical navigation destination across Surface implementations.

Example:

```text
semanticId = orders.home

DESKTOP_WORKBENCH
  /orders

MOBILE_TASK
  /m/orders
```

These routes may load unrelated page definitions while remaining the same semantic destination.

If `semanticId` is omitted, route `id` is its semantic identity.

## 6. Navigation scoping

Navigation items may optionally declare `surfaceIds[]`.

Navigation without `surfaceIds` is shared.

This enables mobile and desktop to expose different navigation sets without duplicating enterprise semantics.

## 7. Client capability profile

Surface inference uses browser capabilities, not User-Agent strings.

The baseline profile includes:

- viewport class;
- coarse/fine/no primary pointer;
- hover;
- touch availability;
- reduced-motion preference;
- standalone display mode.

Current viewport classes:

```text
< 768px    -> COMPACT
768..1199  -> MEDIUM
>= 1200    -> EXPANDED
```

Capability inference is deterministic:

- compact or coarse pointer -> `MOBILE_TASK`;
- medium touch -> `TABLET_WORKBENCH`;
- otherwise -> `DESKTOP_WORKBENCH`.

This is only a default. Explicit URL/user choice has higher authority.

## 8. Resolution precedence

Resolver precedence is:

1. explicit URL Surface target;
2. explicit user Surface preference;
3. browser capability profile;
4. deterministic desktop default.

The requested Surface must then be checked against the Experience declaration.

There is no silent fallback from an unsupported phone Surface into a desktop editor.

## 9. URL representation

The initial explicit URL presentation parameter is:

```text
?surface=desktop
?surface=mobile-task
?surface=mobile-read
?surface=tablet
```

This parameter is presentation context only.

Semantic subject/query state remains independent and should be preserved when crossing Surfaces.

## 10. Resolver results

Resolution returns one of:

### ROUTE

A supported Surface and route were deterministically selected.

The result includes:

- selected target;
- support level;
- Surface id;
- route;
- semantic route id;
- selection source.

### HANDOFF

The semantic destination exists or was requested, but the target Surface cannot safely fulfill it.

Reasons include:

- legacy Experience is desktop-only;
- target Surface not declared;
- target explicitly unsupported;
- semantic route unavailable on target Surface.

The result exposes available targets and optional fallback Surface id.

### NOT_FOUND

No route or semantic destination can be resolved.

Handoff is different from 404. Handoff means the product understands the intent but does not support that operation on this Surface.

## 11. Fail-closed validation

Manifest validation rejects:

- duplicate Surface ids;
- duplicate targets inside one Experience;
- invalid target/support values;
- supported Surface without entry route;
- entry route missing from the same manifest;
- entry route scoped to another Surface;
- route referencing unknown Surface;
- navigation referencing unknown/duplicate Surface ids;
- fallback referencing unknown Surface;
- fallback cycles.

The Host must never resolve ambiguous Surface topology by declaration order.

## 12. Legacy compatibility

A manifest without Surface metadata:

- remains fully valid;
- resolves normally on `DESKTOP_WORKBENCH`;
- does not automatically claim mobile support;
- produces `LEGACY_DESKTOP_ONLY` handoff when an explicit/inferred mobile target is requested through the Surface resolver.

This prevents existing responsive CSS from becoming accidental architectural mobile support.

## 13. Deep-link preservation

Cross-Surface navigation should preserve:

```text
Experience
+ semanticRouteId
+ subject/resource identity
+ safe query/context presentation state
```

The target route path may change.

The resolver maps semantic route identity to the appropriate Surface-specific route.

## 14. Browser Host integration rule

Browser/App Host integration should:

1. read explicit Surface target from URL;
2. read user override if present;
3. create capability profile;
4. resolve Surface;
5. navigate to the selected route or render a deterministic handoff;
6. avoid redirect loops;
7. preserve semantic deep-link state.

The resolver itself remains backend-independent.

## 15. Acceptance

P1 is accepted when:

1. legacy manifests remain compatible;
2. new manifests can declare multiple Surfaces;
3. same semantic route resolves to different desktop/mobile paths;
4. explicit URL target wins over user/capability inference;
5. capability inference does not depend on User-Agent;
6. unsupported target returns HANDOFF, not hidden desktop fallback;
7. invalid Surface topology fails closed;
8. Surface identity remains presentation-only;
9. public Eidos tests prove all above behavior.

App Platform adoption and first mobile Experience are separate downstream steps.
