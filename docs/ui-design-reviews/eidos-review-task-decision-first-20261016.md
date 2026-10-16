# Eidos E6｜任务审核页：决策优先的可展开概览（2026-10-16）

> **本次准确 UI 源路径：** `src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/renderers/html/index.ts`、`src/design-language/productive-workbench-css.ts`。验证：`tests/design-language/design-language.test.mjs`。这只是 Eidos 的通用 **opt-in presentation**；Platform 后续由业务页面选择是否使用。修改不影响默认 full 任务概览。
>
> 源设计证据：用户提供的 BEX-01 V3 原型截图（集中审核标题→批次固定值→四列审核），实际隔离 Host Chromium #993 在 1280px 中任务概览与统计块将首行表格推到第一屏底部；并参考现有 Eidos Productive Design Language/Human UI Review Checklist、Eidos E3 Review Task 组件的真实结构。用户 Excel 与生产登录页面依旧未获得，不冒充 Human 最终验收。

## 目标与完成条件

通用 Eidos 审核页的首要任务是进行当前行级判断，不应默认先阅读多屏上下文。当 Host 明确请求 `reviewTask.presentation="decision-first"`，页面用**一行原生可展开摘要**容纳全部 supporting task context；独立的审核表和关键决策直接跟在摘要之后。可见摘要仍包含真实文件名与需要注意的问题数（若有），并且默认所有证据折叠而非被删除。旧 `full`/未设置的页面 DOM 与样式不变。

## 流程与步骤

用户打开字段审核页：第一眼看到已有任务身份和问题数量；点击/键盘激活摘要可展开完整步骤、原来源信息、指标、问题清单、原有定位按钮与帮助。再次折叠后继续本页逐字段审核。展开或折叠没有任何 Host 命令、映射值、权限变更。文件表本身维持独立审阅顺序。

## 导航与信息架构

原 `UidlFormReviewTaskV010` 增加 `presentation?: "full"|"decision-first"`，是组件级静态呈现策略，不是业务专用标题、按钮、字段语义。通用 renderer 以原生 `details/summary` 包裹原始 task context，仅在显式 opt-in 时生效。保留原 `data-eidos-form-task-* ` 属性和所有 issues focus id；任何布局选项无效均由 `validateUidl` 阻止，不允许静默隐藏资料。

## 视觉与颜色

摘要使用既有 Eidos token：border、surface、font compact、spacing；高度不少于 44px、支持长中文名称换行；需要注意的数量继承 warning 语义色但仍有文字。用户展开后才展示原 progress/metrics/facts/issue rows，组件不修改任何业务字段的 CSS、字体、表格格线或按钮。保留 full 模式的默认间距与行为。

## 记忆与注意力

保留需要随时追溯的原始文件名，额外证据放在同一页可展开而不跳走，降低工作记忆负担。逐行核对时不需滚动通过同一套大统计卡才到表格。统计和焦点定位依旧可取得，不能被删除或变为没有用户反馈的动作。并行批次中的未保存选择依旧由所属应用/Eidos 现有状态处理，不能把展开操作当成已保存。

## 无障碍与跨年龄

`<details><summary>` 可原生键盘操作并提供展开状态；`summary` 至少 44px 并有 `focus-visible` 轮廓。文件名长文本自动换行，概要不依赖颜色。展开时表格语义、行头、原生 select 和 focus link 不变；强缩放 400%、读屏器和真实触摸设备仍须另行人工实测。禁用脚本时也可展开，无模拟按钮。

## 安全与数据修复

这只是前端布局：Host 的身份、权限、审批、schema owner、source evidence、mapping command 和数据提交完全不受影响。容器内容仍由 esc 做 HTML 转义，`presentation` 严格白名单验证以免不受控页面隐去业务资料。展开的定位按钮保持原属 Eidos form 元素并沿原事件处理，不新增任意脚本或不受授权的操作。

## 证据与剩余问题

- 新 Eidos 设计语言测试验证：合法 opt-in、非法模式 fail closed、默认关闭原生 details、内部任务/指标/问题仍在 HTML、summary >=44px。
- Eidos 全套 CI + Human UI gate 通过后再选择性在 Platform 批次字段审核页面 opt-in。**只有真实隔离 Host Chromium + 用户截图复核，才可以声称该业务页面达到 V3 决策首屏；本 PR 不能代替 Platform 落地。**
- 正在并行的 BEX #989 实时状态与 PA05 不在本改动范围；不要覆盖 Platform 业务源码或主线部署。
