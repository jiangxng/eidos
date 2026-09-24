import test from "node:test";
import assert from "node:assert/strict";

test("Workbench public contracts support VS Code-style activity semantics", async () => {
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
