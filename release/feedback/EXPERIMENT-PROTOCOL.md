# External LLM Teaching Experiment

Run this with multiple LLMs without giving them previous Eidos conversations.

## Cohort A — minimal context
Give:
- `llm/QUICK-CONTEXT.md`
- capability catalog
- relevant contract

Ask one realistic task.

## Cohort B — curriculum
Give:
- `llm/TEACH-ME-EIDOS.md`
- normal reading order
- same task

## Cohort C — repository navigation
Give only:
- repository root
- instruction: "Learn Eidos, then solve the task."

## Measure
- evaluation score;
- first-pass validity;
- capability hallucination;
- repair cycles;
- generated code;
- time;
- questions asked;
- files read.

## Context determinism test
Give the same task to at least 3 capable LLMs independently.
Compare:
- ownership model;
- selected capabilities;
- contract shape;
- validation sequence.

If core interpretations diverge materially, treat it as Eidos documentation/contract debt until evidence shows otherwise.
