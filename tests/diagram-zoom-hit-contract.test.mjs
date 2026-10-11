import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

// Source contract guard only. Actual DOM hit testing at three zoom levels
// belongs to the paired EVO App Platform native Chrome acceptance subgate.
// Never count this check as a v1.0 §14 commercial PASS.
test("connector hit stroke and visible line both avoid scaling under camera zoom",async()=>{
  const source=await readFile(new URL("../src/diagram/surface.ts",import.meta.url),"utf8");
  const block=source.slice(source.indexOf('hit.setAttribute("data-eidos-diagram-edge"')-500,
    source.indexOf('hit.setAttribute("data-eidos-diagram-edge"')+170);
  assert.match(block,/hit\.setAttribute\("stroke-width", "18"\)/);
  assert.match(block,/hit\.setAttribute\("vector-effect", "non-scaling-stroke"\)/);
  assert.match(source,/line\.setAttribute\("vector-effect", "non-scaling-stroke"\)/);
});
