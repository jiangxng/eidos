import type { ExperienceStability } from "../experience/contracts.js";
export interface RegionCustomization {regionId:string;hidden?:boolean;order?:number;width?:number;collapsed?:boolean;}
export interface CustomizationPolicy {regionId:string;stability:ExperienceStability;hideable:boolean;reorderable:boolean;resizable:boolean;}
export interface CustomizationResult {accepted:RegionCustomization[];rejected:Array<{change:RegionCustomization;reason:string}>;}
export function validateCustomizations(changes:readonly RegionCustomization[],policies:readonly CustomizationPolicy[]):CustomizationResult{
  const byId=new Map(policies.map(p=>[p.regionId,p]));const accepted:RegionCustomization[]=[];const rejected:Array<{change:RegionCustomization;reason:string}>=[];
  for(const change of changes){const p=byId.get(change.regionId);if(!p){rejected.push({change,reason:"Unknown region"});continue;}
    if(p.stability==="invariant"){rejected.push({change,reason:"Invariant region cannot be personalized"});continue;}
    if(change.hidden&&!p.hideable){rejected.push({change,reason:"Region cannot be hidden"});continue;}
    if(change.order!==undefined&&!p.reorderable){rejected.push({change,reason:"Region cannot be reordered"});continue;}
    if(change.width!==undefined&&!p.resizable){rejected.push({change,reason:"Region cannot be resized"});continue;}accepted.push(change);}
  return {accepted,rejected};
}

export * from "./direct-manipulation.js";
