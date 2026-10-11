import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

// Source wiring only: paired Platform PR #720 executes actual Chrome
// pointer-hit checks. This does not constitute §14 commercial human signoff.
test("connector pointer corridor compensates CSS camera scaling at every zoom",async()=>{
  const source=await readFile(new URL("../src/diagram/surface.ts",import.meta.url),"utf8");
  const block=source.slice(source.indexOf('hit.setAttribute("data-eidos-diagram-edge"')-650,
    source.indexOf('hit.setAttribute("data-eidos-diagram-edge"')+200);
  assert.match(block,/hit\.setAttribute\("stroke-width", "18"\)/);
  assert.match(block,/hit\.style\.strokeWidth = "var\(--eidos-diagram-hit-world\)"/);
  assert.match(source,/stageElement\.style\.setProperty\("--eidos-diagram-hit-world", \(18 \/ camera\.scale\) \+ "px"\)/);
  assert.match(source,/line\.setAttribute\("vector-effect", "non-scaling-stroke"\)/);
});
