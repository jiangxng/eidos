# Eidos Icon System v0.1

**Status:** P0 Design Language component  
**Date:** 2026-09-25  
**Owner:** Eidos

**Design entry point:** `docs/product/EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md`

## Purpose

The Eidos Icon System is the canonical icon language for Workbench and standard plugin Experiences.

It is part of the Eidos Productive Design Language, not a third-party icon-library dependency.

## Business Office v0.2 visual revision

Standard UI icons are monochrome by default. Selected navigation/action state may apply the Eidos brand tone. Multi-color treatment is reserved for separately governed application/domain/product identity. The default stroke is 2px for clearer office-product legibility across desktop and mobile.

## Character

Icons follow the same Productive / Quiet / Precise character as the rest of Eidos:

- simple 24×24 coordinate system;
- consistent rounded 2px stroke language;
- rounded line caps and joins;
- restrained geometry;
- semantic geometry remains simple; decorative accent fragments do not color ordinary system icons;
- legible at 16 / 20 / 24px;
- semantic names rather than raw SVG ownership in plugins.

## Initial production scope

v0.1 intentionally starts with Workbench/core product needs and grows additively.

Initial groups include:

- platform/workbench: dashboard, workspace, plugins, package, browser, sidebar, panel, activity;
- navigation/tools: search, history, refresh, external-link, arrow-right;
- communication/people: chat, agent, notifications, user, help;
- data/business: folder, document, table, form, flow, database, settings;
- execution: play, pause.

The icon registry is the compatibility boundary. Future Finance, Sales, Procurement, Inventory, Manufacturing, CRM, HR, Analytics and industry icons are added without changing existing semantic names.

## Plugin rule

Plugins declare semantic icon names:

```json
{ "icon": "settings" }
```

They should not embed arbitrary SVG or bring a competing icon library into ordinary host UI.

Unknown icon names may temporarily fall back to legacy text rendering for compatibility, but new Eidos/App Platform code should use registered semantic names.

## Copyright/provenance rule

The production icon source in `src/design-language/icons/icon-system.ts` is an original Eidos project asset and has no runtime dependency on Font Awesome, VS Code Codicons, Material Symbols, Heroicons or another icon library.

Mature systems may be studied for information architecture and semantic coverage; their vector assets are not copied.

Brand icons are a separate future registry and must follow the relevant brand/trademark terms.

## Accessibility

Icon-only controls require an accessible name and a discoverable tooltip/title.

Decorative SVGs use `aria-hidden=true`; the owning control provides the accessible name.

Do not encode state using icon color alone.

## Evolution

New icons are additive by default.

Existing semantic names are stable. If an icon meaning must be replaced, deprecate the old name and provide a migration alias before removal.
