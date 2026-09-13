import test from "node:test";import assert from "node:assert/strict";import {sharedCore,personalPeriphery} from "../../dist/collaboration/index.js";
const r=[{id:"truth",capability:"evidence-stack",stability:"invariant"},{id:"decision",capability:"decision-panel",stability:"shared-stable"},{id:"mine",capability:"adaptive-layout",stability:"personal-stable"}];
test("shared core and personal periphery remain distinguishable",()=>{assert.deepEqual(sharedCore(r).map(x=>x.id),["truth","decision"]);assert.deepEqual(personalPeriphery(r).map(x=>x.id),["mine"]);});
