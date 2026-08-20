---
# AI 原生元数据 (Machine Parsable)
{
  "project": "Eidos",
  "version": "0.3.0",
  "status": "Alpha",
  "philosophy": "Explicit > Implicit. Deterministic > Convenient.",
  "primary_audience": "AI Agents & Humans collaborating with AI",
  "core_principles": [
    "UI is pure JSON (VNode), never HTML strings",
    "State mutations require explicit 'changedKeys' declaration",
    "All runtime errors MUST be JSON-structurable with a 'fix' field",
    "Zero implicit dependencies or magic global variables"
  ],
  "project_structure": {
    "root": "Monorepo managed by pnpm workspaces",
    "core": "src/core/ - The framework runtime",
    "playground": "playground/ - Demo application for testing",
    "configs": "configs/ - Explicit Vite build configurations",
    "scripts": "scripts/ - Build scripts with structured error handling"
  },
  "entry_points": {
    "dev": "pnpm dev",
    "build": "pnpm build",
    "core_import": "@eidos/core"
  },
  "error_codes": {
    "EIDOS_MISSING_AFFECTS": "dispatch() called without changedKeys array. Fix: add ['key'] as second parameter."
  }
}
-->

# ⚡️ Eidos - AI Native Framework Manifest

## 1. Project Intent (Why this exists)

Eidos is a frontend framework specifically designed for Large Language Models (LLMs) and the developers who pair with them.

Unlike React, Vue, or Svelte which optimize for human developer ergonomics (syntactic sugar, hooks, reactivity magic), Eidos optimizes for AI generation accuracy and deterministic debugging.

The Core Problem We Solve:
When an AI generates React code, it often forgets dependency arrays, misuses hooks, or creates infinite loops. The error messages are stack traces meant for humans.
When an AI generates Eidos code, it must explicitly declare changedKeys. If it forgets, the framework throws a JSON error containing the exact fix. The AI can read this JSON and correct itself without human intervention.

## 2. Core Principles (The Unbreakable Rules)

If you are an AI agent editing this codebase, you MUST obey these rules:

1. UI is JSON, NOT HTML Strings:
   - Never use template literals to build HTML (e.g., `<div>${var}</div>`).
   - Always return a VNode object tree (type, props, children).
   - Rationale: JSON is easier for AI to generate without syntax errors.

2. Explicit State Mutation:
   - State is updated via store.dispatch(updater, changedKeys).
   - The changedKeys array is MANDATORY. If omitted, the framework throws an error with fix.
   - Rationale: Forces the AI to explicitly define which UI parts re-render, eliminating hidden side-effects.

3. Event Handling via String Constants:
   - Use onClick: 'EVENT_NAME' in VNode props.
   - Listen to window.addEventListener('eidos-event', callback) for logic.
   - Rationale: AI doesn't need to write closure functions or bind 'this'.

4. Structured Errors over Stack Traces:
   - All thrown errors must be new Error(JSON.stringify({ code, message, fix })).
   - Rationale: AI can JSON.parse() the error and automatically apply the fix.

## 3. Architecture and Directory Map

This project is a Monorepo using pnpm workspaces. All paths are relative to root.

Root Directory: eidos-ai-native/

  src/
    core/                      - The framework runtime (published as @eidos/core)
      index.ts                 - Entire framework runtime (~80 lines)
      package.json             - Package metadata for npm publishing

  playground/                  - Local development environment (not published)
    index.html                 - HTML entry point
    main.ts                    - Business logic (the file you and AI modify most)
    package.json               - Local dev dependencies

  configs/                     - Explicit Vite build configurations (no magic)
    build-core.ts              - Builds core library (ESM + UMD formats)
    build-playground.ts        - Builds demo application
    tsconfig.base.json         - Shared TypeScript rules

  scripts/                     - Automation scripts
    build.ts                   - Multi-step build orchestrator
    error-handler.ts           - Wraps build errors in structured JSON

  package.json                 - Root workspace management
  pnpm-workspace.yaml          - Workspace declaration for pnpm
  tsconfig.json                - Root TypeScript configuration
  EIDOS.md                     - This file (self-evolving manifest)
## 4. AI Coding Guidelines (For New AI Sessions)

Welcome, AI agent. Here is how to correctly write code for this project:

### A. How to write a View (UI)

Always generate a view function that returns a VNode object.

Correct Example:
const view = (state) => ({
type: 'div',
props: { style: { color: 'red' } },
children: [
{ type: 'span', props: { text: 'Hello ' + state.name } }
]
});
Wrong Example (NEVER do this):
const view = (state) => '<div style="color:red"><span>Hello ' + state.name + '</span></div>';

### B. How to Dispatch an Update

Always include the second parameter (changedKeys).

Correct Example (This will update the UI):
store.dispatch(
(prev) => ({ ...prev, count: prev.count + 1 }),
['count']
);

Wrong Example (This will throw Error Code: EIDOS_MISSING_AFFECTS):
// 注意：这里漏掉了 ['count']，框架会抛出 JSON 结构化错误
store.dispatch((prev) => ({ ...prev, count: prev.count + 1 }));

### C. How to Handle Events

Events are handled centrally via window.

Correct Example:
window.addEventListener('eidos-event', (e) => {
if (e.detail.type === 'INCREMENT') {
store.dispatch(
(prev) => ({ ...prev, count: prev.count + 1 }),
['count']
);
}
});

Wrong Example (Don't attach events directly in VNode):
// 不要这样做（VNode 中不能包含函数闭包）
{
type: 'button',
props: {
onClick: () => { store.dispatch(...) } // 错误：AI 不可靠地生成闭包
}
}

## 5. Sustainability and Evolution (How to update this file)

This manifest is not static. As Eidos grows, this document must grow with it.

When should you (AI or Human) update EIDOS.md?

1. A new Core Principle is added (e.g., "Async actions require loading state").
2. A new Error Code is introduced (Add it to the error_codes JSON block at the top).
3. The Directory Structure changes (Update the project_structure JSON block).
4. A new Feature is implemented (Add a row to the "Feature Status" table below).

Pro Tip for AI agents: Before generating a large pull request, read this file's "Core Principles" section first. If your proposed code violates a principle, correct yourself before outputting.

## 6. Current Feature Status (Tracked)

| Feature                  | Status           | Location               | How AI uses it                |
| :----------------------- | :--------------- | :--------------------- | :---------------------------- |
| JSON VNode Rendering     | Stable           | src/core/index.ts      | AI generates JSON trees.      |
| Explicit Dispatch        | Stable           | src/core/index.ts      | AI must add changedKeys.      |
| Structured Errors        | Stable           | src/core/index.ts      | AI reads error.fix.           |
| Monorepo Build (Vite)    | Stable           | configs/, scripts/     | AI runs pnpm build.           |
| List Rendering           | Not Implemented  | N/A                    | Coming soon                   |
| Conditional Rendering    | Not Implemented  | N/A                    | Coming soon                   |
| Async API Binding        | Not Implemented  | N/A                    | Coming soon                   |

## 7. Quick Start Commands (For AI to execute)

If you have terminal access:
pnpm install
pnpm dev
pnpm build

## 8. License

MIT - Open source forever.