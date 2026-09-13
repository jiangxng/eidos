# LLM Integration Demo Contract

The showcase intentionally separates the probabilistic and deterministic halves.

```text
Human prompt
  -> LLM / EC (simulated locally in this zero-dependency demo)
  -> capability discovery
  -> EcExperienceProposal
  -> deterministic Eidos validation
  -> Experience resolver
  -> renderer
  -> ActionRequest
  -> Host
```

The browser demo uses a deterministic local prompt-to-proposal simulator so it can run offline without API keys. The UI labels this honestly. Replace the simulator with any LLM/EC adapter that returns the same proposal contract.

This is important commercially: **Eidos is model-agnostic.** The LLM is a producer; Eidos is the validation and realization system.
