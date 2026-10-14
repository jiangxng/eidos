import type { CatalogBrowserV010 } from "./contracts.js";

function esc(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertCatalog(input: CatalogBrowserV010): CatalogBrowserV010 {
  if (input.contractVersion !== "0.1.0" || input.kind !== "catalog-browser") {
    throw new Error("EIDOS_CATALOG_VERSION_UNSUPPORTED");
  }
  if (!input.id || !input.title || !Array.isArray(input.items)) {
    throw new Error("EIDOS_CATALOG_INVALID");
  }
  const ids = new Set<string>();
  for (const item of input.items) {
    if (!item.id || !item.title) throw new Error("EIDOS_CATALOG_ITEM_INVALID");
    if (item.thumbnail && (!item.thumbnail.src || !item.thumbnail.alt)) {
      throw new Error("EIDOS_CATALOG_ITEM_THUMBNAIL_INVALID");
    }
    if (ids.has(item.id)) throw new Error(`EIDOS_CATALOG_ITEM_DUPLICATE: ${item.id}`);
    ids.add(item.id);
  }
  if (input.table) {
    if (input.table.search && (!input.table.search.route.startsWith("/")
      || input.table.search.route.startsWith("//")
      || !input.table.search.label || !input.table.search.submitLabel)) {
      throw new Error("EIDOS_CATALOG_TABLE_SEARCH_INVALID");
    }
    const columns = input.table.columns;
    const rows = input.table.rows;
    if (!Array.isArray(columns) || !Array.isArray(rows)
      || !columns.length || columns.length > 12) {
      throw new Error("EIDOS_CATALOG_TABLE_INVALID");
    }
    const columnIds = new Set<string>();
    for (const column of columns) {
      if (!column.id?.trim() || !column.label?.trim() || columnIds.has(column.id)
        || (column.sortRoute !== undefined && !column.sortRoute.startsWith("/"))) {
        throw new Error("EIDOS_CATALOG_TABLE_COLUMN_INVALID");
      }
      columnIds.add(column.id);
    }
    const itemIds = new Set(input.items.map(item => item.id));
    const rowIds = new Set<string>();
    for (const row of rows) {
      if (!itemIds.has(row.itemId) || rowIds.has(row.itemId)
        || Object.keys(row.cells).some(key => !columnIds.has(key))) {
        throw new Error("EIDOS_CATALOG_TABLE_ROW_INVALID");
      }
      rowIds.add(row.itemId);
    }
    if (input.table.pageInfo) {
      const page = input.table.pageInfo;
      if (!Number.isSafeInteger(page.page) || page.page < 0
        || !Number.isSafeInteger(page.pageSize) || page.pageSize < 1
        || !Number.isSafeInteger(page.total) || page.total < rows.length
        || [page.previousRoute,page.nextRoute].some(route =>
          route !== undefined && !route.startsWith("/"))) {
        throw new Error("EIDOS_CATALOG_TABLE_PAGE_INVALID");
      }
    }
  }
  return input;
}

function actionButton(itemId: string, action: import("./contracts.js").CatalogBrowserActionV010, primary: boolean): string {
  if (action.type === "download") {
    if (!action.href?.startsWith("/")) {
      throw new Error("EIDOS_CATALOG_DOWNLOAD_HREF_INVALID");
    }
    const downloadName = action.downloadFileName
      ? ` download="${esc(action.downloadFileName)}"`
      : " download";
    const help = action.helpText
      ? `<span data-eidos-action-help data-action-id="${esc(action.id)}">${esc(action.helpText)}</span>`
      : "";
    return `<span data-eidos-action-wrap><a data-eidos-catalog-download="${esc(action.id)}" data-eidos-item-id="${esc(itemId)}" data-eidos-primary="${primary ? "true" : "false"}" href="${esc(action.href)}"${downloadName}>${esc(action.label)}</a>${help}</span>`;
  }
  const command = action.command ? ` data-eidos-command="${esc(action.command)}"` : "";
  const values = action.values
    ? ` data-eidos-action-values="${esc(JSON.stringify(action.values))}"`
    : "";
  const inputVersion = action.inputVersion ? ` data-eidos-input-version="${esc(action.inputVersion)}"` : "";
  const route = action.route ? ` data-eidos-route="${esc(action.route)}"` : "";
  const enabled = action.enabled !== false;
  const disabled = enabled ? "" : " disabled";
  const reason = action.disabledReason ? ` data-eidos-disabled-reason="${esc(action.disabledReason)}" title="${esc(action.disabledReason)}"` : "";
  const help = action.helpText ? `<span data-eidos-action-help data-action-id="${esc(action.id)}">${esc(action.helpText)}</span>` : "";
  return `<span data-eidos-action-wrap><button type="button" data-eidos-catalog-action="${esc(action.id)}" data-eidos-action-type="${esc(action.type)}" data-eidos-item-id="${esc(itemId)}" data-eidos-confirm="${action.requiresConfirmation === true ? "true" : "false"}" data-eidos-primary="${primary ? "true" : "false"}"${command}${inputVersion}${route}${values}${reason}${disabled}>${esc(action.label)}</button>${help}</span>`;
}

export function renderCatalogBrowserToHtml(input: CatalogBrowserV010): string {
  const model = assertCatalog(input);
  const items = model.items.map(item => {
    const badges = (item.badges ?? []).map(x => `<span data-eidos-catalog-badge>${esc(x)}</span>`).join("");
    const metadata = Object.entries(item.metadata ?? {})
      .map(([key, value]) => `<span data-eidos-catalog-meta data-key="${esc(key)}">${esc(key)}: ${esc(value)}</span>`)
      .join("");
    const status = item.status
      ? `<span data-eidos-catalog-status data-tone="${esc(item.status.tone ?? "neutral")}">${esc(item.status.label)}</span>`
      : "";
    const thumbnail = item.thumbnail
      ? `<div data-eidos-catalog-thumbnail><img src="${esc(item.thumbnail.src)}" alt="${esc(item.thumbnail.alt)}" loading="lazy" decoding="async"></div>`
      : "";
    const actions = [
      ...(item.secondaryActions ?? []).map(a => actionButton(item.id, a, false)),
      ...(item.primaryAction ? [actionButton(item.id, item.primaryAction, true)] : [])
    ].join("");

    const searchText = [
      item.title,
      item.summary ?? "",
      item.version ?? "",
      item.category ?? "",
      item.thumbnail?.alt ?? "",
      ...(item.badges ?? []),
      ...Object.entries(item.metadata ?? {}).flatMap(([key, value]) => [key, String(value ?? "")])
    ].join(" ").toLocaleLowerCase();

    return `<article data-eidos-catalog-item="${esc(item.id)}" data-eidos-catalog-search-text="${esc(searchText)}">${thumbnail}<header><div><h2>${esc(item.title)}</h2>${item.version ? `<span data-eidos-catalog-version>${esc(item.version)}</span>` : ""}</div>${status}</header>${item.category ? `<div data-eidos-catalog-category>${esc(item.category)}</div>` : ""}${item.summary ? `<p>${esc(item.summary)}</p>` : ""}<div data-eidos-catalog-badges>${badges}</div><div data-eidos-catalog-metadata>${metadata}</div><footer>${actions}</footer></article>`;
  }).join("");

  // The semantic table and narrow-screen cards share the same authorized page.
  const table = model.table ? (() => {
    const records = new Map(model.items.map(item => [item.id, item]));
    const heads = model.table!.columns.map(column =>
      `<th scope="col">${column.sortRoute
        ? actionButton(undefined as never, {
            id: "sort-" + column.id, label: column.label,
            type: "navigate", route: column.sortRoute
          }, false)
        : esc(column.label)}</th>`
    ).join("");
    const rows = model.table!.rows.map(row => {
      const item = records.get(row.itemId);
      if (!item) throw new Error("EIDOS_CATALOG_TABLE_ROW_INVALID");
      const cells = model.table!.columns.map((column, i) => {
        const value = row.cells[column.id];
        const visible = value === undefined || value === null ? "—" : String(value);
        const detail = i === 0 && item.primaryAction?.type === "navigate"
          ? actionButton(item.id, {
              ...item.primaryAction, label: visible
            }, true)
          : esc(visible);
        return `<td data-eidos-col="${esc(column.id)}">${detail}</td>`;
      }).join("");
      return `<tr data-eidos-table-row="${esc(row.itemId)}">${cells}</tr>`;
    }).join("");
    return `<div data-eidos-catalog-table-wrap><table data-eidos-catalog-table><thead><tr>${heads}</tr></thead><tbody>${rows}</tbody></table></div>`;
  })() : "";
  const pagination = model.table?.pageInfo ? (() => {
    const page = model.table!.pageInfo!;
    const previous = page.previousRoute
      ? actionButton(undefined as never, { id: "previous-page", label: page.previousLabel,
          type: "navigate", route: page.previousRoute }, false)
      : "";
    const next = page.nextRoute
      ? actionButton(undefined as never, { id: "next-page", label: page.nextLabel,
          type: "navigate", route: page.nextRoute }, false)
      : "";
    return `<nav data-eidos-catalog-pagination aria-label="Pagination"><span data-eidos-page-summary>${esc(page.summary)}</span><div>${previous}${next}</div></nav>`;
  })() : "";

  const serverSearch = model.table?.search ? `<form data-eidos-catalog-server-search data-eidos-search-route="${esc(model.table.search.route)}" role="search"><label>${esc(model.table.search.label)} <input type="search" name="search" value="${esc(model.table.search.value ?? "")}" maxlength="120" placeholder="${esc(model.table.search.placeholder)}"></label><button type="submit">${esc(model.table.search.submitLabel)}</button></form>` : "";
  const search = model.search
    ? `<div data-eidos-catalog-search><input type="search" data-eidos-catalog-search-input placeholder="${esc(model.search.placeholder ?? "Search")}" aria-label="${esc(model.search.ariaLabel ?? model.search.placeholder ?? "Search catalog")}"></div>`
    : "";
  const noResults = model.search
    ? `<p data-eidos-catalog-search-empty hidden>${esc(model.search.noResultsMessage ?? "No matching items.")}</p>`
    : "";

  return `<section data-eidos-capability="catalog-browser" data-eidos-id="${esc(model.id)}" data-eidos-catalog-layout="${esc(model.layout ?? "grid")}" data-eidos-catalog-has-table="${model.table ? "true" : "false"}"><header><h1>${esc(model.title)}</h1>${model.description ? `<p>${esc(model.description)}</p>` : ""}</header>${search}${serverSearch}${table}<div data-eidos-catalog-items>${items || `<p data-eidos-empty>${esc(model.emptyMessage ?? "No items")}</p>`}</div>${noResults}${pagination}</section>`;
}
