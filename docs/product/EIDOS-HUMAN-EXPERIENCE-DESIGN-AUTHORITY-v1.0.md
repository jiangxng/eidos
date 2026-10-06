# Eidos Human Experience Design Authority v1.0

**Status:** Current authority index and synthesis  
**Applies to:** Eidos, App Host, Workbench, plugin Experiences, generated applications, mobile/tablet/desktop surfaces, and downstream products adopting Eidos

## 1. Purpose

Eidos already has several mature design authorities. They answer different questions and MUST NOT be collapsed into one vague "design system".

This document is the stable first-read for a fresh Human or LLM.

- **Experience Architecture** decides whether a Human task is complete and operable.
- **Navigation & Information Architecture** decides where capabilities are discoverable and how they are grouped.
- **Productive Design Language** decides interaction hierarchy, density, action placement and progressive disclosure.
- **Business Office Visual Language** decides visual character, color, surface, typography and chrome.
- **Mobile Design Language** decides phone/tablet realization of the same semantics.
- **Icon System** decides standard icon semantics and visual consistency.

A visually polished page can still be a bad Experience. A complete Experience can still be placed in the wrong navigation layer. A correct navigation model can still be rendered with the wrong visual character.

## 2. Authority stack

For Human-facing product work, use this order:

1. `docs/product/EIDOS-EXPERIENCE-ARCHITECTURE-CONSTITUTION-v0.1.md`
2. `docs/product/EIDOS-ENTERPRISE-NAVIGATION-INFORMATION-ARCHITECTURE-v0.1.md`
3. `docs/product/EIDOS-PRODUCTIVE-DESIGN-LANGUAGE-v0.1.md`
4. `docs/product/EIDOS-BUSINESS-OFFICE-VISUAL-LANGUAGE-v0.2.md`
5. `MOBILE-DESIGN-LANGUAGE.md`
6. `docs/product/EIDOS-ICON-SYSTEM-v0.1.md`
7. machine-readable policy/tokens/runtime under `src/experience-architecture` and `src/design-language`

Conflict priority:

1. accessibility/security/platform invariants;
2. Experience Architecture;
3. Navigation & Information Architecture;
4. Productive interaction rules;
5. Business Office visual realization;
6. Surface-specific realization.

## 3. Experience model

The canonical formula remains:

```text
Experience
= Archetype
+ Human Goal
+ Subject
+ State
+ Journey
+ Actions
+ Feedback
+ Recovery
+ Agent Assistance
```

A page that only renders fields is not automatically a complete product Experience.

For every bounded task, the design must answer:

- why the Human is here;
- what object/state is being worked on;
- what the primary next action is;
- what constitutes completion;
- how failure recovers;
- which actions should be directly operable;
- what an Agent may explain, prepare or execute.

## 4. Human Directness and Agent Coordination Principle

AI-native does not mean chat-first for every action.

> **If a Human can finish a frequent, deterministic, low-ambiguity task with one click, a short form, a direct selection or a small drag/drop operation, the product should not force that Human to describe the same action in natural language.**

Default optimization order:

```text
lowest Human effort that preserves clarity/control
→ direct manipulation
→ guided workflow
→ contextual Agent assistance
→ open-ended Agent conversation
```

Agent value is highest where ordinary interfaces and organizational boundaries are expensive:

- natural-language communication between people remains necessary;
- information must cross teams, enterprises or software systems;
- different systems use incompatible structures or vocabulary;
- the Human goal is incomplete or ambiguous;
- many objects/sources must be synthesized;
- coordination spans several steps, owners or tools;
- diagnosis, planning, research or exception handling is required.

Therefore:

- do not hide a good button merely to increase Agent usage;
- do not make deterministic frequent actions chat-only;
- allow Agent assistance to invoke the same declared actions as direct UI;
- use Agent reasoning to bridge handoffs and information islands rather than duplicate cheap direct manipulation;
- measure Agent value by reduced coordination/friction/time, not by conversation volume.

This principle applies to UI design, navigation, workflow design, Agent products and EC learning priorities.

## 5. Consequence: UI design has a higher bar

Because direct interaction remains the preferred path for simple work, AI does **not** reduce the need for careful UI design. It increases it.

For each important workflow, the designer/LLM must ask:

1. Can the Human complete this faster with a direct control than with language?
2. Can several steps be collapsed into one safe action?
3. Can object relationships be manipulated visually instead of described?
4. Can defaults eliminate questions?
5. Can context eliminate navigation?
6. Can batch operations eliminate repetitive conversation?
7. Can the UI show state, consequence and next action clearly enough that no explanation is required?
8. Is Agent intervention genuinely adding reasoning/coordination value?

The goal is not "more UI" or "more chat". The goal is **lower total Human effort** while preserving control, auditability and comprehension.

This means mature Eidos Experiences need reusable support for:

