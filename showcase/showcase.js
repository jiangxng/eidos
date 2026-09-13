const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const titles={cockpit:"Order Risk Command Center",llm:"LLM → Eidos Pipeline",capabilities:"Capability Explorer",contracts:"Contract & Ownership Inspector",beyond:"Beyond Forms"};
function show(id){$$(".view").forEach(v=>v.classList.toggle("active",v.id===id));$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.view===id));$("#pageTitle").textContent=titles[id];}
$$(".nav").forEach(n=>n.onclick=()=>show(n.dataset.view));$$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));

const caps=[
["decision-panel","decision","Bounded human decision with evidence and consequences."],
["evidence-stack","decision","Traceable evidence with mandatory-item integrity."],
["exception-queue","exception","Prioritize anomalies without alert fatigue."],
["adaptive-layout","layout","Adapt presentation while preserving stability constraints."],
["shared-focus","collaboration","Keep collaborators on the same stable reference."],
["pivot-analysis","bi","Semantic measures, dimensions and aggregation."],
["flowchart","diagram","Editable graph semantics independent of renderer."],
["report-builder","reporting","Sections, grouping, print/export and drill."],
["digital-twin-view","spatial","Scene, layers, picking and spatial annotation."],
["reorder","customization","Human direct manipulation through the same state model."],
["diff-view","decision","Explain meaningful change using stable before/after references."],
["impact-preview","decision","Preview downstream consequences before action."]
];
$("#capGrid").innerHTML=caps.map(c=>`<article class="cap"><small>${c[1]}</small><h3>${c[0]}</h3><p>${c[2]}</p></article>`).join("");

let current=null, invalid=false;
function makeProposal(prompt){
 const lower=prompt.toLowerCase();
 let capabilities=["exception-queue","evidence-stack","decision-panel","impact-preview","flowchart"];
 if(lower.includes("finance")) capabilities=["kpi-card","variance-analysis","evidence-stack","decision-panel","approval"];
 if(lower.includes("incident")) capabilities=["exception-queue","timeline","shared-focus","decision-panel"];
 if(lower.includes("warehouse")||lower.includes("spatial")||lower.includes("twin")) capabilities=["digital-twin-view","spatial-annotation","exception-queue","evidence-stack","decision-panel"];
 return {contractVersion:"0.1.0",proposalId:"demo-"+Date.now(),producer:"llm/ec-adapter",experience:{id:"generated-review",mode:lower.includes("shared")?"shared":"personal",capabilities:capabilities.map((id,i)=>({id,stability:i===1?"invariant":i===2?"shared-stable":"adaptive"}))},hostBoundary:{businessTruth:"external",execution:"ActionRequest only"}};
}
function validate(p){
 const known=new Set(caps.map(x=>x[0]).concat(["kpi-card","variance-analysis","approval","timeline","spatial-annotation"]));
 const unknown=p.experience.capabilities.filter(c=>!known.has(c.id));
 const evidence=p.experience.capabilities.find(c=>c.id==="evidence-stack");
 if(unknown.length)return {ok:false,msg:`Rejected: unknown capability '${unknown[0].id}'. Fail closed.`};
 if(evidence&&evidence.stability==="adaptive")return {ok:false,msg:"Rejected: decision evidence cannot be freely adaptive."};
 return {ok:true,msg:"PASS · contract valid · capability references resolved · invariants preserved"};
}
function renderProposal(){
 $("#proposal").textContent=JSON.stringify(current,null,2);
 const v=validate(current);$("#validation").className="validation "+(v.ok?"good":"bad");$("#validation").textContent=(v.ok?"✓ ":"✕ ")+v.msg;
 $("#gateText").textContent=v.ok?"PASS — deterministic":"REJECTED — deterministic";
 $("#discoverText").textContent=current.experience.capabilities.map(c=>c.id).join(", ");
}
$("#generate").onclick=()=>{invalid=false;current=makeProposal($("#prompt").value);renderProposal();};
$("#breakBtn").onclick=()=>{if(!current)current=makeProposal($("#prompt").value);current.experience.capabilities.push({id:"magic-ai-widget",stability:"adaptive"});invalid=true;renderProposal();};
$$("[data-prompt]").forEach(b=>b.onclick=()=>{$("#prompt").value=b.dataset.prompt});

