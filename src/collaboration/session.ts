export interface Participant { id:string; name:string; role?:string; }
export interface CollaborationSession { id:string; revision:number; participants:Participant[]; presenterId?:string; focus?:{regionId:string;itemId?:string}; annotations:Array<{id:string;authorId:string;regionId:string;text:string}>; }
export type CollaborationEvent = {type:"join";participant:Participant}|{type:"leave";participantId:string}|{type:"present";participantId:string}|{type:"focus";regionId:string;itemId?:string}|{type:"annotate";id:string;authorId:string;regionId:string;text:string};
export function reduceCollaboration(s:CollaborationSession,e:CollaborationEvent):CollaborationSession{
 let n:CollaborationSession={...s,participants:[...s.participants],annotations:[...s.annotations],revision:s.revision+1};
 switch(e.type){case"join":if(!n.participants.some(p=>p.id===e.participant.id))n.participants.push(e.participant);break;case"leave":n.participants=n.participants.filter(p=>p.id!==e.participantId);if(n.presenterId===e.participantId)delete n.presenterId;break;case"present":n.presenterId=e.participantId;break;case"focus":n.focus={regionId:e.regionId,...(e.itemId?{itemId:e.itemId}:{})};break;case"annotate":n.annotations.push({id:e.id,authorId:e.authorId,regionId:e.regionId,text:e.text});break;} return n;
}
