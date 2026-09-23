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


## Three-part production architecture

The long-term Eidos product boundary is:

```text
Eidos
├─ Core
├─ Component Library
└─ App Host
```

- **Core** validates, normalizes, binds and renders declarative frontend experience.
- **Component Library** provides reusable generic UI capabilities for LLM selection/composition.
- **App Host** bootstraps the application, discovers manifests/pages/navigation, registers adapters/components and hosts the rendered experience.

Business-specific pages such as Sales Order Form, Inventory List or Balance Sheet Page are application compositions, not Eidos Core semantics.

The authoritative target model is documented in:

`docs/architecture/EIDOS-CORE-COMPONENTS-APP-HOST-v0.1.md`

## Installable application boundary

An external business package may contribute an Eidos experience manifest/pages/navigation while owning its backend capability elsewhere.

Eidos consumes that contribution through public frontend contracts only. It does not import EVO or another backend's private implementation.


## Enterprise Agent boundary update — 2026-09-23

The former EC / Experience Compiler product identity is being replaced by the **Enterprise Agent** model.

For Eidos, the durable local rule is:

- Enterprise Agent may produce/select/compose Eidos experience contracts through public Eidos contracts;
- Enterprise Agent is not part of Eidos Core or App Host;
- Eidos must work without any Agent or LLM;
- Eidos must not depend on the Agent's private memory, knowledge, model provider or implementation;
- Agent-generated experience must still pass deterministic Eidos validation;
- App Host may load Agent-produced experience only through the same public experience/package contracts used by other producers.

The canonical Agent Package definition belongs to `EVO-App-Platform/docs/architecture/AGENT-PACKAGE-MODEL-v0.1.md`.

The historical EC-to-Enterprise-Agent transition is recorded in `Experience-Compiler/docs/adr/0004-ec-to-enterprise-agent.md`.


## Package → Feature → Contribution boundary update — 2026-09-23

Eidos participates in the EVO App Platform's generic lifecycle model without owning it.

For Eidos:

- Eidos runtime/App Host may be distributed as Foundation Packages/Features;
- generic frontend capabilities may be exposed as Features/capabilities;
- business applications contribute Eidos pages, navigation, routes, dashboards and bindings as frontend Contributions;
- installing a Package does not necessarily activate every Eidos Feature;
- Eidos App Host must render only effective/active experience Contributions;
- generic UI primitives remain Eidos-owned; business-specific compositions remain App-owned;
- Eidos must not infer package lifecycle from Git repository layout.

The canonical package/feature lifecycle authority belongs to:
`EVO-App-Platform/docs/architecture/PACKAGE-FEATURE-CONTRIBUTION-MODEL-v0.1.md`.
