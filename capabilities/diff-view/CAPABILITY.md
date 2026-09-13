# Diff View

**Capability ID:** `diff-view`  
**Version:** `0.1.0`  
**Status:** Candidate

## Purpose
Explain meaningful change using stable before/after references.

## Constitutional constraints
- Capability semantics are renderer-independent.
- Business truth remains outside Eidos.
- Side effects are expressed as requests, never hidden execution.
- Personalization cannot violate invariant/shared-stable constraints.
- LLMs discover this capability from `capabilities/catalog.json`.
