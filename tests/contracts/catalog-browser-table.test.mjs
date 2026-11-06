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
