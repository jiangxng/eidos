import test from "node:test";
import assert from "node:assert/strict";

import {
  eidosExperienceArchitecturePolicyV010,
  validateExperienceArchitectureV010
} from "../../dist/experience-architecture/index.js";

function base(overrides = {}) {
  return {
    contractVersion: "0.1.0",
    experienceId: "provider-setup",
    maturity: "candidate",
    archetype: "setup",
    taskMode: "bounded-task",
    goal: "Connect an AI provider and make the assistant ready",
    subject: "llm-provider",
    journey: {
      goal: "Make Personal Agent usable",
      states: ["provider", "credential", "verify", "ready"],
      currentState: "provider",
      completionStates: ["ready"],
      recoveryActions: ["retry-current-step"],
      resumable: true
    },
    actions: [
      {
        id: "continue",
        label: "Continue",
        determinism: "deterministic",
        frequency: "frequent",
        surface: "direct",
        primary: true,
        availableInStates: ["provider"]
      }
    ],
    agent: {
      enabled: true,
      mayRecommendDeclaredActions: true,
      mayPrepareDeclaredActionInputs: true,
      mayExecuteOnlyDeclaredActions: true
    },
    quality: {
      systemStringsLocalized: true,
      machineValuesSeparatedFromHumanCopy: true,
      designLanguageCompliant: true
    },
    ...overrides
  };
}

test("experience architecture policy is higher-level than visual realization", () => {
  assert.equal(eidosExperienceArchitecturePolicyV010.authority, "P0");
  assert.deepEqual(
    eidosExperienceArchitecturePolicyV010.authorityStack.slice(0, 2),
    ["experience-architecture", "experience-contracts"]
  );
  assert.equal(
    eidosExperienceArchitecturePolicyV010.actionModel.deterministicFrequentActionRequiresDirectSurface,
    true
  );
  assert.deepEqual(
    eidosExperienceArchitecturePolicyV010.gates,
    [
      "experience-structure",
      "journey-continuity",
      "action-grammar",
      "human-directness",
      "product-quality"
    ]
  );
});

test("candidate bounded task passes when journey, direct action and product quality are explicit", () => {
  const result = validateExperienceArchitectureV010(base());
  assert.equal(result.ok, true, JSON.stringify(result.diagnostics));
});

test("candidate journey cannot stop without completion or recovery", () => {
  const value = base({
    journey: {
      goal: "Configure provider",
      states: ["credential"],
      currentState: "credential",
      completionStates: [],
      recoveryActions: []
    }
  });
  const result = validateExperienceArchitectureV010(value);
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(item => item.code === "EIDOS_JOURNEY_COMPLETION_MISSING"));
  assert.ok(result.diagnostics.some(item => item.code === "EIDOS_JOURNEY_RECOVERY_MISSING"));
});

test("frequent deterministic action cannot be agent-only outside experimental maturity", () => {
  const value = base({
    actions: [{
      id: "approve",
      label: "Approve",
      determinism: "deterministic",
      frequency: "frequent",
      surface: "agent",
      primary: true,
      availableInStates: ["provider"]
    }]
  });
  const result = validateExperienceArchitectureV010(value);
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(item => item.code === "EIDOS_HUMAN_DIRECTNESS_REQUIRED"));
});

test("multiple primary actions in the same state are rejected", () => {
  const value = base({
    actions: [
      {
        id: "save",
        determinism: "deterministic",
        frequency: "frequent",
        surface: "direct",
        primary: true,
        availableInStates: ["provider"]
      },
      {
        id: "continue",
        determinism: "deterministic",
        frequency: "frequent",
        surface: "direct",
        primary: true,
        availableInStates: ["provider"]
      }
    ]
  });
  const result = validateExperienceArchitectureV010(value);
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some(item => item.code === "EIDOS_ACTION_PRIMARY_CONFLICT"));
});

test("production bounded tasks require accessibility, recovery, responsive and Golden Journey evidence", () => {
  const value = base({ maturity: "production" });
  const result = validateExperienceArchitectureV010(value);
  assert.equal(result.ok, false);
  for (const code of [
    "EIDOS_PRODUCT_KEYBOARD_REQUIRED",
    "EIDOS_PRODUCT_RESPONSIVE_REQUIRED",
    "EIDOS_PRODUCT_RECOVERY_REQUIRED",
    "EIDOS_GOLDEN_JOURNEY_REQUIRED"
  ]) {
    assert.ok(result.diagnostics.some(item => item.code === code), code);
  }
});

test("experimental work may stay incomplete but remains explicitly experimental", () => {
  const result = validateExperienceArchitectureV010({
    contractVersion: "0.1.0",
    experienceId: "prototype",
    maturity: "experimental",
    archetype: "conversation",
    taskMode: "bounded-task",
    goal: "Explore an interaction"
  });
  assert.equal(result.ok, true, JSON.stringify(result.diagnostics));
});
