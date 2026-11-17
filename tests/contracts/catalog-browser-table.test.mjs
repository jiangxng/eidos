import test from "node:test";
import assert from "node:assert/strict";
import { renderCatalogBrowserToHtml } from "../../dist/index.js";

const record = {
  contractVersion:"0.1.0",kind:"catalog-browser",id:"suppliers",
  title:"Suppliers",layout:"list",
  items:[{id:"s-1",title:"Acme",primaryAction:{
    id:"open",type:"navigate",label:"Open",route:"/suppliers/s-1"
  }}],
  table:{
    columns:[{id:"name",label:"Name",sortRoute:"/suppliers?sort=name"}],
    rows:[{itemId:"s-1",cells:{name:"<Acme>&"}}],
    search:{route:"/suppliers?page=0",label:"Search suppliers",
      placeholder:"Search",value:"Acme",submitLabel:"Search"},
    pageInfo:{page:0,pageSize:25,total:50,summary:"1–25 / 50",
      nextLabel:"Next",previousLabel:"Previous",
      nextRoute:"/suppliers?page=1"}
  }
};
test("Eidos renders native read-only table, same mobile cards and governed navigation",()=>{
 const html=renderCatalogBrowserToHtml(record);
 assert.match(html, /<table data-eidos-catalog-table>/);
 assert.match(html, /<th scope="col">/);
 assert.match(html, /data-eidos-col="name"/);
 assert.match(html, /&lt;Acme&gt;&amp;/);
 assert.doesNotMatch(html, /<Acme>/);
 assert.match(html, /data-eidos-catalog-item="s-1"/);
 assert.match(html, /data-eidos-catalog-server-search/);
 assert.match(html, /<span data-eidos-catalog-search-label>Search suppliers<\/span>/);
 assert.match(html, /data-eidos-catalog-action="sort-name"/);
 assert.match(html, /data-eidos-search-route="\/suppliers\?page=0"/);
 assert.match(html, /data-eidos-route="\/suppliers\?page=1"/);
 assert.match(html, /data-eidos-catalog-has-table="true"/);
});
test("Eidos rejects columns, duplicate rows, unauthorized hidden columns and unsafe routes",()=>{
 assert.throws(()=>renderCatalogBrowserToHtml({...record,table:{
   ...record.table,columns:[{id:"name",label:"Name"}],
   rows:[{itemId:"s-1",cells:{secret:"never"}}]
 }}),/EIDOS_CATALOG_TABLE_ROW_INVALID/);
 assert.throws(()=>renderCatalogBrowserToHtml({...record,table:{
   ...record.table,rows:[...record.table.rows,...record.table.rows]
 }}),/EIDOS_CATALOG_TABLE_ROW_INVALID/);
 assert.throws(()=>renderCatalogBrowserToHtml({...record,table:{
   ...record.table,pageInfo:{...record.table.pageInfo,nextRoute:"https://evil.test"}
 }}),/EIDOS_CATALOG_TABLE_PAGE_INVALID/);
 assert.throws(()=>renderCatalogBrowserToHtml({...record,table:{
   ...record.table,search:{...record.table.search,route:"//evil.test/"}
 }}),/EIDOS_CATALOG_TABLE_SEARCH_INVALID/);
});

test("CV-02 Eidos reuses authorized server-view routes, labels the current view", () => {
  const html = renderCatalogBrowserToHtml({...record, table: {
    ...record.table,
    views: [
      {id:"all",label:"All suppliers",route:"/suppliers?view=all"},
      {id:"mine",label:"My suppliers",route:"/suppliers?view=mine",selected:true}
    ]
  }});
  assert.match(html,/data-eidos-catalog-view-navigation/);
  assert.match(html,/data-eidos-catalog-view-id="mine"/);
  assert.match(html,/data-eidos-catalog-view-selected="true"/);
  assert.match(html,/aria-current="page"/);
  assert.match(html,/data-eidos-route="\/suppliers\?view=mine"/);
  assert.match(html,/data-eidos-catalog-server-search/);
  assert.match(html,/data-eidos-catalog-table/);
});

