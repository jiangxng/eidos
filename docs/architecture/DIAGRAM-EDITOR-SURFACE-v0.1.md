# Diagram Editor Surface v0.1

**Status:** CANDIDATE REFERENCE SURFACE  
**Date:** 2026-09-28

## Purpose

Provide a reusable Eidos diagram editing surface for Host-owned semantic graphs.

The surface deliberately does **not** own business truth. It renders a Host-projected graph state and emits declared operations back through the normal Eidos `ActionHost`.

## mxGraph / GraphEditor genealogy

The legacy enterprise process designer used the mxGraph family and its editor implementation. That lineage is useful because the original GraphEditor separated reusable editing concerns into concepts such as:

- editor shell;
- graph/canvas;
- toolbar;
- actions;
- menus;
- selection;
- format/properties inspection;
- model serialization.

Eidos preserves the useful interaction architecture, not the legacy authority boundary.

The public mxGraph project is end-of-life. A future Eidos renderer may use maxGraph, the modern TypeScript successor, behind the same Diagram Editor Surface contract.

## v0.1 boundary

The reference surface provides:

- Toolbar;
- Canvas;
- selectable nodes and edges;
- Inspector;
- node direct manipulation;
- Host-backed revisioned operations;
- target-scoped actions such as confirming a selected relation;
- graph-level actions such as Publish.

The first renderer is deliberately dependency-free SVG/DOM. It is a **reference renderer**, not a new semantic graph model.

## Authority

```text
Host semantic model
  ↓ projection
DiagramEditorStateV010
  ↓
Eidos Diagram Editor Surface
  ↓ direct manipulation / declared action
ActionHost
  ↓
Host semantic operation
```

The Eidos state projection is disposable. Refresh must always be able to reconstruct it from the Host.

## Renderer seam

Business/Application code must not depend on SVG DOM details. A future maxGraph adapter may replace the reference renderer without changing:

- DiagramEditorPageV010;
- DiagramEditorStateV010;
- ActionHost commands;
- Host semantic graph contracts.

## Non-goals

- generic ProcessOn replacement;
- XML as authoritative graph state;
- business-specific node semantics in Eidos;
- hidden persistence in the browser;
- LLM-generated executable graph code.
