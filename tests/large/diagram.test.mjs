import test from "node:test";import assert from "node:assert/strict";
import {validateDiagram} from "../../dist/diagram/contracts.js";
test("diagram validates edge references",()=>{assert.deepEqual(validateDiagram({contractVersion:"0.1.0",diagramId:"d",kind:"flowchart",nodes:[{id:"a",kind:"step"}],edges:[{id:"e",source:"a",target:"missing"}]}),["Unknown edge target: missing"]);});
