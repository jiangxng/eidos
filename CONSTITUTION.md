# EIDOS Constitution v1 — Candidate

**Status:** Founder-confirmed candidate  
**Authority:** Highest  
**Applies to:** All Eidos architecture, contracts, capabilities, APIs, implementations, documentation, tests and evolution.

## Preamble — Why Eidos Exists

LLMs can generate software quickly, but every newly generated implementation adds uncertainty, validation cost and opportunities for error.

Eidos does not exist to help LLMs generate more code. Eidos exists so that LLMs need to generate less code.

**Canonical definition**

> Eidos is a deterministic experience tool system designed primarily for LLMs. It provides explicit, versioned, verifiable, discoverable, composable and replaceable capabilities that allow LLMs to construct human digital experiences with minimal new code, while keeping human-intent intelligence, business truth and business execution outside the Eidos boundary.

中文：

> Eidos 是一个以 LLM 为主要使用者的确定性 Experience 工具系统。它通过显式、版本化、可验证、可发现、可组合和可替换的 Capability，使 LLM 以尽可能少的新代码为人类构造数字体验，同时将 Human Intent Intelligence、业务 Truth 和业务 Execution 保持在 Eidos 边界之外。

## Article I — LLM First

Eidos is overwhelmingly LLM-oriented. The target operating model is approximately 99.9% LLM-executed software engineering work. Human software developers are not an assumed system role.

LLMs are the default engineers for architecture, implementation, extension, migration, tests, documentation and maintenance. Humans primarily provide intent, judgment, authorization, constraints and acceptance. Repository structure, architecture, documentation, contracts, APIs, errors, tests and capability discovery are optimized for reliable LLM understanding and use.

Prefer explicit over implicit, deterministic over guessed, stable interfaces over hidden convention, bounded context over whole-repository reconstruction, and structured knowledge over author memory.

## Article II — Composition Before Generation

**Composition Before Generation.**

- Compose before generating.
- Configure before coding.
- Reuse before reimplementing.

For an experience requirement, an LLM first discovers existing Eidos capabilities. New executable implementation is created only when existing capabilities cannot express the requirement.

Eidos maturity is measured partly by how little new code an LLM must generate for equivalent requirements.

## Article III — Capability Before Component

The primary reusable asset of Eidos is an **Experience Capability**, not a specific UI component.

A capability describes what an experience can do. A component or renderer describes one way to present that capability on one terminal.

A capability must not be permanently bound to a component. TreeSelect, for example, is a possible renderer of hierarchical selection; it is not the semantic capability itself.

## Article IV — LLM Context Determinism

Eidos must satisfy **LLM Context Determinism**.

A capable LLM entering the repository without prior conversation, author explanation, hidden knowledge or personal memory must be able to determine:

- what Eidos is and is not;
- which capabilities exist;
- when each capability should and should not be used;
- inputs, outputs, state ownership and side-effect boundaries;
- stable contracts and prohibited dependencies;
- where to modify code;
- how to validate the modification.

**Repository is the authoritative context.**

Confirmed decisions must be encoded in repository artifacts. Conversation memory must never be required for correct maintenance or execution.

## Article V — Explicit Contracts and Deterministic Validation

LLMs are probabilistic. Eidos does not attempt to make the LLM deterministic; it makes the boundary deterministic.

> **LLM proposes. Contracts describe. Validators verify. Runtime realizes.**

Do not use an LLM where deterministic machinery can provide the guarantee.

Schema validity, contract compatibility, capability availability, version compatibility, renderer support, input constraints and architecture boundaries should be machine-verifiable whenever practical.

Errors should be structured and explain what failed, where, why, which rule was violated, what was expected and what can be changed.

## Article VI — Clear Ownership and Boundaries

Roles are separated:

- **Intelligence / Producer** understands Human Intent and decides what experience should be constructed. This is outside Eidos.
- **Experience Contract** explicitly describes the requested experience.
- **Eidos** validates and deterministically realizes the experience.
- **Host** owns business truth, persistence, business execution and real-world side effects.
- **Human** handles matters requiring human judgment, authorization and decision.

Therefore:

- Description is not execution.
- Request is not execution.
- Interaction state is not business state.
- Presentation of truth is not ownership of truth.
- Eidos must not infer business meaning from field names, component names or implicit convention.

The Core Runtime does **not** allow arbitrary LLM-generated executable code at runtime by default. New executable capabilities enter the normal development, validation and versioning pipeline.

## Article VII — Stable Contracts, Replaceable Implementations

**Stable contracts, replaceable implementations.**

Components, renderers, host adapters, producers and internal implementations may evolve or be replaced behind stable contracts.

Eidos may know EVO and Experience Compiler exist, but must not depend on their internal implementations.

EVO may host Eidos; Eidos is not “the EVO frontend.” Experience Compiler may produce Experience Contracts; it is not part of Eidos Runtime.

## Article VIII — Human Attention and Decision Clarity

Eidos ultimately serves humans.

**Human Attention Is Scarce.**

**Machine handles complexity; human attention is reserved for judgment.**

Human Decision Experience is a first-class Eidos direction. When human judgment is required, Eidos should help the person understand what happened, why attention is required, what evidence matters, which choices exist, likely consequences, and the basis of any recommendation.

The goal is not maximum information density. The goal is **Decision Clarity**.

## Article IX — Experience Beyond the Web

Experience is not permanently equivalent to a Web page.

