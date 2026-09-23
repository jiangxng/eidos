import { renderToHtml } from "../renderers/html/index.js";
import type { AppHost, AppHostLoadedPageV010, AppHostSnapshotV010 } from "./contracts.js";

export interface BrowserAppHostShellOptions {
  host: AppHost;
  container: HTMLElement | string;
  title?: string;
  renderPage?: (page: AppHostLoadedPageV010) => string | Node;
}

export interface BrowserAppHostShell {
  refresh(): Promise<AppHostSnapshotV010>;
  navigate(path: string): Promise<void>;
  dispose(): void;
}

export function renderAppHostPageToHtml(page: AppHostLoadedPageV010): string {
  return renderToHtml(page.definition);
}

function resolveContainer(value: HTMLElement | string): HTMLElement {
  if (typeof value !== "string") return value;
  const element = document.querySelector<HTMLElement>(value);
  if (!element) throw new Error(`EIDOS_APP_HOST_CONTAINER_NOT_FOUND: ${value}`);
  return element;
}

function currentPath(): string {
  const hash = window.location.hash;
  if (!hash || hash === "#") return "/";
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

export async function mountBrowserAppHostShell(
  options: BrowserAppHostShellOptions
): Promise<BrowserAppHostShell> {
  const container = resolveContainer(options.container);
  const host = options.host;
  const renderPage = options.renderPage ?? renderAppHostPageToHtml;
  let disposed = false;
  let activePath = currentPath();

  const root = document.createElement("div");
  root.setAttribute("data-eidos-app-host", "0.1.0");
  root.style.display = "grid";
  root.style.gridTemplateColumns = "240px minmax(0, 1fr)";
  root.style.minHeight = "100vh";

  const sidebar = document.createElement("aside");
  sidebar.style.borderRight = "1px solid #ddd";
  sidebar.style.padding = "16px";

  const heading = document.createElement("h1");
  heading.textContent = options.title ?? "Eidos App Host";
  heading.style.fontSize = "18px";
  heading.style.margin = "0 0 16px";

  const navigation = document.createElement("nav");
  navigation.setAttribute("aria-label", "Applications");

  const main = document.createElement("main");
  main.style.padding = "24px";
  main.setAttribute("data-eidos-app-host-main", "");

  const status = document.createElement("div");
  status.setAttribute("role", "status");
  status.style.marginBottom = "12px";
  status.style.fontSize = "12px";

  sidebar.append(heading, navigation);
  main.append(status);
  root.append(sidebar, main);
  container.replaceChildren(root);

  async function renderRoute(path: string): Promise<void> {
    if (disposed) return;
    activePath = path;
    const loaded = await host.loadRoute(path);

    const old = main.querySelector("[data-eidos-page]");
    old?.remove();

    const pageContainer = document.createElement("section");
    pageContainer.setAttribute("data-eidos-page", loaded?.page.id ?? "not-found");

    if (!loaded) {
      const message = document.createElement("p");
      message.textContent = path === "/"
        ? "No active application page."
        : `No active route for '${path}'.`;
      pageContainer.appendChild(message);
      main.appendChild(pageContainer);
      return;
    }

    try {
      const rendered = renderPage(loaded);
      if (typeof rendered === "string") {
        pageContainer.innerHTML = rendered;
      } else {
        pageContainer.appendChild(rendered);
      }
    } catch (error) {
      const pre = document.createElement("pre");
      pre.textContent = error instanceof Error ? error.message : String(error);
      pageContainer.appendChild(pre);
    }

    main.appendChild(pageContainer);
  }

  function renderNavigation(snapshot: AppHostSnapshotV010): void {
    navigation.replaceChildren();

    for (const item of snapshot.navigation) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.label;
      button.setAttribute("data-route", item.route);
      button.style.display = "block";
      button.style.width = "100%";
      button.style.textAlign = "left";
      button.style.margin = "0 0 8px";
      button.onclick = () => {
        window.location.hash = item.route;
      };
      navigation.appendChild(button);
    }

    status.textContent = snapshot.diagnostics.length === 0
      ? `App Host: ${snapshot.status} · revision ${snapshot.revision}`
      : `App Host: ${snapshot.status} · ${snapshot.diagnostics.length} diagnostic(s)`;
  }

  const unsubscribe = host.subscribe(snapshot => {
    if (disposed) return;
    renderNavigation(snapshot);
  });

  const onHashChange = () => {
    void renderRoute(currentPath());
  };
  window.addEventListener("hashchange", onHashChange);

  async function refresh(): Promise<AppHostSnapshotV010> {
    const snapshot = await host.refresh();
    renderNavigation(snapshot);

    let path = currentPath();
    if (!host.resolveRoute(path)) {
      const defaultRoute = snapshot.manifests.find(x => x.defaultRoute)?.defaultRoute;
      path = defaultRoute ?? snapshot.routes[0]?.path ?? "/";
      if (path !== "/" && currentPath() !== path) {
        window.location.hash = path;
      }
    }

    await renderRoute(path);
    return snapshot;
  }

  async function navigate(path: string): Promise<void> {
    if (disposed) throw new Error("EIDOS_APP_HOST_SHELL_DISPOSED");
    if (!host.resolveRoute(path)) throw new Error(`EIDOS_APP_HOST_ROUTE_NOT_FOUND: ${path}`);
    if (currentPath() !== path) {
      window.location.hash = path;
    } else {
      await renderRoute(path);
    }
  }

  function dispose(): void {
    disposed = true;
    unsubscribe();
    window.removeEventListener("hashchange", onHashChange);
    root.remove();
  }

  await refresh();

  return { refresh, navigate, dispose };
}
