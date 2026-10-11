import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateDiagramEditorStateV010} from "../dist/src/diagram/surface.js";

const node={
  id:"sale",kind:"subject",label:"Sales",shape:"rounded-rectangle",
  x:0,y:0,width:150,height:72
};
const state={contractVersion:"0.1.0",resourceId:"v06:fixture",revision:0,
  lifecycleState:"DRAFT",nodes:[node],edges:[]};

test("V06: declared issue level and message are validated; no business semantic writes",()=>{
  assert.equal(validateDiagramEditorStateV010({...state,
    nodes:[{...node,issue:{level:"error",message:"Required mapping is missing"}}]}).ok,true);
  assert.equal(validateDiagramEditorStateV010({...state,
    nodes:[{...node,issue:{level:"warning",message:"Review pending"}}]}).ok,true);
  assert.equal(validateDiagramEditorStateV010({...state,
    nodes:[{...node,issue:{level:"red",message:"Color is not a semantic level"}}]}).ok,false);
  assert.equal(validateDiagramEditorStateV010({...state,
    nodes:[{...node,issue:{level:"error",message:""}}]}).ok,false);
});
test("V06: selection, hover, focus and issue are distinct presentation surfaces",async()=>{
  const src=await readFile(new URL("../src/diagram/surface.ts",import.meta.url),"utf8");
  assert.match(src,/data-eidos-diagram-node\]:hover:not\(:focus-visible\)/);
  assert.match(src,/data-eidos-diagram-node\]:focus-visible/);
  assert.match(src,/element\.setAttribute\("aria-pressed", String\(nodeSelected\)\)/);
  assert.match(src,/data-eidos-diagram-issue/);
  assert.match(src,/issueBadge\.setAttribute\("aria-label"/);
});
