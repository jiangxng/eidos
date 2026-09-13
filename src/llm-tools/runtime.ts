import type {
  CapabilityDescriptor, CapabilityQuery, ExperienceProposalV100,
  RealizedExperienceV100, ValidationDiagnostic, ValidationResult
} from "./contracts.js";

const DESCRIPTORS: CapabilityDescriptor[] = [
  {id:"decision-panel",family:"decision",version:"0.1.0",maturity:"candidate",summary:"Bounded human decision with evidence and alternatives."},
  {id:"evidence-stack",family:"decision",version:"0.1.0",maturity:"candidate",summary:"Decision evidence with mandatory evidence integrity."},
  {id:"impact-preview",family:"decision",version:"0.1.0",maturity:"candidate",summary:"Preview downstream impact before an action."},
  {id:"exception-queue",family:"exception",version:"0.1.0",maturity:"candidate",summary:"Prioritized operational exceptions."},
  {id:"diff-view",family:"decision",version:"0.1.0",maturity:"candidate",summary:"Before/after or proposed/current comparison."},
  {id:"timeline",family:"data",version:"0.1.0",maturity:"candidate",summary:"Ordered events and state transitions."},
  {id:"shared-focus",family:"collaboration",version:"0.1.0",maturity:"candidate",summary:"Stable collaboration focus reference."},
  {id:"adaptive-layout",family:"layout",version:"0.1.0",maturity:"candidate",summary:"Constraint-aware adaptive presentation."},
  {id:"hierarchical-selection",family:"input",version:"0.1.0",maturity:"candidate",summary:"Deterministic tree/reference selection."},
  {id:"flowchart",family:"diagram",version:"0.1.0",maturity:"candidate",summary:"Editable semantic directed graph."},
  {id:"kpi-card",family:"visualization",version:"0.1.0",maturity:"candidate",summary:"Compact metric presentation."},
  {id:"variance-analysis",family:"bi",version:"0.1.0",maturity:"candidate",summary:"Compare actual/reference measures and explain variance."},
  {id:"pivot-analysis",family:"bi",version:"0.1.0",maturity:"candidate",summary:"Measure/dimension aggregation and pivot intent."},
  {id:"report-builder",family:"reporting",version:"0.1.0",maturity:"candidate",summary:"Structured report sections and export intent."},
  {id:"digital-twin-view",family:"spatial",version:"0.1.0",maturity:"candidate",summary:"Scene-oriented spatial operational view."},
  {id:"spatial-annotation",family:"spatial",version:"0.1.0",maturity:"candidate",summary:"Anchored spatial evidence/annotation."},
  {id:"approval",family:"decision",version:"0.1.0",maturity:"candidate",summary:"Explicit approval/decline decision request."}
];

export function discoverCapabilities(query: CapabilityQuery = {}): CapabilityDescriptor[] {
  const q=(query.intent??"").toLowerCase();
  return DESCRIPTORS.filter(c=>{
    if(query.family && c.family!==query.family) return false;
    if(!q) return true;
    return `${c.id} ${c.family} ${c.summary}`.toLowerCase().includes(q);
  }).map(c=>({...c}));
}

export function validateExperienceProposal(proposal: ExperienceProposalV100): ValidationResult {
  const diagnostics: ValidationDiagnostic[]=[];
  const known=new Map(DESCRIPTORS.map(c=>[c.id,c]));
  const ids=new Set<string>();

  if(proposal.contractVersion!=="1.0.0"){
    diagnostics.push({code:"UNSUPPORTED_CONTRACT_VERSION",severity:"error",path:"/contractVersion",message:"Only Experience Proposal 1.0.0 is accepted.",deterministic:true});
  }
  for(let i=0;i<proposal.regions.length;i++){
    const r=proposal.regions[i]!;
    if(ids.has(r.id)) diagnostics.push({code:"DUPLICATE_REGION_ID",severity:"error",path:`/regions/${i}/id`,message:`Duplicate region id '${r.id}'.`,deterministic:true});
    ids.add(r.id);
    if(!known.has(r.capability)) diagnostics.push({code:"UNKNOWN_CAPABILITY",severity:"error",path:`/regions/${i}/capability`,message:`Unknown capability '${r.capability}'.`,deterministic:true});
    if(r.capability==="evidence-stack" && r.stability==="adaptive"){
      diagnostics.push({code:"DECISION_EVIDENCE_MUST_BE_STABLE",severity:"error",path:`/regions/${i}/stability`,message:"Decision evidence cannot be freely adaptive.",deterministic:true});
    }
    if(proposal.mode==="shared" && r.stability==="personal-stable"){
      diagnostics.push({code:"PERSONAL_REGION_IN_SHARED_MODE",severity:"warning",path:`/regions/${i}/stability`,message:"Personal-stable content must remain peripheral in a shared experience.",deterministic:true});
    }
  }
  return {ok:!diagnostics.some(d=>d.severity==="error"),diagnostics};
}

export function realizeExperienceProposal(proposal: ExperienceProposalV100): RealizedExperienceV100 {
  const result=validateExperienceProposal(proposal);
  if(!result.ok){
    const error=new Error("Experience proposal failed deterministic validation.");
    (error as Error & {diagnostics?:ValidationDiagnostic[]}).diagnostics=result.diagnostics;
    throw error;
  }
  const renderable=new Set(["decision-panel","evidence-stack","impact-preview","exception-queue","diff-view","timeline","shared-focus","adaptive-layout","hierarchical-selection","flowchart","kpi-card","variance-analysis","report-builder","digital-twin-view"]);
  return {
    contractVersion:"1.0.0",
    proposalId:proposal.proposalId,
    mode:proposal.mode,
    regions:proposal.regions.map(r=>({...r,realization:renderable.has(r.capability)?"candidate-renderer":"semantic-only"}))
  };
}
