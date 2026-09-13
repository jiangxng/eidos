import type { ExperienceStability } from "../experience/contracts.js";

export type DirectManipulationKind =
  | "drag"
  | "drop"
  | "reorder"
  | "resize"
  | "pin"
  | "unpin"
  | "hide"
  | "show"
  | "collapse"
  | "expand"
  | "duplicate"
  | "lock"
  | "unlock"
  | "reset";

export interface DirectManipulationRequest {
  regionId: string;
  kind: DirectManipulationKind;
  payload?: Record<string, string | number | boolean | null>;
}

export interface DirectManipulationPolicy {
  regionId: string;
  stability: ExperienceStability;
  allowed: DirectManipulationKind[];
  explicitHumanOverrideWinsOverEcInference: true;
}

export function canDirectlyManipulate(
  request: DirectManipulationRequest,
  policy: DirectManipulationPolicy,
): boolean {
  if (policy.regionId !== request.regionId) return false;
  if (policy.stability === "invariant") return request.kind === "reset";
  return policy.allowed.includes(request.kind);
}
