# Source-level Convergence Implemented in this candidate

This candidate incorporates targeted corrections against protected Eidos commit `55da1bd95a960132bbce10346b30cb40cafe51cf` while preserving the existing programming model.

Implemented corrections:
- event handlers are re-bound when event prop values change;
- `onChange`, focus/blur, mouse enter/leave, drag/drop are supported by the legacy event bridge;
- boolean DOM properties are applied consistently rather than serialized as `"false"` attributes;
- `createApp` and `createRouter` expose `dispose()`;
- TreeSelect shared type includes its implemented `onChange` callback;
- unambiguous TreeSelect event parsing helper is added;
- UIDL 0.1.1 -> versioned RenderModel -> existing VNode bridge is concrete and uses an explicit control registry;
- interaction drafts are runtime-instance / interaction scoped.

Non-goals in this candidate:
- no repository replacement;
- no deletion of data/auth/layout/generator/advanced components;
- no direct EVO BusinessData write or Experience Compiler internal dependency;
- no attempt to force list/dashboard/layout through form-only UIDL.
