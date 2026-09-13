export type FieldKind = "text"|"number"|"currency"|"date"|"select"|"boolean";
export interface FieldOption { value:string|number|boolean; label:string; disabled?:boolean; }
export interface FieldDefinition { id:string; label:string; kind:FieldKind; required?:boolean; readOnly?:boolean; placeholder?:string; options?:FieldOption[]; min?:number; max?:number; }
export interface FormDefinition { id:string; fields:FieldDefinition[]; }
export type FormValues = Record<string, string|number|boolean|null>;
export interface FormIssue { fieldId:string; code:string; message:string; }
export function validateForm(def:FormDefinition, values:FormValues):FormIssue[]{
 const issues:FormIssue[]=[];
 for(const f of def.fields){ const v=values[f.id];
  if(f.required && (v===undefined||v===null||v==="")) issues.push({fieldId:f.id,code:"REQUIRED",message:`${f.label} is required`});
  if(typeof v==="number" && f.min!==undefined && v<f.min) issues.push({fieldId:f.id,code:"MIN",message:`${f.label} must be >= ${f.min}`});
  if(typeof v==="number" && f.max!==undefined && v>f.max) issues.push({fieldId:f.id,code:"MAX",message:`${f.label} must be <= ${f.max}`});
  if(f.options && v!==undefined && v!==null && !f.options.some(o=>o.value===v)) issues.push({fieldId:f.id,code:"OPTION",message:`${f.label} contains an unsupported value`});
 }
 return issues;
}
export function patchForm(values:FormValues, fieldId:string, value:FormValues[string]):FormValues { return {...values,[fieldId]:value}; }
