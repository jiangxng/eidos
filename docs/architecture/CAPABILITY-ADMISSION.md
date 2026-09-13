# Capability Admission

A component is not automatically an Eidos Capability.

A capability becomes canonical only when an LLM can determine, without source-code archaeology:

- stable identity and version;
- purpose and non-purpose;
- when to use / not use;
- inputs and outputs;
- state ownership;
- side-effect boundary;
- supported renderers;
- composition relationships;
- stability/personalization constraints;
- deterministic validation;
- examples;
- tests.

## Maturity

### legacy
Useful implementation asset whose semantic boundary is not yet canonical.

### candidate
Explicit semantic contract exists and is under convergence.

### stable
Versioned contract, validation, renderer behavior and compatibility policy are production-grade.
