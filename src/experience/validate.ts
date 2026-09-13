import type { Diagnostic, ValidationResult } from "../runtime/contracts.js";
import type { ExperienceCompositionV010, ExperienceContextV010 } from "./contracts.js";
import { isPlainObject } from "../runtime/json.js";

const modes = new Set(["standard","role","personal","shared"]);
const terminals = new Set(["web","desktop","mobile","tablet","large-screen","embedded","terminal","voice","agent"]);
const stability = new Set(["invariant","shared-stable","personal-stable","adaptive"]);
const attention = new Set(["passive","informative","important","requires-review","urgent","blocking"]);
const motion = new Set(["none","reveal","continuity","attention","confirmation","causality","state-transition"]);
const d = (code:string,path:string,message:string,fix?:string):Diagnostic => ({code,path,message,...(fix?{fix}:{})});

export function validateExperienceContext(value: unknown): ValidationResult<ExperienceContextV010> {
  const diagnostics: Diagnostic[] = [];
  if (!isPlainObject(value)) return {ok:false,diagnostics:[d("EIDOS_CONTEXT_TYPE","$","ExperienceContext must be an object")]};
  if (value.contractVersion !== "0.1.0") diagnostics.push(d("EIDOS_CONTEXT_VERSION","$.contractVersion","Unsupported ExperienceContext version"));
  if (typeof value.contextId !== "string" || !value.contextId) diagnostics.push(d("EIDOS_CONTEXT_ID","$.contextId","contextId is required"));
  if (typeof value.mode !== "string" || !modes.has(value.mode)) diagnostics.push(d("EIDOS_CONTEXT_MODE","$.mode","Unsupported experience mode"));
  if (!isPlainObject(value.device)) diagnostics.push(d("EIDOS_CONTEXT_DEVICE","$.device","device is required"));
  else if (typeof value.device.terminal !== "string" || !terminals.has(value.device.terminal)) diagnostics.push(d("EIDOS_CONTEXT_TERMINAL","$.device.terminal","Unsupported terminal"));
  if (diagnostics.length) return {ok:false,diagnostics};
  return {ok:true,diagnostics:[],value:value as unknown as ExperienceContextV010};
}

export function validateExperienceComposition(value: unknown): ValidationResult<ExperienceCompositionV010> {
  const diagnostics: Diagnostic[] = [];
  if (!isPlainObject(value)) return {ok:false,diagnostics:[d("EIDOS_EXPERIENCE_TYPE","$","ExperienceComposition must be an object")]};
  if (value.contractVersion !== "0.1.0") diagnostics.push(d("EIDOS_EXPERIENCE_VERSION","$.contractVersion","Unsupported ExperienceComposition version"));
  if (typeof value.experienceId !== "string" || !value.experienceId) diagnostics.push(d("EIDOS_EXPERIENCE_ID","$.experienceId","experienceId is required"));
  if (!Array.isArray(value.regions)) diagnostics.push(d("EIDOS_EXPERIENCE_REGIONS","$.regions","regions must be an array"));
  else {
    const ids = new Set<string>();
    value.regions.forEach((r,i)=>{
      const p=`$.regions[${i}]`;
      if(!isPlainObject(r)){diagnostics.push(d("EIDOS_REGION_TYPE",p,"region must be object"));return;}
      if(typeof r.id!=="string"||!r.id) diagnostics.push(d("EIDOS_REGION_ID",`${p}.id`,"id is required"));
      else if(ids.has(r.id)) diagnostics.push(d("EIDOS_REGION_DUPLICATE",`${p}.id`,`Duplicate region id '${r.id}'`));
      else ids.add(r.id);
      if(typeof r.capability!=="string"||!r.capability) diagnostics.push(d("EIDOS_REGION_CAPABILITY",`${p}.capability`,"capability is required"));
      if(typeof r.stability!=="string"||!stability.has(r.stability)) diagnostics.push(d("EIDOS_REGION_STABILITY",`${p}.stability`,"Unsupported stability class"));
      if(r.attention!==undefined && (!isPlainObject(r.attention)||typeof r.attention.level!=="string"||!attention.has(r.attention.level))) diagnostics.push(d("EIDOS_ATTENTION_LEVEL",`${p}.attention`,"Unsupported attention semantics"));
      if(r.motion!==undefined && (!isPlainObject(r.motion)||typeof r.motion.intent!=="string"||!motion.has(r.motion.intent))) diagnostics.push(d("EIDOS_MOTION_INTENT",`${p}.motion`,"Unsupported motion semantics"));
    });
  }
  if (diagnostics.length) return {ok:false,diagnostics};
  return {ok:true,diagnostics:[],value:value as unknown as ExperienceCompositionV010};
}
