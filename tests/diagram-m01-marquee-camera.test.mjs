import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("M01 marquee selection freezes explicit camera before inspector can resize",async()=>{
 const source=await readFile(new URL("../src/diagram/surface.ts",import.meta.url),"utf8");
 assert.match(source,/suppressNextCanvasClick = true;\s*\/\/ M01:[^\n]*\n\s*followsFitToCanvas = false;\s*render\(\)/);
 assert.match(source,/new ResizeObserver\(\(\) => \{\s*if \(!disposed && state && followsFitToCanvas\)/);
});
