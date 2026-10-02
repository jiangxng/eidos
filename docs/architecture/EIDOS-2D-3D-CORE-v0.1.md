# Eidos 2D Core / 3D Core Boundary v0.1

**Status:** CURRENT ARCHITECTURE  
**Date:** 2026-10-02

## 1. Decision

Eidos formalizes two reusable visual-interaction cores:

```text
Eidos
├── 2D Core
└── 3D Core
```

These are frontend-framework foundations. They are not EOG components and must remain reusable by unrelated products.

The existing `diagram-core` / `src/diagram` and `spatial-core` / `src/spatial` implementations are protected convergence assets. The new names clarify ownership; they do not justify a rewrite.

## 2. 2D Core

2D Core owns reusable 2D graph/diagram interaction semantics:

- node;
- edge;
- port;
- group;
- x/y placement;
- size;
- viewport;
- selection;
- pan / zoom;
- drag;
- hit testing;
- connection interaction;
- layout hooks;
- annotations / overlays;
- generic interaction events;
- accessible keyboard/focus behavior;
- renderer-independent state/projection contracts.

2D Core does not own product/domain meaning.

Forbidden examples inside 2D Core:

- Application;
- Ledger;
- Enterprise Relation;
- SOP;
- accounting guidance;
- Enterprise Context publication lifecycle;
- EOG-specific commands.

A consuming product projects its domain model into 2D Core contracts and receives generic interactions back through Eidos/Host action boundaries.

## 3. 3D Core

3D Core owns reusable spatial interaction semantics:

- scene;
- object;
- x/y/z pose;
- camera;
- projection;
- picking / selection;
- focus;
- orbit/navigation;
- visibility;
- LOD;
- annotations / overlays;
- generic spatial interaction events;
- renderer-adapter boundary.

Renderer technology is replaceable:

```text
3D Core contract
    ↓
renderer adapter
    ├── current reference implementation
    ├── Three-like adapter
    ├── future WebGL implementation
    └── future WebGPU implementation
```

No renderer object or serialized renderer state may become product/business truth.

## 4. Product layering

The intended layering is frontend/backend-like:

```text
product/domain authority
      ↓ stable public contract
product Experience / projection
      ↓
Eidos 2D Core or 3D Core
      ↓
renderer
```

Eidos never imports the consuming product's private implementation.

The consuming product never depends on renderer-private DOM/WebGL/Three.js details.

## 5. State boundary

Visual state and domain state are different authorities.

```text
domain definition / business truth
!=
2D/3D view state
```

2D/3D view state may contain layout, viewport, selection, camera and other presentation data.

Changing presentation state must not manufacture a domain revision unless the consuming product explicitly defines such a business operation outside Eidos.

## 6. Compatibility convergence

Current assets map as follows:

### 2D

- `src/diagram/surface.ts` is the current primary convergence asset.
- Existing Diagram Editor public contracts remain supported during migration.
- Future public naming may introduce explicit `2d` entry points without breaking existing `diagram` consumers.

### 3D

- `src/spatial/contracts.ts`
- `src/spatial/engine.ts`
- `src/spatial/surface.ts`
- `src/spatial/three-adapter.ts`

remain the primary convergence assets.

Future public naming may introduce explicit `3d` entry points while preserving `spatial` compatibility.

## 7. Consumer examples

The cores are intentionally broader than EOG.

Potential 2D consumers include:

- EOG 2D Designer;
- EOG 2D Viewer;
- Posting Rule Designer;
- Process Designer;
- Organization Designer;
- Cost Flow Designer;
- relationship explorers.

Potential 3D consumers include:

- EOG 3D Viewer;
- warehouse spatial views;
- production-line views;
- supply-network spatial views;
- future digital-twin-style Experiences.

These examples do not grant Eidos ownership of those domains.

## 8. EOG relationship

For EOG specifically:

```text
Enterprise Context
= Enterprise Graph Definition authority

EOG 2D Designer / Viewer
→ Eidos 2D Core

EOG 3D Viewer
→ Eidos 3D Core
```

Eidos must not know that the projected nodes happen to represent Enterprise Applications, Ledgers or other enterprise definitions.

## 9. Migration rule

Prefer compatibility-preserving extraction over renaming churn.

1. define stable 2D/3D public contracts;
2. add compatibility aliases/adapters where necessary;
3. migrate consuming products to the new public boundaries;
4. remove old private coupling only after regression proof;
5. do not rewrite working rendering code merely to satisfy directory naming.

## 10. Canonical statement

> Eidos 2D Core and 3D Core are reusable deterministic visual-interaction foundations. Products own semantics and truth; Eidos owns generic interaction and rendering contracts.
