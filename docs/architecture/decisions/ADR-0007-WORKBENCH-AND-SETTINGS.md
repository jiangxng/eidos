# ADR-0007: Workbench shell, Activity Bar and Settings contributions

**Status:** Accepted  
**Date:** 2026-09-24

## Context

The first Agent Workspace proved left navigation + assistant + workspace composition, but its three regions were fixed. Long-lived enterprise software needs a more flexible workbench model: a compact activity switcher, contextual side views, a dominant workspace, persistent user layout, and a standard extension configuration surface.

Mainstream IDE workbenches separate these responsibilities rather than letting every extension invent its own window chrome.

## Decision

Eidos adds a generic Workbench capability:

```text
Activity Bar
    ↓
Side Panel / View Container (optional, resizable, hideable)
    ⇆ splitter
Main Workspace
    ↓
Status Bar
```

### Activity semantics

Activity Bar entries are not compressed application navigation.

Supported activity kinds:

- `navigation` — renders application navigation in the Side Panel;
- `side-route` — renders a contributed Eidos route in the Side Panel;
- `workspace-route` — opens a route in the main Workspace;
- `workspace-focus` — hides the Side Panel and maximizes workspace focus.

Selecting the currently active side activity toggles the Side Panel.

### Layout persistence

User interface layout state may persist:

- active Activity;
- Side Panel visibility;
- Side Panel width;
- workspace target.

This state is local UI preference, never authoritative business data.

Persistence failure is non-fatal.

### Resizing

The divider between Side Panel and Workspace is keyboard and pointer operable. Width is clamped by host-defined minimum/maximum bounds.

### Settings

Eidos adds a declarative `settings-editor` Experience capability.

Extensions/platforms may provide typed settings:

- string;
- number;
- boolean;
- select.

The Settings Editor renders and sends values through the normal ActionHost. Eidos does not own persistence or provider-specific semantics.

Secrets are explicitly excluded from ordinary Settings.

### Configuration ownership

Simple extension configuration should use declarative Settings.

Complex configuration may still be a dedicated Eidos Experience.

The host/platform decides how settings Contributions become effective routes, how values are persisted, and how settings are scoped.

### Mobile

On narrow screens, Workbench retains Activity semantics but shows one working surface at a time. A desktop-only resizer is not required to complete normal mobile workflows.

## Compatibility

Existing Standard Shell and Agent Workspace Shell remain valid. Workbench is an additional shell composition and does not change the App Host route or ActionHost contracts.
