# TreeSelect v0.2 design

TreeSelect is a presentation/control component, not a store, data source, command executor, or business object.

## Boundary

- `renderTreeSelect(config, state)` is pure rendering.
- `reduceTreeSelectState(config, state, event)` is the only built-in transition function.
- No component code locates or subscribes to an application store.
- No component code writes `_prevSelected` or other hidden state back into an application store.
- Selection value is controlled by the host. Open/search/expanded/focus/hover state is interaction state, never enterprise truth.
- Events use `TREESELECT::<encoded-name>::<action>::<encoded-json-key>`, so underscores in names and keys are unambiguous.
- Local search only filters the supplied tree. Remote lookup belongs to a Host Adapter / QueryHost.
- `cascade` defaults conceptually to `none`; `descendants` is opt-in.

## Compatibility

`createTreeSelect(config)(rootState)` remains available as a legacy rendering adapter. It accepts old `selected`, `expanded`, `dropdownOpen`, `searchKeyword`, `searchFocus`, and `isHover` state shapes, but it no longer creates hidden subscriptions. Event consumers must migrate from underscore parsing to `parseTreeSelectEvent` + `reduceTreeSelectState`.

## Not yet part of UIDL 0.1.1

The current UIDL 0.1.1 contract only has flat `options` and does not have a hierarchical option schema. TreeSelect is therefore intentionally **not** silently encoded as `select` or `reference`. A future UIDL contract/extension must define hierarchical reference data explicitly before the VNode runtime registers TreeSelect as a standard UIDL control.
