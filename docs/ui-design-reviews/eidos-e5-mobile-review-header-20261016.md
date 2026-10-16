# Eidos E5｜移动端核对卡片：来源与状态同行（2026-10-16）

> **准确变更 UI 路径：** `src/design-language/productive-workbench-css.ts`；设计检查回归为 `tests/design-language/design-language.test.mjs`。

> 通用设计语言的小范围升级，不增加业务专用皮肤或新命令。原始证据来自 **Platform #978 的真实隔离 Host /map Chromium 连续滚动**：1280px 桌面滚动层 3981px，390px 手机滚动层 9139px，包含 22 个来源字段。证据源：[GitHub Actions run 38895420715](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38895420715)、[artifact 12044215349](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38895420715/artifacts/12044215349)。这是合成 172×22 测试数据，**不是用户原 Excel，也不是授权 Railway 页面签收**。
>
> 参考既有设计权威：Eidos Human Experience Design Authority、Productive Design Language、Business Office Visual v0.2、Human UI Design Review Checklist；延续 [E2 四列表](eidos-e2-editable-review-table-20261016.md) 与 [E4 行内来源证据](eidos-e4-inline-review-evidence-20261016.md)。新需求仅来源于可复查的局部截图和原 CSS，不额外引用未读网络资料。

## 目标与完成条件

解决 Eidos E2 四列审核表在窄屏下每个来源列独占「来源字段→样本→映射选择→状态」四个竖向段落的问题。**只把来源字段名和只读状态合为卡片第一行**，源样本与可编辑选择仍独占完整宽度，显著减少跨多行长表时无必要的状态标签重复占行。接受条件：390px 中来源与状态处于相同视觉行、状态仍可读、控件 44px、全部 22 条映射/状态/交互不变；桌面不变。

## 流程与步骤

用户进入映射表或其他基于通用 ReviewTable 的核对任务，首先一眼识别字段及「已匹配／待新增／不导入／需要核对」状态，再沿同一卡片向下查看来源样本并修改选择。详情仍在样本格就地展开；「需要关注／全部字段」筛选及表单最后提交按钮不变。这个改动是**版式精简**，不是让用户绕过对 17 个待新增字段的集中审核；不自称解决手机 9,139px 长滚动的全部问题。

## 导航与信息架构

保留同一原生 `table`、`tbody[data-eidos-form-review-table-row]`、`th[scope=row]` 和四个 `td`；只在原有 `@media(max-width:700px)` 之内调整 CSS Grid 位置。字段名为第一行左列、状态为第一行右列；来源证据和目标选择横跨整行。没有新字段、菜单、锚点、按钮、第二套 mobile shell，也不改变阅读 DOM 顺序。

## 视觉与颜色

使用原 `--eidos-space-xs` 作为同行间隔、同一个 Eidos CSS ReviewTable 区域的 padding/border/type 及状态 tone。小屏卡片变成 `minmax(0,1fr) auto` 双列标题排版；状态 `nowrap`，标题可以换行，避免状态内容与字段标题重叠；证据和选择区域仍占全部宽度。隐藏状态自身多余的视觉 `data-heading:before` 标签，但状态文本和屏幕阅读器表格表头保留。700px 以上 CSS 不变。不额外引入 BEX 私有覆盖样式。

## 记忆与注意力

将只读状态就近贴到字段名，减少反复上下搜索「这条字段的状态是什么」的注意力成本。筛选继续改变视觉条目而不删除映射数据；原来源值、详细候选用途、当前 fieldId 完整保留。移动端仍能在展开样例之后回到当前目标选择，不要求跨页回忆。长页面批量审核仍需要额外 Human 观察，不能声称解决全部决策负担。

## 无障碍与跨年龄

CSS 不移动 DOM 节点，原四列表头、行表头、原生 select、details、focus-visible 保留。状态为只读文字，不被冒充为交互按钮；可编辑控件及证据展开保持 >=44px 触控目标。对 200%/400% 缩放、极长状态翻译、实际触摸设备和读屏器的真实验证仍需后续人工验收；本次 CSS 选用 `minmax(0,1fr)` 让长来源名换行并维持状态列的固有宽度。

## 安全与数据修复

**不触及** UIDL 数据模型、command code、Import Job、mapping decisions、Host 授权、提交和确认门禁、重复同名银行字段的稳定 ID、三条缺失主体类型的 Human 修改，亦不接管 PA05/治理/导入运行时。CSS 不会自动选择映射、不提交、不保存。Platform 仅在 Eidos 合并绿灯后选择性同步公共 CSS，并跑独立真实 Host Chromium；与用户原数据隔离。

## 证据与剩余问题

- 首先以 Eidos `tests/design-language/design-language.test.mjs` 对移动双列标题、状态定位、选择器完整宽度、44px 触控作合同回归，保持 `npm run release:check` 与 Human UI gate。
- Platform 后续再检验 390px 与 1280px 同一业务页、连续截图、所有 22 项映射和原审批动作；须对比实测高度变化，不能凭 CSS 推断。
- 用户实际登录后的 Railway /map **尚未取得**；用户原 Excel 和二个同名开户银行 field ID、主体类型样例真实值均未取得。CI 合格≠Human V3 签收。

## 补充：E5.1 短中文字段名不得因桌面列宽残留而强制换行

在 Platform #981 新真实 Host 390px 截图中，虽然来源与状态同行，但「往来名称」「主体类型」等较短中文字段名仍可能被不必要地压成两行。直接定位 Eidos 原桌面 `[data-eidos-form-review-table] th:first-child{width:20%}` 的 CSS 优先级高于旧手机 `tbody th{width:100%}`，且新 `tbody th[data-eidos-review-table-subject]` 未明确覆盖宽度。因此本轮以**更精确的通用移动选择器**加 `width:100%`，不改列格定义、不减少状态与表格内容、不引入产品 CSS。

目标是让正常中文业务字段名在剩余弹性网格轨道内自然显示，必要时仍能根据极长名称换行；保持状态右对齐、选择控件≥44px。原用户是否满意移动端密度需要独立 Human 签收；新代码及可测 390px 截图验证和回归记录在后续 Platform 同步 PR，不以 CSS 推断效果。

**准确 UI 源码路径：** `src/design-language/productive-workbench-css.ts`；`tests/design-language/design-language.test.mjs` 新增宽度约束，Eidos 自有 Design Gate、CI 需重新通过。本次八个审核域沿用同页既有记录，只针对已证实的字段名宽度问题做窄范围修正。
