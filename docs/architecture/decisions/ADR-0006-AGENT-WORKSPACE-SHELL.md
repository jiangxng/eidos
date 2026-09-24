# ADR-0006: Agent-first Workspace Shell and Chat Experience

**Status:** Accepted
**Date:** 2026-09-24

## Context

EVO App Platform is evolving toward an LLM-first enterprise workspace. The existing Eidos App Host is a two-column navigation + page shell, and Enterprise Agent is represented as an ordinary one-field form. That shape does not reflect the intended operating model:

```text
LLM does most navigation/configuration/analysis work
→ human reviews and confirms consequential actions
→ applications remain visible, inspectable and directly operable
```

The platform also needs a layout that works on desktop and mobile without creating product-specific frontend bypasses.

## Decision

Eidos adds two reusable public capabilities:

1. **Agent Workspace Shell**
2. **Chat Experience**

Neither capability knows about EVO, Enterprise Agent, OpenAI, or any specific product.

## 1. Agent Workspace Shell

Desktop composition:

```text
┌──────────────┬──────────────────────┬──────────────────────────────┐
│ Navigation   │ Assistant            │ Workspace Browser            │
│              │                      │                              │
│ apps/plugins │ conversation         │ active Eidos app / URL       │
│ locale       │ proposals/answers    │ inspect/operate results      │
│              │ composer             │                              │
└──────────────┴──────────────────────┴──────────────────────────────┘
```

The shell accepts a generic `assistantRoute`. The owning platform decides which Experience fills that route.

Navigation behavior:

- normal application routes open in the right Workspace;
- the assistant route focuses the middle Assistant pane;
- Workspace can render an internal Eidos route or an external embeddable http(s) URL;
- external URLs remain browser content, never become authoritative App Host state.

## 2. Mobile behavior

Three simultaneous columns are not usable on narrow screens.

Below the responsive breakpoint, the shell becomes one visible pane at a time:

```text
[Menu] [Chat] [Workspace]
```

Rules:

- Chat is the default mobile pane when an assistant is available.
- Selecting a navigation item opens Workspace.
- Selecting the assistant navigation item opens Chat.
- Menu remains available without losing the current chat/workspace state.
- No desktop-only interaction may be required to complete a normal flow.

## 3. Chat Experience

A Chat Experience is not modeled as a fake form.

Contract:

```ts
interface ChatExperienceV010 {
  contractVersion: "0.1.0";
  kind: "chat";
  id: string;
  title: string;
  command: {
    code: string;
    inputVersion: string;
  };
  composer: {
    key: string;
    placeholder: string;
    sendLabel: string;
  };
  emptyState?: string;
  metadata?: Record<string, JsonValue>;
}
```

The browser shell owns transient transcript rendering. The Agent/backend owns conversation semantics and authoritative tool/action results.

The UI appends:

- user message;
- assistant text;
- errors;
- structured confirmation/proposal surfaces when provided by future command results.

Chat UI state is not enterprise business truth.

## 4. Human confirmation boundary

The shell must support a distinction between:

```text
read/inspect/reason
→ may run directly

side-effectful proposal
→ requires explicit human confirmation before execution
```

The Agent may prepare a plan and explain it. Confirmation belongs to the human-facing interaction layer and action contract, not to model obedience.

## 5. Workspace Browser

The right pane is a generic browser/workspace surface.

Internal target:

```text
/route
→ Eidos App Host route
→ render through Eidos
```

External target:

```text
https://...
→ iframe/browser surface when embeddable
→ user may open externally when embedding is blocked
```

Only `http:`, `https:` and App Host internal paths are accepted. Script/data/file URL schemes are rejected.

## 6. Separation

Eidos owns:

- shell layout semantics;
- responsive behavior;
- chat Experience rendering;
- workspace browser surface;
- generic confirmation affordances;
- accessibility/navigation behavior.

App Platform owns:

- which Experience is the assistant;
- Package/Feature lifecycle;
- LLM/provider resolution;
- Agent tools;
- enterprise/security context.

Enterprise Agent owns:

- reasoning behavior;
- prompts/methods;
- tool-selection semantics;
- durable intelligence integration with EC.

## 7. Acceptance

The capability is accepted when:

1. a host can opt into `agent-workspace` without product-specific Eidos code;
2. assistant Experience renders as a real chat transcript/composer;
3. app navigation opens in the right workspace;
4. external https URL can be entered in the workspace browser;
5. mobile switches Menu/Chat/Workspace as single panes;
6. standard two-column App Host remains available;
7. tests cover route separation and chat rendering.
