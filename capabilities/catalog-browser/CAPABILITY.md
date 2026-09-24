# Catalog Browser Capability

**Capability ID:** `catalog-browser`  
**Version:** `0.1.0`  
**Maturity:** candidate  
**Category:** navigation

## Purpose

Present a discoverable catalog of installable/selectable offerings with explicit status, metadata and host-executed actions.

Typical uses include:

- plugin/app stores;
- capability catalogs;
- template libraries;
- package browsers;
- resource selectors where each item has lifecycle/status actions.

## Inputs

- catalog items;
- item status;
- human-readable metadata;
- declared item actions.

## Outputs

- item action requests;
- navigation requests.

## Ownership

Catalog Browser owns only interaction/presentation state.

It does **not** own:

- catalog truth;
- package installation state;
- business execution;
- persistence;
- dependency resolution.

Those remain in the Host / App Platform / authoritative backend.

## Action semantics

Actions are explicit and versioned.

```text
type = command
→ Eidos emits an ActionRequest
→ ActionHost executes through a public host contract

type = navigate
→ App Host resolves an existing route
```

Catalog Browser never executes package installation or business logic directly.

## Renderer

Current supported renderer:

- HTML

The renderer emits semantic `data-eidos-*` markers so App Host can bind actions without inferring business meaning from labels.

## Use when

Use when humans need to discover, compare status, and act on a bounded set of offerings.

Do not use when the primary task is analytical table work with no item-level lifecycle/action semantics; use DataGrid or another capability instead.

## EVO Plugin Store

EVO App Platform uses Catalog Browser for its Plugin Store Experience.

The correct boundary is:

```text
App Platform catalog/lifecycle truth
        ↓
CatalogBrowserV010
        ↓
Eidos Catalog Browser
        ↓
Eidos App Host
        ↓
Human
```

If Plugin Store needs a reusable interaction that Catalog Browser cannot express, extend this Eidos capability or compose another Eidos capability. Do not bypass Eidos in EVO-App-Platform.
