# Eidos Generic Grouped Form Review — Human UI Design Review (2026-10-16)

## Experience owner and source files
Reusable Eidos UIDL Form contract, validator, render model and HTML renderer are the owner, with Eidos Productive Design Language token-based CSS. Changed files: `src/runtime/contracts.ts`, `src/runtime/validate.ts`, `src/runtime/render-model.ts`, `src/renderers/html/index.ts`, `src/design-language/productive-workbench-css.ts`. This is **not a BEX application page** and does not own a business importer or business storage.

## Human intent and navigation
The user scans many peer decisions without hunting through dozens of full-width independent input sections. Each review group preserves one directly operable primary select while optional supporting inputs remain available via a keyboard-accessible native disclosure. Plain form fields and existing action navigation keep their current behavior. No navigation rewrite or special one-off application route.

## Information hierarchy and cognitive load
A title and bounded source summary identify each group; primary choice is never inside collapsed details. Supporting form fields remain exactly one per declared key and belong to that group, accessible by expanding “Details”. A user may review or change a secondary field without losing the current choice; collapsing never drops input values or changes action IDs.

## Visual and typography
Token-based Eidos spacing, muted text, boundaries and focus outlines. Two-column desktop primary decision layout and one-column narrow-screen layout; no fixed pixel widths beyond a responsive threshold. No custom colors, product logos, glyphs or per-client CSS; Eidos owns all generic styling.

## Accessibility and responsive
Native `details/summary` has keyboard and assistive technology semantics. All fields keep visible labels; focus visibility is explicit. No important state communicated solely by color, no pointer-only controls, no disappearing primary submit. At narrow width content stacks and text wraps, preventing long sample strings from forcing horizontal scrolling. Programmatic contract tests do not replace real browser/Human visual acceptance.

## Safety, action integrity and recovery
UIDL validator refuses unknown group field references, duplicate group IDs, multiple group ownership or primary/details reuse. The ordinary Form ActionRequest still captures the exact same field keys, confirmation and Host-executed command, so groups never become an alternate authorization/execution path. HTML values are escaped. Business-specific requirements (Excel, field mapping, create/ignore, duplicate names, user authority) stay in the Platform consuming Experience.

## Verification and unresolved
- Run Eidos `npm run release:check`, Human UI review gate and grouped contract tests.
- Follow with separate Platform vendor snapshot consumption, its real Host Chromium 20-column review and phone/desktop tests.
- This is a reusable **framework** interaction and not a product signoff or a direct Eidos-to-business write API.
