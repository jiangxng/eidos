# Eidos E6｜审核选择即时状态与筛选反馈（2026-10-16）

> **真实需求：** 用户要求 EVO BEX-01 **按原 V3 高保真原型实现功能**，而不只是多一枚按钮或修正间距。原型：[Platform #909](https://github.com/jiangxng/EVO-App-Platform/pull/909) 的 `BEX-01-IMPORT-V3-IN-CONTEXT-HIGH-FIDELITY-20261015.html`，`changed()`、`fillMappings()`、`render()` 在选项改动后更新行状态、筛选和统计。此次只将这种通用的**本地呈现反馈**纳入 Eidos，不复制业务命令、不补 V3 专用 JS。最初业务场景 [Platform #984](https://github.com/jiangxng/EVO-App-Platform/pull/984) 为真实隔离 Host 的四列集中字段审核。
>
> **修改 UI 的准确路径：** `src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/renderers/html/index.ts`、`src/app-host/page-controller.ts`。协议回归位于 `tests/contracts/runtime.test.mjs`。该模式必须通用、 opt-in，无默认改变现有应用的任何字段状态逻辑。

## 目标与完成条件

让字段审核人员在原有四列表格选择另一个真实目标时，立即看见该行反馈（例如待新增→需要校对、不导入），并同步计算筛选可见数；同 ID 的状态统计可同步变更。**“待新增”仍是建议，“选择字段”仍不等于“保存、批准新建或导入”**。条件：选项来自已签名业务 UIDL 的实际 `select.options`；Eidos 不能猜测业务状态；原字段值、独立 Host 真实命令和授权保持不变。

## 流程与步骤

以前：选择字段→页面状态仍显示旧状态→用户需提交刷新才能看到正确分类。现在：选择下拉的既有选项→从业务页面 opt-in 的 `statusByChoice` 对应查出显示状态→更新原行状态与同屏筛选/计数；后续确认按钮仍执行原 `UidlAction` / Host。选择冲突、必填或无权限仍由现有 Host 校验；视图提示不替代正式写入成功回执。

## 导航与信息架构

保留 `UidlFormReviewGroupV010`、`UidlFormReviewTableV010`、`renderToHtml`、`page-controller` 的原表单结构。不加新导航或单独审批弹窗。状态声明放在来源行的 `statusByChoice`，每个键与既有 `primaryFieldKey` 的 select option value 严格关联；前台只传回已有字段映射值，绝不生成新业务字段或携带伪造动作。

## 视觉与颜色

不新增颜色或 CSS：继续使用原状态单元格与 `data-tone` (neutral / warning / positive)，文字是独立的状态说明。更新只修改 `textContent`、`data-eidos-review-table-status-key` 和原 tone，不添加额外 DOM 行、不隐藏原来源证据。保留桌面原四列和手机现有卡片，Eidos token、原有 44px 控件与键盘焦点不变。

## 记忆与注意力

状态就近反馈，用户无需回到上一个页面查证本次选择是否已被页面接受。筛选本身依旧只设置原行的可见性（不 disable、不清空任何隐藏行的 select）；变动后的各状态统计只影响业务方 ID 与状态 key 显式匹配的统计块。回退选择沿用当前保留值，错误处理/中断仍由原 Host Job/Recipe 持久化完成，不能把本地反馈误解成已保存。

## 无障碍与跨年龄

原 `table` 原生表头、可读中文状态、select 的键盘 change 事件和 aria-live 筛选计数继续工作。状态不只靠颜色；无焦点跳转或额外手势。响应式完全复用现有 Eidos；读屏器真实现场、200%/400% 缩放与复杂辅助技术仍需后续 Human 验收，CI 只校验合同和原浏览器路径。

## 安全与数据修复

新属性必须为已存在的 `select` 实际选项值，校验状态 key 格式、长度、标签、允许的 tone 和有限数量，不接收未知动态字段，HTML JSON 属性一律转义。浏览器选项改变不会触发任何 Host `execute`、提交、批次固定值写入或构造非授权值；字段映射的排他约束与服务器确认保持原样。不得擅自清除原 Excel、企业扩展字段、审批状态或审计。不同业务页面未选择 opt-in 时，Eidos 继续按原静态状态工作。

## 证据与剩余问题

- Eidos 合同测试：验证 opt-in 只接受真实 `select.option`，状态 key 合法，异常参数拒绝；HTML 业务字符串转义；`createActionRequest` 提交原动作和值，不受 UI 状态影响。
- CI 必须通过 `npm run release:check`、Human UI 设计门禁；随后由 Platform **只同步这几处公共源文件**并在实际隔离 Host 172×22 与手机 390px 上验证选择后状态、筛选及统计同步。未实际验证之前不得宣称用户 V3 签收。
- Eidos 只负责 UI 反馈框架，Host owner 负责真正的数据更新和无损恢复；批次固定值可编辑、同屏审批计划和用户真实 XLSX/生产账号仍是 Platform 另行验收事项。
