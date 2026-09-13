import type { AttentionLevel, AttentionSemantic, ExperienceContextV010 } from "../experience/contracts.js";
export interface AttentionPresentation { prominence:"quiet"|"normal"|"strong"|"interrupting"; announce:boolean; motionAllowed:boolean; }
export function presentAttention(semantic:AttentionSemantic,context:ExperienceContextV010):AttentionPresentation{
  const map:Record<AttentionLevel,AttentionPresentation["prominence"]>={passive:"quiet",informative:"normal",important:"strong","requires-review":"strong",urgent:"interrupting",blocking:"interrupting"};
  return {prominence:map[semantic.level],announce:Boolean(context.accessibility?.screenReader)&&semantic.level!=="passive",motionAllowed:!Boolean(context.accessibility?.reduceMotion)};
}
