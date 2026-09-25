# ADR-0008: Extension management surface and plugin-platform boundary

**Status:** Accepted  
**Date:** 2026-09-25

## Context

EVO App Platform is the plugin lifecycle/protocol owner. Eidos is the human experience and Workbench capability owner.

A plugin platform needs a stable human-facing surface for discovery, compatibility inspection and lifecycle actions without App Platform implementing a parallel UI framework.

## Decision

Eidos provides a generic `extension-manager` Experience capability.

It renders host-neutral data supplied by a plugin platform:

- plugin identity/version/publisher;
- lifecycle status;
- protocol compatibility;
- provided/required capabilities;
- Contribution Point summary;
- generic command/navigation actions.

Eidos does not install plugins, resolve dependencies or own the Plugin Protocol. Those remain App Platform responsibilities.

App Platform may expose a Plugin Platform Lab or Plugin Store by producing this contract and routing actions through the normal ActionHost.

This deliberately follows the mature extension-system split used by systems such as VS Code: the host owns extension lifecycle and APIs, while the UI workbench renders declared extension contributions.

## Invariant

Eidos MUST NOT import plugin implementations or App Platform private lifecycle code. App Platform MUST NOT fork Eidos rendering to create a bespoke plugin-management UI.
