import test from "node:test";
import assert from "node:assert/strict";
import {renderCatalogBrowserToHtml} from "../../dist/index.js";

const route = (status,kind) =>
  "/counterparties/my-suppliers?search=Hong+Kong&status=" + status
  + "&subjectType=" + kind + "&page=0&pageSize=25";
const groups = () => [
  {id:"status",label:"Status",options:[
    {id:"all",label:"All statuses",selected:false,route:route("ALL","ORGANIZATION")},
    {id:"active",label:"Active",selected:true,route:route("ACTIVE","ORGANIZATION")},
    {id:"inactive",label:"Inactive",selected:false,route:route("INACTIVE","ORGANIZATION")}
  ]},
  {id:"subjectType",label:"Subject type",options:[
    {id:"all",label:"All kinds",selected:false,route:route("ACTIVE","ALL")},
    {id:"organization",label:"Organization",selected:true,route:route("ACTIVE","ORGANIZATION")},
    {id:"person",label:"Person",selected:false,route:route("ACTIVE","PERSON")}
  ]}
];
const catalog = () => ({
  contractVersion:"0.1.0",kind:"catalog-browser",id:"suppliers",title:"My suppliers",
  items:[],table:{columns:[{id:"displayName",label:"Name"}],rows:[],
    quickFilterGroups:groups()}
});

test("Eidos renders two Owner routes with independent selection and touch-friendly markers",()=>{
  const model=catalog();
  const html=renderCatalogBrowserToHtml(model);
  assert.match(html,/data-eidos-quick-filter-group="status"/);
  assert.match(html,/data-eidos-quick-filter-group="subjectType"/);
  assert.match(html,/data-eidos-catalog-quick-filters/);
  assert.match(html,/quick-filter-status-active/);
  assert.match(html,/quick-filter-subjectType-person/);
  assert.match(html,/aria-label="Subject type"/);
  assert.equal((html.match(/aria-current="page"/g)??[]).length,2);
  assert.match(html,/subjectType=PERSON/);
  assert.match(html,/status=INACTIVE/);
  assert.match(html,/search=Hong\+Kong/);
  assert.equal(model.table.rows.length,0,"render must not filter browser rows");
});

test("Eidos preserves existing single-group quickFilters contract",()=>{
  const model=catalog();
  delete model.table.quickFilterGroups;
  model.table.quickFilters={label:"Status",options:[
    {id:"all",label:"All",route:"/suppliers",selected:true},
    {id:"active",label:"Active",route:"/suppliers?status=ACTIVE",selected:false}
  ]};
  const html=renderCatalogBrowserToHtml(model);
  assert.match(html,/data-eidos-catalog-quick-filters/);
  assert.match(html,/quick-filter-active/);
  assert.doesNotMatch(html,/data-eidos-quick-filter-group/);
});

test("Eidos rejects untrusted, ambiguous, malformed multi-filter groups",()=>{
  const check=(mutate,expected)=>{
    const model=catalog();
    mutate(model);
    assert.throws(()=>renderCatalogBrowserToHtml(model),new RegExp(expected));
  };
  check(m=>m.table.quickFilters={label:"Status",options:[
    {id:"a",label:"A",route:"/suppliers",selected:true},
    {id:"b",label:"B",route:"/suppliers",selected:false}
  ]},"QUICK_FILTER_GROUPS_INVALID");
  check(m=>m.table.quickFilterGroups[1].id="status","QUICK_FILTER_GROUP_INVALID");
  check(m=>m.table.quickFilterGroups[1].options[1].id="all","QUICK_FILTER_GROUP_OPTION_INVALID");
  check(m=>m.table.quickFilterGroups[0].options[0].selected=true,"QUICK_FILTER_GROUP_SELECTION_INVALID");
  check(m=>m.table.quickFilterGroups[1].options[1].selected=false,"QUICK_FILTER_GROUP_SELECTION_INVALID");
  check(m=>m.table.quickFilterGroups[1].options[2].route="//evil.invalid","QUICK_FILTER_GROUP_OPTION_INVALID");
  check(m=>m.table.quickFilterGroups[1].options[2].route="javascript:alert(1)","QUICK_FILTER_GROUP_OPTION_INVALID");
  check(m=>m.table.quickFilterGroups[1].options[2].route="/suppliers\\evil","QUICK_FILTER_GROUP_OPTION_INVALID");
  check(m=>m.table.quickFilterGroups.push(groups()[0],groups()[1],groups()[0]),"QUICK_FILTER_GROUPS_INVALID");
});
