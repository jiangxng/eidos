# B7 — Host-owned optimistic write token and save draft safety (2026-10-10)

**Source:** 2D Designer research handoff in [EVO-App-Platform PR #552](https://github.com/jiangxng/EVO-App-Platform/pull/552); B5a implementation [Eidos PR #137](https://github.com/jiangxng/eidos/pull/137). The earlier Miro/React Flow/draw.io/W3C/MDN research was inherited, not re-browsed this session.

## Contract

- A `DiagramEditorStateV010` may include optional opaque `writeToken: string`. Eidos never parses, creates, compares or owns it. Host responses remain source of truth; it is separate from domain `revision`.
- Eidos serializes `expectedWriteToken` in command values only when provided; older hosts continue working without a token.
- A single mount rejects a second operation while the prior one is in-flight. Action rejection or thrown exception does not mutate the local draft.
- Response reconciliation compares the view state before and after the asynchronous operation. If local edits occurred later, Eidos retains the draft instead of blindly resetting the editor; on same-resource success it updates the write token so the user can save again. Cross-resource Save As never borrows the token.
- Returned `DEFINITION_PROJECTION_WRITE_CONFLICT` is displayed without discarding local edits. Comparing, exporting or saving a separate projection requires a Host workflow; it is not automatic silent merging.

## Boundaries and acceptance

Generic editor operations remain host-agnostic. App Platform owns version minting, policy checks, storage and conflict rules. The vendor implementation must be ported selectively to avoid erasing App Platform's `renderContextNavigationV010` customization.

Tests cover token serialization, legacy omission and static save-safety guards. These do **not** constitute real-browser or physical-device verification. Async navigation side effects from a host callback, UI recovery actions and all end-to-end conflict tests require separate validation.
