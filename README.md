# Eidos

**Eidos is deterministic for machines, adaptive for humans, and stable where shared understanding and familiarity matter.**

Eidos is an LLM-first Experience runtime and capability system. It is designed so that LLMs compose verified capabilities instead of repeatedly generating large amounts of unverified UI code.

## Read in this order

1. `CONSTITUTION.md`
2. `START-HERE.md`
3. `docs/architecture/EXPERIENCE-ARCHITECTURE.md`
4. `docs/ec/EC-EXPECTATIONS.md`
5. `capabilities/catalog.json`
6. `PUBLIC-API.md`
7. `LLM.md`

## Core boundary

`Human Intent -> Intelligence / Experience Compiler -> Experience Contract -> Eidos -> Human Experience`

Eidos does not own Human Intent intelligence, business truth, or business execution.

## Design posture

- LLM-primary engineering (~99.9% target for software design, implementation, extension, testing, documentation and maintenance)
- Composition before generation
- Capability before component
- Deterministic validation at every machine boundary
- Personalization converges toward fit instead of creating perpetual UI churn
- Collaboration protects shared reference and shared truth
- Human decision, exception and attention experiences are first-class capabilities
- Runtime does not execute arbitrary LLM-generated code by default

## Human + LLM operability

Eidos is LLM-first in construction and business-user-first in ordinary operation: a capable LLM should understand the system deterministically, while a novice user should be able to understand and use normal business experiences without human developer assistance; human developers are not an assumed system role.

See `docs/architecture/HUMAN-LLM-OPERABILITY-v0.1.md`.

## Commands

```bash
npm run typecheck
npm test
npm run validate:repo
```


## Large capability edition

This package expands Eidos into a multi-core, component-rich architecture with **203 declared semantic capabilities** across input, data, decision, exception, BI, visualization, diagram, reporting, dashboard, media, spatial, navigation, collaboration, attention, layout and direct customization.

See:
- `capabilities/catalog.large.json`
- `docs/architecture/MULTI-CORE-ARCHITECTURE.md`
- `NEAR-COMPLETE-PLAN.md`


## Complete-state RC

Primary product demo: `showcase/index.html`  
Production packaging: `npm run build:release`  
Full verification: `npm run release:check`  
Deployment: `DEPLOYMENT.md`  
Release scope/maturity: `COMPLETE-STATE.md`  
LLM tool protocol: `llm/TOOL-USAGE.md`

The commercial showcase supports English, Simplified Chinese, Traditional Chinese, Japanese and Spanish.


## Teach / evaluate / promote

- Teach a new LLM: `llm/TEACH-ME-EIDOS.md`
- Minimal LLM bootstrap: `llm/QUICK-CONTEXT.md`
- LLM evaluation: `llm/EVALUATION.md`
- External review kit: `docs/product/EXTERNAL-REVIEW-KIT.md`
- Feedback program: `feedback/README.md`
- Promotion plan: `docs/product/PROMOTION-PLAN.md`
- FAQ: `docs/product/FAQ.md`
