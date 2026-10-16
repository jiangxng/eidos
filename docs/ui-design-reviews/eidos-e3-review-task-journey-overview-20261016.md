# Eidos E3｜可复用的审核任务上下文与可定位的问题清单（2026-10-16）

## 目标与完成条件

承接正式合并的 E1 #188（Review Queue 概览）和 E2 #189（Form 四列审核表格）。E3 解决“只有表格，没有明确当前任务/来源对象/进度/要先解决的问题”的通用 Experience 缺口。由 owning Host 提供全部可信值，通过可选的 `reviewTask` 契约声明当前对象、任务步骤、指标、问题项目和说明文本。Eidos **只负责 Human 展示和把问题按钮定位到已有 Form 审核组**，不能从 Excel 或业务字段推断状态，更不能替代业务保存。

## 流程与步骤

用户在已有 Form 页面首先辨认当前工作对象与步骤，再看到 Host 提供的有意义指标和需处理问题。点击某个问题的“查看/处理”会自动显示并聚焦该问题已声明的审核行，即使该行原本被“只看需关注”筛选隐藏，也通过已有“全部字段”恢复而非擅自变更映射。Human 仍使用原表格主 select 做明确决定，通过已有 Form submit + Host authorization 校验/保存；问题按钮不直接提交/修正数据。

## 导航与信息架构

不新增 Workbench 一级导航，不制造 Eidos 私有 Import Job 管理页。Form `reviewTask.subject` 只表达已经确定并获授权的任务对象；`reviewTask.steps` 最多 6 项且恰有 1 项 current；`issues[].focusGroupId` 必须精确指向当前 Form 的 `reviewGroups[].id`。Eidos App Host 挂载器只做本地 UI 定位和必要的 All 视图切换，不触发新请求或导航到未知 URL。

## 视觉与颜色

遵循 Eidos Experience Architecture Constitution、Productive Design Language 4px 节奏和 Business Office Visual v0.2：轻量步骤提示、白色当前对象卡片、安静的四列统计、一个集中问题列表和就近的上下文动作。状态色只在真实 warning/danger/positive 值出现时呈现，不照搬用户原型的 HTML/品牌资产，不把四个统计卡片硬编码为全部应用的必选布局。新通用样式只位于 Eidos `src/design-language/productive-workbench-css.ts`，不下沉到 Plugin CSS。

## 记忆与注意力

来源对象、行数/列数等业务信息直接放在最初决策前，问题项可直接聚焦目标行，避免跨屏查找。“筛选→看全部→回到所需字段”只改变可视状态，不丢失 Form 控件的输入值。Help Text 必须由 Host 以真实保存语义提供；Eidos 不默认声明“自动保存/已完成”，也不在浏览器 localStorage 伪造持久的跨页 Recipe。

## 无障碍与跨年龄

使用原生 `<ol>` 表达步骤与问题、明确可访问的按钮文本、已有表格 Form 控件和焦点；触屏小宽度将问题动作堆叠为不低于 44px 目标。当前步骤不仅靠颜色表示；问题状态与操作文案均为文本。移动表格恢复 All 后的目标选择会获得焦点；自动测试只证明契约，不代替实机/真人签收。

## 安全与数据修复

`reviewTask` 的所有元素必须通过严格 UIDL 验证（标题、事实、步骤最多数、唯一 current、指标的唯一 ID、问题的唯一 ID、group ID 存在与 Action 文本约束），任何非法目标都不能经渲染器发出动作。所有用户原值 HTML 转义。问题按钮不包含 Host Command、不会改变真实业务对象状态；真正的字段映射、身份判定、恢复、最终确认和审计仍由 Platform/Host 独立负责。原始 Excel 在 Eidos 不落库。

## 证据与剩余问题

涉及 `src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/runtime/render-model.ts`、`src/renderers/html/index.ts`、`src/app-host/page-controller.ts`、`src/design-language/productive-workbench-css.ts` 和 `tests/contracts/runtime.test.mjs`。要求 Eidos release:check 和 Human UI Gate 以最后 HEAD 通过，保留 E1/E2 的已有 Test。下游 Platform 单独接入 `apps/data-import/page.ts`，只能用真实授权 Import Job 的来源文件、统计、问题和步骤，不能凭样例填写固定 172/22/3；真实用户 `/map` 的截图与端到端签收属于后续 E4，不由 Eidos 合并替代。
