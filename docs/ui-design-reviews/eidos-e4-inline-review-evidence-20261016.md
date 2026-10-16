# Eidos E4｜通用审核表格的行内证据展开（2026-10-16）

> Eidos 通用设计语言的单点升级。实际 UI 源码：`src/renderers/html/index.ts`、`src/design-language/productive-workbench-css.ts`；合同测试：`tests/contracts/runtime.test.mjs`。EVO BEX-01 #973 的隔离真实 Host 截图已经证明，每个来源列在既有四列表格下方额外占一整行「查看来源及候选字段用途」，即使折叠也占 45px 左右。对 22 列数据形成大量虚假分隔和垂直滚动成本。通用问题属 Eidos，不能在 Platform 用 BEX 私有 CSS 遮住。
>
> 设计依据：Eidos Human Experience Design Authority、Productive Design Language、Business Office Visual v0.2、Human UI Design Review Checklist。此 PR 只改变通用 E2 ReviewTable 的 **HTML 内容组织与局部 CSS**，不是供应商字段治理、Import Job/Agent、Host 保存/授权、SQL 或产品导航。

## 目标与完成条件

让需要审阅 10–30 行数据的普通业务人员在同一行见到「来源｜证据｜选择｜状态」，并在来源证据旁就近按需展开更多样例/同名候选用途。关闭状态**不额外占一整行**。对各业务通用的字段选择仍有唯一控件和同一 `map_N` key；不改变 UIDL `reviewGroups`/`reviewTable` 类型和提交指令。

## 流程与步骤

原流程：滚过四列来源行 → 还需滚过下一整行的折叠详情标题 → 下一个来源行。新流程：来源样例格同时包含原样例文本与原生 `details/summary`；关闭后用户直接看到下一个来源行，必要时点击同格「查看更多」而不是跨业务页面。展开只增高**该来源行**，不会创建新的逻辑行或表单实例。预检查/批准/导入操作完全不变；本更改没有新命令和副作用。

## 导航与信息架构

所有信息留在宿主 `form[data-eidos-id]` 与既有 `table[data-eidos-form-review-table]`；`tbody[data-eidos-form-review-table-row]` 的 ID 和状态筛选由现有 E2/E3 控制器继续使用，无额外分组、路由、菜单或 Tool。证据展开位置与做决策所需的源值相邻，属于 Eidos 中性的任务操作；字段具体业务标签由 Platform owner 给出。

## 视觉与颜色

在 `data-eidos-review-table-evidence` 单元格内加入 `data-eidos-review-table-sample` 和已有原生 `details`。删除原第二行容器和无效的详情行 CSS。所有文字尺寸、primary 链接色、focus ring、padding 与栅格来自当前 Eidos token；展开详情变单列，以免表格证据格约 25% 宽度内把两只只读表单挤坏。桌面与移动端共享一套 HTML，不造第二套组件或 BEX-only 皮肤。

## 记忆与注意力

折叠只改变阅读负担，不删除任何原始值或待决条件；详情 `initialValue`、字段 ID、状态与已保存选择全不变。原来的 `group.defaultExpanded` 仍让重要冲突首次显示出来；其他详情可逐行看，不必记住前一页或额外滚过 22 个占位条。状态筛选仍只隐藏或显示同一 `tbody`，不改字段选择。

## 无障碍与跨年龄

使用原生 `details/summary` 键盘、状态与可见性；原 `summary:focus-visible` 保留，手机 `summary` 仍不少于 44px，可触摸。四列 `th/td` 和 `data-heading` 响应式卡片语义保留；阅读顺序变「源列→示例→展开证据→选择→状态」，与用户任务一致。未知的 iOS/Safari、读屏器和 200%/400% 人体工学不能仅由 unit test 签收，需在 Platform 集成回归中分别补充。

## 安全与数据修复

渲染器依旧对业务标题、来源样例、选项、状态及详情使用 `esc()` 转义；`renderField()` 对原字段值唯一渲染。UIDL validator 对未知/重复 Field Key、同名目标选择排他规则、Host command 的约束原样存在。尤其不能因为折叠而推断企业关系、修改客户字段、自动选同名银行、自动保存草稿或绕过用户明确审批。没有更改导入执行器/认证/后端。

## 证据与剩余问题

- E4 旧真实 Host 证据：[Platform #966 Chromium](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38842754856)；拟整改业务可读性来源：[Platform #973](https://github.com/jiangxng/EVO-App-Platform/pull/973)，新截图可检查多行状态下的详情区域。
- `tests/contracts/runtime.test.mjs` 新增检查：拥有 `detailFieldKeys` 的 ReviewTable 可以经 UIDL 校验，详情 DOM 在证据单元格内，消除第二行标记，同一 `map_N`、只读 `sourceEvidence_N` 各恰好一次，`createActionRequest` 仍使用原 Host 命令。原 E1/E2/E3 测试必须通过。
- 尚待 Platform owner 同步正式 Eidos 公共源码到已 pin 的 `vendor/eidos`，再在现有真实隔离 Host Chromium 中看桌面与 390px 图像效果。**Eidos CI/源码审查不会代替真实线上用户视觉签收。**
