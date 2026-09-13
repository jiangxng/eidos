# Eidos LLM Tool Usage

The preferred LLM workflow is short and deterministic:

1. Read `START-HERE.md`.
2. Search `capabilities/catalog.large.json` or call `eidos.discoverCapabilities`.
3. Produce `ExperienceProposalV100`; do not emit renderer/framework code first.
4. Call `eidos.validateExperienceProposal`.
5. Repair only diagnostics returned by the validator.
6. Call `eidos.realizeExperienceProposal`.
7. Emit Host `ActionRequest`s for execution; never mutate business truth inside Eidos.

This workflow intentionally narrows the LLM error surface.
