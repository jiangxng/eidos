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


const fileDoc = {
  contractVersion: "0.1.1",
  kind: "form",
  id: "import-source",
  title: "Import source",
  purpose: "execute-command",
  command: {
    code: "data-import.stage-file",
    inputVersion: "0.1.0"
  },
  fields: [{
    key: "sourceFile",
    label: "Source file",
    semanticType: "import-source-file",
    control: "file",
    required: true,
    accept: [".csv", ".xlsx"],
    maxBytes: 10485760
  }],
  actions: [{
    id: "stage",
    label: "Read file",
    type: "submit",
    command: "data-import.stage-file",
    requiresConfirmation: false
  }]
};

assert.equal(validateUidl(fileDoc).ok, true);
const fileHtml = renderToHtml(fileDoc);
assert.match(fileHtml, /type="file"/);
assert.match(fileHtml, /accept="\.csv,\.xlsx"/);
assert.match(fileHtml, /data-eidos-file-max-bytes="10485760"/);

const fileRequest = createActionRequest(fileDoc, {
  sourceFile: {
    name: "counterparties.xlsx",
    mediaType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 5,
    contentBase64: "SGVsbG8="
  }
});
assert.equal(fileRequest.values.sourceFile.name, "counterparties.xlsx");

assert.equal(validateValues(fileDoc, {
  sourceFile: {
    name: "too-large.xlsx",
    mediaType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 10485761,
    contentBase64: "SGVsbG8="
  }
}).ok, false);

assert.equal(validateUidl({
  ...fileDoc,
  fields: [{
    ...fileDoc.fields[0],
    initialValue: "forbidden.xlsx"
  }]
}).ok, false);


const fieldLinkDoc = {
  ...fileDoc,
  fields: [{
    ...fileDoc.fields[0],
    contextLink: {label:"创建企业字段",route:"/object-extensions/from-import?job=abc"}
  }]
};
assert.equal(validateUidl(fieldLinkDoc).ok,true);
const fieldLinkHtml=renderToHtml(fieldLinkDoc);
assert.match(fieldLinkHtml,/type="button" data-eidos-field-context-link/);
assert.match(fieldLinkHtml,/data-eidos-context-route="\/object-extensions\/from-import\?job=abc"/);
assert.equal(toRenderModel(fieldLinkDoc).fields[0].contextLink.label,"创建企业字段");
assert.equal(validateUidl({
  ...fieldLinkDoc,
  fields:[{...fieldLinkDoc.fields[0],contextLink:{label:"Bad",route:"//evil.example"}}]
}).ok,false);
assert.equal(validateUidl({
  ...fieldLinkDoc,
  fields:[{...fieldLinkDoc.fields[0],contextLink:{label:"Bad",route:"javascript:alert(1)"}}]
}).ok,false);


const exclusiveDoc={
  ...doc,
  id:"exclusive-mapping-test",
  fields:[
    {key:"map_0",label:"Column A",semanticType:"data-import-field-mapping",control:"select",required:true,
     initialValue:"code",options:[{value:"__IGNORE__",label:"Ignore"},{value:"code",label:"Code"},{value:"name",label:"Name"}],
     exclusiveSelect:{group:"import-fields",exemptValues:["__IGNORE__"]}},
    {key:"map_1",label:"Column B",semanticType:"data-import-field-mapping",control:"select",required:true,
     initialValue:"__IGNORE__",options:[{value:"__IGNORE__",label:"Ignore"},{value:"code",label:"Code"},{value:"name",label:"Name"}],
     exclusiveSelect:{group:"import-fields",exemptValues:["__IGNORE__"]}}
  ]
};
assert.equal(validateUidl(exclusiveDoc).ok,true);
assert.deepEqual(toRenderModel(exclusiveDoc).fields[0].exclusiveSelect,
 {group:"import-fields",exemptValues:["__IGNORE__"]});
assert.match(renderToHtml(exclusiveDoc),/data-eidos-exclusive-group="import-fields"/);
assert.equal(validateUidl({...exclusiveDoc,fields:[{...exclusiveDoc.fields[0],control:"text"}]}).ok,false);
assert.equal(validateUidl({...exclusiveDoc,fields:[{...exclusiveDoc.fields[0],exclusiveSelect:{group:"",exemptValues:["__IGNORE__"]}}]}).ok,false);

