# Eidos Experience Architecture Constitution v0.1

**Status:** P0 experience authority  
**Date:** 2026-09-28  
**Applies to:** Eidos, App Host, plugin Experiences, generated applications, LLM-authored UI, Agent-assisted workflows, and downstream products adopting Eidos.

## 1. Purpose

Eidos needs an authority above visual design language.

A page can be visually compliant and still be an incomplete product experience: a setup flow can stop after Save, a review page can expose machine enums instead of human meaning, a deterministic action can be available only through chat, or an LLM can generate an isolated form without knowing what comes before or after it.

This constitution prevents that class of failure.

The core rule is:

> **Pixel review is final confirmation, not the source of product correctness.**

An Experience MUST be structurally reviewable even when a Human or LLM cannot see a real browser. Product completeness must be derivable from declared page archetype, user goal, subject/state, journey, actions, feedback, recovery and Agent role.

## 2. Authority stack

Eidos experience authority is layered:

1. **Experience Architecture Constitution** — what makes a task complete and operable.
2. **Experience Contracts** — machine-readable goal/state/journey/action declarations.
3. **Capabilities / Page Archetypes** — reusable semantic page and interaction patterns.
4. **Productive Design Language** — layout, hierarchy, density, buttons, responsive behavior and visual semantics.
5. **Renderer / Terminal** — concrete web, desktop, mobile, voice or Agent realization.

A new LLM MUST NOT start from layer 5 and invent product behavior from markup.

## 3. The experience formula

For bounded productive work, use:

```text
Experience = Archetype + Goal + Subject + State + Journey + Actions + Feedback + Recovery + Agent Assistance
```

Short form:

```text
E = P + G + O + S + J + A + F + R + AI
```

Where:

- **P — Page Archetype:** what kind of working surface this is.
- **G — Goal:** why the Human is here.
- **O — Object / Subject:** what the Human is acting on or understanding.
- **S — State:** what state the subject/task is currently in.
- **J — Journey:** entry, prerequisites, current step, completion and continuation.
- **A — Actions:** what can be done now, under current state/context/authority.
- **F — Feedback:** what happened after an action and what changed.
- **R — Recovery:** how failure, interruption, cancellation and resume work.
- **AI — Agent Assistance:** what AI may explain, recommend, prepare or execute.

A bounded production task that omits a materially required term is incomplete even if it renders correctly.

## 4. Canonical page archetypes

Eidos recognizes a small set of reusable product archetypes.

| Archetype | Primary Human intent | Expected capabilities |
|---|---|---|
| Collection / List | find, compare, select, batch | create, search, filter, sort, group, select, batch action, open detail |
| Detail | understand and act on one subject | state, primary action, edit, related objects, history, contextual actions |
| Overview / Aggregation | understand overall condition | range/filter, drill-down, explain change, inspect exceptions |
| Work Queue | finish assigned or detected work | next item, process, defer, assign, batch, exception handling |
| Editor / Compose | create or modify | validate, save, save-and-continue, cancel, assist/draft |
| Review / Decision | make a bounded judgment | accept/reject/edit, evidence, comparison, reason, next state |
| Setup / Onboarding | make a capability usable | prerequisites, current step, test/validate, next, recovery, completion |
| Explorer / Search | locate an uncertain subject | search, narrow, preview, open, save/favorite, Agent-assisted find |
| Conversation / Agent | express goals requiring interpretation | natural language, suggestions, evidence, proposals, declared quick actions |

An archetype is semantic, not a fixed visual template. Applications may compose archetypes, but they may not bypass the semantic obligations of the archetypes they use.

## 5. State determines actions

Actions belong to **subject + state + context + authority**, not merely to a page.

```text
Available Actions = f(Subject, State, Context, Permission, Policy)
```

The same Detail page may expose different actions in draft, pending approval, approved, fulfilling and completed states.

A renderer MUST NOT invent business actions from labels. The owning Host/Package declares which actions are available; Eidos determines standard presentation.

## 6. Action grammar

Common productive actions form a stable interaction vocabulary.

Deterministic examples:

`Create, Open, Edit, Save, Submit, Approve, Reject, Assign, Start, Complete, Pause, Retry, Cancel, Duplicate, Archive, Restore, Delete, Export, Share, Filter, Search, Compare, Drill down, View history, View related`.

AI-era assistive actions include:

`Explain, Summarize, Recommend, Draft, Generate, Find, Diagnose, Predict, Plan, Automate, Ask`.

These vocabularies complement rather than replace each other.

### 6.1 Human Directness Rule

When an action is:

- known;
- deterministic;
- low ambiguity; and
- frequent or clearly contextual,

the normal interface SHOULD expose a direct manipulation path.

A Human MUST NOT be forced to type a chat instruction for an action that can safely and clearly be represented as a button, menu item, shortcut, toggle, selection or other direct control.

Examples:

- **Approve** is better than requiring “Please approve this order.”
- **Save and continue** is better than requiring the Agent to infer that the user is done editing.
- **Retry connection** is better than requiring a diagnostic conversation.

