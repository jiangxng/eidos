/**
 * Compatibility entry for playground code.
 * TreeSelect event parsing/state transitions are owned by the component package now;
 * the playground must not maintain a second parser/state machine.
 */
export { parseTreeSelectEvent, reduceTreeSelectState, treeSelectEventType } from '../../src/components/TreeSelect/index.js';
export type { TreeSelectEvent, TreeSelectState } from '../../src/components/types.js';
