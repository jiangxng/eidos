/** A read-only server-owned page. Rows must not carry hidden fields. */
export interface CatalogBrowserTableV010 {
  /** The Domain supplies the current order; Eidos never sorts local rows. */
  columns: { id: string; label: string; sortRoute?: string; sortDirection?: "ascending" | "descending" }[];
  search?: { route: string; label: string; placeholder: string; value?: string; submitLabel: string };
  /** Optional routes for owner-authorized, transient column layouts; not a Saved View write. */
  columnControls?: {
    label: string;
    options: {
      id: string;
      label: string;
      visible: boolean;
      toggle?: { label: string; route: string };
      moveUp?: { label: string; route: string };
      moveDown?: { label: string; route: string };
    }[];
    reset?: { label: string; route: string };
  };
  /** A single bounded owner-defined quick-filter group; navigation reauthorizes full query. */
  quickFilters?: {
    label: string;
    options: { id: string; label: string; route: string; selected?: boolean }[];
  };
  /**
   * Multiple independent Owner-defined filter groups. Each action is a
   * presentation-only route back to the Host, which reauthorizes and combines
   * the complete query. Never derive predicates from browser rows.
   * Replaces (does not coexist with) the legacy single quickFilters group.
   */
  quickFilterGroups?: {
    id: string;
    label: string;
    options: { id: string; label: string; route: string; selected?: boolean }[];
  }[];
  /** Optional owner-provided, already-authorized view navigation. No query or ACL evaluation occurs in Eidos. */
  views?: {
    id: string;
    label: string;
    route: string;
    selected?: boolean;
  }[];
  /** Owner-supplied display switches. Eidos only navigates. */
  presentationViews?: {
    id: "table" | "chart" | "board";
    label: string;
    route: string;
    selected?: boolean;
  }[];
  rows: { itemId: string; cells: Record<string, string | number | boolean | null> }[];
  pageInfo?: {
    page: number;
    pageSize: number;
    total: number;
    previousRoute?: string;
    nextRoute?: string;
    summary: string;
    previousLabel: string;
    nextLabel: string;
  };
}

import type { CatalogAuthorizedAggregateBarsV010 } from "./authorized-bars.js";
import type { JsonValue } from "../runtime/contracts.js";
export type CatalogStatusTone = "neutral" | "positive" | "warning";

export interface CatalogBrowserActionV010 {
  id: string;
  label: string;
  type: "command" | "navigate" | "download";
  command?: string;
  inputVersion?: string;
  route?: string;
  href?: string;
  downloadFileName?: string;
  requiresConfirmation?: boolean;
  enabled?: boolean;
  disabledReason?: string;
  helpText?: string;
  values?: Record<string, JsonValue>;
}

export interface CatalogBrowserThumbnailV010 {
  src: string;
  alt: string;
}

export interface CatalogBrowserItemV010 {
  id: string;
  title: string;
  thumbnail?: CatalogBrowserThumbnailV010;
  summary?: string;
  version?: string;
  category?: string;
  badges?: string[];
  status?: { id?: string; label: string; tone?: CatalogStatusTone };
  primaryAction?: CatalogBrowserActionV010;
  secondaryActions?: CatalogBrowserActionV010[];
  metadata?: Record<string, string | number | boolean | null>;
}

/** This board groups only the already-authorized page; it never asserts global counts. */
export interface CatalogReadOnlyKanbanV010 {
  contractVersion: "0.1.0";
  kind: "read-only-kanban";
  scope: "AUTHORIZED_CURRENT_PAGE";
  title: string;
  scopeLabel: string;
  groupFieldId: string;
  emptyLabel: string;
  groups: readonly {id:string;label:string;itemIds:readonly string[]}[];
}

export interface CatalogBrowserV010 {
  contractVersion: "0.1.0";
  kind: "catalog-browser";
  /**
   * grid: browse/discovery cards such as stores and galleries.
   * list: management/work records where scanning and direct actions dominate.
   */
  layout?: "grid" | "list";
  id: string;
  title: string;
  description?: string;
  search?: {
    placeholder?: string;
    ariaLabel?: string;
    noResultsMessage?: string;
  };
  items: CatalogBrowserItemV010[];
  table?: CatalogBrowserTableV010;
  /** Pure presentation choice. Requires the corresponding owner-supplied view. */
  presentation?: "table" | "chart" | "board";
  readOnlyKanban?: CatalogReadOnlyKanbanV010;
  /** Optional domain/Host-authorized full-query chart, not current-page math. */
  authorizedChart?: CatalogAuthorizedAggregateBarsV010;
  emptyMessage?: string;
}
