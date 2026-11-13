import test from "node:test";
import assert from "node:assert/strict";
import {
  renderCatalogBrowserToHtml,
  renderAuthorizedAggregateBarsToHtmlV010,
  assertAuthorizedAggregateBarsV010
} from "../../dist/index.js";

const aggregate={
  contractVersion:"0.1.0",
  kind:"authorized-aggregate-bars",
  title:"Authorized dictionary counts",
  metricId:"dictionary.count.by-state",dimensionFieldId:"state",
  schemaRef:"evo.business-dictionary.directory/0.1.0",
  unit:"dictionary",asOf:"2026-11-13T12:00:00.000Z",
  scope:"AUTHORIZED_ALL_MATCHING_ROWS",
  total:12,countKind:"EXACT",
  buckets:[
    {key:"DRAFT",label:"Draft",count:5,countKind:"EXACT"},
    {key:"PUBLISHED",label:"Published",count:7,countKind:"EXACT"}
  ],
  suppressedLabel:"Fewer than 3",totalLabel:"Total dictionaries",
  asOfLabel:"Read at"
};
function page(chart=aggregate){
  return {contractVersion:"0.1.0",kind:"catalog-browser",
    id:"dictionary",title:"Dictionary",items:[],
    authorizedChart:chart};
}

test("CV06 Eidos uses only owner aggregate for an accessible bar chart",()=>{
  const rendered=renderCatalogBrowserToHtml(page());
  assert.match(rendered,/data-eidos-authorized-aggregate-bars/);
  assert.match(rendered,/data-eidos-chart-scope="AUTHORIZED_ALL_MATCHING_ROWS"/);
  assert.match(rendered,/aria-labelledby="eidos-aggregate-title-dictionary.count.by-state"/);
  assert.match(rendered,/data-eidos-authorized-bar-key="DRAFT"/);
  assert.match(rendered,/data-eidos-authorized-bar-key="PUBLISHED"/);
  assert.match(rendered,/style="width:71.4%"/);
  assert.match(rendered,/style="width:100%"/);
  assert.match(rendered,/Total dictionaries/);
  assert.match(rendered,/Read at/);
  assert.match(rendered,/2026-11-13T12:00:00.000Z/);
  assert.doesNotMatch(rendered,/data-eidos-catalog-table/);
  assert.doesNotMatch(renderCatalogBrowserToHtml({...page(),authorizedChart:undefined}),
    /data-eidos-authorized-aggregate-bars/);
});

test("CV06 Eidos never visually or textually reconstructs suppressed buckets",()=>{
  const chart={...aggregate,countKind:"SUPPRESSED",total:null,
    buckets:[{key:"DRAFT",label:"Draft",count:null,countKind:"SUPPRESSED"},
      {key:"PUBLISHED",label:"Published",count:7,countKind:"EXACT"}]};
  const html=renderAuthorizedAggregateBarsToHtmlV010(chart);
  assert.match(html,/data-eidos-count-kind="SUPPRESSED"/);
  assert.match(html,/Fewer than 3/);
  assert.doesNotMatch(html,/style="width:.*?%"[^>]*><\/span>.*?data-eidos-authorized-bar-count>2</);
  assert.doesNotMatch(html,/data-eidos-authorized-bar-count>9</);
  assert.match(html,/data-eidos-authorized-bar-suppressed/);
  assert.throws(()=>assertAuthorizedAggregateBarsV010({...chart,total:9}),
    /EIDOS_AUTHORIZED_BARS_INVALID/);
  assert.throws(()=>assertAuthorizedAggregateBarsV010({...chart,countKind:"EXACT",total:9}),
    /EIDOS_AUTHORIZED_BARS_INVALID|EIDOS_AUTHORIZED_BARS_TOTAL_INVALID/);
});

test("CV06 Eidos fails closed for contradiction, unsafe chart shape and HTML injection",()=>{
  assert.throws(()=>renderCatalogBrowserToHtml(page({...aggregate,total:3})),
    /EIDOS_AUTHORIZED_BARS_TOTAL_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml(page({...aggregate,buckets:[
    ...aggregate.buckets,aggregate.buckets[0]
  ]})),/EIDOS_AUTHORIZED_BARS_BUCKET_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml(page({...aggregate,buckets:Array(13).fill(aggregate.buckets[0])})),
    /EIDOS_AUTHORIZED_BARS_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml(page({...aggregate,scope:"CURRENT_PAGE"})),
    /EIDOS_AUTHORIZED_BARS_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml(page({...aggregate,
    buckets:[{key:"DRAFT",label:"Draft",count:NaN,countKind:"EXACT"}]
  })),/EIDOS_AUTHORIZED_BARS_BUCKET_INVALID/);
  assert.throws(()=>renderCatalogBrowserToHtml(page({...aggregate,asOf:"invalid"})),
    /EIDOS_AUTHORIZED_BARS_INVALID/);
  const html=renderAuthorizedAggregateBarsToHtmlV010({...aggregate,
    title:'<script>alert("x")</script>',
    buckets:[{key:"DRAFT",label:"<img src=x>",count:5,countKind:"EXACT"},
      {key:"PUBLISHED",label:"Published",count:7,countKind:"EXACT"}]
  });
  assert.doesNotMatch(html,/<script>|<img src=x>/);
  assert.match(html,/&lt;script&gt;/);
  assert.match(html,/&lt;img src=x&gt;/);
});
