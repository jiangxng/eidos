import test from "node:test";
import assert from "node:assert/strict";
import {discoverCapabilities,validateExperienceProposal,realizeExperienceProposal} from "../../dist/llm-tools/index.js";

test("LLM tool discovery is bounded and deterministic",()=>{
  const found=discoverCapabilities({intent:"decision"});
  assert.ok(found.some(x=>x.id==="decision-panel"));
});

test("unknown capability fails closed",()=>{
  const result=validateExperienceProposal({contractVersion:"1.0.0",proposalId:"x",mode:"personal",regions:[{id:"r",capability:"magic-widget",stability:"adaptive"}]});
  assert.equal(result.ok,false);
  assert.equal(result.diagnostics[0].code,"UNKNOWN_CAPABILITY");
});

test("valid proposal realizes without framework code",()=>{
  const realized=realizeExperienceProposal({contractVersion:"1.0.0",proposalId:"x",mode:"personal",regions:[{id:"r",capability:"decision-panel",stability:"shared-stable"}]});
  assert.equal(realized.regions[0].realization,"candidate-renderer");
});
