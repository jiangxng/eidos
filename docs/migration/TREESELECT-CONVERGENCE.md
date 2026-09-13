# TreeSelect convergence

## Root cause in v0.4 implementation

The legacy TreeSelect mixed four responsibilities:

1. VNode rendering;
2. discovery/subscription of an application store from component render code;
3. selection state transitions;
4. playground-specific string event parsing.

That produced two state machines (component + playground), hidden subscriptions, `_prevSelected` write-back, non-disposable lifecycle behavior, and an ambiguous underscore-delimited event protocol. The core renderer also did not originally dispatch every DOM event the control declared.

## v0.2 correction

TreeSelect is now split into explicit surfaces:

- `TreeSelectConfig`: static control configuration and supplied tree data;
- `TreeSelectState`: controlled value + ephemeral interaction state;
- `TreeSelectEvent`: structured event representation;
- `renderTreeSelect`: pure VNode rendering;
- `reduceTreeSelectState`: pure transition function;
- `parseTreeSelectEvent` / `treeSelectEventType`: deterministic DOM-event envelope;
- `createTreeSelect`: legacy render adapter only, without hidden subscriptions.

The host owns persistence. The component owns no enterprise truth and performs no command/query execution.

## Migration rule

Delete the TreeSelect-specific `type.split('_')` switch from `playground/app/events.ts`. Parse `e.detail.type` using `parseTreeSelectEvent`, obtain the current TreeSelect state, call `reduceTreeSelectState`, and dispatch the returned state/value explicitly. Application callbacks, commands, remote search, and data fetching belong outside the component.

## UIDL status

TreeSelect is intentionally not a UIDL 0.1.1 built-in. UIDL needs a versioned hierarchical-option/reference contract first. Registering it before that contract exists would create an implicit producer/runtime dependency.
