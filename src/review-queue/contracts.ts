import type { JsonValue } from "../runtime/contracts.js";

export type ReviewQueueItemStateV010 =
  | "pending"
  | "attention"
  | "accepted"
  | "rejected";

export interface ReviewQueueActionV010 {
  id: string;
  label: string;
  type: "command" | "navigate";
  command?: string;
  inputVersion?: string;
  route?: string;
  primary?: boolean;
  requiresConfirmation?: boolean;
  enabled?: boolean;
  disabledReason?: string;
}

export interface ReviewQueueFieldOptionV010 {
  label: string;
  value: JsonValue;
}

export interface ReviewQueueFieldV010 {
  key: string;
  label: string;
  control: "text" | "textarea" | "select";
  value?: JsonValue;
  readOnly?: boolean;
  options?: ReviewQueueFieldOptionV010[];
}

export interface ReviewQueueEvidenceV010 {
  id: string;
  title: string;
  source?: string;
  detail?: string;
  route?: string;
  localizationKey?: string;
}

export interface ReviewQueueMetricV010 {
  id: string;
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
}

export interface ReviewQueueTechnicalDetailV010 {
  key: string;
  label: string;
  value: string;
}

export interface ReviewQueueItemV010 {
  id: string;
  title: string;
  summary?: string;
  state: ReviewQueueItemStateV010;
  statusLabel: string;
  localizationKey?: string;
  fields?: ReviewQueueFieldV010[];
  evidence?: ReviewQueueEvidenceV010[];
  metrics?: ReviewQueueMetricV010[];
  technicalDetails?: ReviewQueueTechnicalDetailV010[];
  primaryAction?: ReviewQueueActionV010;
  secondaryActions?: ReviewQueueActionV010[];
  metadata?: Record<string, JsonValue>;
}

/** Object/file/task context; meaning and provenance come only from the owning Host. */
export interface ReviewQueueContextV010 {
  title: string;
  subtitle?: string;
  statusLabel?: string;
  facts?: { id: string; label: string; value: string }[];
}
/** View-only state filter: never authorizes a business decision or hides source data in the Host. */
export interface ReviewQueueStateFilterV010 {
  label: string;
  selectedId: string;
  options: {
    id: string;
    label: string;
    states: ReviewQueueItemStateV010[];
  }[];
  noMatchesMessage: string;
}

export interface ReviewQueueV010 {
  contractVersion: "0.1.0";
  kind: "review-queue";
  id: string;
  title: string;
  description?: string;
  emptyMessage?: string;
  technicalDetailsLabel?: string;
  context?: ReviewQueueContextV010;
  /** High-level task metrics, distinct from per-item evidence. */
  overviewMetrics?: ReviewQueueMetricV010[];
  stateFilter?: ReviewQueueStateFilterV010;
  items: ReviewQueueItemV010[];
  metadata?: Record<string, JsonValue>;
}

export function isReviewQueueV010(value: unknown): value is ReviewQueueV010 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return item.contractVersion === "0.1.0"
    && item.kind === "review-queue"
    && typeof item.id === "string"
    && item.id.length > 0
    && typeof item.title === "string"
    && item.title.length > 0
    && Array.isArray(item.items);
}
