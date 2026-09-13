# Eidos Complete-State Release Candidate

Version: `1.2.0-complete-rc.1`

"Complete state" here means the repository is coherent and usable end-to-end for its current declared release scope, not that every future Eidos capability is production-mature.

## End-to-end scope present

- Constitution / Philosophy / Invariants / Concepts / Public API.
- Deterministic LLM context and tool protocol.
- Capability discovery.
- Experience Proposal validation and realization.
- Experience context, stability, attention and motion policy.
- Direct human customization.
- Shared collaboration primitives.
- Form/Data, Decision/Exception, BI/Visualization/Reporting, Diagram and Spatial core implementations.
- Large capability catalog.
- Engineering demo.
- Commercial multilingual showcase.
- Go-to-market positioning and sales script.
- Production-static packaging.
- Deployment instructions and Docker/static-host examples.
- Automated type/test/repository/showcase/release checks.

## Maturity is explicit

A semantic capability may be `planned`, `candidate` or `stable`.
The release must never imply that a planned semantic slot is a production-complete renderer.

## Definition of done for this RC

A clean checkout can:
1. install dependencies;
2. pass type checks and tests;
3. validate the repository;
4. build a static deployment bundle;
5. run the commercial and engineering demos;
6. expose machine-readable contracts/catalog/context to an LLM;
7. reject invalid LLM proposals deterministically.
