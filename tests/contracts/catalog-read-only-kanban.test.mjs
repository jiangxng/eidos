import test from "node:test";
import assert from "node:assert/strict";
import { renderCatalogBrowserToHtml } from "../../dist/index.js";
import { eidosProductiveWorkbenchCss } from "../../dist/index.js";

const item=(id,label)=>({
  id,title:label,status:{label:"Draft",tone:"warning"},
  primaryAction:{id:"open",type:"navigate",label:"Open",route:"/dictionaries/detail?id="+id}
});
const table={
  columns:[{id:"displayName",label:"Name"}],
  rows:[{itemId:"a",cells:{displayName:"Alpha"}},
    {itemId:"b",cells:{displayName:"Beta"}}],
  pageInfo:{page:1,pageSize:2,total:20,summary:"3–4 / 20",
    previousRoute:"/dictionaries?page=0",nextRoute:"/dictionaries?page=2",
    previousLabel:"Previous",nextLabel:"Next"},
  presentationViews:[
    {id:"table",label:"Table",route:"/dictionaries?presentation=table"},
    {id:"board",label:"Board",route:"/dictionaries?presentation=board",selected:true}
  ]
};
const board={
  contractVersion:"0.1.0",kind:"read-only-kanban",
  title:"Current page by state",scope:"AUTHORIZED_CURRENT_PAGE",
  scopeLabel:"Only 3–4 / 20 authorized records on this page",
  groupFieldId:"state",emptyLabel:"No records on this page",
  groups:[
    {id:"DRAFT",label:"Draft",itemIds:["a"]},
    {id:"PUBLISHED",label:"Published",itemIds:["b"]}
  ]
};
const page={
  contractVersion:"0.1.0",kind:"catalog-browser",
  id:"dict",title:"Dictionaries",items:[item("a","<Alpha>"),item("b","Beta")],
  table,readOnlyKanban:board,presentation:"board"
};

test("CV06 Eidos board uses exactly owner-page items, native cards and original pagination",()=>{
  const html=renderCatalogBrowserToHtml(page);
  assert.match(html,/data-eidos-read-only-kanban/);
  assert.match(html,/data-eidos-board-column="DRAFT"/);
  assert.match(html,/data-eidos-board-column="PUBLISHED"/);
  assert.match(html,/data-eidos-board-scope/);
  assert.match(html,/Only 3–4 \/ 20 authorized records/);
  assert.match(html,/data-eidos-catalog-item="a"/);
  assert.match(html,/&lt;Alpha&gt;/);
  assert.doesNotMatch(html,/<Alpha>/);
  assert.equal((html.match(/data-eidos-catalog-item="a"/g)||[]).length,1);
  assert.doesNotMatch(html,/data-eidos-catalog-table/);
  assert.match(html,/data-eidos-catalog-action="open"/);
  assert.match(html,/data-eidos-route="\/dictionaries\?page=2"/);
  assert.match(html,/data-eidos-catalog-presentation-navigation/);
  assert.match(html,/data-eidos-catalog-presentation-selected="true"/);
  assert.match(html,/aria-current="page"/);
  assert.doesNotMatch(html,/draggable|dragstart|dropzone/);
});

test("CV06 read-only board rejects missing, repeated and out-of-page IDs",()=>{
  const render=changes=>renderCatalogBrowserToHtml({
    ...page,readOnlyKanban:{...board,...changes}
  });
  assert.throws(()=>render({scope:"AUTHORIZED_ALL_MATCHING_ROWS"}),
    /EIDOS_CATALOG_BOARD_INVALID/);
  assert.throws(()=>render({groups:[{id:"DRAFT",label:"Draft",itemIds:["a"]}]}),
    /EIDOS_CATALOG_BOARD_PARTITION_INVALID/);
  assert.throws(()=>render({groups:[{id:"DRAFT",label:"Draft",itemIds:["a","b"]},
    {id:"PUBLISHED",label:"Published",itemIds:["a"]}]}),
    /EIDOS_CATALOG_BOARD_ITEM_INVALID/);
  assert.throws(()=>render({groups:[{id:"DRAFT",label:"Draft",itemIds:["a"]},
    {id:"PUBLISHED",label:"Published",itemIds:["hidden"]}]}),
    /EIDOS_CATALOG_BOARD_ITEM_INVALID/);
  assert.throws(()=>render({groups:[{id:"DRAFT",label:"Draft",itemIds:["a"]},
    {id:"DRAFT",label:"Dup",itemIds:["b"]}]}),
    /EIDOS_CATALOG_BOARD_GROUP_INVALID/);
  assert.throws(()=>render({groups:Array(9).fill({id:"A",label:"A",itemIds:[]})}),
    /EIDOS_CATALOG_BOARD_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml({...page,readOnlyKanban:undefined}),
    /EIDOS_CATALOG_BOARD_NOT_AUTHORIZED/);
});

test("CV06 chart/table switches remain Host navigation and require authorized data",()=>{
  const tablePage={...page,presentation:"table",readOnlyKanban:undefined,table:{
    ...table,presentationViews:[
      {id:"table",label:"Table",route:"/dictionaries?presentation=table",selected:true},
      {id:"board",label:"Board",route:"/dictionaries?presentation=board"}
    ]
  }};
  const html=renderCatalogBrowserToHtml(tablePage);
  assert.match(html,/data-eidos-catalog-table/);
  assert.doesNotMatch(html,/data-eidos-read-only-kanban/);
  assert.throws(()=>renderCatalogBrowserToHtml({...tablePage,presentation:"chart"}),
    /EIDOS_CATALOG_CHART_NOT_AUTHORIZED/);
  assert.throws(()=>renderCatalogBrowserToHtml({...tablePage,table:{
    ...tablePage.table,presentationViews:[
      {id:"table",label:"Table",route:"https://evil.invalid",selected:true},
      {id:"board",label:"Board",route:"/dictionaries?presentation=board"}
    ]
  }}),/EIDOS_CATALOG_PRESENTATION_VIEWS_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml({...page,table:{
    ...table,presentationViews:[
      {id:"table",label:"Table",route:"/dictionaries?presentation=table",selected:true},
      {id:"board",label:"Board",route:"/dictionaries?presentation=board"}
    ]
  }}),/EIDOS_CATALOG_PRESENTATION_VIEWS_INVALID/);
});

test("CV06 Kanban responsive CSS is token-based, no draggable gestures",()=>{
  assert.match(eidosProductiveWorkbenchCss,/\[data-eidos-read-only-kanban\]/);
  assert.match(eidosProductiveWorkbenchCss,/\[data-eidos-board-columns\]/);
  assert.match(eidosProductiveWorkbenchCss,/min-height:44px/);
  assert.match(eidosProductiveWorkbenchCss,/grid-template-columns:minmax\(0,1fr\)/);
});
