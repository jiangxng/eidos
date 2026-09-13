# Eidos FAQ

## Is Eidos another component library?
No. It can contain a very large component library, but its primary abstraction for LLMs is semantic Capability + explicit Contract + deterministic validation.

## Is Eidos an LLM?
No. An LLM or Experience Compiler is a producer. Eidos is the deterministic Experience system.

## Does Eidos replace the backend?
No. Host systems remain owners of business truth, authorization, persistence and execution.

## Does every UI change need an LLM?
No. Direct manipulation is first-class when it is faster and reliable.

## Is personalization constantly rearranging the interface?
No. Adaptation should converge toward fit. Stable familiarity and shared reference are explicit design constraints.

## Can an LLM generate JavaScript and run it inside Eidos Core?
Not by default. Core Runtime is intentionally not an arbitrary generated-code execution environment.

## Why multiple cores?
Different renderer domains—Web, BI, Diagram, Reporting, Spatial—have genuinely different implementation constraints. They share one Constitution and deterministic semantic language.

## Are all catalog capabilities production complete?
No. Maturity is explicit: planned, candidate, stable.
