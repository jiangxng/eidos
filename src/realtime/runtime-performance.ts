export type RuntimeActivityCounterNameV010 =
  | "surfaceMounts"
  | "surfaceUnmounts"
  | "surfaceReuses"
  | "surfacePatches"
  | "resourceInvalidations"
  | "resourceRefreshes"
  | "httpRequests"
  | "conditionalRequests"
  | "sseMessages"
  | "sseReconnects"
  | "structuralDomMutations";

export interface RuntimeActivitySnapshotV010 {
  contractVersion: "0.1.0";
  surfaceMounts: number;
  surfaceUnmounts: number;
  surfaceReuses: number;
  surfacePatches: number;
  resourceInvalidations: number;
  resourceRefreshes: number;
  httpRequests: number;
  conditionalRequests: number;
  sseMessages: number;
  sseReconnects: number;
  structuralDomMutations: number;
}

export interface RuntimeActivityMonitorV010 {
  mark(name: RuntimeActivityCounterNameV010, amount?: number): void;
  snapshot(): RuntimeActivitySnapshotV010;
  reset(): void;
}

export interface IdleRuntimeBudgetV010 {
  maxSurfaceMounts: number;
  maxSurfaceUnmounts: number;
  maxHttpRequests: number;
  maxSseReconnects: number;
  maxStructuralDomMutations: number;
}

export interface IdleRuntimeBudgetResultV010 {
  ok: boolean;
  violations: string[];
  delta: RuntimeActivitySnapshotV010;
}

const zeroSnapshot = (): RuntimeActivitySnapshotV010 => ({
  contractVersion: "0.1.0",
  surfaceMounts: 0,
  surfaceUnmounts: 0,
  surfaceReuses: 0,
  surfacePatches: 0,
  resourceInvalidations: 0,
  resourceRefreshes: 0,
  httpRequests: 0,
  conditionalRequests: 0,
  sseMessages: 0,
  sseReconnects: 0,
  structuralDomMutations: 0
});

export const DEFAULT_IDLE_RUNTIME_BUDGET_V010: IdleRuntimeBudgetV010 = {
  maxSurfaceMounts: 0,
  maxSurfaceUnmounts: 0,
  maxHttpRequests: 0,
  maxSseReconnects: 0,
  maxStructuralDomMutations: 0
};

export function createRuntimeActivityMonitorV010(): RuntimeActivityMonitorV010 {
  let state = zeroSnapshot();
  return {
    mark(name, amount = 1) {
      if (!Number.isFinite(amount) || amount < 0) {
        throw new Error("EIDOS_RUNTIME_ACTIVITY_AMOUNT_INVALID");
      }
      state = {
        ...state,
        [name]: state[name] + amount
      };
    },
    snapshot() {
      return { ...state };
    },
    reset() {
      state = zeroSnapshot();
    }
  };
}

export function runtimeActivityDeltaV010(
  before: RuntimeActivitySnapshotV010,
  after: RuntimeActivitySnapshotV010
): RuntimeActivitySnapshotV010 {
  return {
    contractVersion: "0.1.0",
    surfaceMounts: Math.max(0, after.surfaceMounts - before.surfaceMounts),
    surfaceUnmounts: Math.max(0, after.surfaceUnmounts - before.surfaceUnmounts),
    surfaceReuses: Math.max(0, after.surfaceReuses - before.surfaceReuses),
    surfacePatches: Math.max(0, after.surfacePatches - before.surfacePatches),
    resourceInvalidations: Math.max(
      0,
      after.resourceInvalidations - before.resourceInvalidations
    ),
    resourceRefreshes: Math.max(0, after.resourceRefreshes - before.resourceRefreshes),
    httpRequests: Math.max(0, after.httpRequests - before.httpRequests),
    conditionalRequests: Math.max(
      0,
      after.conditionalRequests - before.conditionalRequests
    ),
    sseMessages: Math.max(0, after.sseMessages - before.sseMessages),
    sseReconnects: Math.max(0, after.sseReconnects - before.sseReconnects),
    structuralDomMutations: Math.max(
      0,
      after.structuralDomMutations - before.structuralDomMutations
    )
  };
}

export function evaluateIdleRuntimeBudgetV010(
  before: RuntimeActivitySnapshotV010,
  after: RuntimeActivitySnapshotV010,
  budget: IdleRuntimeBudgetV010 = DEFAULT_IDLE_RUNTIME_BUDGET_V010
): IdleRuntimeBudgetResultV010 {
  const delta = runtimeActivityDeltaV010(before, after);
  const violations: string[] = [];
  if (delta.surfaceMounts > budget.maxSurfaceMounts) {
    violations.push(`surfaceMounts=${delta.surfaceMounts} > ${budget.maxSurfaceMounts}`);
  }
  if (delta.surfaceUnmounts > budget.maxSurfaceUnmounts) {
    violations.push(`surfaceUnmounts=${delta.surfaceUnmounts} > ${budget.maxSurfaceUnmounts}`);
  }
  if (delta.httpRequests > budget.maxHttpRequests) {
    violations.push(`httpRequests=${delta.httpRequests} > ${budget.maxHttpRequests}`);
  }
  if (delta.sseReconnects > budget.maxSseReconnects) {
    violations.push(`sseReconnects=${delta.sseReconnects} > ${budget.maxSseReconnects}`);
  }
  if (delta.structuralDomMutations > budget.maxStructuralDomMutations) {
    violations.push(
      `structuralDomMutations=${delta.structuralDomMutations} > ${budget.maxStructuralDomMutations}`
    );
  }
  return {
    ok: violations.length === 0,
    violations,
    delta
  };
}
