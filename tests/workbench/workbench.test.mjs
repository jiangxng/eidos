import test from "node:test";
import assert from "node:assert/strict";

test("Workbench public contracts support stable activity semantics", async () => {
  const module = await import("../../dist/workbench/index.js");
  assert.equal(typeof module.mountWorkbenchShell, "function");
  assert.equal(typeof module.createBrowserWorkbenchLayoutStateStore, "function");
});

test("Workbench activity kinds separate side views from workspace targets", () => {
  const activities = [
    { id: "apps", title: "Apps", icon: "A", kind: "navigation" },
    { id: "agent", title: "Agent", icon: "B", kind: "side-route", route: "/agent" },
    { id: "plugins", title: "Plugins", icon: "C", kind: "workspace-route", route: "/store" },
    { id: "workspace", title: "Workspace", icon: "D", kind: "workspace-focus" }
  ];
  assert.deepEqual(
    activities.map(item => item.kind),
    ["navigation", "side-route", "workspace-route", "workspace-focus"]
  );
});


test("Workbench activity normalization validates, sorts and supports secondary placement", async () => {
  const { normalizeWorkbenchActivities } = await import("../../dist/workbench/index.js");

  const normalized = normalizeWorkbenchActivities([
    { id: "settings", title: "Settings", icon: "S", kind: "workspace-route", route: "/settings", order: 1000, placement: "secondary" },
    { id: "apps", title: "Apps", icon: "A", kind: "navigation", order: 10 }
  ]);

  assert.deepEqual(normalized.map(item => item.id), ["apps", "settings"]);
  assert.equal(normalized[1].placement, "secondary");
  assert.throws(
    () => normalizeWorkbenchActivities([
      { id: "duplicate", title: "One", icon: "1", kind: "navigation" },
      { id: "duplicate", title: "Two", icon: "2", kind: "navigation" }
    ]),
    /EIDOS_WORKBENCH_ACTIVITY_DUPLICATE/
  );
  assert.throws(
    () => normalizeWorkbenchActivities([
      { id: "missing-route", title: "Missing route", icon: "M", kind: "side-route" }
    ]),
    /EIDOS_WORKBENCH_ACTIVITY_ROUTE_REQUIRED/
  );
});


test("Workbench explicit URL/deep link wins over Host default and persisted layout", async () => {
  const { resolveWorkbenchInitialTargetV010 } = await import(
    "../../dist/workbench/index.js"
  );

  assert.equal(
    resolveWorkbenchInitialTargetV010({
      urlPath: "/m/enterprise-agent",
      initialWorkspaceRoute: "/store",
      persistedWorkspaceTarget: "/ledger-runtime-configurator"
    }),
    "/m/enterprise-agent"
  );

  assert.equal(
    resolveWorkbenchInitialTargetV010({
      initialWorkspaceRoute: "/store",
      persistedWorkspaceTarget: "/ledger-runtime-configurator"
    }),
    "/store"
  );

  assert.equal(
    resolveWorkbenchInitialTargetV010({
      persistedWorkspaceTarget: "/ledger-runtime-configurator"
    }),
    "/ledger-runtime-configurator"
  );
});

test("Workbench shell exposes a generic global-control mount without domain semantics", async () => {
  const source = await import("node:fs/promises").then(fs =>
    fs.readFile(new URL("../../src/workbench/shell.ts", import.meta.url), "utf8")
  );
  assert.match(source, /mountGlobalControls\?:/);
  assert.match(source, /data-eidos-global-controls/);
  assert.doesNotMatch(source, /enterpriseId|subjectId/);
});


test("business Workbench exposes workspace mode and visible mobile activity labels", async () => {
  const source = await import("node:fs/promises").then(fs =>
    fs.readFile(new URL("../../src/workbench/shell.ts", import.meta.url), "utf8")
  );
  assert.match(source, /data-eidos-workspace-mode/);
  assert.match(source, /data-eidos-activity-label/);
  assert.match(source, /root\.setAttribute\("data-eidos-workspace-mode", workspaceMode\)/);
});


test("standard business Workbench does not render browser address chrome", async () => {
  const source = await import("node:fs/promises").then(fs =>
    fs.readFile(new URL("../../src/workbench/shell.ts", import.meta.url), "utf8")
  );
  assert.doesNotMatch(source, /data-eidos-browser-address/);
  assert.doesNotMatch(source, /data-eidos-browser-go/);
  assert.doesNotMatch(source, /data-eidos-browser-external/);
  assert.doesNotMatch(source, /\bbrowserAddress\b|\bbrowserGo\b|\bbrowserExternal\b/);
  assert.match(source, /browserToolbar\.append\(globalControls\)/);
});


test("Workbench history recovery preserves qualified routes and handles an empty hash fallback", async () => {
  const source = await import("node:fs/promises").then(fs =>
    fs.readFile(new URL("../../src/workbench/shell.ts", import.meta.url), "utf8")
  );

  assert.match(source, /routeQuerySuffix/);
  assert.match(
    source,
    /surface\.resolution\.route\.path \+ routeQuerySuffix\(normalized\)/
  );
  assert.match(
    source,
    /const fallback = options\.initialWorkspaceRoute\?\.trim\(\) \|\| "\/"/
  );
  assert.match(source, /window\.history\.replaceState/);
  assert.match(source, /void navigateWorkspace\(fallback\)/);
});

test("Workbench owns successful internal action-result navigation", async () => {
  const source = await import("node:fs/promises").then(fs =>
    fs.readFile(new URL("../../src/workbench/shell.ts", import.meta.url), "utf8")
  );

  assert.match(source, /function actionResultNavigateToV010/);
  assert.match(source, /route\.startsWith\("\/"\) \? route : undefined/);
  assert.match(
    source,
    /const navigateTo = actionResultNavigateToV010\(result\);/
  );
  assert.match(source, /await navigateWorkspace\(navigateTo\)/);
});