test("CV-02 catalog view chooser rejects untrusted route, duplicates and ambiguous current state", () => {
  const render = views => renderCatalogBrowserToHtml({...record,table:{...record.table,views}});
  assert.throws(() => render([{id:"a",label:"Link",route:"https://evil.test"}]),
    /EIDOS_CATALOG_TABLE_VIEW_INVALID/);
  assert.throws(() => render([{id:"a",label:"Link",route:"//evil.test"}]),
    /EIDOS_CATALOG_TABLE_VIEW_INVALID/);
  assert.throws(() => render([{id:"a",label:"One",route:"/a"},
    {id:"a",label:"Two",route:"/b"}]), /EIDOS_CATALOG_TABLE_VIEW_INVALID/);
  assert.throws(() => render([{id:"a",label:"One",route:"/a",selected:true},
    {id:"b",label:"Two",route:"/b",selected:true}]),
    /EIDOS_CATALOG_TABLE_VIEW_SELECTION_INVALID/);
  assert.throws(() => render([{id:"a",label:"  ",route:"/a"}]),
    /EIDOS_CATALOG_TABLE_VIEW_INVALID/);
  assert.doesNotMatch(renderCatalogBrowserToHtml(record),/data-eidos-catalog-view-navigation/);
});
test("CV-02 table routes stay on-origin for view, search, sort and pagination",()=>{
  const unsafeRoutes=[
    "//outside.invalid/suppliers",
    "/\\outside.invalid/suppliers",
    "/suppliers\ncross-line"
  ];
  for(const route of unsafeRoutes){
    const withTable=changes=>renderCatalogBrowserToHtml({
      ...record,table:{...record.table,...changes}
    });
    assert.throws(()=>withTable({views:[{
      id:"outside",label:"Outside",route
    }]}),/EIDOS_CATALOG_TABLE_VIEW_INVALID/,route);
    assert.throws(()=>withTable({search:{
      ...record.table.search,route
    }}),/EIDOS_CATALOG_TABLE_SEARCH_INVALID/,route);
    assert.throws(()=>withTable({columns:[{
      ...record.table.columns[0],sortRoute:route
    }]}),/EIDOS_CATALOG_TABLE_COLUMN_INVALID/,route);
    assert.throws(()=>withTable({pageInfo:{
      ...record.table.pageInfo,nextRoute:route
    }}),/EIDOS_CATALOG_TABLE_PAGE_INVALID/,route);
  }
  // A legitimate owner-provided local route may retain its encoded query.
  assert.match(renderCatalogBrowserToHtml({...record,table:{
    ...record.table,
    columns:[{...record.table.columns[0],sortRoute:"/suppliers?sort=name&direction=asc"}]
  }}),/data-eidos-route="\/suppliers\?sort=name&amp;direction=asc"/);
});
test("CV-02 accessible sorted column stays owner-defined and announces direction",()=>{
  const render=columns=>renderCatalogBrowserToHtml({...record,table:{
    ...record.table,columns
  }});
  for(const [direction,arrow] of [["ascending","↑"],["descending","↓"]]){
    const html=render([{...record.table.columns[0],sortDirection:direction}]);
    assert.match(html,new RegExp('scope="col" aria-sort="'+direction+'"'));
    assert.match(html,new RegExp('data-eidos-sort-indicator aria-hidden="true">'+arrow));
    assert.match(html,/data-eidos-catalog-action="sort-name"/);
    assert.match(html,/data-eidos-route="\/suppliers\?sort=name"/);
  }
  assert.doesNotMatch(renderCatalogBrowserToHtml(record),/aria-sort=/);
  assert.throws(()=>render([{...record.table.columns[0],sortDirection:"sideways"}]),
    /EIDOS_CATALOG_TABLE_COLUMN_SORT_INVALID/);
  assert.throws(()=>render([{id:"name",label:"Name",sortDirection:"ascending"}]),
    /EIDOS_CATALOG_TABLE_COLUMN_SORT_INVALID/);
  assert.throws(()=>render([
    {...record.table.columns[0],sortDirection:"ascending"},
    {id:"code",label:"Code",sortRoute:"/suppliers?sort=code",sortDirection:"descending"}
  ]),/EIDOS_CATALOG_TABLE_SORT_SELECTION_INVALID/);
});
test("CV-02 owner column actions preserve table data and use ordinary governed navigation",()=>{
  const controls={
    label:"Columns",
    options:[
      {id:"name",label:"Name",visible:true,
       toggle:{label:"Hide name",route:"/suppliers?columns=code"},
       moveDown:{label:"Move down",route:"/suppliers?columns=code,name"}},
      {id:"code",label:"Code",visible:false,
       toggle:{label:"Show code",route:"/suppliers?columns=name,code"}}
    ],
    reset:{label:"Restore default",route:"/suppliers?view=all"}
  };
  const render=col=>renderCatalogBrowserToHtml({...record,table:{
    ...record.table,columnControls:col
  }});
  const html=render(controls);
  assert.match(html,/<details data-eidos-catalog-column-controls>/);
  assert.match(html,/<summary>Columns<\/summary>/);
  assert.match(html,/data-eidos-column-choice="code" data-eidos-column-visible="false"/);
  assert.match(html,/data-eidos-catalog-action="column-toggle-code"/);
  assert.match(html,/data-eidos-route="\/suppliers\?columns=name,code"/);
  assert.match(html,/data-eidos-catalog-action="column-reset-reset"/);
  assert.match(html,/data-eidos-col="name"/);
  assert.doesNotMatch(html,/data-eidos-col="code"/);
  assert.doesNotMatch(renderCatalogBrowserToHtml(record),/data-eidos-catalog-column-controls/);
  assert.throws(()=>render({...controls,options:[
    {...controls.options[0],toggle:{label:"Offsite",route:"//outside.invalid/x"}},
    controls.options[1]
  ]}),/EIDOS_CATALOG_COLUMN_CONTROLS_INVALID/);
  assert.throws(()=>render({...controls,options:[
    controls.options[0],{...controls.options[1],id:"name"}
  ]}),/EIDOS_CATALOG_COLUMN_CONTROLS_INVALID/);
  assert.throws(()=>render({...controls,options:[
    {...controls.options[0],visible:false},controls.options[1]
  ]}),/EIDOS_CATALOG_COLUMN_CONTROLS_INVALID/);
  assert.throws(()=>render({...controls,options:[
    controls.options[0],{...controls.options[1],moveUp:{label:"Move",route:"/suppliers"}}
  ]}),/EIDOS_CATALOG_COLUMN_CONTROLS_INVALID/);
});
