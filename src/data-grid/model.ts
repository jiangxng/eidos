export type SortDirection="asc"|"desc";
export interface GridColumn<Row extends Record<string,unknown>=Record<string,unknown>> { id:keyof Row & string; label:string; sortable?:boolean; width?:number; hidden?:boolean; }
export interface GridSort { columnId:string; direction:SortDirection; }
export interface GridFilter { columnId:string; op:"eq"|"contains"|"gt"|"gte"|"lt"|"lte"; value:unknown; }
export interface GridState { sort?:GridSort; filters:GridFilter[]; page:number; pageSize:number; selectedIds:string[]; }
export interface GridResult<Row>{ rows:Row[]; total:number; page:number; pageSize:number; }
function matches(v:unknown,f:GridFilter):boolean { const x=f.value; switch(f.op){case"eq":return v===x;case"contains":return String(v??"").toLowerCase().includes(String(x??"").toLowerCase());case"gt":return Number(v)>Number(x);case"gte":return Number(v)>=Number(x);case"lt":return Number(v)<Number(x);case"lte":return Number(v)<=Number(x);} }
export function executeGrid<Row extends Record<string,unknown>>(rows:readonly Row[], state:GridState):GridResult<Row>{
 let result=rows.filter(r=>state.filters.every(f=>matches(r[f.columnId],f)));
 if(state.sort){ const {columnId,direction}=state.sort; result=[...result].sort((a,b)=>{const av=a[columnId],bv=b[columnId]; if(av===bv)return 0; const n=(av??"")<(bv??"")?-1:1; return direction==="asc"?n:-n;}); }
 const total=result.length, start=Math.max(0,state.page)*state.pageSize;
 return {rows:result.slice(start,start+state.pageSize),total,page:state.page,pageSize:state.pageSize};
}
export function toggleGridSelection(state:GridState,id:string):GridState { const s=new Set(state.selectedIds); s.has(id)?s.delete(id):s.add(id); return {...state,selectedIds:[...s]}; }
