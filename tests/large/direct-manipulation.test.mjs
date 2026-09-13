import test from "node:test";import assert from "node:assert/strict";
import {canDirectlyManipulate} from "../../dist/customization/direct-manipulation.js";
test("explicit direct manipulation respects stability",()=>{assert.equal(canDirectlyManipulate({regionId:"x",kind:"reorder"},{regionId:"x",stability:"personal-stable",allowed:["reorder"],explicitHumanOverrideWinsOverEcInference:true}),true);assert.equal(canDirectlyManipulate({regionId:"x",kind:"reorder"},{regionId:"x",stability:"invariant",allowed:["reorder"],explicitHumanOverrideWinsOverEcInference:true}),false);});
