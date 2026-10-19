import { validateUidl } from "../../dist/runtime/validate.js";
import { renderToHtml } from "../../dist/renderers/html/index.js";
import test from "node:test";
import assert from "node:assert/strict";

import {
  eidosDesignTokensV010,
  eidosDesignTokenCss,
  eidosProductiveWorkbenchCss,
  eidosDesignPolicyV010,
  eidosMobileDesignLanguageV010,
  eidosTextScalePreferencesV010,
  normalizeEidosTextScalePreferenceV010
} from "../../dist/design-language/index.js";

test("design language uses a productive 4px-derived rhythm and mobile touch target", () => {
  assert.equal(eidosDesignTokensV010.contractVersion, "0.1.0");
  assert.equal(eidosDesignTokensV010.spacing.xs, 4);
  assert.equal(eidosDesignTokensV010.spacing.md, 8);
  assert.equal(eidosDesignTokensV010.size.activityBarDesktop, 56);
  assert.equal(eidosDesignTokensV010.size.touchTarget, 44);
  assert.equal(eidosDesignTokensV010.type.unit, "rem");
});

test("productive Workbench CSS exposes stable semantic tokens and shell selectors", () => {
  assert.match(eidosDesignTokenCss, /--eidos-space-xs:4px/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-app-host-layout="workbench"/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-extension-manager-header/);
  assert.match(eidosProductiveWorkbenchCss, /justify-content:flex-end/);
  assert.match(eidosProductiveWorkbenchCss, /min-height:44px/);
});


test("design policy encodes toolbar and action hierarchy for LLM/plugin generation", () => {
  assert.equal(eidosDesignPolicyV010.actions.maxPrimaryPerScope, 1);
  assert.equal(eidosDesignPolicyV010.actions.primaryPlacement, "trailing");
  assert.deepEqual(eidosDesignPolicyV010.toolbar.leading, ["navigation", "back", "sidebar-structure"]);
  assert.equal(eidosDesignPolicyV010.plugin.inheritHostTokens, true);
  assert.equal(eidosDesignPolicyV010.accessibility.ariaRoleRequiresKeyboardBehavior, true);
});


test("productive design language includes modern agent chat and grouped settings patterns", () => {
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-thread-controls/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-thread-selector/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-composer\]:focus-within/);
  assert.match(eidosProductiveWorkbenchCss, /scrollbar-gutter:stable/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-settings-version="0\.2\.0"\][^{]*\[data-eidos-setting\]/
  );
  assert.match(eidosProductiveWorkbenchCss, /grid-template-columns:minmax\(180px/);
  assert.match(eidosProductiveWorkbenchCss, /details\[data-eidos-settings-group\]/);
});


test("productive design language includes a first-class Review / Decision pattern", () => {
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-queue/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-item/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-technical/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-review-actions/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /button\[data-eidos-primary="true"\][^{]*\{[\s\S]*margin-left:auto/
  );
});


test("Catalog Browser follows Eidos trailing-primary and disabled-help styling", () => {
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-catalog-item\] \[data-eidos-action-help\]/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-catalog-item\] button:disabled/
  );
});


test("mobile design language is a normative plugin contract", () => {
  assert.equal(eidosMobileDesignLanguageV010.contractVersion, "0.1.0");
  assert.equal(eidosMobileDesignLanguageV010.navigation.primaryPlacement, "bottom");
  assert.equal(eidosMobileDesignLanguageV010.content.primaryFlow, "single-column");
  assert.equal(eidosMobileDesignLanguageV010.navigation.destinationTouchTargetPx, 44);
  assert.equal(eidosMobileDesignLanguageV010.plugin.customMobileShellForbidden, true);
  assert.equal(eidosMobileDesignLanguageV010.plugin.customBreakpointForbidden, true);
  assert.equal(eidosMobileDesignLanguageV010.accessibility.touchTargetMinimumPx, 44);
  assert.equal(eidosDesignPolicyV010.mobile.normativeReference, "Eidos Mobile Design Language v0.1");
  assert.equal(eidosDesignPolicyV010.plugin.inheritResponsiveRealization, true);
  assert.ok(eidosDesignPolicyV010.plugin.forbiddenByDefault.includes("custom-mobile-shell"));
});

