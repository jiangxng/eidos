import test from "node:test";
import assert from "node:assert/strict";

import {
  isExtensionManagerV010,
  renderExtensionManagerToHtml
} from "../../dist/extension-manager/index.js";
import { renderAppHostPageToHtml } from "../../dist/app-host/index.js";

const definition = {
  contractVersion: "0.1.0",
  kind: "extension-manager",
  id: "plugin-lab",
  title: "Plugin Platform Lab",
  description: "Validate App Platform and Eidos integration.",
  protocol: {
    name: "EVO Plugin Protocol",
    version: "0.1.0",
    status: "preview"
  },
  host: {
    name: "EVO App Platform",
    version: "0.1.0",
    eidosVersion: "1.3.0"
  },
  items: [
    {
      id: "reference-plugin",
      title: "Reference Plugin",
      description: "Pure declarative test plugin.",
      version: "0.1.0",
      publisher: "EVO",
      category: "APPLICATION",
      status: { id: "not-installed", label: "Not installed" },
      compatibility: {
        protocolVersion: "0.1.0",
        eidosVersion: "1.3.0",
        state: "compatible"
      },
      capabilities: {
        provides: ["reference.hello"],
        requires: ["eidos.app-host"]
      },
      contributions: [
        { kind: "eidos.experience", count: 1 },
        { kind: "eidos.workbench-activity", count: 1 }
      ],
      primaryAction: {
        id: "install",
        label: "Install",
        type: "command",
        command: "app-platform.install-package",
        inputVersion: "0.1.0"
      }
    }
  ]
};

test("Extension Manager contract is host-neutral", () => {
  assert.equal(isExtensionManagerV010(definition), true);
});

test("Extension Manager renders protocol, compatibility, contributions and lifecycle actions", () => {
  const html = renderExtensionManagerToHtml(definition);
  assert.match(html, /data-eidos-extension-manager="plugin-lab"/);
  assert.match(html, /EVO Plugin Protocol/);
  assert.match(html, /eidos\.experience/);
  assert.match(html, /data-eidos-extension-action="install"/);
});

test("App Host recognizes Extension Manager as a first-class Eidos capability", () => {
  const page = {
    experienceId: "plugin-lab",
    packageId: "host",
    featureId: "host.plugin-lab",
    route: { id: "plugin-lab", path: "/plugin-lab", pageId: "plugin-lab" },
    page: { id: "plugin-lab", source: "memory://plugin-lab" },
    definition
  };
  const html = renderAppHostPageToHtml(page);
  assert.match(html, /data-eidos-extension-manager=/);
});


test("Extension Manager renders trust, permissions and runtime posture", () => {
  const definition = {
    contractVersion: "0.1.0",
    kind: "extension-manager",
    id: "security-test",
    title: "Extensions",
    protocol: { name: "EVO Plugin Protocol", version: "0.1.0", status: "preview" },
    host: { name: "EVO App Platform" },
    items: [{
      id: "sample",
      title: "Sample",
      version: "0.1.0",
      status: { id: "enabled", label: "Enabled" },
      trust: { level: "review", label: "Review required", publisher: "Example" },
      permissions: [{ id: "network", label: "Network access", risk: "medium", granted: false }],
      activation: { mode: "on-demand", events: ["onCommand"] },
      runtime: { kind: "worker", isolation: "worker", status: "inactive" },
      storage: { scope: "package", state: "available" },
      events: { publish: ["sample.changed"], subscribe: ["host.ready"] }
    }]
  };
  const html = renderExtensionManagerToHtml(definition);
  assert.match(html, /data-eidos-extension-trust/);
  assert.match(html, /Network access/);
  assert.match(html, /Activation: on-demand/);
  assert.match(html, /Runtime: worker \/ worker/);
  assert.match(html, /Storage: available/);
});
