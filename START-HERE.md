# START HERE

Read `CONSTITUTION.md` first. It is the highest-authority Eidos document.

Then read, in order:

1. `ARCHITECTURE-MAP.md`
2. `docs/architecture/EXPERIENCE-ARCHITECTURE.md`
3. `llm/repository-map.json`
4. `capabilities/catalog.json`
5. `docs/ec/EC-EXPECTATIONS.md`
6. `PUBLIC-API.md`
7. the nearest capability/contract document for the task

## Default LLM rule

**Prefer composing a declared Capability over generating a new implementation.**

Before changing architecture, identify:
- owner;
- stable contract;
- invariants;
- dependency direction;
- validation command.

## Verify every meaningful change

```bash
npm run typecheck
npm test
npm run validate:repo
```

If a deterministic check can prove a rule, do not replace it with an LLM opinion.


## Teaching a new LLM

Use `llm/TEACH-ME-EIDOS.md`. For constrained context use `llm/QUICK-CONTEXT.md`.
Evaluate understanding with `llm/EVALUATION.md`.

## External review

Use `docs/product/EXTERNAL-REVIEW-KIT.md` and record feedback under `feedback/`.
