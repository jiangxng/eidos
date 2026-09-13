# LLM Feedback Record

## Environment
- Model / agent:
- Model version/date if known:
- Context window/mode:
- Tools available:
- Repository version/commit:
- Files provided before task:
- Was prior chat history available? yes/no

## Task
- Exact user request:
- Expected Eidos capability family:
- Autonomy level:

## First attempt
- Capabilities selected:
- Did it search/discover before generating? yes/no
- Did it generate framework code unnecessarily? yes/no
- Proposal valid on first pass? yes/no
- Validator diagnostics:
- Repair cycles:
- Approx. generated lines/tokens:
- Time to valid experience:

## Understanding failures
Check all that apply:
- [ ] Eidos identity misunderstood
- [ ] EC/Eidos/Host ownership confused
- [ ] capability vs component confused
- [ ] unknown capability guessed
- [ ] business execution placed inside Eidos
- [ ] stability rule violated
- [ ] collaboration invariant violated
- [ ] direct manipulation ignored
- [ ] accessibility/attention/motion semantics missed
- [ ] renderer detail leaked into semantic contract
- [ ] documentation could not be found
- [ ] documentation was contradictory

## What the LLM said was unclear
Paste concise excerpts or summarize.

## Improvement hypothesis
Which should change?
- [ ] Constitution / invariant
- [ ] Quick Context
- [ ] capability metadata
- [ ] schema / type
- [ ] validator diagnostic
- [ ] example
- [ ] tool API
- [ ] implementation
- [ ] naming
- [ ] nothing; model-specific issue

## Outcome
- First-pass evaluation score /40:
- Final evaluation score /40:
- Would you trust this LLM to modify Eidos autonomously? yes/no/with-review
