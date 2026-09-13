# Eidos Architecture Map

```text
EC / Other Producer
       |
       | EcExperienceProposal
       v
+-----------------------------+
| Eidos Contract Boundary     |
| - schema validation         |
| - capability discovery      |
| - compatibility validation  |
+-----------------------------+
       |
       v
+-----------------------------+
| Experience Resolver         |
| - stability policy          |
| - attention integrity       |
| - accessibility             |
| - shared-reference rules    |
+-----------------------------+
       |
       v
+-----------------------------+
| Capability Runtime          |
+-----------------------------+
       |
       +--------> Renderer(s)
       |
       +--------> Action/Query Request ----> Host
```

## Ownership

- EC/Producer: Human Intent intelligence and long-term personalization learning.
- Eidos: capability contracts, deterministic validation, experience resolution, rendering boundary.
- Host: business truth and business execution.
- Human: judgment where human judgment is required.

## Fast navigation

- highest authority: `CONSTITUTION.md`
- LLM instructions: `llm/TASK-PROTOCOL.md`
- capability discovery: `capabilities/catalog.json`
- experience contracts: `src/experience/`
- EC boundary: `src/ec/`
- runtime: `src/runtime/`
- existing component convergence: `src/components/`
- renderers: `src/renderers/`
- deterministic checks: `tools/validate-repository.mjs`
