# Eidos Productive Design Language v0.1

**Status:** P0 design authority  
**Date:** 2026-09-25  
**Applies to:** App Host, Workbench, Eidos capabilities, and plugin-contributed human interfaces

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

Eidos default character is **productive, quiet and precise**.

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
