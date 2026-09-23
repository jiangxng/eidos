# Eidos App Host

App Host is the production frontend container boundary for dynamically active Eidos experiences.

It does not install applications and does not own business truth.

## Public flow

```text
ExperienceSource
→ list effective active experience manifests
→ App Host validate/merge
→ navigation + routes + page references
→ load page definition
→ Eidos Core / Component Library
→ render
```

## Current v0.1 implementation

`createAppHost(source)` provides:

- deterministic discovery;
- manifest validation;
- dynamic refresh;
- navigation assembly;
- route resolution;
- lazy page loading;
- cross-package conflict diagnostics;
- subscription to host snapshots;
- disposal.

The `ExperienceSource` port deliberately does not mention EVO or App Manager.

A Mock Source, REST source, EVO-backed source or another backend may implement the same contract.

## Boundary

App Host must not:

- install/uninstall Packages;
- activate/deactivate Features;
- import App Manager private code;
- import EVO private code;
- execute business commands directly;
- treat frontend state as business truth.

App Manager owns Package/Feature lifecycle. App Host only consumes the effective active Experience Contributions.