$("#customize").onclick=()=>{$("#customHint").classList.toggle("hidden");$("#customize").textContent=$("#customHint").classList.contains("hidden")?"Customize layout":"Finish customizing";};
$("#saveLayout").onclick=()=>{localStorage.setItem("eidos-demo-layout",JSON.stringify($$("#workspace .card").map(x=>x.dataset.id)));$("#customHint").innerHTML="✓ Personal view saved. Explicit human override now outranks inferred EC layout preference.";};
let dragged=null;
$$(".movable").forEach(card=>{card.addEventListener("dragstart",()=>{if($("#customHint").classList.contains("hidden"))return;dragged=card;card.classList.add("dragging")});card.addEventListener("dragend",()=>{card.classList.remove("dragging");dragged=null});card.addEventListener("dragover",e=>{if(!dragged)return;e.preventDefault();const target=e.currentTarget;if(target!==dragged)target.parentNode.insertBefore(dragged,target);});});
const saved=JSON.parse(localStorage.getItem("eidos-demo-layout")||"null");if(saved){const w=$("#workspace");saved.forEach(id=>{const el=w.querySelector(`[data-id="${id}"]`);if(el)w.appendChild(el);});}
$("#persona").onchange=e=>{const v=e.target.value;if(v==="Shared Review"){$$(".movable").forEach(x=>x.draggable=false);$("#customHint").classList.add("hidden");}else{$$(".movable").forEach(x=>x.draggable=true);}document.body.dataset.persona=v;};


// --- Localisation -----------------------------------------------------------
const I18N=window.EIDOS_I18N||{};
const i18nSelectors={
  "nav.cockpit":'.nav[data-view="cockpit"]',
  "nav.llm":'.nav[data-view="llm"]',
  "nav.capabilities":'.nav[data-view="capabilities"]',
  "nav.contracts":'.nav[data-view="contracts"]',
  "nav.beyond":'.nav[data-view="beyond"]',
  "customize":"#customize",
  "ask":'[data-go="llm"]',
  "hero.title":"#cockpit .hero h2",
  "hero.body":"#cockpit .hero p",
  "hero.exposure":"#cockpit .hero-score span",
  "llm.heading":"#llm .prompt-panel h2",
  "llm.generate":"#generate",
  "llm.note":"#llm .disclaimer",
  "cap.heading":"#capabilities .section-intro h2",
  "cap.body":"#capabilities .section-intro p",
  "contract.heading":"#contracts .section-intro h2",
  "beyond.heading":"#beyond .section-intro h2",
  "beyond.body":"#beyond .section-intro p"
};
let currentLocale=localStorage.getItem("eidos-locale")||"en";
function applyLocale(locale){
  const dict=I18N[locale]||I18N.en||{};
  currentLocale=locale; document.documentElement.lang=locale; localStorage.setItem("eidos-locale",locale);
  Object.entries(i18nSelectors).forEach(([k,s])=>{const el=document.querySelector(s);if(el&&dict[k])el.textContent=dict[k]});
  const active=document.querySelector(".view.active")?.id||"cockpit";
  const tk="title."+active; if(dict[tk])document.querySelector("#pageTitle").textContent=dict[tk];
  document.querySelector("#language").value=locale;
}
const originalShow=show;
show=function(id){originalShow(id);const d=I18N[currentLocale]||I18N.en;const key="title."+id;if(d&&d[key])document.querySelector("#pageTitle").textContent=d[key];};
document.querySelector("#language").addEventListener("change",e=>applyLocale(e.target.value));
applyLocale(currentLocale);
