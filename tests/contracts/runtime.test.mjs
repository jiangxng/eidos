import assert from "node:assert/strict"; import fs from "node:fs";
import {validateUidl,toRenderModel,createActionRequest,validateValues} from "../../dist/runtime/index.js";
import {renderToHtml} from "../../dist/renderers/html/index.js";
const doc=JSON.parse(fs.readFileSync(new URL("../../examples/sales-order.uidl.json",import.meta.url),"utf8"));
assert.equal(validateUidl(doc).ok,true); assert.deepEqual(toRenderModel(doc),toRenderModel(JSON.parse(JSON.stringify(doc))));
assert.match(renderToHtml(doc),/data-model-version="0.1.0"/); assert.match(renderToHtml(doc),/data-eidos-action="cancel"/);
const request=createActionRequest(doc,{orderNo:"SO-1001",productId:"P-1",quantity:2,currency:"USD"},{runtimeInstanceId:"rt-1"});
assert.equal(request.contractVersion,"0.1.0"); assert.equal(request.actionId,"approve"); assert.equal(request.runtimeInstanceId,"rt-1"); assert.equal(request.requiresConfirmation,true);
assert.equal(validateValues(doc,{orderNo:"BAD",productId:"P-1",quantity:0,currency:"EUR",extra:1}).ok,false);
const badVersion={...doc,contractVersion:"0.1.0"}; const vr=validateUidl(badVersion); assert.equal(vr.ok,false); assert.ok(vr.diagnostics.some(x=>x.code==="EIDOS_VERSION_UNSUPPORTED"));
const multi={...doc,actions:[...doc.actions,{id:"approve2",label:"Approve2",type:"submit"}]}; assert.equal(validateUidl(multi).ok,false);
console.log("EIDOS convergence runtime contracts PASS");

const editDoc = {
  ...doc,
  id: "edit-order",
  fields: doc.fields.map((field, index) => index === 0
    ? { ...field, initialValue: "SO-1001", readOnly: true }
    : field.key === "currency"
      ? { ...field, initialValue: "USD" }
      : field)
};
assert.equal(validateUidl(editDoc).ok, true);
const editHtml = renderToHtml(editDoc);
assert.match(editHtml, /name="orderNo"[^>]*value="SO-1001"/);
assert.match(editHtml, /value="USD" selected/);
assert.equal(
  toRenderModel(editDoc).fields.find(field => field.key === "orderNo").initialValue,
  "SO-1001"
);
