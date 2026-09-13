# Rewrite Policy

Eidos preserves knowledge, not accidental complexity.

A component SHOULD be rewritten when preserving its current implementation materially increases:

- LLM ambiguity;
- duplicated API choices;
- hidden state;
- hidden lifecycle behavior;
- runtime-only failure;
- undocumented edge cases;
- generated code volume;
- required context size;
- coupling to a framework-specific mental model.

## Priority

1. Reliability
2. Deterministic clarity
3. LLM efficiency
4. Human direct-manipulation efficiency
5. Compatibility

Compatibility is valuable, clarity is more valuable, reliability is non-negotiable.

Legacy APIs may be temporarily adapted into canonical contracts. They must not remain indefinitely if their coexistence permanently increases LLM error surface.
