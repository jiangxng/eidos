import type { JsonValue } from './contracts.js';
export interface InteractionDraft { runtimeInstanceId:string; interactionId:string; values:Record<string,JsonValue> }
export function createInteractionDraft(runtimeInstanceId:string,interactionId:string,initial:Record<string,JsonValue>={}):InteractionDraft{return{runtimeInstanceId,interactionId,values:{...initial}}}
export function updateInteractionDraft(draft:InteractionDraft,fieldKey:string,value:JsonValue):InteractionDraft{return{...draft,values:{...draft.values,[fieldKey]:value}}}
