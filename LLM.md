# LLM Context Determinism Contract

> **Mandatory proactive-engineering instinct:** Read `docs/architecture/LLM-PROACTIVE-ENGINEERING-INSTINCTS-v0.1.md` and `llm.foundation-map.json`. Do not wait for the human to name ordinary framework/product foundations such as design-system governance, accessibility, interaction consistency, performance budgets, diagnostics, compatibility or responsive behavior. Detect and classify missing foundations as NOW / SOON / WATCH.

> **Plugin-platform boundary (2026-09-25):** Eidos is the UI/runtime side of the native EVO plugin/mini-app platform. Native plugins are not MCP applications by default. MCP/OAuth are external-integration concerns and must not leak into generic Eidos plugin contracts unless the task explicitly concerns an external integration.

A fresh LLM must be able to work from a clean checkout without prior conversation.

> **Design authority (2026-09-25):** Before changing App Host, Workbench, standard Eidos capabilities, button hierarchy, spacing, toolbar placement, responsive layout or plugin-facing visual patterns, read `docs/product/EIDOS-PRODUCTIVE-DESIGN-LANGUAGE-v0.1.md` and use `src/design-language/tokens.ts`. Do not invent a parallel visual language inside a host product or plugin.

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
- do not assume a human developer role; LLMs are the default engineers for implementation and extension;
- do not require human developer intervention for normal business configuration;
- make validation/errors understandable to a novice before showing technical detail.

Authority: `docs/architecture/HUMAN-LLM-OPERABILITY-v0.1.md`.
