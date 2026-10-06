# Eidos Productive Design Language v0.1

**Status:** P0 design authority  
**Date:** 2026-09-25  
**Applies to:** App Host, Workbench, Eidos capabilities, and plugin-contributed human interfaces

**Design entry point:** `docs/product/EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md`

## Visual revision

The current normative visual realization is `EIDOS-BUSINESS-OFFICE-VISUAL-LANGUAGE-v0.2.md`. This v0.1 document remains authoritative for productive interaction hierarchy, density, accessibility and capability behavior; where visual character differs, the Business Office v0.2 revision wins.

## Authority relationship

The Productive Design Language is the visual/interaction realization layer below the **Eidos Experience Architecture Constitution**.

Authority: `docs/product/EIDOS-EXPERIENCE-ARCHITECTURE-CONSTITUTION-v0.1.md`.

A page is not product-complete merely because it matches Eidos visual tokens. Page archetype, Human goal, state-aware actions, journey continuity, direct manipulation, feedback, recovery and Agent boundaries are defined by the higher-level Experience Architecture authority.

## Purpose

Eidos owns the visual/interaction language used by EVO App Host and plugin Experiences.

The goal is not to imitate one product. The goal is a coherent, productive enterprise workbench that remains familiar, dense, accessible, responsive and extensible as hundreds of plugins are installed.

## Reference stack

Eidos adopts compatible lessons from mature systems:

- **VS Code UX Guidelines** — Workbench information architecture, Activity Bar/View Container/View separation, contextual toolbars, extension contribution discipline.
- **Microsoft Fluent 2** — 4px spacing rhythm, responsive composition, alignment, hierarchy through spacing.
- **IBM Carbon** — enterprise/productive density, one-primary-action hierarchy, low-emphasis toolbar actions, explicit danger styling.
- **Apple HIG** — toolbar grouping and placement semantics: navigation/structure on the leading side, context/search in the middle, important actions/overflow on the trailing side.
- **W3C WAI-ARIA APG** — keyboard/focus behavior and semantic interaction patterns.
- **ACM SIGCHI / CHI / UIST** — long-term HCI research source for interaction quality and new interface paradigms.
- **UX StackExchange** — secondary practice source for recurring interaction-design questions; never overrides standards or Eidos invariants.

Research source catalog: `docs/product/DESIGN-RESEARCH-SOURCES-v0.1.md`.

## Source priority

When sources disagree:

1. accessibility/security/platform constraints;
2. Eidos product invariants and tested user behavior;
3. mature design-system guidance;
4. HCI research evidence;
5. community conventions;
6. visual fashion.

Do not copy a visual trend merely because it is popular.

## Design character

Eidos interaction foundation remains **productive, quiet and precise**; the current visual character is **business, calm, approachable, productive and trustworthy**.

- dense enough for enterprise work;
- restrained chrome so business content remains dominant;
- stable positions for recurring actions;
- low visual noise;
- visible state and focus;
- progressive disclosure instead of permanent clutter;
- motion only when it communicates state or spatial continuity.

## Spatial system

Use a 4px base rhythm.

Preferred spacing values:

`2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48`.

Rules:

- 4/8px for tightly related controls;
- 12/16px for component interiors;
- 20/24px between meaningful sections;
- 32px+ only for major separation or empty-state emphasis;
- text aligns to stable left edges; icons align optically inside fixed hit targets;
- spacing expresses grouping before borders do.

## Workbench anatomy

Canonical desktop hierarchy:

```text
Activity Bar | Primary Side Panel | Main Workspace
                                  | optional contextual/secondary surfaces
---------------------------------------------------
Status Bar
```

Rules:

- Activity Bar selects a View Container/workspace context; it is not duplicated application navigation.
- Side Panel contains navigation, trees, chat, search or contextual Views.
- Main Workspace contains the user's primary task.
- Supporting information must not steal permanent width unless it is repeatedly needed.
- Panels are resizable/hideable where task continuity benefits.
- Mobile becomes one visible working surface plus persistent context/navigation affordance.

## Toolbar placement

Toolbars are contextual, not global dumping grounds.

Preferred order:

```text
leading: navigation / back / sidebar structure
middle:  title / current context / search or address
trailing: frequent contextual actions / primary action / overflow
```

Rules:

- keep stable actions in stable positions;
- group actions by function;
- maximum roughly three visible logical groups;
- move low-frequency actions into overflow/context menus;
- icon-only controls require an accessible name and tooltip/title;
- do not mix navigation and destructive actions in one visual group.

## Button hierarchy

Within one action scope:

- at most **one primary** action;
- supporting actions use tertiary/ghost/quiet treatment;
- destructive actions are explicit and visually distinct, but should not visually dominate unless destruction is the workflow's primary purpose;
- navigation should normally look like navigation, not a high-emphasis button;
- labels describe the next result with short active language;
- icon-only actions are reserved for familiar symbols or space-constrained toolbars.

Placement:

- page/form primary action: trailing edge of its action row on wide layouts;
- navigation/back/sidebar controls: leading edge;
- contextual tools: nearest contextual toolbar;
- destructive secondary actions: separated from the primary forward action;
- mobile: preserve semantic order even when actions stack.

## Density and hit targets

Desktop enterprise mode is compact/productive, but hit targets remain operable.

- compact visual control: typically 32–36px high;
- Activity Bar target: 48px desktop;
- touch/mobile interactive target: minimum 44px;
- avoid reducing hit target merely to make the interface appear denser.

## Typography

Default hierarchy:

- 11px: status/meta/compact chrome;
- 12–13px: dense supporting UI;
- 14px: normal controls/body in Workbench;
- 16px: card/section title;
- 20–24px: page-level title only.

