# Residual Branch Reconciliation — 2026-09-30

Status: complete  
Authority: repository hygiene decision  
Canonical branch: `main`

## Decision

The twelve residual branches left after merged-PR cleanup are retired. None remains an authoritative development line.

## Classification

### Absorbed or superseded

- `app-host/browser-lifecycle-resilience-v0.1` — superseded by merged Browser Lifecycle/Resilience PR #59 and Web Runtime Stability PR #70.
- `app-host/surface-contract-resolver-v0.1-mainline` — PR #66 was explicitly closed as redundant because current main already contained the Surface contract/resolver capability.
- `app-host/surface-contract-resolver-v0.1-rebase` — no commits ahead of main.
- `assistant-four-locale-chrome` — no commits ahead of main.
- `chat-action-locale-context` — PR #30 was superseded; current main already sends active locale with Chat actions.
- `workbench/surface-observability-v0.1` — current Workbench exposes resolved Surface target/id and has stronger runtime observability.
- `eidos/app-host-action-executor-v0.1` — historical implementation line absorbed by later App Host convergence into main.
- `eidos/pure-frontend-positioning-v0.1` — historical intermediate line absorbed by the current Eidos architecture.

### Rejected old boundary

- `app-host/context-header-from-active-context` — the old branch embedded an EVO-specific transport header inside generic Eidos App Host infrastructure. The implementation is retired. Future context propagation must use an Eidos-neutral transport/context contract.

### Intent retained; implementation retired

- `components/task-inbox-availability-v0.1` — the semantic distinction between “no work” and “work source unavailable/degraded” remains useful. The old branch predates the current localization/presentation boundary and is not merged as-is. Reintroduce only through the current Task Inbox and presentation contracts when needed.
- `performance/surface-scoped-loading-v0.1` — surface-scoped/lightweight loading remains a valid performance concern. The old branch was partial and predates the current stable Surface lifecycle/runtime architecture. Revisit under the current performance/runtime baseline instead of reviving this branch.

### Historical convergence harness

- `convergence/upstream-readiness-v0.2.1` — PR #1 targeted an older baseline and an external fixture dependency that never became current Eidos authority. The PR is retained as historical evidence, but the branch is retired.

## Rule

Retired branches are references, not product authority. Their useful ideas must be reintroduced from current `main` under current invariants, contracts, tests and localization/runtime rules. Do not revive these branches by merging or rebasing them wholesale.
