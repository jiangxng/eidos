# Eidos Concepts

## UIDL
A versioned, serializable external interaction document. UIDL contains no executable code.

## Legacy View API
The existing trusted TypeScript VNode/component configuration surface. It is preserved for compatibility and is not a JSON wire contract.

## VNode
The existing Eidos renderer implementation object. It is below UIDL and RenderModel.

## RenderModel
A versioned, serializable runtime-owned normalized model derived from a validated UIDL document. It is not enterprise state.

## UIEvent
A structured interaction record scoped to a runtime instance and interaction. DOM objects, File objects and original browser events do not cross the runtime contract boundary.

## ActionRequest
A versioned, serializable snapshot of a requested action. Creation means “request formed”, not “business execution succeeded”.

## Host Adapter
The boundary that may confirm, authorize, execute, query, correlate and return results through public upstream APIs.

## UI State
Drafts, selection, expansion, loading/error and other local interaction state. It is never authoritative business truth.

## Policy Snapshot
Host-provided UI presentation policy. Server-side/business authorization remains authoritative.

## Producer
Any upstream UIDL producer. Experience Compiler is one possible producer and is never required as an implementation dependency.

## Legacy Generator
Existing intent/page generation assets. Business defaults remain optional producer/profile behavior, never core runtime semantics.

## Context Determinism
A repository revision plus context manifest must let a fresh LLM locate the same authoritative architecture, ownership, contracts and tests without prior chat history.
