import type { DiagramRectV010 } from "./viewport.js";
import {
  diagramRectMatchesV010,
  type DiagramRectMatchModeV010
} from "./geometry.js";

export type DiagramSelectionKindV010 = "node" | "edge";

export interface DiagramSelectionTargetV010 {
  kind: DiagramSelectionKindV010;
  id: string;
}

export interface DiagramSelectionStateV010 {
  items: DiagramSelectionTargetV010[];
  primary?: DiagramSelectionTargetV010;
}

function key(target: DiagramSelectionTargetV010): string {
  return target.kind + ":" + target.id;
}

function unique(
  items: readonly DiagramSelectionTargetV010[]
): DiagramSelectionTargetV010[] {
  const seen = new Set<string>();
  const result: DiagramSelectionTargetV010[] = [];
  for (const item of items) {
    const itemKey = key(item);
    if (seen.has(itemKey)) continue;
    seen.add(itemKey);
    result.push({ ...item });
  }
  return result;
}

export function createDiagramSelectionV010(
  items: readonly DiagramSelectionTargetV010[] = [],
  primary?: DiagramSelectionTargetV010
): DiagramSelectionStateV010 {
  const next = unique(items);
  const resolvedPrimary = primary
    && next.some(item => key(item) === key(primary))
      ? { ...primary }
      : next[0]
        ? { ...next[0] }
        : undefined;
  return {
    items: next,
    ...(resolvedPrimary ? { primary: resolvedPrimary } : {})
  };
}

export function replaceDiagramSelectionV010(
  target?: DiagramSelectionTargetV010
): DiagramSelectionStateV010 {
  return target
    ? createDiagramSelectionV010([target], target)
    : createDiagramSelectionV010();
}

export function toggleDiagramSelectionV010(
  state: DiagramSelectionStateV010,
  target: DiagramSelectionTargetV010
): DiagramSelectionStateV010 {
  const targetKey = key(target);
  const exists = state.items.some(item => key(item) === targetKey);
  if (exists) {
    const items = state.items.filter(item => key(item) !== targetKey);
    return createDiagramSelectionV010(items, items[0]);
  }
  const items = [...state.items, target];
  return createDiagramSelectionV010(items, target);
}

export function addToDiagramSelectionV010(
  state: DiagramSelectionStateV010,
  targets: readonly DiagramSelectionTargetV010[]
): DiagramSelectionStateV010 {
  const items = unique([...state.items, ...targets]);
  const primary = targets.at(-1) ?? state.primary;
  return createDiagramSelectionV010(items, primary);
}

export function diagramMarqueeSelectionV010(
  nodes: readonly (DiagramRectV010 & { id: string })[],
  marquee: DiagramRectV010,
  mode: DiagramRectMatchModeV010 = "intersect"
): DiagramSelectionTargetV010[] {
  return nodes
    .filter(node => diagramRectMatchesV010(marquee, node, mode))
    .map(node => ({ kind: "node" as const, id: node.id }));
}
