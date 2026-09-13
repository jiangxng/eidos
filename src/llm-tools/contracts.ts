import type { ExperienceStability } from "../experience/contracts.js";

export interface CapabilityQuery {
  intent?: string;
  family?: string;
  terminal?: string;
  needsDirectManipulation?: boolean;
}

export interface CapabilityDescriptor {
  id: string;
  family: string;
  version: string;
  maturity: "planned" | "candidate" | "stable";
  summary: string;
  stabilitySupport?: ExperienceStability[];
}

export interface ProposedRegion {
  id: string;
  capability: string;
  stability: ExperienceStability;
  props?: Record<string, unknown>;
}

export interface ExperienceProposalV100 {
  contractVersion: "1.0.0";
  proposalId: string;
  mode: "standard" | "role" | "personal" | "shared";
  regions: ProposedRegion[];
}

export interface ValidationDiagnostic {
  code: string;
  severity: "error" | "warning";
  path: string;
  message: string;
  deterministic: true;
}

export interface ValidationResult {
  ok: boolean;
  diagnostics: ValidationDiagnostic[];
}

export interface RealizedRegion extends ProposedRegion {
  realization: "candidate-renderer" | "semantic-only";
}

export interface RealizedExperienceV100 {
  contractVersion: "1.0.0";
  proposalId: string;
  mode: ExperienceProposalV100["mode"];
  regions: RealizedRegion[];
}
