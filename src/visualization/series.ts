import type { VisualizationSpecV010 } from "./contracts.js";
export interface CartesianPoint { x:string|number; y:number; series?:string; }
export interface VisualizationModel { kind:string; title?:string; points:CartesianPoint[]; }
export function toVisualizationModel(spec:VisualizationSpecV010, rows:readonly Record<string,unknown>[]):VisualizationModel{
 const measure=spec.measures[0]?.id; const dim=spec.dimensions?.[0]?.id; if(!measure) return {kind:"empty",points:[]};
 return {kind:spec.rendererPreference??(spec.intent==="compare-over-time"?"line-chart":"bar-chart"),points:rows.map((r,i)=>({x:(dim?r[dim]:i) as string|number,y:Number(r[measure]??0)}))};
}
