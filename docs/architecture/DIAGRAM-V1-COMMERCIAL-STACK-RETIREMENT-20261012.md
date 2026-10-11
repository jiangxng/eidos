# Eidos 2D Designer historical commercial PR stack retirement — 2026-10-12

> Owner-only maintenance for generic diagram. Does not modify Platform Host/Ledger/Agent or any product design behavior, and does not turn synthetic CI into formal 39-case customer acceptance.

## Research and mainline facts

- Eidos commercial core [#160](https://github.com/jiangxng/eidos/pull/160) merged to `main` at `3fde008f372bcbcaad45563f511c7b7cf1f8924e`; original merged PR source head was **`4302ee78ffd581274b603c3a020c633575693289`**. Later positional-lock fix [#171](https://github.com/jiangxng/eidos/pull/171) merged at `79e124d32fa5435a645968617d3147358518cb4f`.
- Of 29 *open* historical staged 2D PRs in `#130–#159` excluding Agent #142, **27 open PR source refs are provable ancestors** of source head `4302...` via GitHub compare (`behind_by=0`). The source head of #159 was already deleted after #160; PR #159 remains an open historical Draft. A separate docs-only side branch [#156](https://github.com/jiangxng/eidos/pull/156) has an extra independent commit, and **its unique recovery document** `docs/architecture/DIAGRAM-DESIGNER-CONTEXT-RECOVERY-20261010.md` is copied verbatim into this reconciliation PR. It must not be lost.
- Additional unmerged experimental ref `feat/diagram-obstacle-routing-b1-20261009` diverged from the staged commercial chain by two old commits, and modern `main` has more extensive routing already. Archive its exact original tip as a Git parent for provenance; do not forward-port obsolete source wholesale.
- The staged PRs are **history**, not 29 missing commercial features. After a dedicated history-only integration, close those draft/open PRs as superseded by #160, preserve linkable PR reviews/comments/source head commits, and delete only explicitly SHA-pinned source refs with ancestry proven in modern `main`.
- Preserve independent non-diagram feature branches, e.g. Agent `agent/pa01b2-contextual-refresh-20261010`, Workbench and Eidos catalog/gallery separate feature heads; do not invent their completion.
- Per original 2D Designer v1.0 §14, machine subcase evidence is 39/39 across Platform integration; customer/physical-device formal signoff remains **0/39**. This cleanup does not claim deployment, accessible physical touch devices or product go-live.

## Exact historical archive and deletion control

The accompanying [ref manifest](../../repository-hygiene/diagram-v1-eidos-stacked-head-retirement-20261012.json) is a snapshot of all 29 live or already-absent historical staged PR heads plus one older standalone experiment. It records PR number/head commit, current live SHA and expectation. **No main runtime files are copied from old heads**: the top checkpoint `4302...`, independent #156 head and old obstacle-routing head are incorporated as extra parents to a commit whose tree is byte-identical to this maintenance branch before history incorporation. This is an explicit *ours/history-only* merge; it is not a claim that #156's or the experiment's old functionality was product-shipped.

After current main merge, GitHub Actions validates parent ancestry, exact live SHA, allowed PR numbers, no external open PR dependencies, no protected refs, then closes precisely the 29 superseded open historical PRs and deletes only the historical source refs still present (plus this maintenance branch). A closed PR, existing #160 integration and merged parent lineage remain traceable.

## Sources

- [#160 primary merged Eidos core](https://github.com/jiangxng/eidos/pull/160)
- [#171 merged positional lock](https://github.com/jiangxng/eidos/pull/171)
- [#156 side-branch research recovery](https://github.com/jiangxng/eidos/pull/156)
- Eidos GitHub compare refs to original #160 head `4302ee78...` per pinned branch manifest