const grouped={
 ...exclusiveDoc,
 id:"generic-review-groups",
 reviewGroups:[
  {id:"first",title:"First source",summary:"2 examples",
   primaryFieldKey:"map_0",detailFieldKeys:[],detailsLabel:"More"},
  {id:"second",title:"Second source",summary:"2 examples",
   primaryFieldKey:"map_1",detailFieldKeys:[],defaultExpanded:true}
 ]
};
assert.equal(validateUidl(grouped).ok,true);
const groupedRender=renderToHtml(grouped);
assert.match(groupedRender,/data-eidos-form-review-groups/);
assert.match(groupedRender,/data-eidos-form-review-group="first"/);
assert.match(groupedRender,/First source/);
assert.match(groupedRender,/data-eidos-exclusive-group="import-fields"/);
assert.equal((groupedRender.match(/name="map_0"/g)??[]).length,1);
assert.equal((groupedRender.match(/name="map_1"/g)??[]).length,1);
assert.equal(toRenderModel(grouped).reviewGroups[0].primaryFieldKey,"map_0");
const groupedDetails={...grouped,reviewGroups:[
 {...grouped.reviewGroups[0],detailFieldKeys:["map_1"]}]};
assert.equal(validateUidl(groupedDetails).ok,true);
assert.match(renderToHtml(groupedDetails),/<details data-eidos-review-group-detail/);
assert.equal(validateUidl({...grouped,reviewGroups:[
 {...grouped.reviewGroups[0],primaryFieldKey:"missing"}]}).ok,false);
assert.equal(validateUidl({...grouped,reviewGroups:[
 {...grouped.reviewGroups[0],detailFieldKeys:["map_0"]}]}).ok,false);
assert.equal(validateUidl({...grouped,reviewGroups:[
 {...grouped.reviewGroups[0]},{...grouped.reviewGroups[0]}]}).ok,false);
assert.equal(validateUidl({...grouped,reviewGroups:[{...grouped.reviewGroups[0],
 summary:"<script>alert(1)</script>"}]}).ok,true);
assert.doesNotMatch(renderToHtml({...grouped,reviewGroups:[{
 ...grouped.reviewGroups[0],summary:"<script>alert(1)</script>"}]}),/<script>/);


const tableDoc = {
 ...exclusiveDoc,
 id:"public-editable-review-table",
 reviewGroups:[
   {id:"source-0",title:"First source",summary:"3 original samples",
    primaryFieldKey:"map_0",detailFieldKeys:[],
    reviewStatus:{key:"attention",label:"Needs review",tone:"warning"}},
   {id:"source-1",title:"Second source",summary:"1 original sample",
    primaryFieldKey:"map_1",detailFieldKeys:[],
    reviewStatus:{key:"confirmed",label:"Confirmed",tone:"positive"}}
 ],
 reviewTable:{
   columnLabels:{subject:"Source",evidence:"Examples",
     decision:"Target field",status:"Status"},
   filter:{label:"Show",selectedId:"attention",noMatchesMessage:"No matches.",
    options:[
      {id:"attention",label:"Needs attention",statusKeys:["attention"]},
      {id:"all",label:"All columns",statusKeys:["attention","confirmed"]}
    ]}
 }
};
assert.equal(validateUidl(tableDoc).ok,true,JSON.stringify(validateUidl(tableDoc).diagnostics));
const tableHtml=renderToHtml(tableDoc);
assert.match(tableHtml,/<table data-eidos-form-review-table/);
assert.match(tableHtml,/<th scope="col">Source<\/th>/);
assert.match(tableHtml,/data-eidos-review-table-evidence/);
assert.match(tableHtml,/3 original samples/);
assert.match(tableHtml,/data-eidos-review-table-status-key="confirmed" hidden/);
assert.match(tableHtml,/data-eidos-form-review-table-count role="status" aria-live="polite">1 \/ 2/);
assert.match(tableHtml,/data-eidos-form-review-table-filter/);
assert.equal((tableHtml.match(/name="map_0"/g)??[]).length,1);
assert.equal((tableHtml.match(/name="map_1"/g)??[]).length,1);
assert.match(tableHtml,/data-eidos-exclusive-group="import-fields"/);
assert.equal(toRenderModel(tableDoc).reviewTable.filter.selectedId,"attention");
assert.doesNotMatch(tableHtml,/data-eidos-form-review-groups>/);
assert.equal(createActionRequest(tableDoc,{map_0:"__IGNORE__",map_1:"name"}).command.code,
  exclusiveDoc.command.code,
  "Presentation must never create a separate Host save/command");

