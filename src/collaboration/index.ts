import type { ExperienceRegion } from "../experience/contracts.js";
export interface SharedReference {sessionId:string;referenceVersion:string;regionId?:string;itemId?:string;}
export function assertSharedReferenceStable(before:SharedReference,after:SharedReference):void{
  if(before.sessionId!==after.sessionId)throw new Error("EIDOS_SHARED_SESSION_CHANGED");
  if(before.referenceVersion!==after.referenceVersion)throw new Error("EIDOS_SHARED_REFERENCE_VERSION_CHANGED");
}
export function sharedCore(regions:readonly ExperienceRegion[]):ExperienceRegion[]{return regions.filter(r=>r.stability==="invariant"||r.stability==="shared-stable");}
export function personalPeriphery(regions:readonly ExperienceRegion[]):ExperienceRegion[]{return regions.filter(r=>r.stability==="personal-stable"||r.stability==="adaptive");}

export * from "./session.js";