test("productive Workbench realizes phone navigation, safe areas and mobile sheets", () => {
  assert.match(eidosDesignTokenCss, /--eidos-mobile-nav-height:64px/);
  assert.match(eidosDesignTokenCss, /--eidos-safe-area-bottom:env\(safe-area-inset-bottom,0px\)/);
  assert.match(eidosProductiveWorkbenchCss, /Eidos Mobile Design Language v0\.1 reference realization/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-activity-bar\][\s\S]*grid-row:2[\s\S]*flex-direction:row/
  );
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-status-bar\]\{display:none\}/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-account-menu\][\s\S]*position:fixed[\s\S]*bottom:calc/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-catalog-detail-thumbnails\][\s\S]*overflow-x:auto[\s\S]*scroll-snap-type/
  );
});




test("agent chat chrome responds to its own pane width", () => {
  assert.match(eidosProductiveWorkbenchCss, /container-name:eidos-chat/);
  assert.match(eidosProductiveWorkbenchCss, /@container eidos-chat \(max-width:520px\)/);
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-side-panel\] \[data-eidos-chat-header\] h1\{[\s\S]*display:none/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-workspace-content\]:has\(> \[data-eidos-chat\]\)[\s\S]*padding:0/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-chat-heading-group\][\s\S]*display:flex[\s\S]*align-items:center/
  );
  assert.match(
    eidosProductiveWorkbenchCss,
    /data-eidos-chat-new-thread[\s\S]*data-eidos-chat-history-toggle[\s\S]*background:transparent/
  );
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-more-toggle/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-toolbar-label/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-chat-thread-selector\][\s\S]*display:none/);
});

test("system text scaling is part of the mobile contract", () => {
  assert.equal(eidosMobileDesignLanguageV010.typography.preferenceAuthority, "os-and-user-agent");
  assert.equal(eidosMobileDesignLanguageV010.typography.defaultPreference, "system");
  assert.deepEqual(eidosMobileDesignLanguageV010.typography.userScalePresets, ["system", "small", "standard", "large"]);
  assert.equal(eidosMobileDesignLanguageV010.typography.userScaleComposesWithSystem, true);
  assert.equal(eidosMobileDesignLanguageV010.typography.fixedPixelFontSizesForbidden, true);
  assert.equal(eidosDesignPolicyV010.accessibility.systemTextScaleRequired, true);
  assert.equal(eidosDesignPolicyV010.typography.sizing, "root-relative");
  assert.match(eidosDesignTokenCss, /--eidos-font-body:\.875rem/);
  assert.match(eidosProductiveWorkbenchCss, /html\{font-size:100%;-webkit-text-size-adjust:auto;text-size-adjust:auto\}/);
  assert.doesNotMatch(eidosProductiveWorkbenchCss, /font-size:\s*\d+(?:\.\d+)?px/);
});


test("text scale presets compose with system preference", () => {
  assert.deepEqual(
    eidosTextScalePreferencesV010.map(item => [item.id, item.additionalScale]),
    [["system", 1], ["small", 0.9], ["standard", 1], ["large", 1.15]]
  );
  assert.equal(normalizeEidosTextScalePreferenceV010("large"), "large");
  assert.equal(normalizeEidosTextScalePreferenceV010("unknown"), "system");
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale="small"\]\{font-size:90%\}/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale="standard"\]\{font-size:100%\}/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale="large"\]\{font-size:115%\}/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-text-scale-control/);
});


