# Eidos Business Office Visual Language v0.2

**Status:** Normative visual revision  
**Applies to:** desktop Workbench, mobile Workbench, standard Eidos capabilities, and plugin-contributed business interfaces

## Product character

Eidos is an enterprise business operating environment, not a developer console.

The default visual character is:

- professional without feeling bureaucratic;
- calm and trustworthy;
- approachable enough for everyday office work;
- productive without looking compressed or technical;
- content-first, with framework chrome visually subordinate to business information.

The reference category is modern business productivity software. Mature systems such as Microsoft Fluent / Microsoft 365, SAP Fiori Horizon, Salesforce Lightning and Atlassian may inform patterns, but Eidos does not copy their brand identity or proprietary assets.

## Color system

Neutral surfaces establish hierarchy.

- page canvas uses a soft neutral;
- primary content surfaces remain white;
- chrome is close to white and should visually recede;
- brand blue is reserved for selection, focus, links and primary actions;
- success, warning and danger colors communicate state only;
- plugins do not introduce a competing palette for standard controls.

Domain/application colors are allowed for application identity, category recognition, diagrams and charts. They do not recolor ordinary shell controls.

## Surface hierarchy

The visual stack is intentionally shallow:

1. soft neutral canvas;
2. white content/card surfaces;
3. lightly raised transient surfaces such as menus and sheets;
4. stronger elevation only for modal/blocking overlays.

Borders are subtle. Spacing and surface contrast establish grouping before heavy rules do.

Cards use soft radii and very light elevation. They should feel like office documents/modules, not dashboard widgets floating in space.

## Desktop Workbench

Desktop retains the Eidos Workbench information architecture, but its realization is business-oriented:

- Activity navigation uses a light rail and rounded selected state instead of an IDE-style selected edge;
- ordinary Activity icons are monochrome; active selection receives the brand tone;
- internal application routes do not expose an address bar by default;
- the bottom technical status bar is hidden in normal business use;
- Side Panel headings use natural casing instead of uppercase technical chrome;
- global enterprise/user/language controls remain quiet and compact;
- technical status, identifiers and runtime diagnostics use progressive disclosure.

The result should feel closer to an office suite / ERP workspace than a code editor or admin console.

## Mobile Workbench

Mobile preserves the same business visual language:

- bottom navigation shows both icon and short text label;
- selected navigation uses a soft brand-tinted surface;
- top global context chrome remains compact;
- page canvas becomes effectively full-width;
- cards and forms use comfortable touch spacing;
- system text scaling and user text-size preference remain authoritative;
- account/details use a raised bottom sheet.

## Typography

Use platform-native office fonts before web-fashion fonts.

Preferred stack:

- Apple system font on Apple platforms;
- Segoe UI on Windows;
- Microsoft YaHei UI / PingFang SC / Noto Sans SC for Chinese fallback;
- generic sans-serif last.

Normal body text remains productive, while page titles and section titles have enough scale to feel like business documents rather than developer panes.

## Icons

Standard interface icons:

- use the Eidos semantic registry;
- use a consistent 24x24 geometry;
- use a slightly stronger rounded stroke for legibility;
- are monochrome by default;
- inherit brand color only when selected or emphasized;
- do not contain decorative multi-color fragments.

Application/domain/product identity may use one of the governed Eidos accent colors or a separately governed brand asset. This color is identity, not control state.

On mobile bottom navigation, every primary icon must have a visible short label.

## Buttons and fields

Primary actions use Eidos brand blue rather than near-black.

Secondary actions use white/subtle surfaces with neutral borders. Destructive actions use explicit danger semantics.

Inputs use neutral borders and receive brand focus treatment. Focus should feel clear but not fluorescent.

## Business cards, lists and tables

Cards:

- white on a soft neutral canvas;
- subtle neutral border;
- soft 10–12px radius;
- minimal elevation;
- stronger emphasis through title, spacing and status—not decoration.

Lists and tables remain efficient. Table headers and grouped rows use subtle neutral fills. Technical identifiers are secondary to human-readable names.

## Technical information

Technical information is still supported because Eidos is an extensible runtime, but it is not the default visual personality.

Routes, package IDs, protocol versions, hashes, runtime receipts and diagnostic traces should appear only where they help the current task, otherwise under Technical details / diagnostics / advanced disclosure.

## Plugin conformance

Plugins inherit:

- typography;
- palette;
- icon semantics;
- standard controls;
- card/list/table surfaces;
- responsive realization;
- focus and accessibility behavior.

A plugin may introduce domain identity color and custom visualization where the domain genuinely requires it. It may not recreate standard office chrome, buttons, forms, navigation or shell styling.

## Evolution rule

Future visual changes should preserve the semantic contracts while evolving the realization. Visual polish belongs in Eidos first so every plugin improves together.
