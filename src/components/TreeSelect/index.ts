import type { VNode } from '../../core/index.js';
import type { TreeItem, TreeKey, TreeSelectConfig, TreeSelectEvent, TreeSelectState, TreeSelectValue } from '../types.js';
import { getIndent, treeSelectStyles } from './style.js';

const PREFIX = 'TREESELECT';
const SEP = '::';

function keyToken(key: TreeKey): string { return encodeURIComponent(JSON.stringify(key)); }
function decodeKey(token: string): TreeKey | undefined {
  try { const value = JSON.parse(decodeURIComponent(token)); return typeof value === 'string' || typeof value === 'number' ? value : undefined; }
  catch { return undefined; }
}

export function treeSelectEventType(name: string, action: TreeSelectEvent['action'], key?: TreeKey): string {
  return [PREFIX, encodeURIComponent(name), action, key === undefined ? '' : keyToken(key)].join(SEP);
}

export function parseTreeSelectEvent(type: string, value?: unknown): TreeSelectEvent | null {
  const parts = type.split(SEP);
  if (parts.length !== 4 || parts[0] !== PREFIX) return null;
  let name: string;
  try { name = decodeURIComponent(parts[1]); } catch { return null; }
  const action = parts[2] as TreeSelectEvent['action'];
  const allowed: TreeSelectEvent['action'][] = ['toggle-open','toggle-expand','select','check','search','focus','blur','hover','leave','clear'];
  if (!allowed.includes(action)) return null;
  const key = parts[3] ? decodeKey(parts[3]) : undefined;
  if (parts[3] && key === undefined) return null;
  return { name, action, key, value };
}

function nodeKey(item: TreeItem, config: TreeSelectConfig): TreeKey {
  const key = item[config.valueKey ?? 'id'];
  if (typeof key !== 'string' && typeof key !== 'number') throw new Error(`TreeSelect node key must be string or number: ${String(key)}`);
  return key;
}
function labelOf(item: TreeItem, config: TreeSelectConfig): string { return String(item[config.labelKey ?? 'label'] ?? ''); }
function childrenOf(item: TreeItem, config: TreeSelectConfig): TreeItem[] { const value = item[config.childrenKey ?? 'children']; return Array.isArray(value) ? value : []; }
function sameKey(a: TreeKey, b: TreeKey): boolean { return typeof a === typeof b && a === b; }

export function findTreeNode(data: TreeItem[], config: TreeSelectConfig, key: TreeKey): TreeItem | null {
  for (const item of data) { if (sameKey(nodeKey(item, config), key)) return item; const found = findTreeNode(childrenOf(item, config), config, key); if (found) return found; }
  return null;
}
function descendants(item: TreeItem, config: TreeSelectConfig): TreeKey[] {
  const result: TreeKey[] = [];
  for (const child of childrenOf(item, config)) { result.push(nodeKey(child, config), ...descendants(child, config)); }
  return result;
}
function includesKey(values: TreeKey[], key: TreeKey): boolean { return values.some(value => sameKey(value, key)); }
function removeKey(values: TreeKey[], key: TreeKey): TreeKey[] { return values.filter(value => !sameKey(value, key)); }
function uniqueKeys(values: TreeKey[]): TreeKey[] { const result: TreeKey[] = []; for (const key of values) if (!includesKey(result, key)) result.push(key); return result; }

export function createTreeSelectState(config: TreeSelectConfig, value?: TreeSelectValue): TreeSelectState {
  return { value: value ?? (config.multiple ? [] : null), expandedKeys: [], open: false, search: '', focused: false, hovered: false };
}

