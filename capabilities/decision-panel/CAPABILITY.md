# Decision Panel

**Capability ID:** `decision-panel`  
**Version:** `0.1.0`  
**Status:** Candidate

## Purpose
Focus a human on a bounded decision with evidence, alternatives, recommendation rationale and consequences.

## Constitutional constraints
- Capability semantics are renderer-independent.
- Business truth remains outside Eidos.
- Side effects are expressed as requests, never hidden execution.
- Personalization cannot violate invariant/shared-stable constraints.
- LLMs discover this capability from `capabilities/catalog.json`.
