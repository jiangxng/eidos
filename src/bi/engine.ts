import type { BiQueryIntentV010 } from "./contracts.js";
export interface BiResult { columns:string[]; rows:Array<Record<string,string|number|null>>; }
function agg(values:number[],kind:string):number { if(kind==="count")return values.length;if(kind==="distinct-count")return new Set(values).size;if(!values.length)return 0;if(kind==="avg")return values.reduce((a,b)=>a+b,0)/values.length;if(kind==="min")return Math.min(...values);if(kind==="max")return Math.max(...values);return values.reduce((a,b)=>a+b,0); }
export function executeBi(rows:readonly Record<string,unknown>[],q:BiQueryIntentV010):BiResult{
 let filtered=[...rows];
 for(const f of q.filters??[]){filtered=filtered.filter(r=>{const v=r[f.field],x=f.value;switch(f.operator){case"eq":return v===x;case"neq":return v!==x;case"gt":return Number(v)>Number(x);case"gte":return Number(v)>=Number(x);case"lt":return Number(v)<Number(x);case"lte":return Number(v)<=Number(x);case"in":return Array.isArray(x)&&x.includes(v);case"between":return Array.isArray(x)&&Number(v)>=Number(x[0])&&Number(v)<=Number(x[1]);}});}
 const dims=q.dimensions.map(d=>d.id); const groups=new Map<string,Record<string,unknown>[]>();
 for(const r of filtered){const key=JSON.stringify(dims.map(d=>r[d]));const g=groups.get(key)??[];g.push(r);groups.set(key,g);}
 if(!groups.size&&dims.length===0)groups.set('[]',filtered);
 const out=[] as Array<Record<string,string|number|null>>;
 for(const [key,g] of groups){const vals=JSON.parse(key) as unknown[];const row:Record<string,string|number|null>={};dims.forEach((d,i)=>row[d]=(vals[i]??null) as string|number|null);for(const m of q.measures){row[m.id]=agg(g.map(r=>Number(r[m.id]??0)),m.aggregation);}out.push(row);} return {columns:[...dims,...q.measures.map(m=>m.id)],rows:out};
}
