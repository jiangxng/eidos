import type { AttentionSemantic } from "../experience/contracts.js";
import type { JsonValue } from "../runtime/contracts.js";
export interface EvidenceItem {id:string;label:string;value?:JsonValue;source?:string;mandatory?:boolean;confidence?:number;}
export interface DecisionAlternative {id:string;label:string;summary?:string;impacts?:Array<{dimension:string;description:string;severity?:"low"|"medium"|"high"}>;}
export interface DecisionModel {id:string;question:string;alternatives:DecisionAlternative[];evidence:EvidenceItem[];recommendation?:{alternativeId:string;rationale:string;confidence?:number};attention?:AttentionSemantic;}
export function validateDecisionModel(model:DecisionModel):string[]{const issues:string[]=[];if(!model.id)issues.push("Decision id is required");if(!model.question)issues.push("Decision question is required");if(model.alternatives.length<2)issues.push("A decision requires at least two alternatives");const ids=new Set(model.alternatives.map(a=>a.id));if(model.recommendation&&!ids.has(model.recommendation.alternativeId))issues.push("Recommendation must reference an existing alternative");return issues;}
export function mandatoryEvidence(model:DecisionModel):EvidenceItem[]{return model.evidence.filter(e=>e.mandatory);}
