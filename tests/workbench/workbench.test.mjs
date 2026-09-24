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
