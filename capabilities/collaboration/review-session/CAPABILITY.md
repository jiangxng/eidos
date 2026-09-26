# review-session

**Family:** `collaboration`  
**Version:** `0.1.0`  
**Maturity:** `candidate`

## Purpose

Human review of proposed changes through the reusable Eidos Review Queue pattern.

## Public realization

Current reference realization:

- contract: `src/review-queue/contracts.ts`
- renderer: `src/review-queue/render.ts`
- product authority: `docs/product/REVIEW-QUEUE-EXPERIENCE-PATTERN-v0.1.md`

## LLM contract

Select this capability when a workflow requires a person to inspect evidence, optionally edit proposal fields, and accept/reject a proposed state change before the owning Host commits it.

Do not use it as a generic card list.

## Constitutional requirements

- proposal and committed business truth remain separate;
- Eidos has no hidden business side effects;
- one primary action per review item;
- evidence remains inspectable;
- machine ids and commands remain stable across locales;
- authorization and persistence remain Host-owned;
- renderer-independent semantics;
- deterministic validation before stable admission.

## Promotion

`candidate -> stable` after at least two independent domain consumers and keyboard/mobile behavior verification.