export interface TreeSelectTransition { state: TreeSelectState; valueChanged: boolean; value: TreeSelectValue }
export function reduceTreeSelectState(config: TreeSelectConfig, state: TreeSelectState, event: TreeSelectEvent): TreeSelectTransition {
  if (event.name !== config.name || config.disabled) return { state, valueChanged: false, value: state.value };
  let next = state; let valueChanged = false;
  switch (event.action) {
    case 'toggle-open': next = { ...state, open: !state.open }; break;
    case 'focus': next = { ...state, focused: true }; break;
    case 'blur': next = { ...state, focused: false }; break;
    case 'hover': next = { ...state, hovered: true }; break;
    case 'leave': next = { ...state, hovered: false }; break;
    case 'search': next = { ...state, search: typeof event.value === 'string' ? event.value : '', open: true }; break;
    case 'clear': next = { ...state, value: config.multiple ? [] : null }; valueChanged = true; break;
    case 'toggle-expand': {
      if (event.key === undefined) break;
      const expanded = includesKey(state.expandedKeys, event.key) ? removeKey(state.expandedKeys, event.key) : [...state.expandedKeys, event.key];
      next = { ...state, expandedKeys: expanded }; break;
    }
    case 'select':
    case 'check': {
      if (event.key === undefined) break;
      const item = findTreeNode(config.data, config, event.key); if (!item || item.disabled) break;
      if (config.multiple) {
        const current = Array.isArray(state.value) ? state.value : [];
        const affected = config.cascade === 'descendants' ? [event.key, ...descendants(item, config)] : [event.key];
        const shouldRemove = includesKey(current, event.key);
        let value = [...current];
        for (const key of affected) value = shouldRemove ? removeKey(value, key) : uniqueKeys([...value, key]);
        next = { ...state, value }; valueChanged = true;
      } else {
        next = { ...state, value: event.key, open: false }; valueChanged = !sameKey(state.value as TreeKey, event.key);
      }
      break;
    }
  }
  return { state: next, valueChanged, value: next.value };
}

export function filterTreeData(data: TreeItem[], config: TreeSelectConfig, search: string): TreeItem[] {
  const term = search.trim().toLocaleLowerCase(); if (!term) return data;
  const result: TreeItem[] = [];
  const childrenKey = config.childrenKey ?? 'children';
  for (const item of data) {
    const filteredChildren = filterTreeData(childrenOf(item, config), config, term);
    if (labelOf(item, config).toLocaleLowerCase().includes(term) || filteredChildren.length) result.push({ ...item, [childrenKey]: filteredChildren });
  }
  return result;
}

export function getSelectedTreeItems(config: TreeSelectConfig, value: TreeSelectValue): TreeItem[] {
  const keys = Array.isArray(value) ? value : value === null ? [] : [value];
  return keys.map(key => findTreeNode(config.data, config, key)).filter((item): item is TreeItem => item !== null);
}

function normalizedLegacyState(config: TreeSelectConfig, source: any): TreeSelectState {
  const expanded = source?.expanded ?? {};
  return {
    value: source?.value ?? source?.selected ?? (config.multiple ? [] : null),
    expandedKeys: Array.isArray(source?.expandedKeys) ? source.expandedKeys : Object.keys(expanded).filter(key => expanded[key]),
    open: Boolean(source?.open ?? source?.dropdownOpen), search: String(source?.search ?? source?.searchKeyword ?? ''),
    focused: Boolean(source?.focused ?? source?.searchFocus), hovered: Boolean(source?.hovered ?? source?.isHover),
  };
}