- contextual actions;
- direct manipulation;
- drag/drop where semantically appropriate;
- bulk selection and batch action;
- inline edit;
- previews/diffs;
- progressive disclosure;
- business-readable state;
- recovery and undo/compensation patterns where possible;
- cross-object navigation;
- Agent-to-action handoff.

## 6. Navigation model

Navigation is a projection of useful work, not an inventory of installed code.

Default hierarchy:

```text
Global session context
→ Primary work navigation
→ Application/domain navigation
→ Business administration
→ Settings/system administration
→ Contextual professional tools
→ Search / Command / Agent long-tail discovery
```

Consequences:

- Package installed does not imply persistent navigation.
- The same destination should not normally be duplicated in Activity Bar and another persistent menu.
- Low-frequency system/admin functions belong in Settings or administration.
- Professional editors/viewers/diagnostics should usually be contextual tools.
- Long-tail capabilities belong to Search/Agent discovery rather than permanent menu growth.
- Technical architecture names should not leak into ordinary business navigation when a clear business term exists.

Full authority: `docs/product/EIDOS-ENTERPRISE-NAVIGATION-INFORMATION-ARCHITECTURE-v0.1.md`.

## 7. Interaction model

Productive interaction defaults:

- one primary action per bounded scope;
- deterministic frequent actions are directly operable;
- low-frequency actions move to overflow or progressive disclosure;
- task-specific configuration stays near the task;
- stable platform configuration belongs in Settings;
- destructive actions remain separate;
- technical identifiers are secondary to Human-readable language;
- loading, success, error, recovery and next-step semantics are part of the Experience.

Settings are not a dumping ground for normal task commands.

## 8. Visual model

The normative visual personality is **Business Office**:

- calm;
- professional;
- approachable;
- trustworthy;
- productive;
- content-first.

Default realization:

- soft neutral page canvas;
- white business content surfaces;
- restrained business blue for selection/focus/primary action;
- semantic status colors only for real status;
- subtle borders and shallow elevation;
- standard system icons monochrome by default;
- platform-native office typography;
- technical/developer chrome progressively disclosed;
- no browser-like address bar or permanent technical status bar in normal business work.

Eidos is not visually positioned as an IDE, developer console, generic admin dashboard or technical SaaS shell.

## 9. Responsive and mobile model

Mobile is not desktop squeezed smaller.

The same semantic Experience is re-realized as:

- one primary task surface at a time;
- bottom primary navigation with icon + short label;
- compact global context;
- secondary context as replacement/overlay/sheet;
- single-column forms and lists;
- safe-area-aware chrome;
- minimum 44px touch targets;
- system/browser text scaling;
- optional Eidos text preference layered on top.

Plugins do not own private mobile shells, breakpoints or device-specific business semantics.

## 10. Icon model

Standard product UI uses the Eidos semantic icon registry.

- ordinary system icons are monochrome;
- selected/emphasized state may use governed brand tone;
- application/domain identity color is separate;
- arbitrary plugin icon systems are not the default;
- icon-only controls require accessible names/tooltips;
- mobile primary navigation shows a visible short label.

## 11. Human language model

Business users should see business language before system architecture language.

Machine identifiers, Package IDs, protocol versions and runtime receipts remain available under Details / Advanced / Diagnostics / Technical information when useful.

## 12. AI-native interaction model

Eidos uses two first-class channels.

### Direct manipulation

Use for known, deterministic, frequent, low-ambiguity work.

### Agentic interaction

Use for:

- ambiguous intent;
- cross-object reasoning;
- cross-person coordination;
- cross-company coordination;
- cross-application/system orchestration;
- information-island bridging;
- diagnosis;
- planning;
- explanation;
- long-tail discovery.

The Agent should surface declared contextual quick actions rather than forcing chat to replace good product controls.

Long-term rule:

> **Menus and direct controls support stable muscle memory; Search and Agent interaction handle the long tail, ambiguity and coordination gap.**

## 13. EC learning implication

EC should not learn only "what answer to give".

For Human Experience improvement, EC should accumulate evidence about:

- recurring task paths;
- repeated manual handoffs;
- repeated questions that could become UI state or a direct action;
- UI steps that cause hesitation, reversal or error;
- operations that are repeatedly performed in batches;
- cross-system/cross-company translation and reconciliation;
- where Humans still need natural-language negotiation;
- where Agent assistance was used even though a simpler direct interaction would have been cheaper;
- where a proposed UI control reduced coordination time or error rate.

EC may propose Experience improvements to Eidos through semantic capabilities, but Eidos remains the deterministic owner of interaction realization and fallback.

The learning target is:

> **minimize total Human effort and coordination cost, not maximize Agent conversation volume.**

## 14. Design ownership

### Eidos owns

- reusable Experience architecture;
- Workbench shell;
- navigation semantics and placement rules;
- responsive/mobile realization;
- visual tokens;
- standard controls;
- icon system;
- accessibility behavior;
- generic interaction patterns.

### Product/Host owns