Use weight and spacing before adding more colors.

## Color

Color is semantic before decorative.

- neutral surfaces dominate;
- accent indicates focus/selection/primary action;
- success/warning/danger only communicate state;
- do not invent plugin-specific chrome colors for ordinary product surfaces;
- plugins inherit host theme/tokens unless a capability explicitly allows branded content.

## Plugin UI rule

Plugins contribute semantics; Eidos owns normal visual realization.

A plugin should declare:

- Experience structure;
- actions and their semantics;
- settings;
- Workbench Activity/View contribution;
- status/tone where contractually supported.

A plugin should not hard-code its own competing:

- spacing scale;
- button hierarchy;
- shell layout;
- toolbar geometry;
- focus treatment;
- standard form styling.

Custom visual experiences are allowed only when the domain genuinely requires them and must still preserve accessibility, theme and host interaction invariants.

## Accessibility

Prefer native HTML semantics.

Do not add ARIA roles unless the expected keyboard behavior is also implemented.

Required:

- visible keyboard focus;
- deterministic tab/focus order;
- accessible labels for icon-only controls;
- no color-only state communication;
- keyboard-operable lifecycle actions and menus;
- focus recovery after dialogs/transient surfaces;
- mobile/touch target compliance.

## Responsive model

Use responsive **reflow and re-architecture**, not desktop shrinking.

- desktop: multi-pane;
- tablet: reduce simultaneous secondary surfaces;
- mobile: one active work surface with preserved state;
- low-priority actions move to overflow rather than wrapping into visual noise.


## AI conversation surfaces

Agent chat is a productive work surface, not a social-message imitation.

Default pattern:

- assistant output uses the reading surface directly instead of wrapping every answer in a heavy card or bubble;
- assistant/system prose may use **safe Markdown** for headings, emphasis, lists, tables, quotes, links and code; Eidos owns the renderer and typography so every Agent does not invent its own rich-text stack;
- raw HTML from model output is never interpreted as trusted UI; it is escaped, and unsafe link schemes remain inert;
- Human-authored chat input is preserved literally by default rather than silently reinterpreted as formatted output;
- Human messages may use a restrained, right-aligned surface so turn boundaries remain easy to scan;
- execution activity, evidence and proposals remain semantically distinct from prose and visually subordinate to the main answer;
- thread/history controls belong in the chat header and use quiet toolbar treatment;
- the composer stays visually anchored near the conversation edge, may use a floating bordered surface, and must not cause transcript geometry to jump during ordinary state refresh;
- composer focus is visible but should not flood the whole pane with accent color;
- long-running conversations favor stable scroll position, predictable message width and minimal chrome;
- passive recovery/hydration must not cause visible remount loops or repeated transcript replacement when content has not changed.

The intended character is contemporary AI workbench: calm, content-first and operationally transparent.

Do not default to:

- avatars for every message;
- large colored assistant bubbles;
- permanent tool-debug output mixed with prose;
- decorative gradients or motion without state meaning;
- rebuilding the entire chat surface for background polling or recovery.


## Review and decision surfaces

Review is a judgment workspace, not a generic form.

Default pattern:

- Human-readable title, summary and status establish what decision is required;
- evidence and confidence/context metrics support the decision without dominating it;
- editable review fields are visually grouped from evidence;
- deterministic review actions remain directly operable;
- one forward/accept action is primary and occupies the trailing decision position;
- reject/destructive alternatives remain visually separate from the primary forward action;
- machine IDs, enum values, receipts, test names and diagnostics use collapsed **Technical details** unless they are themselves the subject of the review;
- attention states may use a semantic warning edge/status, but avoid turning every review item into an alarm;
- mobile preserves decision order and makes the primary action easy to reach.

System-generated review copy is localizable. Business/user-authored evidence content is preserved as authored unless the product explicitly provides translation.

A Review capability that exposes raw machine identifiers as its main Human explanation is not Design Language compliant.

## Settings information architecture

New configuration surfaces should prefer the grouped Settings Editor capability when multiple concerns are present.

Recommended grouping for Provider-style configuration:

```text
Runtime / model selection
Credentials
Governance / administrator authorization
Runtime status / diagnostics
Advanced
```

Rules:

- ordinary runtime values and sensitive credentials are visually separated even when submitted through one Host action;
- secrets remain non-readable after save and expose state through semantic status, not echoed values;
- administrator/bootstrap authorization is advanced governance UI and should not visually compete with normal configuration;
- health/resolution/status is read-only state, not presented as an editable setting;
- advanced and low-frequency controls use progressive disclosure;
- settings rows may use a compact two-column desktop layout, but reflow to one column on narrow screens;
- one save action owns the form scope; avoid a primary button per settings group.


## Governance

Design decisions that introduce a new reusable pattern belong in Eidos first.

A fresh LLM modifying Workbench or a plugin Experience MUST read this document and the machine-readable tokens before inventing new layout/button conventions.

Visual consistency is product behavior, not optional polish.


## Icon language

Eidos owns the standard icon language used by Workbench and standard plugin surfaces.

Authority: `docs/product/EIDOS-ICON-SYSTEM-v0.1.md`.

Rules:

- standard UI uses semantic Eidos icon names rather than raw Unicode glyphs or plugin-owned SVG;
- icon geometry follows the Eidos 24×24 productive stroke system;
- icon-only controls require accessible labels and tooltips;
- plugins inherit the Eidos icon registry by default;
- third-party icon libraries are not a default dependency;
- brand icons are governed separately from ordinary product icons;
- the registry grows additively as new business domains require new semantics.
