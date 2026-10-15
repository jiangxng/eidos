#!/usr/bin/env node
/**
 * Enforce auditable Human UI review artifacts on PRs that touch Eidos UI.
 * This is a process/evidence check, not an automated declaration of good UX.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const required = [
  "目标与完成条件", "流程与步骤", "导航与信息架构", "视觉与颜色",
  "记忆与注意力", "无障碍与跨年龄", "安全与数据修复", "证据与剩余问题"
];
const reviewRoot = "docs/ui-design-reviews/";
function uiPath(path) {
  return /^(src\/(?:components|design-language|navigation|renderers|workbench|experience|experience-architecture)\/|capabilities\/.*\/(?:CAPABILITY\.md|.*\.(?:tsx?|html|css))$|demo\/|MOBILE-DESIGN-LANGUAGE\.md$)/.test(path);
}
function check(paths, load) {
  const changedUI = paths.filter(uiPath);
  if (!changedUI.length) return { ok:true, changedUI, message:"No Eidos Human UI source/contract change detected." };
  const notes = paths.filter(p => p.startsWith(reviewRoot) && p.endsWith(".md"));
  if (!notes.length) return {ok:false,changedUI,message:"UI modifications require a new/updated docs/ui-design-reviews/*.md in this PR."};
  for (const path of notes) {
    let body;
    try {body=load(path)}catch{return {ok:false,changedUI,message:"Cannot read review artifact: "+path}}
    if (body.length < 500) continue;
    if (required.every(item=>new RegExp("^##\\s+"+item+"\\s*$","m").test(body))
      && changedUI.some(p=>body.includes(p))) return {ok:true,changedUI,message:"Review evidence: "+path};
  }
  return {ok:false,changedUI,message:"Review note needs all eight substantive headings and an exact changed UI file path. See docs/product/EIDOS-HUMAN-UI-DESIGN-REVIEW-CHECKLIST-v1.0.md."};
}
if (process.argv.includes("--self-test")) {
  const sample = required.map(h=>"## "+h+"\nExample details for actual task, owner, evidence and recovery.").join("\n\n")+"\nsrc/components/Button.ts";
  const assert = (ok,txt)=>{if(!ok)throw new Error("FAIL: "+txt)};
  assert(check(["docs/product/readme.md"],()=>sample).ok,"docs-only");
  assert(!check(["src/components/Button.ts"],()=>sample).ok,"missing note");
  assert(check(["src/components/Button.ts","docs/ui-design-reviews/button-20261015.md"],()=>sample).ok,"complete UI review");
  assert(!check(["src/components/Button.ts","docs/ui-design-reviews/button-20261015.md"],()=>sample.replace("## 记忆与注意力","## WRONG")).ok,"missing memory review");
  console.log("Eidos UI review gate self-test PASS");
  process.exit(0);
}
const [base,head]=process.argv.slice(2);
if (!base||!head) {console.error("Usage: node tools/ui-design-review-gate.mjs <baseSHA> <headSHA>");process.exit(2)}
const paths=execFileSync("git",["diff","--name-only","--diff-filter=ACMR",base+"..."+head],{encoding:"utf8"}).trim().split("\n").filter(Boolean);
const result=check(paths,path=>readFileSync(path,"utf8"));
console.log(JSON.stringify(result,null,2));
if (!result.ok) process.exit(1);
