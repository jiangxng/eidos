/**
 * Deterministic, bounded orthogonal route planner.
 *
 * Geometry only. Nodes/relations are never added, removed or rewritten.
 * The fast common path retains the stable L/Z connector when unobstructed.
 */
export interface DiagramRoutingPointV010 { x: number; y: number; }
export interface DiagramRoutingObstacleV010 {
  x: number; y: number; width: number; height: number;
}
export interface DiagramOrthogonalRouteV010 {
  points: DiagramRoutingPointV010[];
  cleared: boolean;
  notice?: "ROUTE_CONGESTED" | "ROUTE_BUDGET_EXCEEDED";
}
interface Rect {
  x0: number; y0: number; x1: number; y1: number;
}

const EPSILON = 1e-7;
const MAX_RELEVANT_OBSTACLES = 24;
const MAX_GRID = 2704;

function rect(obstacle: DiagramRoutingObstacleV010, margin: number): Rect {
  return {
    x0: obstacle.x - margin,
    x1: obstacle.x + obstacle.width + margin,
    y0: obstacle.y - margin,
    y1: obstacle.y + obstacle.height + margin
  };
}

function valid(point: DiagramRoutingPointV010): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}
function cross(rectangle: Rect, a: DiagramRoutingPointV010, b: DiagramRoutingPointV010): boolean {
  if (Math.abs(a.x - b.x) <= EPSILON) {
    return a.x > rectangle.x0 + EPSILON && a.x < rectangle.x1 - EPSILON
      && Math.min(a.y, b.y) < rectangle.y1 - EPSILON
      && Math.max(a.y, b.y) > rectangle.y0 + EPSILON;
  }
  if (Math.abs(a.y - b.y) <= EPSILON) {
    return a.y > rectangle.y0 + EPSILON && a.y < rectangle.y1 - EPSILON
      && Math.min(a.x, b.x) < rectangle.x1 - EPSILON
      && Math.max(a.x, b.x) > rectangle.x0 + EPSILON;
  }
  return true;
}
function blocked(
  obstacles: readonly Rect[],
  a: DiagramRoutingPointV010,
  b: DiagramRoutingPointV010
): boolean {
  return obstacles.some(obstacle => cross(obstacle, a, b));
}
function midpoint(a: number, b: number): number {
  return a + (b - a) / 2;
}
function simpleRoutes(a: DiagramRoutingPointV010, b: DiagramRoutingPointV010):
DiagramRoutingPointV010[][] {
  const middleX = midpoint(a.x, b.x);
  const middleY = midpoint(a.y, b.y);
  return Math.abs(a.x - b.x) >= Math.abs(a.y - b.y)
    ? [
        [a, { x: middleX, y: a.y }, { x: middleX, y: b.y }, b],
        [a, { x: a.x, y: middleY }, { x: b.x, y: middleY }, b]
      ]
    : [
        [a, { x: a.x, y: middleY }, { x: b.x, y: middleY }, b],
        [a, { x: middleX, y: a.y }, { x: middleX, y: b.y }, b]
      ];
}
function clearRoute(points: readonly DiagramRoutingPointV010[], obstacles: readonly Rect[]): boolean {
  for (let i = 1; i < points.length; i++) {
    if (blocked(obstacles, points[i - 1]!, points[i]!)) return false;
  }
  return true;
}
function normalize(points: readonly DiagramRoutingPointV010[]): DiagramRoutingPointV010[] {
  const deduped: DiagramRoutingPointV010[] = [];
  for (const point of points) {
    const last = deduped.at(-1);
    if (!last || Math.abs(point.x - last.x) > EPSILON || Math.abs(point.y - last.y) > EPSILON) {
      deduped.push(point);
    }
  }
  for (let index = 1; index < deduped.length - 1;) {
    const p = deduped[index - 1]!;
    const c = deduped[index]!;
    const q = deduped[index + 1]!;
    if (
      (Math.abs(p.x - c.x) <= EPSILON && Math.abs(c.x - q.x) <= EPSILON)
      || (Math.abs(p.y - c.y) <= EPSILON && Math.abs(c.y - q.y) <= EPSILON)
    ) deduped.splice(index, 1);
    else index++;
  }
  return deduped;
}
class Queue {
  items: Array<{ id: number; cost: number }> = [];
  push(id: number, cost: number): void {
    const items = this.items;
    items.push({ id, cost });
    let i = items.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (items[parent]!.cost <= cost) break;
      items[i] = items[parent]!;
      i = parent;
    }
    items[i] = { id, cost };
  }
  pop(): { id: number; cost: number } | undefined {
    const items = this.items;
    if (!items.length) return undefined;
    const first = items[0]!;
    const last = items.pop()!;
    if (!items.length) return first;
    let i = 0;
    while (2 * i + 1 < items.length) {
      let child = 2 * i + 1;
      if (child + 1 < items.length && items[child + 1]!.cost < items[child]!.cost) child++;
      if (items[child]!.cost >= last.cost) break;
      items[i] = items[child]!;
      i = child;
    }
    items[i] = last;
    return first;
  }
}
/** Collision-free orthogonal paths or a clearly flagged legacy fallback. */
export function routeDiagramOrthogonallyV010(
  start: DiagramRoutingPointV010,
  end: DiagramRoutingPointV010,
  obstacles: readonly DiagramRoutingObstacleV010[],
  clearance = 14
): DiagramOrthogonalRouteV010 {
  if (!valid(start) || !valid(end)
    || !Number.isFinite(clearance) || clearance < 0 || clearance > 200
    || !Array.isArray(obstacles) || obstacles.some(item =>
      !valid(item) || !Number.isFinite(item.width) || !Number.isFinite(item.height)
      || item.width <= 0 || item.height <= 0
    )) {
    throw new Error("EIDOS_DIAGRAM_ROUTE_INPUT_INVALID");
  }
  const simple = simpleRoutes(start, end);
  // This is a bounded local planner, not a promise of global optimal routing.
  const bounds = {
    x0: Math.min(start.x, end.x), x1: Math.max(start.x, end.x),
    y0: Math.min(start.y, end.y), y1: Math.max(start.y, end.y)
  };
  const window = 400 + Math.max(bounds.x1 - bounds.x0, bounds.y1 - bounds.y0);
  const near = obstacles.map(obstacle => rect(obstacle, clearance))
    .filter(item =>
      item.x1 >= bounds.x0 - window && item.x0 <= bounds.x1 + window
      && item.y1 >= bounds.y0 - window && item.y0 <= bounds.y1 + window
    )
    .sort((a, b) => {
      const distance = (item: Rect) =>
        Math.abs(midpoint(item.x0, item.x1) - midpoint(bounds.x0, bounds.x1))
        + Math.abs(midpoint(item.y0, item.y1) - midpoint(bounds.y0, bounds.y1));
      return distance(a) - distance(b)
        || a.x0 - b.x0 || a.y0 - b.y0 || a.x1 - b.x1 || a.y1 - b.y1;
    });
  // If there are too many possibly relevant obstacles, decline to claim clearance.
  if (near.length > MAX_RELEVANT_OBSTACLES) {
    return { points: normalize(simple[0]!), cleared: false, notice: "ROUTE_BUDGET_EXCEEDED" };
  }
  for (const route of simple) {
    if (clearRoute(route, near)) return { points: normalize(route), cleared: true };
  }

  const xs = [...new Set([start.x, end.x, ...near.flatMap(item => [item.x0, item.x1])])]
    .sort((a, b) => a - b);
  const ys = [...new Set([start.y, end.y, ...near.flatMap(item => [item.y0, item.y1])])]
    .sort((a, b) => a - b);
  const columns = xs.length;
  const rows = ys.length;
  if (columns * rows > MAX_GRID) {
    return { points: normalize(simple[0]!), cleared: false, notice: "ROUTE_BUDGET_EXCEEDED" };
  }
  const vertex = (x: number, y: number) => y * columns + x;
  const decoded = (v: number): DiagramRoutingPointV010 => ({
    x: xs[v % columns]!, y: ys[Math.floor(v / columns)]!
  });
  const startVertex = vertex(xs.indexOf(start.x), ys.indexOf(start.y));
  const endVertex = vertex(xs.indexOf(end.x), ys.indexOf(end.y));
  // State is position + arrival axis (0=initial, 1=horizontal, 2=vertical).
  const encode = (v: number, axis: number) => v * 3 + axis;
  const size = columns * rows * 3;
  const costs = new Float64Array(size);
  costs.fill(Infinity);
  const previous = new Int32Array(size);
  previous.fill(-1);
  const heap = new Queue();
  const initial = encode(startVertex, 0);
  costs[initial] = 0;
  heap.push(initial, 0);
  let final = -1;
  let visited = 0;
  while (heap.items.length && visited < 24000) {
    const item = heap.pop()!;
    if (item.cost > costs[item.id] + EPSILON) continue;
    visited++;
    const v = Math.floor(item.id / 3);
    const axis = item.id % 3;
    if (v === endVertex) { final = item.id; break; }
    const x = v % columns;
    const y = Math.floor(v / columns);
    const next = [
      [x + 1, y, 1], [x, y + 1, 2],
      [x - 1, y, 1], [x, y - 1, 2]
    ];
    for (const [nx, ny, nextAxis] of next) {
      if (nx! < 0 || nx! >= columns || ny! < 0 || ny! >= rows) continue;
      const neighbor = vertex(nx!, ny!);
      const a = decoded(v);
      const b = decoded(neighbor);
      if (blocked(near, a, b)) continue;
      const cost = item.cost + Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
        + (axis !== 0 && axis !== nextAxis ? 24 : 0);
      const id = encode(neighbor, nextAxis!);
      if (cost + EPSILON < costs[id]) {
        costs[id] = cost;
        previous[id] = item.id;
        heap.push(id, cost);
      }
    }
  }
  if (final === -1) {
    return { points: normalize(simple[0]!), cleared: false, notice: "ROUTE_CONGESTED" };
  }
  const route: DiagramRoutingPointV010[] = [];
  for (let current = final; current !== -1; current = previous[current]!) {
    route.push(decoded(Math.floor(current / 3)));
  }
  route.reverse();
  return { points: normalize(route), cleared: true };
}
