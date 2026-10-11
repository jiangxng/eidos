import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("M05/M06 same secondary-button gesture distinguishes pan versus context menu",async()=>{
 const s=await readFile(new URL("../src/diagram/surface.ts",import.meta.url),"utf8");
 assert.match(s,/rightGesture\.dragged=true/);
 assert.match(s,/event\.type==="pointerup" && !completedRight\.dragged/);
 assert.match(s,/event\.preventDefault\(\);\s*\};\s*canvas\.addEventListener\("contextmenu",suppressNativeContextMenu\)/);
 assert.match(s,/data-eidos-diagram-context-menu/);
 assert.match(s,/selectedNodeIds\.size>1/);
 assert.match(s,/data-eidos-diagram-context-subject/);
 assert.match(s,/rightGesture=undefined;\s*closeContextMenu\(\)/);
});
