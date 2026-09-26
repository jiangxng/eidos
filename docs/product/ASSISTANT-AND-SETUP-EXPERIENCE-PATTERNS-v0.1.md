# Eidos Assistant and Setup Experience Patterns v0.1

**Status:** Proposed reusable design/runtime baseline  
**Date:** 2026-09-26  
**Applies to:** Eidos Workbench extensions that expose assistants, guided setup, provider readiness, extension onboarding or human-confirmed proposals.

## 1. Why this exists

Current Eidos public capabilities are structurally correct but too thin for a mature assistant/plugin setup experience.

Observed gaps:

- chat@0.1.0 renders only title, transcript, textarea and Send;
- ChatMessageV010 is plain role + text and cannot represent activity, evidence, proposal or setup state;
- Extension Manager mixes lifecycle, runtime, integrity and capability detail into an always-expanded technical card;
- Extension Manager has no separate product-readiness concept;
- Settings Editor has no grouping/status/advanced disclosure;
- Eidos has no generic declarative setup/onboarding flow.

These gaps encourage host products either to expose raw errors/diagnostics or to invent product-specific UI. Both conflict with Productive Design Language governance.

## 2. Design principles

New patterns must preserve the Eidos character:

- productive, quiet and precise;
- compact enterprise density;
- one primary action per scope;
- progressive disclosure;
- stable Workbench geometry;
- semantic state rather than decorative color;
- keyboard/focus accessibility;
- mobile reflow rather than desktop shrinking;
- declarative, non-executable public contracts.

No pattern may know about OpenAI, EVO, Personal Agent, ERP, a specific provider or a specific business domain.

## 3. Assistant Chat v0.2

Working capability name:

    chat@0.2.0

It remains compatible in spirit with chat@0.1.0 but adds structured assistant semantics.

### 3.1 Experience contract goals

A Chat Experience may declare:

- title;
- command;
- composer;
- optional current-context summary;
- optional readiness/attention state;
- empty-state content;
- optional suggested actions/prompts;
- capability metadata.

### 3.2 Structured message parts

A future message should support ordered safe parts such as:

- text;
- notice;
- activity;
- evidence;
- proposal;
- action group.

This is presentation structure, not hidden reasoning.

Example conceptual shape:

    message
      text
      activity[]
      evidence[]
      proposal?

Eidos owns rendering and interaction semantics.

### 3.3 Activity

Activity communicates observable Host/tool work:

- label;
- state: pending / complete / error;
- optional concise detail;
- optional route for deeper diagnostics.

Do not render private chain-of-thought.

### 3.4 Evidence

Evidence is a navigable source reference:

- label/title;
- source/context;
- optional freshness/time;
- optional route/open target.

Host products decide what an evidence target means; Eidos only renders/navigation-dispatches.

### 3.5 Proposal

Proposal supports human review:

- title;
- summary/reason;
- optional risk/impact summary;
- primary action;
- secondary action(s);
- optional review route;
- confirmation flag.

Eidos enforces one-primary-action visual hierarchy.

### 3.6 Readiness / attention

Assistant surfaces should support a non-conversational readiness state:

- ready;
- setup-required;
- unavailable;
- degraded.

A missing dependency should not have to appear as a fake assistant message.

Example:

    Assistant needs setup
    A required service is not ready.

    [Set up]

### 3.7 Empty state

Empty assistant views may expose:

- short capability explanation;
- current context;
- 2-4 suggested prompts/actions.

Avoid marketing hero layouts or oversized decorative surfaces in productive Workbench side panels.

## 4. Setup Flow v0.1

Working capability name:

    setup-flow@0.1.0

Purpose: declarative guided setup for extensions/providers/features without custom wizard Webviews.

### 4.1 Contract

A Setup Flow contains:

- id/title/description;
- ordered steps;
- optional completion action.

Each step contains:

- id;
- title;
- description;
- state: pending / current / complete / blocked / error;
- optional status detail;
- optional primary action;
- optional secondary action(s).

Actions reuse normal command/navigation semantics.

No arbitrary HTML or script.

### 4.2 Visual model

