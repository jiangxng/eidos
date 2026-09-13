import type { ExperienceContextV010, MotionIntent, MotionSemantic } from "../experience/contracts.js";
export interface MotionPresentation {intent:MotionIntent;enabled:boolean;emphasis:"subtle"|"normal"|"strong";}
export function resolveMotion(semantic:MotionSemantic,context:ExperienceContextV010):MotionPresentation{
  if(context.accessibility?.reduceMotion||semantic.intent==="none")return {intent:"none",enabled:false,emphasis:"subtle"};
  return {intent:semantic.intent,enabled:true,emphasis:semantic.importance==="high"?"strong":semantic.importance==="low"?"subtle":"normal"};
}