test("business-office visual revision replaces developer-console defaults", () => {
  assert.equal(eidosDesignTokensV010.visualRevision, "0.2.0");
  assert.equal(eidosDesignPolicyV010.visualRevision, "0.2.0");
  assert.equal(eidosDesignPolicyV010.visualLanguage.developerConsoleAsDefault, false);
  assert.equal(eidosDesignPolicyV010.workbench.statusBar.defaultVisibility, "hidden");
  assert.equal(eidosDesignPolicyV010.workbench.workspace.internalRouteAddress, "not-rendered-in-standard-business-workbench");
  assert.equal(eidosDesignPolicyV010.mobile.primaryNavigationLabels, "visible");
  assert.equal(eidosDesignTokensV010.color.brand, "#2B6CB0");
  assert.equal(eidosDesignTokensV010.icon.standardMode, "monochrome");
  assert.match(eidosDesignTokenCss, /--eidos-bg-selected:#EAF2FB/);
  assert.match(eidosDesignTokenCss, /--eidos-shadow-raised:/);
  assert.match(eidosProductiveWorkbenchCss, /Eidos Business Office Visual Language v0\.2/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-workspace-mode="app"/);
  assert.match(eidosProductiveWorkbenchCss, /data-eidos-activity-label/);
  assert.match(eidosProductiveWorkbenchCss, /font-family:var\(--eidos-font-family\)/);
});


test("mobile review cards place source and read-only status together without shrinking controls", () => {
  const css = eidosProductiveWorkbenchCss;
  const mobile = css.slice(css.indexOf("/* Eidos E2:"));
  assert.match(mobile, /@media\(max-width:700px\)\{[\s\S]*grid-template-columns:minmax\(0,1fr\) auto/);
  assert.match(mobile, /tbody th\[data-eidos-review-table-subject\]\{[\s\S]*grid-row:1/);
  assert.match(mobile, /tbody th\[data-eidos-review-table-subject\]\{[^}]*width:100%/);
  assert.match(mobile, /tbody td\[data-eidos-review-table-status\]\{[\s\S]*grid-row:1/);
  assert.match(mobile, /tbody td\[data-eidos-review-table-evidence\],[\s\S]*tbody td\[data-eidos-review-table-choice\]\{[\s\S]*grid-column:1\/-1/);
  assert.match(mobile, /\[data-eidos-form-review-table\] select,[\s\S]*\[data-eidos-form-review-table\] input\{min-height:44px\}/);
  assert.match(mobile, /data-eidos-review-table-status\]\[data-heading\]:before\{[\s\S]*display:none/);
});

test("decision-first review task hides none of the Host facts and requires explicit opt-in", () => {
  const doc={
    contractVersion:"0.1.1",kind:"form",id:"eidos.example.decision-review",
    title:"Review",purpose:"execute-command",
    command:{code:"test.action",inputVersion:"0.1.0"},
    fields:[{key:"choice",label:"Choose",semanticType:"test-choice",
      control:"select",required:true,initialValue:"keep",
      options:[{value:"keep",label:"Keep"}]}],
    actions:[{id:"submit",label:"Submit",type:"submit",
      command:"test.action",requiresConfirmation:true}],
    reviewTask:{
      presentation:"decision-first",
      subject:{title:"Supplier file.xlsx",facts:[{id:"rows",label:"Rows",value:"172"}]},
      steps:[{id:"upload",label:"Upload",state:"complete"},
             {id:"review",label:"Review",state:"current"}],
      metrics:[{id:"issues",label:"Needs review",value:"1"}],
      issuesTitle:"Needs attention",
      issues:[{id:"bank",title:"Bank field",focusGroupId:undefined}],
      helpText:"Only approved schema changes are saved."
    }
  };
  const result=validateUidl(doc);
  assert.equal(result.ok,true,JSON.stringify(result));
  const html=renderToHtml(doc);
  assert.match(html,/data-eidos-task-presentation="decision-first"/);
  assert.match(html,/<details data-eidos-form-task-details>/);
  assert.match(html,/<summary><strong>Supplier file\.xlsx<\/strong>/);
  assert.match(html,/data-eidos-form-task-metric/);
  assert.match(html,/data-eidos-form-task-issue="bank"/);
  assert.match(html,/Only approved schema changes are saved/);
  assert.doesNotMatch(html,/<details data-eidos-form-task-details open/);
  const malformed={...doc,reviewTask:{...doc.reviewTask,presentation:"invisible"}};
  assert.equal(validateUidl(malformed).ok,false,
    "unknown layouts must not quietly hide task evidence");
  assert.match(eidosProductiveWorkbenchCss,/data-eidos-task-presentation="decision-first"/);
  assert.match(eidosProductiveWorkbenchCss,/data-eidos-form-task-details\]>summary\{[\s\S]*min-height:44px/);
});


test("E6 review plan validates real field references and renders an escaped local preview", () => {
  const doc={
    contractVersion:"0.1.1",kind:"form",id:"eidos.preview.test",
    title:"Review",purpose:"execute-command",
    command:{code:"test.approve",inputVersion:"0.1.0"},
    fields:[
      {key:"choice_0",label:"Target",semanticType:"test.target",control:"select",
        required:true,initialValue:"__CREATE__",options:[
          {value:"__CREATE__",label:"Create"},
          {value:"__IGNORE__",label:"Ignore"},
          {value:"__REVIEW__",label:"Review"},
          {value:"field.1",label:"Reuse"}]},
      {key:"label_0",label:"Name",semanticType:"test.name",control:"text",
        required:true,initialValue:"Legal <alert>"},
      {key:"type_0",label:"Type",semanticType:"test.type",control:"select",
        required:true,initialValue:"STRING",options:[
          {value:"STRING",label:"Text"},{value:"NUMBER",label:"Number"}]}
    ],
    reviewGroups:[{
      id:"r0",title:"Excel <script>alert(1)</script>",
      primaryFieldKey:"choice_0",detailFieldKeys:["label_0","type_0"],
      reviewStatus:{key:"proposed",label:"Proposed"},
      statusByChoice:{
        "__CREATE__":{key:"proposed",label:"Proposed"},
        "__IGNORE__":{key:"ignored",label:"Excluded"},
        "__REVIEW__":{key:"attention",label:"Review",tone:"warning"},
        "field.1":{key:"suggested",label:"Reuse"}
      }
    }],
    reviewTable:{columnLabels:{subject:"Source",evidence:"Evidence",
      decision:"Target",status:"Status"}},
    reviewPlan:{
      title:"Review before approving",warning:"Preview only. No fields created.",
      categories:[
        {id:"create",label:"Create",statusKeys:["proposed"]},
        {id:"reuse",label:"Reuse",statusKeys:["suggested"]},
        {id:"ignore",label:"Ignore",statusKeys:["ignored"]},
        {id:"pending",label:"Pending",statusKeys:["attention"]}
      ],
      proposedFields:[{groupId:"r0",labelFieldKey:"label_0",typeFieldKey:"type_0"}]
    },
    actions:[{id:"submit",label:"Approve",type:"submit",requiresConfirmation:true}]
  };
  assert.equal(validateUidl(doc).ok,true,JSON.stringify(validateUidl(doc).diagnostics));
  const html=renderToHtml(doc);
  assert.match(html,/data-eidos-form-review-plan/);
  assert.match(html,/data-eidos-plan-label-field="label_0"/);
  assert.match(html,/data-eidos-review-plan-categories/);
  assert.match(html,/Excel &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html,/<script>alert\(1\)<\/script>/);
  assert.match(eidosProductiveWorkbenchCss,/data-eidos-review-plan-items/);
  assert.equal(validateUidl({...doc,reviewPlan:{...doc.reviewPlan,
    categories:doc.reviewPlan.categories.slice(1)}}).ok,false,
    "missing a reachable status cannot be silently omitted");
  assert.equal(validateUidl({...doc,reviewPlan:{...doc.reviewPlan,
    proposedFields:[{groupId:"r0",labelFieldKey:"choice_0",typeFieldKey:"type_0"}]}}).ok,false,
    "the preview must not read a select masquerading as an editable field name");
  const zeroReuse={
    ...doc,
    fields:[{...doc.fields[0],options:doc.fields[0].options.filter(x=>x.value!=="field.1")},
      ...doc.fields.slice(1)],
    reviewGroups:[{...doc.reviewGroups[0],statusByChoice:{
      "__CREATE__":{key:"proposed",label:"Proposed"},
      "__IGNORE__":{key:"ignored",label:"Excluded"},
      "__REVIEW__":{key:"attention",label:"Review"}
    }}],
    reviewPlan:{...doc.reviewPlan,categories:doc.reviewPlan.categories.map(c=>
      c.id==="reuse"?{...c,statusKeys:[]}:c)}
  };
  assert.equal(validateUidl(zeroReuse).ok,true,
    "a zero-count category is valid when no real option has that outcome");
  assert.equal(validateUidl({...doc,reviewPlan:{...doc.reviewPlan,
    proposedFields:[{groupId:"r0",labelFieldKey:"label_0",typeFieldKey:"unknown"}]}}).ok,false);
});


test("compact review table preserves accessible choices and defers optional navigation", () => {
  const doc={
    contractVersion:"0.1.1",kind:"form",id:"eidos.compact-review",
    title:"Review source columns",purpose:"execute-command",
    command:{code:"review.source",inputVersion:"0.1.0"},
    fields:[
      {key:"choice",label:"原始列-安全<label>",semanticType:"review.choice",control:"select",
       required:true,initialValue:"__CREATE__",
       options:[{value:"__CREATE__",label:"Propose new field"},{value:"__IGNORE__",label:"Do not import"}],
       contextLink:{label:"Review enterprise field creation",route:"/review-field"}},
      {key:"original",label:"Source evidence",semanticType:"review.source",
       control:"text",required:false,readOnly:true,initialValue:"Original"}
    ],
    reviewGroups:[{id:"row-0",title:"原始列-安全<label>",summary:"S001",
      primaryFieldKey:"choice",detailFieldKeys:["original"],
      detailsLabel:"Inspect source",reviewStatus:{key:"proposed",label:"Proposed"}}],
    reviewTable:{presentation:"compact",columnLabels:{
      subject:"Source",evidence:"Evidence",decision:"Target",status:"Status"}},
    actions:[{id:"review",type:"submit",label:"Review",command:"review.source"}]
  };
  assert.equal(validateUidl(doc).ok,true,JSON.stringify(validateUidl(doc)));
  const html=renderToHtml(doc);
  assert.match(html,/data-eidos-review-table-presentation="compact"/);
  assert.match(html,/data-eidos-review-table-choice-label>原始列-安全&lt;label&gt;/);
  assert.match(html,/name="choice"/);
  assert.equal((html.match(/data-eidos-field-context-link/g) ?? []).length,1);
  const evidenceCell=html.match(/<td data-eidos-review-table-evidence[\s\S]*?<\/td>/)?.[0]??"";
  const choiceCell=html.match(/<td data-eidos-review-table-choice[\s\S]*?<\/td>/)?.[0]??"";
  assert.match(evidenceCell,/data-eidos-field-context-link/);
  assert.doesNotMatch(choiceCell,/data-eidos-field-context-link/);
  assert.match(eidosProductiveWorkbenchCss,/data-eidos-review-table-presentation="compact"/);
  const defaultHtml=renderToHtml({...doc,reviewTable:{
    columnLabels:doc.reviewTable.columnLabels}});
  assert.match(defaultHtml,/data-eidos-review-table-presentation="standard"/);
  assert.doesNotMatch(defaultHtml,/data-eidos-review-table-choice-label/);
  assert.equal(validateUidl({...doc,reviewTable:{...doc.reviewTable,
    presentation:"hidden"}}).ok,false);
});


test("workbench presentation keeps actual file, steps, counts and issues visible before choices",()=>{
  const document={
    contractVersion:"0.1.1",kind:"form",id:"workbench.review",title:"Review",
    purpose:"execute-command",command:{code:"review",inputVersion:"0.1.0"},
    fields:[{key:"choice",label:"Target",semanticType:"field.match",
      control:"select",required:true,initialValue:"pending",options:[
        {value:"pending",label:"Human decision required"},
        {value:"id.bank",label:"Approved bank field"}]}],
    reviewGroups:[{
      id:"bank-row",title:"开户银行",primaryFieldKey:"choice",detailFieldKeys:[],
      reviewStatus:{key:"attention",label:"Needs Human review"}
    }],
    reviewTask:{
      presentation:"workbench",
      subject:{title:"Source <bank>.xlsx",subtitle:"22 columns",statusLabel:"Source retained",
        facts:[{id:"rows",label:"Rows",value:"172"}]},
      steps:[{id:"file",label:"Choose file",state:"complete"},
        {id:"review",label:"Review",state:"current"}],
      metrics:[{id:"unmatched",label:"Unmatched",value:"3",tone:"warning"}],
      issuesTitle:"Needs attention",
      issues:[{id:"bank",title:"开户银行 ambiguous",focusGroupId:"bank-row",
        actionLabel:"Review source"}],
      helpText:"Not committed"
    },
    actions:[{id:"save",type:"submit",label:"Save",command:"review"}]
  };
  assert.equal(validateUidl(document).ok,true,JSON.stringify(validateUidl(document)));
  const html=renderToHtml(document);
  assert.match(html,/data-eidos-task-presentation="workbench"/);
  assert.doesNotMatch(html,/<details data-eidos-form-task-details>/);
  for(const selector of ["data-eidos-form-task-steps","data-eidos-form-task-context",
    "data-eidos-form-task-metrics","data-eidos-form-task-issues",
    'data-eidos-form-task-focus="bank-row"'])assert.ok(html.includes(selector),selector);
  assert.ok(html.indexOf("data-eidos-form-task-issues")<html.indexOf('data-eidos-form-fields'),
    "source blockers precede field decisions");
  assert.match(html,/Source &lt;bank&gt;.xlsx/);
  assert.doesNotMatch(html,/Source <bank>.xlsx/);
  assert.match(eidosProductiveWorkbenchCss,/data-eidos-task-presentation="workbench"/);
  assert.equal(validateUidl({...document,reviewTask:{...document.reviewTask,
    presentation:"nonexistent"}}).ok,false);
});
