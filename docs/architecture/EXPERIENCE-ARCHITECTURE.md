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
