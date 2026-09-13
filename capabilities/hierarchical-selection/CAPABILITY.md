# hierarchical-selection — Candidate Capability

**Status:** candidate  
**Component asset:** `src/components/TreeSelect`  
**Canonical contract:** not yet published

## Purpose
Allow a human to select one or more stable identities from hierarchical reference data.

## Non-purpose
This capability does not own business truth, execute remote queries, infer business meaning, or persist selections.

## State ownership
Selection value is controlled by the host/interaction owner. Open/expanded/search/focus/hover are interaction state.

## Renderer independence
TreeSelect is one Web/VNode renderer candidate. Other terminals may use a full-screen picker, search picker, cascader, voice flow, or another renderer.

## Current decision
Do not pretend the flat UIDL 0.1.1 `options` contract is a hierarchical-reference contract. A versioned hierarchical reference contract must be designed explicitly before canonical Runtime registration.
