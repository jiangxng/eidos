# LLM Context Determinism Contract

A fresh LLM must be able to work from a clean checkout without prior conversation.

Before editing code, identify:
- base revision and architecture version;
- owner module and allowed dependency direction;
- public APIs that must remain compatible;
- relevant invariant IDs;
- contract/version/hash impact;
- tests and rollback route.

Never assume:
- field names imply enterprise semantics;
- EVO or Experience Compiler internals are available;
- local UI state is enterprise truth;
- unknown contract versions are “probably compatible”;
- chat memory can replace repository authority.

If accepted contracts/ADRs conflict at the same priority, record the conflict and block only the affected acceptance claim. Do not rewrite history to make the conflict disappear.


## Human + LLM operability

When realizing a business-facing capability:

- preserve domain language;
- prefer guided human-readable forms over exposing raw AST/internal IDs;
- keep one semantic truth across UI, contracts and runtime;
- use progressive disclosure for advanced detail;
- do not require developer intervention for normal business configuration;
- make validation/errors understandable to a novice before showing technical detail.

Authority: `docs/architecture/HUMAN-LLM-OPERABILITY-v0.1.md`.
