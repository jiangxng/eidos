# LLM-First Engineering

Eidos coding architecture gives LLMs absolute priority when human-developer convenience genuinely conflicts with machine determinism.

## Requirements
1. Canonical vocabulary is documented.
2. Stable boundaries have machine-readable contracts.
3. Ownership and dependency direction are explicit.
4. Hidden state/lifecycle behavior is minimized.
5. Deterministic validation replaces reasoning where machines can guarantee the answer.
6. Bounded modules can be changed without reconstructing the repository.
7. Errors are structured and actionable.
8. Tests encode invariants.
9. Architecture decisions live in the repository.
10. Capability discovery uses a catalog, not source-code archaeology.


## Deep Vertical MVP Principle

Eidos follows a **thin breadth, deep vertical slice** MVP rule.

MVP constrains how many capabilities are admitted at once. It does not justify weakening the engineering foundation of a capability that has already been admitted.

For an in-scope vertical slice, implement the foundations required for it to be:

- correct and deterministic;
- performant on desktop and mobile;
- observable and diagnosable;
- contract-driven and replaceable at module boundaries;
- safe to evolve without repository-wide rewrites;
- suitable for LLM-led implementation, replay, and debugging.

Do not dismiss required in-scope foundations as "over-design" merely because they are infrastructure. At the same time, do not use this principle to add speculative horizontal features that are not required by the accepted vertical slice.

A useful decision test is:

```text
Does this foundation make the current accepted vertical slice
real, robust, measurable, and durable?

YES -> it belongs in the MVP depth.
NO  -> defer it as horizontal or speculative scope.
```
