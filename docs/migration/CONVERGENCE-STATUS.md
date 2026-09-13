# Architecture Convergence Status

## Implemented by this overlay

- AC-1A candidate authoritative docs + context manifest.
- Contract provenance decision: 0.1.0 blocked, corrected strict profile versioned as 0.1.1.
- Pure DOM/network-free UIDL runtime with structured diagnostics.
- Versioned RenderModel and ActionRequest.
- Required/type/range/pattern/select/read-only/unknown-key value validation.
- Deep JSON snapshot boundary.
- Reference HTML renderer.
- VNode bridge public contracts and host ActionHost/QueryHost ports.
- Contract tests and context checks.

## Deliberately not claimed as complete

- Existing protected source-level defects (legacy typecheck/import/event/boolean/listener issues) are not changed by this overlay because the protected repository source was not available in the execution environment.
- Concrete VNode bridge implementation against the current core/components must be completed inside the protected repository.
- UIDL 0.1.0 compatibility remains blocked pending public contract identity confirmation.

## Next source-level PRs

1. AC-2A legacy strict typecheck/import baseline repairs only.
2. AC-2B event update / boolean property / onChange / TreeSelect action parsing / lifecycle fixes.
3. AC-4 concrete VNode control registry and sales-order vertical slice behind a route flag.
4. AC-5 host/data/auth/generator boundary facades.

## TreeSelect correction (v0.2 candidate)

- Replaced hidden store discovery/subscription with pure controlled state.
- Replaced underscore parsing with deterministic encoded event envelopes.
- Added pure reducer, local search, disabled handling, optional descendant cascade, and compatibility rendering adapter.
- Kept TreeSelect out of UIDL 0.1.1 until hierarchical reference/options are formally versioned.
