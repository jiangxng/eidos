# Eidos v1.0 commercial Diagram branch retirement — verified outcome (2026-10-12)

**Result: historical source refs retired; Eidos generic Diagram main remains current.** This records live GitHub state after the two 2026-10-12 cleanup merges. It does not change runtime, business version policy, or formal commercial acceptance.

## Actual merges and history preservation

- [Eidos #160](https://github.com/jiangxng/eidos/pull/160) had already brought generic commercial Diagram core into main; [#171](https://github.com/jiangxng/eidos/pull/171) provided position pin/auto-layout hardening.
- [#172](https://github.com/jiangxng/eidos/pull/172) merged at `99cf0dbd15cb265823730180ca591f1440612261`; it restores the independent #156 research document `DIAGRAM-DESIGNER-CONTEXT-RECOVERY-20261010.md`, audits the 29 historic staged PRs #130–#159 (excluding unrelated Agent #142), and incorporates original #160 source checkpoint / unique #156 and routing-experiment commits as historical Git parents, preserving code provenance without an old working-tree overwrite.
- [#173](https://github.com/jiangxng/eidos/pull/173) merged at `9835ca35b173867761d9fbe670c3d963739e5fe5`; it added a strictly limited merged-PR close event to run the retirement.
- On the verified final enumeration, Eidos main remained `9835ca35b173867761d9fbe670c3d963739e5fe5` and **six** branch refs existed: `main`, `agent/pa01b2-contextual-refresh-20261010`, `feat/catalog-detail-gallery-actions`, `feat/workbench-global-session-controls-v01`, `feat/2d-core-workbench-primitives`, `improve/agent-chat-interactions-v01`. **Zero of the 29 former stacked 2D PR branches and zero of the old routing experiment or maintenance refs remained.**
- Only [PR #142](https://github.com/jiangxng/eidos/pull/142) (Agent) remained open; the 29 targeted 2D stage PRs were all closed or merged (GitHub auto-marked #130 merged).

## Exact execution outcome; do not falsify CI

The post-merge closed-event [workflow #38156910421](https://github.com/jiangxng/eidos/actions/runs/38156910421) **shows FAILED**, despite applying the intended cleanup:

- The run log explicitly records **28** `EIDOS_STAGED_PR_CLOSED` and **1** `EIDOS_STAGED_PR_ALREADY_MERGED` (the #130 auto-merged after historical ancestry convergence); #159's original source branch had already been removed.
- The run log explicitly records **28** `EIDOS_LEGACY_REF_DELETED`. Other maintenance refs were removed automatically by GitHub as merged PR branches. Independent final GitHub `/branches` enumerations verified zero scoped historical refs and the six retained branch names above.
- After those deletes, the script attempted to re-check `chore/diagram-v1-commercial-stack-retirement-20261012`, which GitHub had independently auto-deleted, receiving an HTTP 404. Hence this workflow's terminal result is **failure after partial execution with fully verified desired end-state**, NOT a CI-success claim.
- Prior to merge, [#172](https://github.com/jiangxng/eidos/pull/172) and [#173](https://github.com/jiangxng/eidos/pull/173) independently passed Eidos `release-check` and audit-only checks. The old cleanup workflow is retired from current main to avoid repeat execution against absent refs; it remains recoverable in #173 and main history.

## Scope and remaining limitations

Platform old 12 branches were similarly history-reconciled and deleted by [Platform #780](https://github.com/jiangxng/EVO-App-Platform/pull/780), with an actual successful main-run [#38156172588](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38156172588). Historical experimental UI ideas **not adopted** into current product remain named and archived in Platform's `DIAGRAM-V1-12-LEGACY-HEADS-RECONCILIATION-20261012.md`.

Browser-automation subcase evidence is associated with all 39 original v1.0 acceptance cases; **formal customer/real-device signoff remains 0/39**. No deployment, customer release, new business definition version or regression-free performance SLA is inferred from branch retirement.
