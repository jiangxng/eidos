# Eidos Quick Context — Minimal LLM Bootstrap

If context budget is tight, read this file plus the relevant Capability and Contract.

**Purpose:** deterministic Experience system primarily for LLM use.

**Optimize for:** reliability, low LLM error surface, composition reuse, low generated-code volume, deterministic validation.

**Boundary:** EC/LLM interprets intent and proposes. Eidos validates and realizes. Host owns truth/execution. Human owns judgment and explicit direct manipulation.

**Never:** guess unknown capabilities; mutate enterprise truth; execute arbitrary generated code in Core; hide mandatory evidence; let personalization destroy shared reference.

**Prefer:** capability discovery -> proposal -> validation -> realization -> ActionRequest.

**Stability:** invariant > shared-stable > personal-stable > adaptive.

**Evolution:** one Constitution, multiple specialized cores, many capabilities/renderers, one deterministic language for LLMs.

**Human customization:** use direct manipulation when faster; explicit human choice outranks EC inference unless higher-order integrity/policy constraints apply.

**Mandatory for Human UI work:** read `docs/product/EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md` and `docs/product/EIDOS-HUMAN-UI-DESIGN-REVIEW-CHECKLIST-v1.0.md` first; review the normative navigation/color/interaction documents before proposing or changing UI. Include the required UI review record in the implementation PR and distinguish machine checks from Human acceptance. Do not jump straight to markup or CSS.

**Read next:** `llm/TOOL-USAGE.md`, then the relevant `capabilities/**/CAPABILITY.md`.
