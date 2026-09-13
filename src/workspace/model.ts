export interface WorkspaceItem { id:string; title:string; region:string; order:number; width:number; height:number; hidden?:boolean; pinned?:boolean; locked?:boolean; }
export interface Workspace { id:string; items:WorkspaceItem[]; revision:number; }
export type WorkspaceCommand =
 | {type:"move";id:string;region:string;order:number}
 | {type:"resize";id:string;width:number;height:number}
 | {type:"toggle-hidden";id:string}
 | {type:"toggle-pin";id:string}
 | {type:"lock";id:string;locked:boolean}
 | {type:"reset";snapshot:Workspace};
export function applyWorkspaceCommand(ws:Workspace,cmd:WorkspaceCommand):Workspace{
 if(cmd.type==="reset") return structuredClone(cmd.snapshot);
 const item=ws.items.find(x=>x.id===cmd.id); if(!item) return ws;
 if(item.locked && cmd.type!=="lock") return ws;
 const items=ws.items.map(x=>x.id===item.id?({...x}):x);
 const next=items.find(x=>x.id===item.id)!;
 switch(cmd.type){case"move":next.region=cmd.region;next.order=cmd.order;break;case"resize":next.width=Math.max(1,cmd.width);next.height=Math.max(1,cmd.height);break;case"toggle-hidden":next.hidden=!next.hidden;break;case"toggle-pin":next.pinned=!next.pinned;break;case"lock":next.locked=cmd.locked;break;}
 return {...ws,items,revision:ws.revision+1};
}
export function normalizedWorkspace(ws:Workspace):Workspace { const items=[...ws.items].sort((a,b)=>a.region.localeCompare(b.region)||a.order-b.order).map((x,i)=>({...x,order:i})); return {...ws,items}; }