Desktop:

    Setup title

    ✓ Step 1
    → Step 2   current details + primary action
      Step 3
      Step 4

Only the current/failed step receives high visual emphasis.

Completed steps remain compact.

Blocked/error state uses semantic status tokens.

### 4.3 Mobile

Steps become a stacked linear flow.

The current actionable step remains visible without requiring a desktop side-by-side layout.

### 4.4 Focus/accessibility

After step action completion:

- update announced status;
- focus remains on the current step or advances to the next actionable step;
- errors are associated with the relevant step;
- no focus loss on rerender.

## 5. Extension Manager readiness and progressive disclosure

Lifecycle state and readiness are separate concepts.

Lifecycle examples:

- not installed;
- enabled;
- disabled;
- incompatible.

Readiness examples:

- ready;
- setup required;
- blocked;
- degraded;
- error.

An enabled extension may still require setup.

### 5.1 Item hierarchy

Default item presentation should prioritize:

1. extension identity/purpose;
2. lifecycle + readiness;
3. primary action;
4. relevant warning/blocker.

Technical diagnostics should be behind a disclosure control:

- protocol compatibility;
- signature/integrity detail;
- runtime isolation/history;
- Contribution summary;
- raw Capability list;
- storage/events.

Trust/permission problems that require a decision are promoted out of technical details.

This aligns Eidos with its own progressive-disclosure invariant.

### 5.2 Primary action

Primary action is derived from current user task:

- Install;
- Set up;
- Open;
- Enable;
- Retry/check.

Do not show Open when the product is installed but unusable.

## 6. Settings Editor v0.2

Recommended additive evolution:

- sections/groups;
- read-only status rows;
- notice/callout;
- advanced/collapsible group;
- secret-status semantics;
- one stable primary Save action.

Example:

    Provider

    General
      Model
      API endpoint

    Credentials
      API key          Configured
      [replacement field]

    Advanced
      temporary/bootstrap administration

Secret plaintext remains outside the public definition after save.

## 7. Workbench relationship

Assistant Chat normally fits in a Side Panel View Container.

Main Workspace remains the dominant surface for:

- evidence;
- documents;
- provider/settings setup;
- detailed diagnostics;
- business objects;
- complex review.

Do not make an Activity Bar item open an unrelated custom full-screen Webview merely to obtain more space.

A future activity-level preferred initial side-panel width MAY be introduced if multiple assistant products demonstrate the need.

## 8. Dialog/confirmation pattern

Consequential action confirmation must use a reusable Eidos dialog pattern or an equivalent accessible Host-owned mechanism.

Requirements:

- visible title/prompt;
- focus containment while modal;
- logical initial focus, favoring the safer action for destructive flows;
- Escape/cancel support where appropriate;
- focus restoration after close;
- no reliance on browser window.confirm as the long-term product experience.

window.confirm may remain a compatibility implementation until the Eidos dialog pattern is delivered.

## 9. Localization

All reusable Eidos chrome uses Eidos localization namespace(s).

Product/extension content stays in the owning Package namespace.

Contracts keep stable machine identifiers across locales.

## 10. Compatibility

Do not break chat@0.1.0 immediately.

Preferred migration:

- retain v0.1 renderer/contracts;
- add v0.2 recognition/rendering;
- hosts migrate incrementally;
- deprecate only after downstream adoption.

The same additive rule applies to Extension Manager and Settings Editor.

## 11. Acceptance

This RFC is implemented when:

1. assistant dependency/setup state can be rendered outside transcript messages;
2. Chat supports structured observable activity/evidence/proposal parts;
3. Setup Flow exists as a declarative Eidos capability;
4. Extension Manager distinguishes lifecycle from readiness;
5. Extension Manager technical detail is collapsed by default;
6. Settings supports grouped Provider/credential UX or an equivalent Eidos-native structure;
7. desktop/mobile keyboard behavior is tested;
8. all visual realization uses Eidos tokens/icons;
9. no product-specific CSS is needed by consuming hosts.

## 12. First consumer

The first intended consumer is EVO Personal Agent, but the contracts MUST remain generic.

Personal Agent-specific lifecycle/readiness/provider orchestration belongs to EVO App Platform, not Eidos.
