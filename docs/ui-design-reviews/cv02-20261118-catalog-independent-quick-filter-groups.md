# CV-02 List Foundation · Eidos multiple independent quick filters (2026-11-18)

## Product/UX scope

Eidos Catalog Browser previously supports only one `quickFilters` group. Existing Counterparty pages need two independent groups (**Status** and **Subject type**) while preserving server-side search, pagination, column layouts and row authorization. This update adds an **optional shared Eidos presentation contract** `table.quickFilterGroups` (2–4 groups) rather than business-specific HTML or a second List framework.

| Surface | Expected interaction | Owner of authoritative result |
| --- | --- | --- |
| Desktop 1280px | Two separate, clearly labelled `nav` groups; current choice visibly selected; Tab/Enter operate each native button | Domain/Host via local route |
| Narrow mobile 390px | Each group wraps; each button at least 44 × 44 CSS pixels; no horizontal overflow from forced single line | Domain/Host re-query |
| Keyboard/assistive tech | Each `nav` has its own `aria-label`; selected button uses `aria-current="page"`; `:focus-visible` keeps a 2px outline | Eidos markup only |
| Legacy | Single `quickFilters` unchanged; absent groups keeps old table/card behavior | Existing caller |

## Exact ownership / trust boundary

- `quickFilterGroups` is **not** a query DSL, permission source, saved view, or client-side table filter. The business Owner generates every scoped **local route**, including the other currently selected predicates and search state; navigating always causes Host/Domain reauthorization before any result or total is calculated.
- Eidos validates 2–4 groups, 2–8 unique options per group, unique bounded group identifiers, exactly **one** selected option per group, bounded local routes, and rejects simultaneous old/new filter contracts to avoid ambiguous selections. Reject external, protocol-relative, backslash, control chars, duplicate IDs, missing labels.
- Groups share existing Eidos Catalog navigation/actions and Productive Design Language tokens. No new visual layer, inline arbitrary HTML, private plugin CSS, model selection or business database dependency.
- Buttons wrap on mobile, use `--eidos-touch-target` (44px), and preserve semantic selected/focus states. This review assesses concrete component implementation; **it does not constitute physical phone, NVDA/VoiceOver or independent Human acceptance**.

## Verification, rollback and missing evidence

- Automated regression: rendering of two groups with independent selected buttons, search/other filter route retention, legacy single-group unchanged, bad route/duplicate/missing or ambiguous group **fail closed**, CSS token/selector checks; `npm run release:check` + UI Gate on exact PR HEAD.
- Downstream Platform must separately prove real Enterprise/role/field authorization, true three-way `search AND status AND subjectType` *before* totals/pagination, identical Human/Agent READ and page CSV, browser navigation and revoked/disabled cases.
- Rollback: stop passing `quickFilterGroups` and existing `quickFilters` continues to work. No database migration, credentials, feature gates or source-of-truth update.
- Not claimed: actual independent physical devices or external Human signoff, online model inference, production authorization, CV03 Saved View WRITE or CV04 background EXPORT.
