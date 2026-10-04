import type { DiagramPointV010, DiagramRectV010 } from "./viewport.js";

export type DiagramRectMatchModeV010 = "contain" | "intersect";

export function normalizeDiagramRectV010(
  start: DiagramPointV010,
  end: DiagramPointV010
): DiagramRectV010 {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  return {
    x,
    y,
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y)
  };
}

export function diagramRectContainsPointV010(
  rect: DiagramRectV010,
  point: DiagramPointV010
): boolean {
  return point.x >= rect.x
    && point.x <= rect.x + rect.width
    && point.y >= rect.y
    && point.y <= rect.y + rect.height;
}

export function diagramRectContainsRectV010(
  outer: DiagramRectV010,
  inner: DiagramRectV010
): boolean {
  return inner.x >= outer.x
    && inner.y >= outer.y
    && inner.x + inner.width <= outer.x + outer.width
    && inner.y + inner.height <= outer.y + outer.height;
}

export function diagramRectsIntersectV010(
  a: DiagramRectV010,
  b: DiagramRectV010
): boolean {
  return a.x <= b.x + b.width
    && a.x + a.width >= b.x
    && a.y <= b.y + b.height
    && a.y + a.height >= b.y;
}

export function diagramRectMatchesV010(
  selection: DiagramRectV010,
  candidate: DiagramRectV010,
  mode: DiagramRectMatchModeV010
): boolean {
  return mode === "contain"
    ? diagramRectContainsRectV010(selection, candidate)
    : diagramRectsIntersectV010(selection, candidate);
}

export function snapDiagramValueV010(
  value: number,
  gridSize: number
): number {
  if (!Number.isFinite(value) || !Number.isFinite(gridSize) || gridSize <= 0) {
    throw new Error("EIDOS_2D_GRID_INVALID");
  }
  return Math.round(value / gridSize) * gridSize;
}

export function snapDiagramPointV010(
  point: DiagramPointV010,
  gridSize: number
): DiagramPointV010 {
  return {
    x: snapDiagramValueV010(point.x, gridSize),
    y: snapDiagramValueV010(point.y, gridSize)
  };
}

export type DiagramAlignmentV010 =
  | "left"
  | "center-x"
  | "right"
  | "top"
  | "center-y"
  | "bottom";

export function alignDiagramRectsV010(
  rects: readonly (DiagramRectV010 & { id: string })[],
  alignment: DiagramAlignmentV010
): Record<string, DiagramPointV010> {
  if (rects.length === 0) return {};
  const minX = Math.min(...rects.map(rect => rect.x));
  const maxX = Math.max(...rects.map(rect => rect.x + rect.width));
  const minY = Math.min(...rects.map(rect => rect.y));
  const maxY = Math.max(...rects.map(rect => rect.y + rect.height));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return Object.fromEntries(rects.map(rect => {
    let x = rect.x;
    let y = rect.y;
    if (alignment === "left") x = minX;
    if (alignment === "center-x") x = centerX - rect.width / 2;
    if (alignment === "right") x = maxX - rect.width;
    if (alignment === "top") y = minY;
    if (alignment === "center-y") y = centerY - rect.height / 2;
    if (alignment === "bottom") y = maxY - rect.height;
    return [rect.id, { x, y }];
  }));
}
