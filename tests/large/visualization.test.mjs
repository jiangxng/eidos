import test from "node:test";import assert from "node:assert/strict";
import {chooseDefaultVisualization} from "../../dist/visualization/contracts.js";
test("visualization intent resolves deterministically",()=>{assert.equal(chooseDefaultVisualization({contractVersion:"0.1.0",visualizationId:"v",intent:"compare-over-time",measures:[{id:"revenue"}]}).rendererId,"line-chart");});
