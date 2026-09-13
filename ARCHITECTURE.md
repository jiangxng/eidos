# Eidos Architecture — Converged Boundary Model

```text
Experience Compiler / other producer
            |
       versioned UIDL
            v
+---------------------------+
| contracts                 |
+---------------------------+
            |
            v
+---------------------------+
| pure UIDL runtime         |
| validate -> normalize     |
| validate values -> action |
+---------------------------+
      |                |
      v                v
RenderModel        ActionRequest
      |                |
      v                v
VNode bridge        Host Adapter
      |                |
existing VNode/       public command/query API
components/core       (EVO is one possible host)
      |
existing DOM renderer/layout
```

## Dependency direction

- `contracts`: no DOM, network, EVO or compiler implementation dependencies.
- `src/runtime`: contracts + pure helpers only; no window/document/fetch.
- `src/renderers/vnode`: runtime/public component/core APIs only.
- existing core/components/layout remain implementation assets.
- `src/adapters`: host-facing ports and legacy bridge; runtime must never import adapters.
- optional producer/generator remains outside runtime ownership.

## Compatibility model

Legacy VNode routes continue unchanged unless explicitly migrated. UIDL is added as a second, versioned entry path.
List/dashboard/layout capabilities are not forced into the form-only UIDL contract.
