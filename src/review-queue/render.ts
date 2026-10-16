import type {
  ReviewQueueActionV010,
  ReviewQueueFieldV010,
  ReviewQueueItemV010,
  ReviewQueueStateFilterV010,
  ReviewQueueV010
} from "./contracts.js";

function esc(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attr(name: string, value: unknown): string {
  return ` ${name}="${esc(value)}"`;
}

function encodedValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function renderAction(action: ReviewQueueActionV010, itemId: string): string {
  const enabled = action.enabled !== false;
  return `<button type="button"`
    + attr("data-eidos-review-action", action.id)
    + attr("data-eidos-item-id", itemId)
    + attr("data-eidos-action-type", action.type)
    + attr("data-eidos-primary", action.primary === true ? "true" : "false")
    + attr("data-eidos-confirm", action.requiresConfirmation === true ? "true" : "false")
    + (action.command ? attr("data-eidos-command", action.command) : "")
    + (action.inputVersion ? attr("data-eidos-input-version", action.inputVersion) : "")
    + (action.route ? attr("data-eidos-route", action.route) : "")
    + (action.disabledReason
      ? attr("title", action.disabledReason) + attr("data-eidos-disabled-reason", action.disabledReason)
      : "")
    + (enabled ? "" : " disabled")
    + ">" + esc(action.label) + "</button>";
}

function renderField(field: ReviewQueueFieldV010): string {
  const common = attr("name", field.key)
    + attr("data-eidos-review-field", field.key)
    + (field.readOnly ? " disabled" : "");

  if (field.control === "textarea") {
    return `<label data-eidos-review-field-wrap><span>${esc(field.label)}</span>`
      + `<textarea rows="3"${common}>`
      + esc(encodedValue(field.value)) + "</textarea></label>";
  }

  if (field.control === "select") {
    const current = encodedValue(field.value);
    const options = (field.options ?? []).map(option => {
      const value = encodedValue(option.value);
      return "<option"
        + attr("value", value)
        + attr("data-value-json", JSON.stringify(option.value))
        + (value === current ? " selected" : "")
        + ">" + esc(option.label) + "</option>";
    }).join("");
    return `<label data-eidos-review-field-wrap><span>${esc(field.label)}</span>`
      + "<select" + common + ">" + options + "</select></label>";
  }

  return `<label data-eidos-review-field-wrap><span>${esc(field.label)}</span>`
    + `<input type="text"${common}${attr("value", encodedValue(field.value))}></label>`;
}

function renderItem(item: ReviewQueueItemV010, technicalDetailsLabel: string,
  includedStates?: readonly string[]): string {
  const metrics = (item.metrics ?? []).map(metric =>
    "<span data-eidos-review-metric"
      + attr("data-metric-id", metric.id)
      + attr("data-tone", metric.tone ?? "neutral")
      + "><span>" + esc(metric.label) + "</span><strong>" + esc(metric.value) + "</strong></span>"
  ).join("");

  const evidence = (item.evidence ?? []).map(entry =>
    "<article data-eidos-review-evidence" + attr("data-evidence-id", entry.id) + ">"
      + "<strong>" + esc(entry.title) + "</strong>"
      + (entry.source ? "<span>" + esc(entry.source) + "</span>" : "")
      + (entry.detail ? "<p>" + esc(entry.detail) + "</p>" : "")
      + (entry.route ? "<a" + attr("href", entry.route) + attr("data-eidos-route", entry.route) + ">Open</a>" : "")
      + "</article>"
  ).join("");

  const fields = (item.fields ?? []).map(renderField).join("");
  const technical = (item.technicalDetails ?? []).length
    ? "<details data-eidos-review-technical><summary>" + esc(technicalDetailsLabel) + "</summary><dl>"
      + (item.technicalDetails ?? []).map(detail =>
        "<div data-eidos-review-technical-row"
          + attr("data-detail-key", detail.key)
          + "><dt>" + esc(detail.label) + "</dt><dd>" + esc(detail.value) + "</dd></div>"
      ).join("")
      + "</dl></details>"
    : "";
  const actions = [
    ...(item.secondaryActions ?? []).map(action => renderAction(action, item.id)),
    ...(item.primaryAction ? [renderAction({ ...item.primaryAction, primary: true }, item.id)] : [])
  ].join("");

  return "<li data-eidos-review-item"
    + attr("data-item-id", item.id)
    + attr("data-state", item.state)
    + (includedStates && !includedStates.includes(item.state) ? " hidden" : "")
    + "><form data-eidos-review-form" + attr("data-item-id", item.id) + ">"
    + "<header data-eidos-review-item-header><div><strong>" + esc(item.title) + "</strong>"
    + (item.summary ? "<p>" + esc(item.summary) + "</p>" : "")
    + "</div><span data-eidos-review-status>" + esc(item.statusLabel) + "</span></header>"
    + (metrics ? "<div data-eidos-review-metrics>" + metrics + "</div>" : "")
    + (fields ? "<div data-eidos-review-fields>" + fields + "</div>" : "")
    + (evidence ? "<section data-eidos-review-evidence-list>" + evidence + "</section>" : "")
    + technical
    + (actions ? "<footer data-eidos-review-actions>" + actions + "</footer>" : "")
    + "</form></li>";
}

const ALL_STATES = ["pending", "attention", "accepted", "rejected"] as const;

function reviewFilterOptions(filter: ReviewQueueStateFilterV010) {
  if (!filter.label?.trim() || !filter.noMatchesMessage?.trim()
    || !Array.isArray(filter.options) || !filter.options.length
    || filter.options.length > 8 || !filter.selectedId?.trim()) {
    throw new Error("EIDOS_REVIEW_STATE_FILTER_INVALID");
  }
  const ids = new Set<string>();
  let coversAll = false;
  for (const option of filter.options) {
    if (!option.id?.trim() || !option.label?.trim() || ids.has(option.id)
      || !Array.isArray(option.states) || !option.states.length
      || new Set(option.states).size !== option.states.length
      || option.states.some(state => !ALL_STATES.includes(state))) {
      throw new Error("EIDOS_REVIEW_STATE_FILTER_INVALID");
    }
    ids.add(option.id);
    if (ALL_STATES.every(state => option.states.includes(state))) coversAll = true;
  }
  if (!coversAll || !ids.has(filter.selectedId)) {
    throw new Error("EIDOS_REVIEW_STATE_FILTER_MISSING_ALL");
  }
  return filter.options;
}

export function renderReviewQueueToHtml(document: ReviewQueueV010): string {
  const ids = new Set<string>();
  for (const item of document.items) {
    if (ids.has(item.id)) throw new Error("EIDOS_REVIEW_ITEM_DUPLICATE: " + item.id);
    ids.add(item.id);
  }
  const context = document.context ? (() => {
    const subject = document.context!;
    if (!subject.title?.trim() || (subject.facts?.length ?? 0) > 8) {
      throw new Error("EIDOS_REVIEW_CONTEXT_INVALID");
    }
    const facts = (subject.facts ?? []).map(fact =>
      "<div data-eidos-review-context-fact"
      + attr("data-fact-id", fact.id)
      + "><dt>" + esc(fact.label) + "</dt><dd>" + esc(fact.value)
      + "</dd></div>"
    ).join("");
    if (new Set((subject.facts ?? []).map(fact => fact.id)).size
      !== (subject.facts ?? []).length
      || (subject.facts ?? []).some(fact =>
        !fact.id?.trim() || !fact.label?.trim())) {
      throw new Error("EIDOS_REVIEW_CONTEXT_INVALID");
    }
    return "<section data-eidos-review-context aria-label=" + `"${esc(subject.title)}"` + ">"
      + "<div data-eidos-review-context-heading><strong>" + esc(subject.title) + "</strong>"
      + (subject.subtitle ? "<span>" + esc(subject.subtitle) + "</span>" : "")
      + "</div>"
      + (subject.statusLabel ? "<span data-eidos-review-context-status>"
        + esc(subject.statusLabel) + "</span>" : "")
      + (facts ? "<dl data-eidos-review-context-facts>" + facts + "</dl>" : "")
      + "</section>";
  })() : "";
  const overview = document.overviewMetrics ? (() => {
    if (document.overviewMetrics!.length > 8 || new Set(
      document.overviewMetrics!.map(metric => metric.id)
    ).size !== document.overviewMetrics!.length
      || document.overviewMetrics!.some(metric =>
        !metric.id?.trim() || !metric.label?.trim()
        || !["neutral", "positive", "warning", "danger"].includes(metric.tone ?? "neutral"))) {
      throw new Error("EIDOS_REVIEW_OVERVIEW_INVALID");
    }
    const metrics = document.overviewMetrics!.map(metric =>
      "<div data-eidos-review-overview-metric"
      + attr("data-metric-id", metric.id)
      + attr("data-tone", metric.tone ?? "neutral")
      + "><strong>" + esc(metric.value) + "</strong>"
      + "<span>" + esc(metric.label) + "</span></div>"
    ).join("");
    return "<section data-eidos-review-overview aria-label=" + `"${esc(document.title)}"` + ">"
      + metrics + "</section>";
  })() : "";
  const filter = document.stateFilter;
  const options = filter ? reviewFilterOptions(filter) : [];
  const selected = options.find(option => option.id === filter?.selectedId);
  const includedStates = selected?.states;
  const technicalDetailsLabel = document.technicalDetailsLabel ?? "Technical details";
  const items = document.items.map(item =>
    renderItem(item, technicalDetailsLabel, includedStates)
  ).join("");
  const count = document.items.filter(item =>
    !includedStates || includedStates.includes(item.state)).length;
  const stateFilter = filter
    ? "<div data-eidos-review-filter-toolbar>"
      + "<label>" + esc(filter.label)
      + "<select data-eidos-review-state-filter>"
      + options.map(option =>
        "<option" + attr("value", option.id)
        + attr("data-eidos-review-filter-states", option.states.join(","))
        + (option.id === filter.selectedId ? " selected" : "")
        + ">" + esc(option.label) + "</option>"
      ).join("")
      + "</select></label>"
      + "<span data-eidos-review-results role=\"status\" aria-live=\"polite\">"
      + String(count) + " / " + String(document.items.length) + "</span></div>"
    : "";
  const filteredEmpty = filter
    ? "<p data-eidos-review-filter-empty"
      + (count ? " hidden" : "")
      + ">" + esc(filter.noMatchesMessage) + "</p>"
    : "";
  const empty = document.items.length === 0
    ? "<div data-eidos-review-empty>" + esc(document.emptyMessage ?? "Nothing to review.") + "</div>"
    : "";
  return "<section data-eidos-review-queue" + attr("data-review-id", document.id) + ">"
    + "<header data-eidos-review-header><h1>" + esc(document.title) + "</h1>"
    + (document.description ? "<p>" + esc(document.description) + "</p>" : "")
    + "</header>"
    + context + overview + stateFilter
    + empty + (items ? "<ol data-eidos-review-items>" + items + "</ol>" : "")
    + (document.items.length ? filteredEmpty : "")
    + "</section>";
}