Chat-only access is acceptable for open-ended, interpretive or genuinely conversational tasks.

### 6.2 One primary next action

A bounded action scope should expose at most one primary forward action. Supporting actions remain lower emphasis. Destructive actions are separated from the forward path.

## 7. Dual-channel AI-native interaction

Eidos uses two first-class interaction channels.

### Direct manipulation

Best for known, deterministic, frequent, low-ambiguity operations.

Goal: **see it, understand it, act once.**

### Agentic interaction

Best for ambiguous goals, cross-object reasoning, cross-application work, diagnosis, planning and explanation.

Goal: **express intent rather than learn navigation.**

The two channels converge through **Contextual Quick Actions**.

An Agent may say:

```text
3 critical materials may delay 5 orders.

[Create replenishment plan] [View affected orders] [Not now]
```

The Agent should not merely describe an available deterministic action in prose when a safe declared action can be surfaced directly.

### 7.1 Mixed-initiative rule

Eidos adopts the Human-AI interaction idea of **mixed initiative**: direct manipulation and intelligent assistance are complementary, not competing product ideologies.

The preferred controller at any moment is the one that can reduce total Human effort while preserving clarity, authority and recoverability.

Use direct manipulation when:

- intent is already known;
- action semantics are deterministic;
- state/consequence can be made visible;
- the operation is frequent or strongly contextual;
- a button, selection, batch action, short form or small drag/drop operation is cheaper than language.

Use Agent initiative when:

- intent is incomplete or ambiguous;
- evidence must be synthesized;
- work crosses people, teams, companies or software systems;
- vocabularies/data models must be translated;
- planning/diagnosis/exception handling is required;
- coordination spans multiple steps or owners.

An Agent may discover, prepare, explain or orchestrate a declared action, but availability of an Agent is not a reason to remove an efficient direct interaction.

This rule is grounded in the Direct Manipulation and Mixed-Initiative HCI research cataloged in `DESIGN-RESEARCH-SOURCES-v0.1.md`.

### 7.2 Experience simplification obligation

Before adding conversational interaction to an enterprise workflow, the designer/LLM MUST ask whether product design can remove the need for conversation by:

- exposing the relevant state;
- adding a contextual action;
- choosing a safe default;
- supporting batch work;
- reducing navigation;
- adding direct manipulation;
- turning a recurring explanation into product copy/status;
- converting a stable repeated request into a governed workflow.

AI does not excuse avoidable interaction friction.

## 8. Declared-action boundary for Agents

Agent flexibility does not grant arbitrary UI or business authority.

- Agents may recommend declared actions.
- Agents may prepare inputs for declared actions.
- Agents may execute only actions the Host exposes and policy authorizes.
- Agents must not fabricate commands from prose.
- Consequential actions preserve confirmation/authorization requirements.
- Direct UI and Agent execution must converge on the same Host command semantics.

This keeps AI flexibility inside enterprise control boundaries.

## 9. Journey Continuity

A productive flow is a journey, not a set of unrelated pages.

For bounded tasks, declare:

```text
goal
entry
prerequisites
current state / step
available actions
recommended next action
completion criteria
next destination
failure recovery
resume behavior
```

Every transition should either:

1. advance the task;
2. expose a clear blocker with a repair action; or
3. close the task cleanly.

A successful action that strands the Human on a page with no clear next step is an experience defect.

### Setup-specific rule

Setup/onboarding must be goal-oriented and progressively disclosed.

Prefer:

```text
Connect AI service
→ provide credential
→ validate automatically
→ choose/recommend runtime
→ confirm use
→ ready
→ open feature
```

over exposing internal implementation fields as the primary mental model.

The system should infer or default what it safely can. Advanced/provider-specific controls remain available through progressive disclosure.

## 10. Settings versus workflow

Settings are for relatively stable configuration and preferences.

Commands that are part of the normal task flow stay near the task they affect.

Task-specific configuration should normally be reachable in context rather than forcing a detour to a general Settings area.

When a journey must cross into Settings:

- provide a direct action to the exact setting;
- preserve the originating journey;
- on completion, return or continue to the next relevant step;
- do not require the Human to remember navigation instructions.

## 11. Feedback and closure

An actionable Experience must distinguish at least:

`idle → pending → success/error → resulting state`.

For long-running actions, visible progress is required when silence would create uncertainty.

On success, communicate:

- what completed;
- resulting state;
- next meaningful action when one exists.

On failure, communicate:

- what failed in Human language;
- what remains unchanged where relevant;
- the closest repair/retry action.

Do not use raw error codes as the primary message.

## 12. Recovery and resumability

Multi-step work should survive normal interruption when technically feasible.

A mature Experience defines:

- back/cancel semantics;
- retry semantics;
- resumability;
- preservation of valid prior input;
- focus restoration;
- behavior after partial completion.

Repair should return the Human to the broken step, not restart unrelated completed work.

## 13. Human-facing language and machine values

