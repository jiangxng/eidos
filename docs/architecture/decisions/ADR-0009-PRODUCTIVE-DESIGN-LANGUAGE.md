# ADR-0009: Productive Design Language is an Eidos-owned public capability

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Workbench structure already belongs to Eidos, but host-specific CSS can silently create a second UI architecture. As plugin count grows, independent spacing, button placement, focus styling and shell chrome would make the product inconsistent and force every LLM/plugin to rediscover design decisions.

## Decision

Eidos owns a versioned Productive Design Language consisting of:

- research-backed layout/action guidance;
- machine-readable semantic design tokens;
- a default Productive Workbench stylesheet;
- accessibility and responsive invariants.

The default character is productive, quiet and precise rather than decorative.

Host products consume this public styling capability. Plugins contribute semantic Experiences and actions and inherit Eidos realization unless a domain-specific visual capability is explicitly admitted.

The reference synthesis is:

- VS Code for Workbench/container/action placement;
- Fluent for spacing/alignment/responsive composition;
- Carbon for enterprise density and button hierarchy;
- Apple HIG for toolbar grouping/placement;
- WAI-ARIA APG for keyboard/focus semantics.

## Consequence

Visual consistency becomes testable architecture, not host-level polish.

Ordinary Workbench CSS should no longer be owned by EVO App Platform or individual plugins.

New reusable visual/interaction patterns are added to Eidos first and documented before adoption by plugin products.
