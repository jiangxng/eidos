export type ExceptionSeverity="info"|"low"|"medium"|"high"|"critical";
export type ExceptionStatus="open"|"reviewing"|"resolved"|"dismissed";
export interface ExceptionItem { id:string; title:string; severity:ExceptionSeverity; status:ExceptionStatus; reasonCode:string; evidenceIds:string[]; assignee?:string; createdAt:string; }
const rank:Record<ExceptionSeverity,number>={info:0,low:1,medium:2,high:3,critical:4};
export function prioritizeExceptions(items:readonly ExceptionItem[]):ExceptionItem[]{return [...items].sort((a,b)=>rank[b.severity]-rank[a.severity]||a.createdAt.localeCompare(b.createdAt));}
export function transitionException(item:ExceptionItem,status:ExceptionStatus):ExceptionItem{return {...item,status};}
