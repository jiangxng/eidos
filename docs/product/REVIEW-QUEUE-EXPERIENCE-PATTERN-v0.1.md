# Eidos Review Queue Pattern v0.1

**Status:** Candidate reusable pattern  
**Date:** 2026-09-27  
**Capability:** `review-queue@0.1.0`

## Purpose

Review Queue is the generic Eidos surface for human review of proposed state changes, classifications or knowledge before the owning Host commits them.

It is intentionally domain-neutral. Eidos does not know whether an item represents Memory, configuration, policy, finance, workflow or another plugin domain.

## Contract

A Review Queue contains:

- title and optional description;
- zero or more review items;
- one semantic state per item;
- optional editable fields;
- optional evidence references;
- optional compact metrics;
- one primary action at most;
- secondary actions.

Item states:

- `pending`
- `attention`
- `accepted`
- `rejected`

Actions reuse standard command/navigation semantics and may require confirmation.

## Productive Design Language

Review Queue follows the existing Eidos rules:

- compact enterprise density;
- one primary action per item;
- evidence and metrics are supporting information, not decorative cards;
- editable fields stay close to the decision they affect;
- rejected/accepted terminal states remain visible if the Host chooses to show them;
- mobile reflows items vertically;
- no plugin-owned HTML/CSS is required for standard review flows.

## Authority boundary

Eidos renders and dispatches interaction semantics only.

The Host owns:

- what is being reviewed;
- whether edits are valid;
- authorization;
- side effects;
- decision persistence;
- provenance/audit history.

A Review Queue action never implies that Eidos itself approves or mutates business state.

## Localization

Human-facing chrome is localized using stable keys:

- `review.<reviewId>.title`
- `review.<reviewId>.description`
- `review.<reviewId>.empty`
- `review.<reviewId>.status.<state>.label`
- `review.<reviewId>.field.<fieldKey>.label`
- `review.<reviewId>.field.<fieldKey>.option.<value>.label`
- `review.<reviewId>.metric.<metricId>.label`
- `review.<reviewId>.action.<actionId>.label`

Machine ids, commands, field keys and option values are never localized.