Machine identifiers, enum values, command names, receipts, proposal IDs, provider IDs and test names are not default Human copy.

Rules:

- user-facing system text goes through localization;
- stable machine values remain stable and untranslated;
- machine values may appear in Details / Diagnostics / Advanced when useful;
- Human-facing labels explain machine states;
- business/user-authored content is not automatically translated merely because the chrome is localized.

Fallback language is resilience, not localization completeness.

## 14. Product maturity

Every Experience should have an explicit maturity level.

### Experimental

May be incomplete for exploration.

Allowed:
- partial journeys;
- temporary UI;
- incomplete localization;
- limited state handling.

It must not silently present itself as production-complete.

### Candidate

Requires:
- explicit archetype and goal;
- coherent journey for bounded tasks;
- action hierarchy;
- direct manipulation for known deterministic actions;
- localization coverage for required product locales;
- loading/empty/error/terminal semantics where applicable;
- Eidos Design Language compliance.

### Production

Adds:
- recovery/resume where applicable;
- accessibility and keyboard behavior;
- responsive behavior;
- permission/security correctness;
- telemetry/observable action completion where applicable;
- regression journeys;
- compatibility/migration expectations;
- Human visual/interaction validation.

## 15. Golden Journeys

Critical user goals are tested as **Golden Journeys**, not merely page renders.

A Golden Journey asserts the Human can get from an entry condition to an outcome, including repair paths.

Example:

```text
No Provider
→ Install Provider
→ Credential required
→ Configure credential
→ Verify runtime
→ Resolve binding
→ Personal Agent ready
→ Open Personal Agent
```

A page-render test can pass while this journey is broken. Production certification requires the journey to pass.

## 16. Non-visual review logic

When real UI inspection is unavailable, reviewers and LLMs MUST inspect at least:

1. What archetype is this?
2. What Human goal does it serve?
3. What subject/state is shown?
4. What is the primary next action?
5. Which deterministic actions are directly available?
6. What prerequisites/blockers exist?
7. What happens after every action?
8. What is the completion condition?
9. How does failure recover?
10. Can interrupted work resume?
11. Are internal machine values separated from Human copy?
12. Are all system strings localizable?
13. Does Agent assistance use declared actions rather than invent authority?
14. Are advanced details progressively disclosed?
15. Can a keyboard/touch user complete the same goal?

This checklist does not replace Human visual validation; it prevents structural UX defects before pixel review.

## 17. CI gates

The intended product-quality gates are:

1. **Experience Structure Gate** — archetype, goal and maturity are declared.
2. **Journey Continuity Gate** — bounded tasks have entry/prerequisites/completion/recovery semantics.
3. **Action Grammar Gate** — state-appropriate actions and primary hierarchy are coherent.
4. **Human Directness Gate** — deterministic frequent actions are not chat-only.
5. **Product Quality Gate** — localization, accessibility, responsive behavior, design language and recovery meet maturity requirements.

A future LLM may change implementation details, but it must pass these gates.

## 18. External foundations

Eidos adopts principles, not visual clones.

- Microsoft Windows settings guidance: smart defaults, fewer settings, task commands kept out of generic Settings, grouped configuration and on-demand advanced options.
- Ben Shneiderman direct-manipulation research: preserve comprehensible, predictable, controllable direct interaction for suitable tasks.
- Eric Horvitz mixed-initiative interaction research: couple intelligent services with direct manipulation rather than forcing an all-automation/all-GUI choice.
- Microsoft Human-AI Interaction Guidelines: make capability clear, act contextually, support efficient invocation/dismissal/correction and preserve control over time.
- Google PAIR Guidebook: first determine whether AI adds unique value; design feedback/control, graceful failure and supervision of automation.
- Microsoft 365 Copilot UX guidance: conversational surfaces should add value that is difficult or inefficient through traditional navigation, and should expose focused capabilities rather than rebuild whole applications inside chat.
- Apple HIG Generative AI: AI is not right for every feature; use it when it creates clear value, preserve Human agency and retain non-AI paths when practical.
- Microsoft Fluent interaction guidance: define trigger/response/stop conditions; each turn should advance the task or close it cleanly; ask only for information needed for the next step.
- Apple HIG: good defaults, minimal settings, task-specific options in task context, direct links to needed settings, progressive disclosure.
- IBM Carbon: one primary action per action scope; multi-step progress communicates current/completed/future steps; validate before progression and show repair guidance.
- W3C APG: predictable keyboard interaction, visible/persistent focus and focus restoration across dialogs or state-changing operations.

The curated URLs live in `DESIGN-RESEARCH-SOURCES-v0.1.md`.

## 19. Governance

This constitution is P0 experience authority.

A new reusable interaction pattern belongs in Eidos before product-specific copies proliferate.

A fresh LLM modifying a production Experience MUST treat this document, its machine-readable policy and the CI validators as constraints. It must not rely on conversation memory to reconstruct them.

The long-term goal is deliberate:

> **Move product knowledge from LLM memory into executable architecture.**
