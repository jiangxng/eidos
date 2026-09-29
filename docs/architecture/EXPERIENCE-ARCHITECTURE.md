# Eidos Experience Architecture

## North star

> **Deterministic for machines. Adaptive for humans. Stable where shared understanding and familiarity matter.**

Eidos separates probabilistic intelligence from deterministic realization.

```text
Human Intent
    |
    v
Intelligence / Experience Compiler
    |  proposes explicit, versioned experience contracts
    v
Eidos Contract Boundary
    |  schema + capability + policy + compatibility validation
    v
Experience Resolver
    |  applies Eidos invariants deterministically
    v
Capability Runtime
    |
    +--> Renderer (Web / Mobile / Voice / ...)
    |
    +--> ActionRequest / QueryRequest -> Host
```

## Four stability layers

1. **Invariant** — business truth, required safety semantics, mandatory evidence, policy controls.
2. **Shared Stable** — shared decision state, evidence structure, timeline anchors and collaboration reference.
3. **Personal Stable** — layouts, shortcuts and density that may become personal but should settle as familiarity forms.
4. **Adaptive** — task/device/context-sensitive assistance that may change without destroying mental models.

## Experience modes

- `standard`: deterministic fallback requiring no personalization service.
- `role`: responsibility-oriented defaults.
- `personal`: explicit EC-provided adaptation context.
- `shared`: collaboration mode protecting shared reference.

## Personalization authority

Highest to lowest:
1. Business truth / safety / organization policy
2. Accessibility
3. Decision integrity
4. Shared collaboration contract
5. Role
6. Task context
7. Personal preference
8. Cosmetic preference

## Attention
Attention semantics are distinct from attention presentation. `requires-review` is semantic; color, motion, sound, haptic or announcement are presentation.

## Motion
Motion is semantic before visual: reveal, continuity, attention, confirmation, causality, state-transition. Renderers decide mechanics and respect reduce-motion settings.

## Collaboration
> **Shared core, personal periphery.**

## Page customization
Customization is constrained composition, not arbitrary DOM mutation.

## Failure mode
If EC or profile context is unavailable, Eidos falls back to a deterministic standard experience.


## Product experience completeness

The product-level authority for complete Human journeys is:

`docs/product/EIDOS-EXPERIENCE-ARCHITECTURE-CONSTITUTION-v0.1.md`

The deterministic contract boundary now applies not only to layout/capability realization but also to product experience semantics.

For bounded work:

```text
Experience = Archetype + Goal + Subject + State + Journey + Actions + Feedback + Recovery + Agent Assistance
```

LLM/AGI assistance is an interaction channel inside this architecture, not a replacement for deterministic direct manipulation. Frequent low-ambiguity actions remain directly operable; Agents recommend or execute only Host-declared actions under policy.

Critical product goals are certified with Golden Journeys so a page-render test cannot falsely certify a broken end-to-end task.


## Web delivery and Surface Targets

Cross-device delivery follows `docs/architecture/WEB-DELIVERY-AND-SURFACE-ARCHITECTURE-v0.1.md`.

The architectural rule is:

> **Same truth and actions; surface-specific experience.**

Desktop and mobile Experiences may be independently composed and versioned. Eidos does not require one responsive page implementation to serve every device class. Mobile support is explicit per Experience, and unsupported operations resolve to a deterministic handoff rather than a broken compressed desktop page.

Browser caching, immutable build assets, shell revalidation, bfcache compatibility, weak-network behavior and Surface-specific performance budgets are part of the Experience architecture, not deployment afterthoughts.
