# Eidos E6｜四列决策审核的实时方案预览（2026-10-16）

> **本次 UI 源码路径：** `src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/runtime/render-model.ts`、`src/renderers/html/index.ts`、`src/app-host/page-controller.ts`、`src/design-language/productive-workbench-css.ts`；回归测试 `tests/design-language/design-language.test.mjs`。来自用户 2026-10-16 的 V3 供应商字段审核原型和 [Platform Draft #909](https://github.com/jiangxng/EVO-App-Platform/pull/909)。项目原规范 Eidos Human UI Design Review Checklist / Productive Design Language / E2–E5 决策表均沿用，不另造业务私有控件。

## 目标与完成条件

为通用 Eidos `reviewTable` 新增可选的 `reviewPlan`，在正式确认动作之前，向用户展示正在编辑的多条选择如何分为「拟创建／复用／忽略／待决策」并逐行列出来源和 Human 选择。随 native select 和相关名称、类型输入变化更新，**仅是浏览器本地预览**。不写回 Host、不自动审批企业 Schema、不混淆已持久化数据。Host 仍必须独立验证每一个选择，明确确认才写入。

## 流程与步骤

业务用户先看来源证据、目标系统字段及状态；按当前选择看到审核表下方的提案清单和分组计数，再决定是否继续修改或提交现有带确认的业务 command。预览从真实表单选择器读取，不复制另外一组可编辑输入；决策表和提交数据继续使用同一 field key。名称和类型输入改变时方案同步变化，最后确认仍为原业务按钮。

## 导航与信息架构

预览属于当前四列审核页的**决策确认区**，放在审核表之后、最后提交动作之前，无新顶层页面、抽屉或导航。应用定义状态类别与具体表单键的对应关系，Eidos 仅验证和呈现。所有状态类别必须完全覆盖本审核表可能出现的状态，杜绝隐藏未决策的项目；分类项唯一且数量有限。

## 视觉与颜色

使用现有 Eidos spacing/type/border/color token，清楚分出分组数量、逐行名称及辅助信息。标题、说明和只读警示文字完整保留。两列以上的桌面布局会自适应，390px 则自然变单列，避免横向滚动。绝不在本 PR 写 Platform/供应商专用 CSS，不让预览视觉压过实际原四列证据。

## 记忆与注意力

审核者无需记住「这 20 个字段到底选了哪些」并回到每一行重新检查：决策总览汇总当下选择。名称与类型也显示在对应拟建项旁边。筛选为「需要关注」时，预览仍显示**全部源列**，避免被过滤项目在确认中隐形。计数仅表示本地草稿状态，不标注已保存或已获批。

## 无障碍与跨年龄

使用语义 section/header/dl/ul，计数 `aria-live=polite`；键盘保持现有 select/input 的自然焦点，计划区只读不抢焦点，所有状态以文字表达。用户切换选择后仅更新文本节点，避免 HTML 插入与注入风险。400% 缩放、真实触摸及独立读屏器仍须用户后续视觉/无障碍签收。

## 安全与数据修复

所有分类值必须来自 `reviewGroups.statusByChoice` 的合法 option、无遗漏、无重复；拟建字段标签和类型必须引用同一 group 内可编辑的真实 field key，禁止跨行读取或伪造 Host 字段。只用 `textContent`、`createElement`、`replaceChildren`，无网络请求、无保存命令、无 Schema mutation。原批量创建/排他映射/批准门禁/Excel 原始内容保持不变。

## 证据与剩余问题

Eidos `npm run release:check`、UI gate、真实 Platform Host 172×22 desktop/390px Chromium 均需在准确 PR HEAD 通过。当前 Eidos 测试包含状态覆盖、错误来源字段、危险 HTML 转义。后续 Platform 应只同步该通用能力并配置四种决策标签/label/type 字段引用，核对实际更新。用户真实 Excel、Railway 登录现场、Human V3 签收依然未完成；本预览**不是**已生效 Schema 变更、也不能替代后端审批。

## E6.1｜零项目类别的完整性修正（2026-10-16）

准确源码改动：`src/runtime/validate.ts`、`tests/design-language/design-language.test.mjs`。实际 Host 供应商批次可能没有任何真实「复用已有字段」候选，但 UI 必须允许显示「复用 0 项」，不能因此让整个审批页无法打开。分类 `statusKeys:[]` 只有在该类真实可达状态为零时允许；对任何可达状态仍强制**恰好一个**归类，其他跨行字段引用校验和原生提交/权限均不变。零类别仍保留业务标签和计数，避免用户误判已经有可用目标。此变更不修改 Host 命令或任何业务数据、没有新的按钮和风险性行为。需重新通过 Eidos CI 和 Human 门禁，再在 Platform 真实 Host 浏览器测试中验收。
