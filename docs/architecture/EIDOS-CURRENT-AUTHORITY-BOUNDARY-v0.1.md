# Eidos Current Authority Boundary v0.1

**Status:** CURRENT_AUTHORITY  
**Purpose:** fast ownership classification before implementation

## Fresh-task rule

Before changing Eidos, answer:

> Is this a reusable deterministic Human-experience capability, renderer/runtime rule, design-language rule or Experience contract?

If **no**, it probably belongs to the consuming product, App Platform, EVO or Experience Compiler.

## Eidos owns

- Experience/UIDL contracts and deterministic validation;
- reusable Human interaction capabilities;
- reusable 2D Core and 3D Core visual-interaction contracts and renderer seams;
- rendering/runtime/resolution across supported Surfaces;
- App Host / Workbench framework behavior;
- Productive Design Language and semantic UI primitives;
- localization infrastructure for Eidos-owned chrome;
- generic accessibility, interaction, responsiveness and stability rules.

## Eidos does not own by default

- enterprise/business source-of-truth data;
- ledger/posting/accounting execution;
- identity-provider semantics or authorization decisions;
- Package/Feature lifecycle and Provider selection;
- persistent enterprise knowledge/learning/reasoning;
- product-specific business workflows;
- ChatGPT/Claude/vendor business semantics;
- application-specific localization vocabulary.

## Placement rule

~~~text
reusable deterministic Human-experience primitive
  -> Eidos capability/runtime

product-specific Human UI
  -> owning plugin/app Experience using Eidos

business/domain truth
  -> owning application/provider/runtime

identity/provider/plugin governance
  -> EVO App Platform Provider/Core

persistent intelligence/learning
  -> Experience Compiler

external product/protocol compatibility
  -> Integration Adapter
~~~

If a product needs a missing reusable interaction, extend Eidos first, validate it here, then consume the public capability from the product. Do not move product semantics into Eidos merely to render them.

## Data / Designer rule

~~~text
Experience / Designer output
  -> ActionRequest / QueryRequest / public contract
  -> owning Host/Application/Provider
~~~

Eidos MUST NOT become the authoritative business-data owner or bypass Host authorization because it renders the interaction.

## Documentation loading rule

For ordinary work, read current authority first:

1. `LLM.md`
2. `INVARIANTS.md`
3. this document
4. directly relevant current architecture/capability contract

Load ADRs only when rationale, migration, compatibility or historical asset ownership matters.

ADRs preserve decisions; current architecture documents may evolve in place.

## Drift signal

Stop and reassess when Eidos code starts to know:

- Ledger or accounting semantics;
- enterprise membership/authorization policy;
- provider/vendor credentials;
- package lifecycle policy;
- one application's private data schema;
- EC knowledge internals.

Those are ownership leaks, not UI conveniences.


## 2D / 3D ownership rule

Reusable graph/canvas/spatial interaction belongs in Eidos 2D Core or 3D Core.

Product/domain semantics belong to the consuming product. A product may project domain state into Eidos and translate generic interactions into declared ActionRequests, but Eidos must not learn the product's semantic vocabulary merely to render it.

Authority: `docs/architecture/EIDOS-2D-3D-CORE-v0.1.md`.
