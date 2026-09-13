# Upstream Provenance

The protected historical source baseline used for Architecture Convergence is:

`jiangxng/eidos@55da1bd95a960132bbce10346b30cb40cafe51cf`

The baseline contains existing assets across:

- core VNode/render/store/router/form
- AdvancedForm / AdvancedTable
- TreeSelect / DatePicker / Upload / Dialog
- auth/RBAC
- data managers and adapters
- layout regions/blocks/menu/theme/generator
- playground modules
- build scripts and historical documentation

This reference package preserves the source-level convergence assets already migrated into the candidate and records the upstream commit as the protected provenance point.

It is intentionally not described as a byte-for-byte Git repository archive. Architecture Convergence follows:

> Preserve implementation assets; correct architectural boundaries.

When importing additional historical files from upstream, do not automatically grant them canonical status. Classify them as legacy, candidate or stable according to the Constitution and Capability admission rules.