export function renderTreeSelect(config: TreeSelectConfig, state: TreeSelectState): VNode {
  const selected = getSelectedTreeItems(config, state.value); const displayData = config.searchable === false ? config.data : filterTreeData(config.data, config, state.search);
  const multipleValues = Array.isArray(state.value) ? state.value : [];
  const renderNodes = (items: TreeItem[], level = 0): VNode[] => items.map(item => {
    const key = nodeKey(item, config), children = childrenOf(item, config), hasChildren = children.length > 0;
    const selectedNow = config.multiple ? includesKey(multipleValues, key) : state.value !== null && !Array.isArray(state.value) && sameKey(state.value, key);
    const expanded = includesKey(state.expandedKeys, key), disabled = config.disabled || Boolean(item.disabled);
    const rowChildren: VNode[] = [
      hasChildren ? { type:'span', props:{ text: expanded ? '▼' : '▶', style:treeSelectStyles.toggleIcon, onClick: treeSelectEventType(config.name,'toggle-expand',key) } } : { type:'span', props:{text:'',style:{width:'16px',display:'inline-block'}} },
    ];
    if (config.checkable !== false) rowChildren.push({ type:'input', props:{ type:'checkbox', checked:selectedNow, disabled, style:treeSelectStyles.checkbox, onChange:treeSelectEventType(config.name,'check',key), 'aria-label':`选择 ${labelOf(item, config)}` } });
    if (item.icon) rowChildren.push({ type:'span', props:{text:String(item.icon)+' ',style:{fontSize:'14px'}} });
    rowChildren.push({ type:'span', props:{ text:labelOf(item,config), style:{...treeSelectStyles.nodeLabel,color:disabled?'#ccc':'#333'}, onClick:disabled?undefined:treeSelectEventType(config.name,'select',key) } });
    const nodeChildren: VNode[] = [{ type:'div', key:`row:${String(key)}`, props:{ style:{...treeSelectStyles.nodeRow,paddingLeft:(8+getIndent(level))+'px',...(selectedNow?treeSelectStyles.nodeRowSelected:{}),...(disabled?treeSelectStyles.nodeRowDisabled:{})}, role:'treeitem','aria-selected':selectedNow,'aria-expanded':hasChildren?expanded:undefined }, children:rowChildren }];
    if (hasChildren && expanded) nodeChildren.push({ type:'div', key:`children:${String(key)}`, props:{role:'group'}, children:renderNodes(children,level+1) });
    return { type:'div', key, children:nodeChildren };
  });

  const valueDisplay: VNode = config.multiple && selected.length ? { type:'div', props:{style:treeSelectStyles.tags}, children:selected.map(item=>({ type:'span', key:nodeKey(item,config), props:{text:labelOf(item,config),style:treeSelectStyles.tag} })) } : { type:'span', props:{ text:selected.length ? selected.map(item=>labelOf(item,config)).join(', ') : (config.placeholder ?? '请选择'), style:{...treeSelectStyles.valueText,...(!selected.length?treeSelectStyles.placeholderText:{})} } };

  return { type:'div', props:{style:treeSelectStyles.container,'data-eidos-control':'tree-select','data-name':config.name}, children:[
    { type:'div', props:{ style:{...treeSelectStyles.trigger,...(state.hovered?treeSelectStyles.triggerHover:{}),...(config.disabled?treeSelectStyles.triggerDisabled:{})}, role:'combobox','aria-expanded':state.open,'aria-disabled':Boolean(config.disabled),tabIndex:config.disabled?-1:0,onClick:config.disabled?undefined:treeSelectEventType(config.name,'toggle-open'),onMouseEnter:treeSelectEventType(config.name,'hover'),onMouseLeave:treeSelectEventType(config.name,'leave') }, children:[valueDisplay,{type:'span',props:{text:'▼',style:{...treeSelectStyles.arrow,...(state.open?treeSelectStyles.arrowOpen:{})}}}] },
    state.open ? { type:'div', props:{style:treeSelectStyles.dropdown,role:'tree'}, children:[
      config.searchable === false ? null : { type:'input', props:{ placeholder:config.searchPlaceholder ?? '搜索...',value:state.search,style:{...treeSelectStyles.searchInput,...(state.focused?treeSelectStyles.searchInputFocus:{})},onInput:treeSelectEventType(config.name,'search'),onFocus:treeSelectEventType(config.name,'focus'),onBlur:treeSelectEventType(config.name,'blur'),'aria-label':'搜索树节点'} },
      ...(displayData.length ? renderNodes(displayData) : [{type:'div',props:{style:treeSelectStyles.empty,text:'无匹配结果'}}])
    ].filter(Boolean) as VNode[] } : null
  ].filter(Boolean) as VNode[] };
}

/** Legacy adapter: preserves createTreeSelect(config)(rootState) while removing hidden store subscriptions. */
export function createTreeSelect(config: TreeSelectConfig) {
  return (rootState: any): VNode => renderTreeSelect(config, normalizedLegacyState(config, rootState?.[config.name] ?? {}));
}