// Failed contracts must never render a table with missing/duplicated sources.
for(const reviewTable of [
 {...tableDoc.reviewTable,columnLabels:{subject:"x"}},
 {...tableDoc.reviewTable,filter:{...tableDoc.reviewTable.filter,
   options:[tableDoc.reviewTable.filter.options[0]]}},
 {...tableDoc.reviewTable,filter:{...tableDoc.reviewTable.filter,
   selectedId:"not-a-filter"}},
 {...tableDoc.reviewTable,filter:{...tableDoc.reviewTable.filter,
   options:[...tableDoc.reviewTable.filter.options,
     tableDoc.reviewTable.filter.options[0]]}}
]){
 assert.equal(validateUidl({...tableDoc,reviewTable}).ok,false);
}
assert.equal(validateUidl({...tableDoc,reviewGroups:[
 {...tableDoc.reviewGroups[0],reviewStatus:undefined},tableDoc.reviewGroups[1]]}).ok,false);
assert.equal(validateUidl({...tableDoc,reviewGroups:[
 {...tableDoc.reviewGroups[0],reviewStatus:{
   key:"has,separator",label:"Break filter"}} ,tableDoc.reviewGroups[1]]}).ok,false);
const dangerous={...tableDoc,
  reviewGroups:[{...tableDoc.reviewGroups[0],title:"<script>alert(1)</script>"},
    tableDoc.reviewGroups[1]]};
assert.doesNotMatch(renderToHtml(dangerous),/<script>/);
assert.match(renderToHtml(dangerous),/&lt;script&gt;/);


const taskDoc={
  ...tableDoc,
  reviewTask:{
    subject:{title:"Current source file",subtitle:"172 records · 22 columns",
      statusLabel:"File received",facts:[{id:"source",label:"Source",value:"Supplier records"}]},
    steps:[{id:"choose",label:"Select source",state:"complete"},
      {id:"review",label:"Review and continue",state:"current"}],
    metrics:[{id:"matched",label:"Matched",value:"16",tone:"positive"},
      {id:"issues",label:"Needs attention",value:"3",tone:"warning"}],
    issuesTitle:"Needs review",issuesDescription:"Resolve before validation",
    issues:[{id:"bank",title:"Two same-name targets",
      description:"Select the intended destination.",
      focusGroupId:"source-0",actionLabel:"Review field"}],
    helpText:"Changes are saved when you submit this form."
  }
};
assert.equal(validateUidl(taskDoc).ok,true,JSON.stringify(validateUidl(taskDoc).diagnostics));
const taskHtml=renderToHtml(taskDoc);
assert.match(taskHtml,/data-eidos-form-task-overview/);
assert.match(taskHtml,/data-eidos-form-task-steps/);
assert.match(taskHtml,/data-eidos-form-task-context/);
assert.match(taskHtml,/data-eidos-form-task-metrics/);
assert.match(taskHtml,/data-eidos-form-task-issues/);
assert.match(taskHtml,/data-eidos-form-task-focus="source-0"/);
assert.match(taskHtml,/Changes are saved when you submit this form/);
assert.equal((taskHtml.match(/name="map_0"/g)??[]).length,1);
assert.equal(createActionRequest(taskDoc,{map_0:"__IGNORE__",map_1:"name"}).command.code,
  exclusiveDoc.command.code);
for(const invalidTask of [
 {...taskDoc.reviewTask,subject:{title:""}},
 {...taskDoc.reviewTask,steps:[{id:"x",label:"Step",state:"complete"}]},
 {...taskDoc.reviewTask,issues:[{id:"wrong",title:"Invalid focus",focusGroupId:"missing"}]},
 {...taskDoc.reviewTask,metrics:[{id:"a",label:"Metric",value:"1"},
   {id:"a",label:"Duplicate",value:"2"}]},
 {...taskDoc.reviewTask,issues:[{id:"a",title:"Wrong item",actionLabel:"Do it"}]}
]){
 assert.equal(validateUidl({...taskDoc,reviewTask:invalidTask}).ok,false);
}
const escapedTask=renderToHtml({...taskDoc,reviewTask:{
 ...taskDoc.reviewTask,subject:{title:"<script>alert(1)</script>"},
 issues:[{id:"x",title:"<img src=x onerror=evil()>",focusGroupId:"source-0",
  actionLabel:"<svg onload=evil()>"}]
}});
assert.doesNotMatch(escapedTask,/<script>|<img|<svg onload/);
assert.match(escapedTask,/&lt;script&gt;/);
assert.match(escapedTask,/&lt;img/);
