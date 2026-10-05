# Eidos Mobile Design Language v0.1

Status: **Normative baseline**

Mobile is a first-class realization of the same Eidos Experience semantics. Its current visual realization also follows `docs/product/EIDOS-BUSINESS-OFFICE-VISUAL-LANGUAGE-v0.2.md`. It is not a reduced desktop page and it is not a separate plugin UI system.

## Core rule

A plugin declares semantic content, actions and capability intent. Eidos owns how those semantics are realized on desktop, tablet and phone.

Plugins MUST NOT create a parallel mobile shell, private breakpoint system, private spacing scale, private navigation rail, or device-specific business semantics.

## Phone information architecture

- One primary task surface at a time.
- Primary destinations use bottom navigation with a visible short icon label; desktop side rails do not survive onto phone.
- Secondary context replaces the current surface or appears as an overlay/sheet instead of permanently consuming width.
- Global session context remains compact top chrome.
- Status information that is useful but non-essential must not consume permanent phone viewport space.
- Content flows as a single column unless a capability explicitly requires spatial presentation.

## Typography and system text scale

- Phone text follows the operating-system and browser text-size preference where the platform exposes it.
- Hosts opt in to standards-based system text scaling; Eidos typography uses root-relative units rather than fixed pixel font sizes.
- The default preference is **Follow system**. Users may additionally choose **Small (90%)**, **Standard (100%)**, or **Large (115%)**; these are Eidos multipliers layered on top of the system/browser text preference rather than replacements for it.
- Larger system text must reflow the interface instead of clipping labels, hiding actions or shrinking touch targets.
- Plugins MUST NOT set ordinary UI typography with fixed pixel font sizes or override the system text-scale behavior.

## Interaction

- Minimum interactive target: 44px.
- One primary action per scope.
- Primary actions must remain easy to reach with one hand.
- Narrow action groups stack instead of compressing into tiny controls.
- Destructive actions remain visually and spatially separated from forward primary actions.
- No operation may require a gesture without an accessible non-gesture equivalent.

## Collections and detail

- Catalogs, lists and settings become single-column.
- Wide tables either scroll deliberately or use a semantic mobile reflow; silent column loss is forbidden.
- Detail media becomes a horizontal scroll rail where appropriate.
- Technical metadata uses progressive disclosure.

## Forms

- Phone forms use a single field column.
- Standard text/select controls are at least 44px high.
- Commit actions stay visible when a long form would otherwise push them far below the current viewport.

## Plugin conformance

Every plugin is expected to use Eidos capabilities, tokens, controls and responsive realization. A plugin may supply domain content, domain actions and declared layout hints. It may not replace the Host shell or invent its own mobile design system.

Exceptions require a named Eidos capability or an explicit architecture decision; they must not be hidden in plugin CSS.

## v0.1 reference realization

The Productive Workbench is the reference realization:

- bottom Activity navigation on phone;
- full-width Panel or Workspace, never a permanent two-column split;
- compact top global controls;
- account details presented as a bottom sheet;
- hidden phone status bar;
- single-column Catalog, Detail, Settings and Review flows;
- 44px minimum controls and actions;
- safe-area-aware bottom chrome.

Future mobile components must extend these semantics rather than bypass them.
