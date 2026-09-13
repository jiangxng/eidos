# Eidos Capability Catalog

This directory is the canonical discovery surface for reusable Experience Capabilities.

A Capability describes **what an experience can do**. A component describes one renderer-specific implementation.

## Admission rule

A capability is not canonical until its definition states:
- purpose and non-purpose;
- stable identity and version;
- inputs and outputs;
- state ownership;
- requests/side effects;
- supported renderers;
- constraints;
- composition points;
- validation;
- examples and tests.

Current components are implementation assets and must not automatically be treated as canonical capabilities.

## Current convergence status

- `hierarchical-selection`: candidate; TreeSelect implementation is being converged.
- Form/Table/DatePicker/Upload/Dialog: legacy implementation assets pending capability admission review.
