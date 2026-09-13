import assert from "node:assert/strict"; import {toJsonSnapshot} from "../../dist/runtime/index.js";
assert.deepEqual(toJsonSnapshot({b:2,a:[1,true]}),{a:[1,true],b:2});
assert.throws(()=>toJsonSnapshot({fn(){}}),/not JSON-serializable/); const c={}; c.self=c; assert.throws(()=>toJsonSnapshot(c),/cyclic/);
console.log("EIDOS JSON boundary PASS");
