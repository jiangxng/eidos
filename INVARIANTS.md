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
- **EIDOS-16** App Host is the canonical production container for Eidos Experiences in Eidos-adopting systems; product Experiences are discovered and mounted through App Host rather than each creating an independent application shell.
- **EIDOS-17** Eidos interaction contracts MUST be able to express action availability and human-readable unavailability reasons. Hosts must not expose knowingly invalid next-step actions as apparently executable controls.
- **EIDOS-18** Localization semantics belong to Eidos/App Host contracts and deterministic rendering; each Experience/package owns its own localization namespace and resources. No central translation package may become the implicit owner of unrelated product vocabulary.
- **EIDOS-19** Literal human-facing strings remain valid deterministic fallbacks. Localization resolution may override only declared/stable semantic text slots and MUST NOT change machine identifiers, command codes, field keys, semantic types, or business data.
- **EIDOS-20** Agent-first layouts are generic App Host capabilities. Eidos may host an assistant route, chat surface, and workspace browser, but MUST NOT depend on a specific Agent, model provider, or enterprise product.
- **EIDOS-21** Responsive product acceptance requires normal workflows to remain usable on narrow screens; multi-pane desktop layouts MUST provide a single-pane mobile interaction model without losing active chat/workspace state.
- **EIDOS-22** Workbench Activity Bar items select View Containers or workspace targets; they are not a compressed duplicate of application navigation. Side panels are user-toggleable and resizable, and layout state may persist without becoming business truth.
- **EIDOS-23** Simple extension configuration SHOULD use a declarative Settings Editor contract. Secrets/credentials MUST NOT be represented as ordinary Settings values; secure secret handling is a separate platform boundary.
- **EIDOS-24** Workbench layout persistence is user-interface state only. Failure to persist layout MUST NOT prevent the App Host or business Experiences from operating.

- **EIDOS-25** Eidos owns the default visual/interaction language for App Host, Workbench and standard Experience capabilities. Host products and plugins MUST consume Eidos design tokens/patterns instead of silently forking ordinary shell, spacing, focus or button semantics.
- **EIDOS-26** Standard action scopes expose at most one visually primary action. Supporting, destructive and navigation actions use semantically distinct lower-emphasis treatments and stable placement rules defined by the Eidos Productive Design Language.
- **EIDOS-27** Productive density MUST NOT reduce mobile/touch hit targets below the Eidos minimum or remove visible keyboard focus. Icon-only controls require accessible names and discoverable labels/tooltips.
- **EIDOS-28** Workbench layout follows stable container semantics: Activity Bar selects context, Side Panel hosts secondary/contextual Views, Main Workspace owns the primary task, and toolbars expose only context-relevant actions. Plugins MUST NOT repurpose these regions into competing navigation systems.

- **EIDOS-29** Participating LLMs are proactive framework stewards, not request-only implementers. They MUST review mature UI/runtime foundations and surface material omissions even when the human did not name the engineering concept.
- **EIDOS-30** Reusable UI/interaction gaps are classified NOW / SOON / WATCH in `llm.foundation-map.json`. A NOW gap that is already causing duplication, drift, accessibility/reliability risk or expensive future migration MUST be addressed before broad feature expansion.
- **EIDOS-31** A clean-room fresh-LLM review from repository authority is a required architecture-health technique. Repeated rediscovery of the same missing design/runtime foundation is an Eidos documentation/architecture defect.

- **EIDOS-32** Eidos owns the standard product icon language. Workbench and ordinary plugin UI MUST prefer registered semantic Eidos icon names over raw Unicode glyphs, arbitrary SVG, copied brand assets or independent icon-library dependencies.
- **EIDOS-33** The Eidos Icon Registry is additive and semantic-name stable. Missing domain icons are added to Eidos at the reusable owner boundary rather than being privately invented inside each plugin.
- **EIDOS-34** Icon-only controls MUST provide accessible names/tooltips; decorative icon SVG is aria-hidden and MUST NOT be the sole carrier of state.

- **EIDOS-35** A mounted Surface instance MUST NOT be remounted because of query revalidation, realtime invalidation, ordinary Host snapshot refresh, focus/visibility changes, or other non-structural state changes. Remount requires Surface identity change, instance identity change, structural contract version change, an explicit presentation reset, or an unrecoverable render failure.
- **EIDOS-36** Realtime resource changes are reconciled at resource scope. A resource invalidation MUST NOT imply a shell-wide refresh; only mounted consumers that declare the affected resource may refresh. A sequence gap requires canonical snapshot recovery rather than speculative delta application.
- **EIDOS-37** A stable idle Surface MUST be application-network quiet: no fixed polling, no avoidable Surface mount/unmount churn, no structural DOM churn, and no reconnect loop. Idle behavior is measurable through Runtime activity counters and budgets.
- **EIDOS-38** Desktop, tablet and mobile Experiences MAY use different Surface implementations while sharing stable semantic route/action/resource identities. Device adaptation is resolved before rendering; individual components MUST NOT become the primary owner of cross-Surface routing policy.

- **EIDOS-39** Eidos-owned human-visible platform chrome MUST resolve through the Eidos localization runtime. Framework renderers and mounted runtimes MUST NOT introduce unlocalizable platform-owned display strings; literal plugin/business/runtime content remains owned by its source.
- **EIDOS-40** Localization ownership is explicit: Eidos owns localization infrastructure and Eidos platform resources; each plugin/package owns its own resources; enterprise/runtime business data is not implicitly translated by Eidos. Machine identifiers, status codes and business truth remain independent from presentation locale.

- **EIDOS-41** Eidos 2D Core and 3D Core MUST remain product/domain-semantic-free. Business concepts such as Application, Ledger, SOP, Enterprise Relation or publication authority belong to consuming products and MUST NOT become framework primitives.
- **EIDOS-42** 2D/3D presentation state (layout, viewport, pose, camera, selection) is not authoritative business/domain truth. Presentation changes MUST NOT manufacture domain revisions unless an owning product explicitly defines and executes such a business operation outside Eidos.
- **EIDOS-43** Renderer implementations are replaceable behind stable 2D/3D contracts. SVG/DOM, Three.js, WebGL, WebGPU or future renderer objects MUST NOT become public product-state authority.
- **EIDOS-44** Existing `src/diagram/**` and `src/spatial/**` APIs are compatibility assets during 2D/3D convergence; migration MUST prefer public aliases/adapters and regression proof over unnecessary rewrites.


- **EIDOS-45** Phone realization is governed by the Eidos Mobile Design Language. Plugins and Host products MUST reuse the same semantic Experience contracts across desktop/tablet/phone and MUST NOT introduce private mobile shells, breakpoint systems, spacing systems, or device-specific business semantics.
- **EIDOS-46** Phone layouts prioritize one primary task surface, bottom primary navigation, compact global context chrome, single-column content flow, safe-area-aware bottom chrome, and Eidos minimum touch targets. When a standard Eidos capability cannot express a required mobile interaction, the reusable Eidos capability MUST be extended before a plugin ships a private workaround.
