# LLM Engineering Workflow

Status: Active engineering protocol  
Scope: Eidos repository work performed through LLM-led engineering sessions

## Long-task execution

Substantial repository work is split into durable checkpoints instead of depending on one long conversational turn.

Preferred sequence:

1. inspect repository authority and decide scope;
2. persist core implementation;
3. persist tests and validation;
4. open PR and run CI;
5. merge and verify main.

## Recovery after timeout

A timeout never implies that prior repository actions failed or were rolled back.

Before continuing after an interrupted turn:

1. read the actual repository branch/PR/CI state;
2. identify the last durable successful checkpoint;
3. continue from that checkpoint;
4. do not recreate commits, branches or PRs that already exist.

## Efficiency

Prefer batched reads, deterministic edits and durable commits over repeated fine-grained remote operations.

Timeout resilience MUST NOT reduce architecture depth, test coverage or repository authority.
