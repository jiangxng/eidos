import test from "node:test";import assert from "node:assert/strict";import {getCapability,discoverCapabilities} from "../../dist/capabilities/catalog.js";
test("capability discovery is deterministic",()=>{assert.equal(getCapability("decision-panel")?.category,"decision");assert.ok(discoverCapabilities({category:"decision"}).length>=3);});