Web DOM is one renderer. Capabilities should be able to evolve toward Desktop, Web, Mobile, Tablet, Native, Large Screen, Embedded UI, Terminal, Voice, Agent UI and future terminals.

Long-term direction:

> **More Capabilities × More Renderers**

## Article X — Controlled Evolution

Important changes to contracts, capabilities, public APIs and architecture are explicit and include, where applicable:

- Version
- Rationale
- Compatibility rule
- Migration path
- Deprecation path
- Validation
- Rollback strategy

Never silently change the meaning of an existing contract.

Historical implementation is valuable project capital, but it is not architectural authority.

> **Preserve implementation assets; correct architectural boundaries.**

Prefer Adapt → Migrate → Deprecate → Replace over Repository Replacement.

## Direction

Eidos should evolve toward:

- more reliable capabilities;
- more renderers and terminals;
- less newly generated code;
- lower LLM error probability;
- less required context;
- stronger deterministic validation;
- shorter Time-to-Experience;
- faster runtime;
- clearer human decision experiences.

> **More capability. Less generated code. Less uncertainty. Less context. Faster experience. Clearer decisions.**

## Constitutional Design Test

Any important capability, API or architecture change should answer:

1. Does it help an LLM understand Eidos more deterministically?
2. Does it reduce the new code an LLM must generate?
3. Can it be discovered and composed?
4. Can it be deterministically validated?
5. Are ownership and side effects explicit?
6. Does it preserve Eidos boundaries?
7. Can an LLM understand it without conversation history?
8. Is implementation replaceable behind a stable contract?
9. Can the capability survive a different renderer?
10. Does it ultimately make the human experience faster, clearer or more focused?

If a design repeatedly fails these tests, working code alone is not sufficient for admission into canonical Eidos architecture.


## Article XI — Adaptive, Yet Stable

Eidos is **deterministic for machines, adaptive for humans, and stable where shared understanding and familiarity matter**.

Adaptation is not perpetual rearrangement. Good adaptation should converge toward fit.

> **Adaptation should converge toward fit, not produce perpetual change.**

Personalization may adapt presentation, density, prioritization, interaction style and assistance, but must preserve stable mental models where familiarity, safety, collaboration or policy require stability.

## Article XII — Shared Understanding Overrides Personal Variation

Personalization must never destroy shared reference.

During collaboration, shared truth, shared decision state, shared evidence and shared reference points must remain stable across participants. Personal assistance may surround the shared core, but must not alter the meaning of the shared work.

> **Shared core, personal periphery.**

Organization policy, decision integrity, accessibility and collaboration requirements override personal preference.

## Article XIII — Experience Integrity

The following are constitutional Experience Invariants:

- Business truth must remain invariant under personalization.
- Decision-critical evidence must remain available.
- Semantic importance must not be downgraded merely because a user dislikes interruption.
- Attention semantics are distinct from attention presentation.
- Motion semantics are distinct from renderer-specific animation.
- Personalization must be reversible and resettable.
- Eidos must remain usable with a deterministic standard experience when EC or personalization context is unavailable.
- Runtime does not silently learn or maintain a competing user-personality model; EC owns long-term learning and preference resolution.


## Article XIV — Human + LLM Operability

Eidos experiences must make domain capability understandable to both LLMs and humans.

Normal business operation must not depend on human developers translating business intent into source code, SQL or hidden implementation structures. LLMs are expected to perform ordinary software engineering and capability extension work.

The default experience must be usable by a novice through business terminology and guided interaction. Advanced technical detail may be progressively disclosed, but must not dominate ordinary operation.

Human-readable and machine-readable representations must share one declared semantic truth. Eidos may render schemas, AST-backed configuration and compiled contracts, but it must not force business users to reason directly in those internal representations.

Business-facing validation and errors explain the business problem first; implementation diagnostics are secondary.

Authority: `docs/architecture/HUMAN-LLM-OPERABILITY-v0.1.md`.


## Article XV — Eidos Usage Integrity

A human-facing product surface may be described or accepted as **Eidos-based** only when its semantic interaction model is realized through Eidos public contracts/capabilities and a supported Eidos runtime/renderer boundary.

Visual imitation is not Eidos integration. A bespoke HTML/JS page that merely resembles an Eidos experience MUST NOT be used as evidence that a product surface is Eidos-based.

For EVO-family product verification, diagnostic-only bespoke surfaces may exist when explicitly labelled non-product, but they MUST NOT satisfy product UX, installation-flow or business-experience acceptance gates.

Host applications may own transport, authentication, routing and outer chrome. Business-facing controls, actions and experience semantics claimed as Eidos-based must remain traceable to Eidos public contracts and deterministic rendering/interaction behavior.


## Article XVI — Framework Before Product-Specific Frontend

For EVO-family and other projects that adopt Eidos as their experience framework, human-facing frontend work MUST pass through Eidos public capabilities/contracts.

When a product requirement cannot be expressed by current Eidos capability:

1. identify the missing reusable experience capability;
2. implement it in Eidos behind a stable public contract and renderer boundary;
3. validate it inside Eidos;
4. consume that capability from the product project.

The product project MUST NOT solve the gap by creating a parallel business-UI framework or bespoke semantic frontend. Host-owned shell/chrome, transport and routing remain allowed, but product interaction semantics belong to Eidos.

This rule preserves layering:

```text
Product business/lifecycle semantics
        ↓ public experience contract
Eidos capability/runtime/renderer
        ↓
Human experience
```
