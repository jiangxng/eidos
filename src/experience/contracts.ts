import type { JsonValue } from "../runtime/contracts.js";

export type ExperienceStability = "invariant" | "shared-stable" | "personal-stable" | "adaptive";
export type ExperienceMode = "standard" | "role" | "personal" | "shared";
export type AttentionLevel = "passive" | "informative" | "important" | "requires-review" | "urgent" | "blocking";
export type MotionIntent = "none" | "reveal" | "continuity" | "attention" | "confirmation" | "causality" | "state-transition";
export type InteractionPreference = "pointer" | "keyboard" | "touch" | "voice" | "assistive";

export interface AccessibilityContext {
  reduceMotion?: boolean;
  highContrast?: boolean;
  screenReader?: boolean;
  textScale?: number;
}

export interface DeviceContext {
  terminal: "web" | "desktop" | "mobile" | "tablet" | "large-screen" | "embedded" | "terminal" | "voice" | "agent";
  viewportClass?: "compact" | "medium" | "expanded";
  inputModes?: InteractionPreference[];
  capabilities?: string[];
}

export interface CollaborationContext {
  sessionId: string;
  mode: "shared" | "presenter" | "follow" | "review";
  sharedReferenceVersion: string;
  participantCount?: number;
  presenterParticipantId?: string;
}

export interface ExperienceContextV010 {
  contractVersion: "0.1.0";
  contextId: string;
  mode: ExperienceMode;
  role?: string;
  expertise?: "novice" | "intermediate" | "expert";
  task?: string;
  locale?: string;
  device: DeviceContext;
  accessibility?: AccessibilityContext;
  collaboration?: CollaborationContext;
  preferences?: {
    density?: "comfortable" | "compact" | "dense";
    explanationLevel?: "minimal" | "normal" | "detailed";
    preferredInteraction?: InteractionPreference;
    stableRegionIds?: string[];
  };
  extensions?: Record<string, JsonValue>;
}

export interface AttentionSemantic {
  level: AttentionLevel;
  reasonCode: string;
  decisionCritical?: boolean;
  interruptible?: boolean;
}

export interface MotionSemantic {
  intent: MotionIntent;
  importance?: "low" | "normal" | "high";
  repeat?: "never" | "on-change" | "while-active";
}

export interface PresentationConstraint {
  id: string;
  stability: ExperienceStability;
  required?: boolean;
  hideable?: boolean;
  reorderable?: boolean;
  resizable?: boolean;
  reason?: string;
}

export interface ExperienceRegion {
  id: string;
  capability: string;
  stability: ExperienceStability;
  attention?: AttentionSemantic;
  motion?: MotionSemantic;
  props?: Record<string, JsonValue>;
}

export interface ExperienceCompositionV010 {
  contractVersion: "0.1.0";
  experienceId: string;
  title?: string;
  regions: ExperienceRegion[];
  constraints?: PresentationConstraint[];
  metadata?: Record<string, JsonValue>;
}

export interface ResolvedExperienceV010 {
  contractVersion: "0.1.0";
  experienceId: string;
  mode: ExperienceMode;
  regions: ExperienceRegion[];
  diagnostics: string[];
}
