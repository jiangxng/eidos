# Eidos

**Eidos is deterministic for machines, adaptive for humans, and stable where shared understanding and familiarity matter.**

Eidos is a pure, LLM-native frontend framework. It is designed so that LLMs compose verified frontend capabilities instead of repeatedly generating large amounts of unverified UI code.

## Read in this order

1. `CONSTITUTION.md`
2. `START-HERE.md`
3. `docs/architecture/EIDOS-CORE-COMPONENTS-APP-HOST-v0.1.md`
4. `docs/architecture/EXPERIENCE-ARCHITECTURE.md`
5. `docs/ec/EC-EXPECTATIONS.md`
6. `capabilities/catalog.json`
7. `PUBLIC-API.md`
8. `LLM.md`

## Product boundary

Eidos has three long-term production parts:

```text
Eidos
├─ Core
├─ Component Library
└─ App Host
```

Examples / Showcase are validation assets, not a production layer.

Eidos does not own Human Intent intelligence, enterprise business truth, enterprise persistence, or backend business execution. EVO is one possible host, not a required dependency.

See `docs/architecture/EIDOS-CORE-COMPONENTS-APP-HOST-v0.1.md`.

## Design posture

- LLM-first coding and maintenance (design weight >= 90%)
- Composition before generation
- Capability before component
- Deterministic validation at every machine boundary
- Personalization converges toward fit instead of creating perpetual UI churn
- Collaboration protects shared reference and shared truth
- Human decision, exception and attention experiences are first-class capabilities
- Runtime does not execute arbitrary LLM-generated code by default

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
