import type { ReportSpecV010 } from "./contracts.js";
const esc=(v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
export function renderReportHtml(spec:ReportSpecV010,data:Record<string,unknown>={}):string{
 const body=spec.sections.map(s=>{const title=s.title?`<h2>${esc(s.title)}</h2>`:"";const value=s.sourceRef?data[s.sourceRef]:undefined; if(s.kind==="page-break")return '<div style="break-after:page"></div>';return `<section data-kind="${s.kind}">${title}${value===undefined?"":`<pre>${esc(JSON.stringify(value,null,2))}</pre>`}</section>`;}).join("\n");
 return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(spec.title)}</title></head><body><h1>${esc(spec.title)}</h1>${body}</body></html>`;
}
