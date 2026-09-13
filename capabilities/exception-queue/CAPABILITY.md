# Exception Queue

**Capability ID:** `exception-queue`  
**Version:** `0.1.0`  
**Status:** Candidate

## Purpose
Prioritize anomalies that genuinely require human attention while limiting alert fatigue.

## Constitutional constraints
- Capability semantics are renderer-independent.
- Business truth remains outside Eidos.
- Side effects are expressed as requests, never hidden execution.
- Personalization cannot violate invariant/shared-stable constraints.
- LLMs discover this capability from `capabilities/catalog.json`.
