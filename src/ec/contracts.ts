import type { ExperienceCompositionV010, ExperienceContextV010 } from "../experience/contracts.js";
import type { JsonValue } from "../runtime/contracts.js";
export interface EcAdaptationHintsV010 {contractVersion:"0.1.0";profileRevision:string;preferredDensity?:"comfortable"|"compact"|"dense";preferredExplanationLevel?:"minimal"|"normal"|"detailed";stableRegionIds?:string[];rankedCapabilityPreferences?:string[];extensions?:Record<string,JsonValue>;}
export interface EcExperienceProposalV010 {contractVersion:"0.1.0";proposalId:string;producedAt:string;composition:ExperienceCompositionV010;context:ExperienceContextV010;adaptation?:EcAdaptationHintsV010;rationale?:Array<{code:string;explanation:string;evidence?:string[]}>;}
export interface EcBoundaryPolicy {runtimeGeneratedExecutableCode:false;eidosOwnsLongTermUserProfile:false;ecMayProposePersonalization:true;eidosMustValidateProposal:true;standardFallbackRequired:true;}
export const EC_BOUNDARY_POLICY:EcBoundaryPolicy={runtimeGeneratedExecutableCode:false,eidosOwnsLongTermUserProfile:false,ecMayProposePersonalization:true,eidosMustValidateProposal:true,standardFallbackRequired:true};
