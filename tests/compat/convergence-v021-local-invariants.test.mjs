import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCanonicalExperienceProposalV100, validateCanonicalActionRequestV100, createHostNeutralActionRequestV100, adaptEcExperienceProposalV010 } from '../../dist/convergence/v021.js';

const baseExperience=()=>({contractVersion:'1.0.0',proposalId:'xp-local',producedAt:'2026-09-15T08:00:00Z',experience:{experienceId:'exp-local',regions:[{id:'decision',capabilityId:'decision-panel',capabilityVersion:'1.0.0',stability:'shared-stable',mandatoryEvidence:true,evidenceRefs:['ev-1'],accessibility:{required:true,label:'Decision evidence'}}]},context:{},fallback:{mode:'standard'}});
const baseAction=()=>({contractVersion:'1.0.0',actionRequestId:'ar-local',experienceInstanceId:'xi',experienceContractVersion:'1.0.0',capabilityId:'decision-panel',capabilityVersion:'1.0.0',actionSemantic:'APPROVE_RECOMMENDATION',targetRef:{host:'host-a',resourceType:'decision',resourceId:'1'},interactionContext:{surface:'desktop'},submittedValues:{choice:'B'},confirmationEvidence:{confirmed:true,method:'explicit-click'},actorContextRef:'actor-1',correlationId:'corr-1',occurredAt:'2026-09-15T08:04:00Z',presentedStateEtag:'s1',presentedDefinitionVersion:'3'});

for(const [name,mutate,code] of [
  ['unknown capability fails closed',v=>{v.experience.regions[0].capabilityId='not-a-capability';},'EIDOS_XP_CAPABILITY_UNKNOWN'],
  ['unsupported capability version fails closed',v=>{v.experience.regions[0].capabilityVersion='99.0.0';},'EIDOS_XP_CAPABILITY_VERSION'],
  ['missing mandatory evidence fails closed',v=>{v.experience.regions[0].evidenceRefs=[];},'EIDOS_XP_MANDATORY_EVIDENCE'],
  ['accessibility violation fails closed',v=>{v.experience.regions[0].accessibility.label='';},'EIDOS_XP_ACCESSIBILITY'],
  ['invalid fallback fails closed',v=>{v.fallback={mode:'invented'};},'EIDOS_XP_FALLBACK'],
  ['business authorization assertion fails closed',v=>{v.authorized=true;},'EIDOS_TRUSTED_AUTH_FORBIDDEN'],
]) test(name,()=>{const v=baseExperience();mutate(v);const r=validateCanonicalExperienceProposalV100(v);assert.equal(r.ok,false);assert.ok(r.diagnostics.some(x=>x.code===code));});

test('ActionRequest remains host-neutral and confirmation is not authorization',()=>{const v=baseAction();const produced=createHostNeutralActionRequestV100(v);assert.equal(produced.targetRef.host,'host-a');assert.equal('command' in produced,false);assert.equal('authorized' in produced,false);assert.equal(produced.confirmationEvidence.confirmed,true);});

test('ActionRequest rejects command-shaped coupling',()=>{const v=baseAction();v.type='command';v.command={code:'approve'};const r=validateCanonicalActionRequestV100(v);assert.equal(r.ok,false);assert.ok(r.diagnostics.some(x=>x.code==='EIDOS_AR_HOST_NEUTRAL'));});

test('ActionRequest rejects nested trusted authorization result',()=>{const v=baseAction();v.confirmationEvidence.authorized=true;const r=validateCanonicalActionRequestV100(v);assert.equal(r.ok,false);assert.ok(r.diagnostics.some(x=>x.code==='EIDOS_TRUSTED_AUTH_FORBIDDEN'));});

test('ActionRequest requires presentation evidence for TOCTOU',()=>{const v=baseAction();delete v.presentedStateEtag;const r=validateCanonicalActionRequestV100(v);assert.equal(r.ok,false);assert.ok(r.diagnostics.some(x=>x.path==='$.presentedStateEtag'));});

test('v0.1 adapter refuses to guess capability version',()=>{const legacy={contractVersion:'0.1.0',proposalId:'legacy',producedAt:'2026-09-15T08:00:00Z',composition:{experienceId:'exp',regions:[{id:'r',capability:'decision-panel',stability:'shared-stable'}]},context:{}};const r=adaptEcExperienceProposalV010(legacy,{});assert.equal(r.status,'UNSUPPORTED');assert.ok(r.diagnostics.some(x=>x.code==='EIDOS_V010_VERSION_MAP'));});
