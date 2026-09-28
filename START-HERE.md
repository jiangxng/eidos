# START HERE

Read `CONSTITUTION.md` first. It is the highest-authority Eidos document.

Then read, in order:

1. `ARCHITECTURE-MAP.md`
2. `docs/product/EIDOS-EXPERIENCE-ARCHITECTURE-CONSTITUTION-v0.1.md`
3. `docs/architecture/EXPERIENCE-ARCHITECTURE.md`
4. `docs/product/EIDOS-PRODUCTIVE-DESIGN-LANGUAGE-v0.1.md` for Human-facing work
5. `llm/repository-map.json`
6. `capabilities/catalog.json`
7. `docs/ec/EC-EXPECTATIONS.md`
8. `PUBLIC-API.md`
9. the nearest capability/contract document for the task

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

For Human-facing candidate/production Experiences, run the Experience Architecture validator as part of the owning project's CI. Visual review confirms pixels; it does not replace structural journey/action validation.


## Teaching a new LLM

Use `llm/TEACH-ME-EIDOS.md`. For constrained context use `llm/QUICK-CONTEXT.md`.
Evaluate understanding with `llm/EVALUATION.md`.

## External review

Use `docs/product/EXTERNAL-REVIEW-KIT.md` and record feedback under `feedback/`.
