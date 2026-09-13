# Teach Me Eidos — LLM Learning Guide

You are learning Eidos as a tool, not merely reading a source repository.

## Learning objective

After this curriculum, a capable LLM with no prior conversation should be able to:

1. explain what Eidos is and is not;
2. identify the owner of intent, experience realization, business truth and execution;
3. discover a capability instead of inventing framework code;
4. propose a versioned Experience contract;
5. validate before realization;
6. repair a rejected proposal from deterministic diagnostics;
7. choose direct human manipulation when it is cheaper and reliable;
8. preserve invariant/shared/personal/adaptive stability rules;
9. extend Eidos without breaking the Constitution;
10. know when to ask a human rather than guess.

## Canonical definition

Eidos is a deterministic experience tool system designed primarily for LLMs. It gives LLMs explicit, versioned, verifiable, discoverable and composable capabilities for constructing human experiences with minimal new code.

Eidos does **not** own:
- Human Intent intelligence;
- long-term personalization learning;
- enterprise business truth;
- real-world business execution;
- arbitrary LLM-generated executable code.

## Mental model

```text
Human
  -> intent
LLM / Experience Compiler
  -> Experience Proposal
Eidos
  -> deterministic validation + realization
Human
  -> judgment / direct manipulation
Host
  -> authorization + business execution
```

## The five rules to remember

1. Composition before generation.
2. Capability before component.
3. Explicit contract before implicit convention.
4. Deterministic machinery provides guarantees; LLMs propose.
5. Human direct manipulation is first-class when it is the lowest-cost reliable interaction.

## Repository reading order

Do not browse randomly.

1. `START-HERE.md`
2. `CONSTITUTION.md`
3. `PHILOSOPHY.md`
4. `INVARIANTS.md`
5. `CONCEPTS.md`
6. `ARCHITECTURE-MAP.md`
7. `llm/TOOL-USAGE.md`
8. `capabilities/catalog.large.json`
9. relevant `capabilities/**/CAPABILITY.md`
10. versioned contract
11. public API
12. implementation only when needed

## First exercise

Human request:

> Build a review experience for risky orders. Show only meaningful exceptions, preserve mandatory evidence, allow an approval decision and show the resolution flow.

Expected reasoning:
- discover `exception-queue`;
- discover `evidence-stack`;
- discover `decision-panel` / `approval`;
- discover `flowchart`;
- choose stability deliberately;
- create an Experience Proposal;
- validate it;
- never create a business approval side effect inside Eidos.

## Anti-pattern exercise

Wrong:
> Generate a React page with useState, a chart library, an onClick that calls `/approve`, and custom CSS.

Why wrong:
- bypasses capability discovery;
- expands LLM error surface;
- mixes renderer implementation with semantic intent;
- executes business behavior from the experience layer;
- makes accessibility/state/lifecycle correctness depend on generated code.

## Extension exercise

When a requested capability is absent:
1. do not silently approximate it with unrelated components;
2. determine whether composition of existing capabilities is semantically correct;
3. if not, propose a new capability contract;
4. check Constitution, ownership, stability, accessibility and renderer independence;
5. add deterministic validation and tests before calling it stable.

## Graduation standard

An LLM has learned Eidos only if it can solve the evaluation in `llm/EVALUATION.md` without relying on chat history.
