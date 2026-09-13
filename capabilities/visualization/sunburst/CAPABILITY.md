# sunburst

**Family:** `visualization`  
**Version:** `0.1.0`  
**Maturity:** `planned`

## Purpose
Canonical semantic capability placeholder for the Eidos capability system.

## LLM contract
An LLM should select this capability by semantic intent, not by guessing framework-specific component APIs.

## Constitutional requirements
- explicit inputs/outputs before promotion to `stable`;
- no hidden business truth;
- no hidden Host side effects;
- renderer-independent semantics;
- deterministic validation before stable admission;
- direct manipulation is allowed where it is the lowest-cost reliable interaction.

## Promotion
`planned -> candidate -> stable`

This file intentionally defines the semantic slot before every renderer is implemented. It prevents future implementations from inventing incompatible meanings.
