# Eidos Global Invariants

- **EIDOS-01** Eidos never owns enterprise business truth.
- **EIDOS-02** Eidos never writes EVO BusinessData directly.
- **EIDOS-03** Enterprise business execution occurs outside the runtime through declared public contracts.
- **EIDOS-04** Runtime semantics come from explicit UIDL control/action declarations, never field-name inference.
- **EIDOS-05** Component implementations are replaceable behind stable control semantics.
- **EIDOS-06** UIDL, RenderModel and ActionRequest are serializable and explicitly versioned.
- **EIDOS-07** Unsupported or ambiguous contract versions fail closed.
- **EIDOS-08** UI/local state is never authoritative business state.
- **EIDOS-09** Core/runtime must not import EVO or Experience Compiler implementation code.
- **EIDOS-10** Architecture must be reconstructable without LLM chat history.
- **EIDOS-11** New runtime work must not silently break promised legacy API behavior.
- **EIDOS-12** Equal explicit input + registry + environment snapshot produces equal normalized model/request.
- **EIDOS-13** New interactions are runtime-instance scoped and disposable; listeners/subscriptions must be releasable.
- **EIDOS-14** A product surface counts as Eidos-based only when its semantic controls/interactions are realized through Eidos public contracts and supported runtime/renderer boundaries; bespoke look-alike HTML/JS cannot satisfy Eidos product acceptance.
- **EIDOS-15** When an Eidos-based product needs a human-experience capability that Eidos cannot yet express, the owning product MUST extend Eidos through a reusable public capability/renderer boundary rather than bypass Eidos with product-specific frontend implementation.
