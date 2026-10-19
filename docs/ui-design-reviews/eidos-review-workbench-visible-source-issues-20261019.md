# Eidos｜Human 真实文件摘要与问题前置的审核工作台（2026-10-19）

> 设计依据：直接阅读用户 BEX-01 V3 原型 #909 原始 HTML，原型在文件选择后依次展示步骤、文件摘要、四项字段统计、待处理问题卡片、四列审核表和独立操作区。先前合并的 Eidos #196 `decision-first` 模式将所有统计和问题一起折叠，虽减少首屏高度，但与用户要求的“100% 还原 V3”不一致。本项引入通用可选的 `reviewTask.presentation="workbench"`，不把合成数据写进框架，也不覆盖 #196。当前实施仅是原型一致性的一个环节，不是最终签收。

## 目标与完成条件

Human 打开导入或其他审核页面时，无须点击展开才能看到**真实**文件/来源、任务步骤、统计和待处理问题；待处理问题上的导航直接指向下方具体来源行。确认不存在需要处理的问题时，不伪造 warning 面板。保留 Eidos 原 `full` 与 `decision-first`，新 mode 必须明确 opt-in。

## 流程与步骤

页面顶部导航 → 页标题/说明 → 任务步骤 → 来源文件卡片（名称、保留状态和记录数量）→ 当前计数 → 必须人工判断的真实问题与直接核对按钮 → 同一页四列来源字段表及其原本的操作区。所有 issue 与 summary 字符串均来自 Host 真实读取数据；点“核对”使用已有 Eidos `data-eidos-form-task-focus` 焦点行为，不发起新的隐式 Host 写入。

## 导航与信息架构

`reviewTask.presentation` 扩展受控值 `workbench`。Eidos 是 UI 所有者，业务供应商字段和问题选择在 Platform。原有 source facts、issues、metrics/steps、helpText 一项也不删除，唯一改变是这些信息不再塞在一个折叠控件里。既有 route、submission、filter、reviewPlan/ReviewTable 均保持。

## 视觉与颜色

继承 Eidos 中性色 token/typography。步骤独立在上，文件摘要为有边框的卡片，四指标在桌面排成四列，问题以轻边框内容列表呈现，窄屏变为两列指标和流式任务；不复制 BEX HTML 固定配色。原型 1280px/390px 的最终行距和完整页面截图仍需业务层再验。

## 记忆与注意力

发生真实字段冲突时先看问题再选字段，减少漏审的风险；问题列表最多展示多少由真实业务契约决定，Eidos 不伪造数量或假设三条主体类型。原表格的字段选项、原值、Human draft、Recipe、来源证据和字段审批权限继续保持。

## 无障碍与跨年龄

原有 steps 是 ol、facts 是 dl、issues 是 ol，关注按钮是原生 button，状态有文字。1024px 以下的窄屏使用可换行的 steps，520px 以下卡片内边距变小，触摸仍继承原最小 44px。源文件名经 `esc` HTML 转义；未启用 workbench 的旧表单不受影响。

## 安全与数据修复

新 mode 只改变呈现结构，不触及企业授权、Host 命令、Schema 创建、银行歧义消除、主体类型、预检查、明确提交或审计。validateUidl 使用显式白名单检查 unknown modes fail closed。不能从 SUPPLIER 推断 ORGANIZATION，也不能将模拟的 172 行当真实客户资料。

## 证据与剩余问题

源码：`src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/renderers/html/index.ts`、`src/design-language/productive-workbench-css.ts`。回归：`tests/design-language/design-language.test.mjs` 针对 `workbench` 做合同/渲染/可见问题/HTML 转义/无隐式提交测试。适用 CI 和 Human UI Gate 必须通过，才允许 Eidos PR 合并；随后再在 Platform Draft #1054 选择性同步通用功能并启动真实 Host Chromium 桌面/390px 回归。用户逐项核对之前不得声称 V3 100% 完成。M01–M03 完成、M04 真实客户 OPEN、M05 真实提交 OPEN、M06 Human 视觉 OPEN，工程总进度 3/6。