- product vocabulary;
- business capabilities;
- role/permission/context truth;
- business-specific navigation contributions;
- workflows/content;
- authorization and policy.

### Plugin owns

- domain semantics;
- business actions;
- pages/routes/capabilities;
- optional declared navigation contribution when justified;
- domain identity/visualization when genuinely required.

A plugin does not own a competing shell, design system, mobile shell, standard icon system or generic navigation architecture.

## 15. Design review decision table

| Question | Authority |
|---|---|
| Is the task/journey complete? | Experience Architecture Constitution |
| Should this capability appear in navigation? | Enterprise Navigation & IA |
| Is this daily work, administration, Settings or contextual tooling? | Enterprise Navigation & IA |
| Should this be a button/drag/direct action or Agent interaction? | Human Directness Principle + Experience Architecture |
| Where does the primary action go? | Productive Design Language |
| Should this be Settings or stay in task context? | Experience Architecture + Productive Design Language |
| What color/surface/radius/typography should it use? | Business Office Visual Language + tokens |
| How does it work on phone? | Mobile Design Language |
| Which icon should be used? | Icon System |
| Can a plugin invent its own shell/style? | No; extend Eidos first |

## 16. Fresh-LLM workflow

For any Human-facing UI task:

1. read this document;
2. identify the Human goal and page archetype;
3. decide direct manipulation vs Agent coordination;
4. classify navigation/discoverability;
5. identify direct actions and journey completion;
6. apply Productive interaction rules;
7. apply Business Office visual rules;
8. resolve desktop/tablet/mobile realization;
9. use Eidos icons/tokens;
10. check localization/accessibility;
11. verify no product/plugin-specific fork was introduced.

Do not begin by writing markup/CSS and infer product behavior afterward.

## 17. Canonical design documents

Current authority set:

- `docs/product/EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md`
- `docs/product/EIDOS-EXPERIENCE-ARCHITECTURE-CONSTITUTION-v0.1.md`
- `docs/product/EIDOS-ENTERPRISE-NAVIGATION-INFORMATION-ARCHITECTURE-v0.1.md`
- `docs/product/EIDOS-PRODUCTIVE-DESIGN-LANGUAGE-v0.1.md`
- `docs/product/EIDOS-BUSINESS-OFFICE-VISUAL-LANGUAGE-v0.2.md`
- `MOBILE-DESIGN-LANGUAGE.md`
- `docs/product/EIDOS-ICON-SYSTEM-v0.1.md`
- `docs/product/DESIGN-RESEARCH-SOURCES-v0.1.md`

Supporting architecture:

- `docs/architecture/EXPERIENCE-ARCHITECTURE.md`
- `docs/architecture/EXPERIENCE-INVARIANTS.md`
- `docs/architecture/SURFACE-CONTRACT-AND-RESOLVER-v0.1.md`
- `docs/architecture/HUMAN-LLM-OPERABILITY-v0.1.md`

Historical ADRs are loaded only when rationale, compatibility or archaeology is needed.

## 18. Practice roadmap

This authority is intended to evolve through measured practice rather than a one-time redesign.

### Phase 1 — classify and clean

- audit current navigation placement;
- remove duplicate persistent destinations;
- move low-frequency system/admin capabilities to Settings;
- preserve contextual professional tools without permanent chrome;
- audit chat-only deterministic actions and restore direct controls.

### Phase 2 — strengthen direct interaction

- add reusable contextual actions;
- improve batch actions and inline operations;
- use drag/drop only where object relationships are naturally spatial;
- add previews/diffs and clear resulting-state feedback;
- reduce unnecessary navigation and configuration questions.

### Phase 3 — instrument Human effort

Where governance permits, measure Experience friction through product evidence such as:

- repeated path length;
- repeated retries/reversals;
- task completion time;
- repeated manual handoffs;
- batchable repetition;
- Agent requests that map to deterministic actions;
- cross-system copy/re-entry patterns.

Metrics are evidence for improvement, not permission for hidden manipulation or surveillance.

### Phase 4 — EC-assisted experience learning

EC may use governed longitudinal evidence to identify recurring friction and propose semantic Experience improvements.

EC should distinguish:

- DIRECT;
- GUIDED;
- AGENT_ASSISTED;
- CONVERSATIONAL / COORDINATION

before proposing a solution.

Eidos remains responsible for validating and deterministically realizing accepted interaction proposals.

The objective is not autonomous continuous UI mutation. Improvement remains versioned, testable, reviewable and reversible.

## 19. Evolution rule

Keep this document short enough to be the first design read, but complete enough for a fresh LLM to classify a task correctly.

When a new durable design dimension emerges:

1. decide whether it extends an existing authority or needs a new one;
2. document it in Eidos first;
3. add it to this authority index;
4. add machine-readable policy/tests when enforceable;
5. update downstream adoption documents.

Long-term objective:

> **A fresh LLM should reconstruct the product's design reasoning from repository authority without needing the original chat.**
