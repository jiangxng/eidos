# External Review Kit

Send reviewers the repository plus one of these instructions.

## For an LLM
> You have no prior Eidos context. Learn Eidos using the repository's prescribed LLM reading order. Then complete `llm/EVALUATION.md` and one realistic experience-composition task. Record uncertainty rather than guessing. Return the completed `feedback/LLM-FEEDBACK-TEMPLATE.md`.

## For a developer
> Run `npm run release:check`, open the commercial showcase, then implement or modify one experience through capabilities/contracts rather than framework-first code. Record anything that required source-code archaeology.

## For a product/operations reviewer
> Watch/run the commercial showcase. Explain Eidos back in your own words after three minutes, complete one direct customization, inspect one LLM proposal failure, then complete `feedback/HUMAN-FEEDBACK-TEMPLATE.md`.

## For an enterprise architect
Review:
- `CONSTITUTION.md`
- `ARCHITECTURE.md`
- `PUBLIC-API.md`
- `DEPLOYMENT.md`
- EC/Host boundaries
- contracts and validator behavior

Focus feedback on trust, integration, policy, security, auditability and migration.
