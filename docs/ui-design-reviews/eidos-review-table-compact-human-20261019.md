# Eidos 通用 ReviewTable｜紧凑 Human 字段决策行（2026-10-19）

> **唯一目标：** 通用 Eidos 表单的四列审核表可按应用选择 `reviewTable.presentation="compact"`，使每行接近真实 V3 高保真目标的“来源—示例—决策—状态”紧凑密度。参考来源为用户提供的 BEX-01 V3 图 S01（2026-10-16，原图直接阅读）与现有实际图 S02（重复字段名和每行导航占用高度）。用户当前提出 100% 还原 V3；该通用原语只是其中的一个工程子项，不是业务签收。

## 目标与完成条件

真实 ReviewTable 每一行已有首列来源名称，却在目标选择栏再次显示同一个来源名，还把长的 contextLink 固定占在选择框下方。应用可以显式选择 compact：只在可视层省略重复文字，仍保留绑定 label 和可发现的原有字段创建导航。默认 standard DOM/UI 不变。本组件不理解“供应商”“银行”“Schema”。

## 流程与步骤

在现有 ReviewTable 四列中就地审查来源样本、选择目标、查看状态；如需创建字段或检查来源，展开同行的来源详情，即可找到原有 contextLink、来源样本及其他附加字段。新的密度模式不会提交更改、发起 Host 操作或切换业务路由。没有 detailFieldKeys 的行仍把 contextLink 留在选择框旁，防止入口丢失。

## 导航与信息架构

`reviewTable.presentation?: "standard"|"compact"` 属于通用 Eidos Uidl 表单呈现契约。选择与源码 field key、选项值、statusByChoice、reviewPlan、filter 均不变。ContextLink 在 compact 模式移入同一行的 accessible native details，依然保留 `data-eidos-field-context-link` 和完整导航 route；其他模式原路径不变。

## 视觉与颜色

CSS 以已存在的 Eidos token 驱动：减少选择栏的视觉重复、统一小间距，使单行优先呈现 select 和源证据；保留状态文字和 warning / positive 语义色。工具栏在 compact 模式把总数居左，显示筛选居右，方便用户对应 V3 的视觉阅读顺序。不复制 Platform 原型配色，也不改变其他页面默认密度。

## 记忆与注意力

决策者无需在第 1 和第 3 列反复读同一字段名；可展开的来源证据与“为本列创建扩展字段”保留当前 source row 邻近关系。筛选、草稿、状态、审核预览继续复用原有功能，未关闭和未批准的候选不会误标为已处理。

## 无障碍与跨年龄

被视觉隐藏的是绑定 field label 的一段 `<span>`，而非 `aria-hidden` 或 display:none，辅助技术和原生 select 的 accessible name 不丢失。Native details / summary 保持键盘操作，移动端 select 和证据按钮保持最小 44px 目标，换行的字段名不会覆盖状态。未启用 compact 的使用者完全不受影响。

## 安全与数据修复

严格白名单防止未知 `presentation` 值被默默接收；所有文字经原有 esc 转义。ContextLink 仍为原 Host 允许的 typed route，而不是 HTML 注入或直接发起 Schema 操作。没有擅自忽略 Excel 列、生成新的字段 ID、修改用户输入、业务 Schema、导入 Job 或正式数据提交。通用变更只在 Eidos owner 仓库；应用自行 opt-in 后才生效。

## 证据与剩余问题

- 源文件：`src/runtime/{contracts,validate,render-model}.ts`、`src/renderers/html/index.ts`、`src/design-language/productive-workbench-css.ts`。
- 回归：`tests/design-language/design-language.test.mjs` 验证 compact 模式通过严格校验、默认 standard 不受影响、下拉保留原 field key、HTML 转义、独立导航按钮仍只有一个且移入 evidence disclosure。
- 精确 HEAD TypeScript/Node tests 和 Human UI CI 仍需 PASS；Eidos owner PR 合并后，Platform 再选择性 forward-port，保留 Host overlays；最终 1280/390px 的实际 Host 截图、用户 Human 对照必须另行验收。
