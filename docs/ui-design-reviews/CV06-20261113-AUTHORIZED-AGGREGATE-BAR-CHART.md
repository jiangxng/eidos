# CV-06 受治理聚合柱状图 · Eidos Owner UI 评审（2026-11-13）

> Eidos 上游开发分支 `feat/cv06-catalog-authorized-aggregate-bars-20261113`；基线 `main@127150c30193b57b38d1d9cc62443ddfa90e2349`。变更文件：`src/catalog-browser/contracts.ts`、`src/catalog-browser/render.ts`、`src/catalog-browser/authorized-bars.ts`、`src/catalog-browser/index.ts`、`src/design-language/productive-workbench-css.ts`。本记录属于开发与自动化证据，**不等于 Human 真实登录、物理移动设备、无障碍专家签收**。

## 目标与完成条件

在现有 Eidos Catalog Browser 页面中，按需用业务 Owner 经过 Host 授权的聚合结果呈现一个可理解的柱状图，并确保 390px 不溢出、被抑制的少量记录**不能由当前页推算重构**。第一业务接入为 EVO Business Dictionary `dictionary.count.by-state`，具有 `DRAFT/PUBLISHED` 维度、度量单位、`asOf` 和合法全集查询声明。完成边界仅为首个只读图；Eidos `kanban` 仍为 planned，不给拖拽或写入权限。

## 流程与步骤

Human 在当前已授权列表中看到可选统计 → Eidos 使用 Host/Owner 下发的有限 `authorizedChart` 模型 → 仅校验结构、显示已公开的精确桶与受隐藏桶 → 保留完整原 Catalog Browser 表格/搜索/排序/分页/详情返回。没有图表时不添加空容器。图表没有 Ajax、SQL、Agent 发送和异步重算；企业切换或撤权后的授权复核由 Host 每次刷新页面执行。数据异常时 fail-closed，不调用未经验证的客户端聚合算法。

## 导航与信息架构

不新建仪表盘框架、不添加第二条左侧菜单或顶层应用；利用 `CatalogBrowserV010.authorizedChart?` 挂在原集合视图内部。该字段完全可选，原 `renderCatalogBrowserToHtml` 兼容无图表页面；原系统/个人 View 的导航、状态与 URI 均不修改。图表作为阅读区，不承担发布字典、保存视图、全量导出、Kanban 修改等行为。

## 视觉与颜色

柱状条使用 Eidos 现有 `--eidos-primary`、背景和边框 token，百分比只按**已授权且未抑制的桶**中最大值归一化；未获披露的桶不渲染比例或数据宽度。条宽具有确定数值输入并由 Renderer 计算后转义；颜色不代表发布权限或业务财务含义。桌面 3 列呈现维度、图条、数量，390px 改两列文字、图条独占下一行，`min-width:0` 防止横向溢出。主图和原业务列表共享一个 Page，不借 CSS 修改任何数据集合。

## 记忆与注意力

一眼呈现“草稿与已发布”的已授权状态对比，`totalLabel`、`asOfLabel` 和状态文字都可直接复制/阅读；没有自动刷新、颜色闪动、动态叠层或无限滚动。受抑制的小样本显示业务提供的“少于 3 条”等替代文案，不显示推测的具体数字。空值被清楚区分为零与已隐藏，避免误导。

## 无障碍与跨年龄

原生 `section/aria-labelledby/h2/dl/ul/li` 输出可读文字和计数；柱条 `aria-hidden=true`，视障用户无需“读出颜色”才能获得事实。390px 自动断行，系统字号沿用 Eidos typography tokens，禁用 JS 也能展示服务器已经生成的内容。未宣称真实 VoiceOver/TalkBack 或屏幕阅读器独立签收；后续接入 Platform 需真实 Chromium 390px 与 Human 操作反馈。无拖拽或高频动作。

## 安全与数据修复

Eidos **从不拥有业务事实或授权**。`assertAuthorizedAggregateBarsV010` 对 `scope=AUTHORIZED_ALL_MATCHING_ROWS`、有限桶、无重复 key、非负安全整数、唯一合法度量 ID、完整 ISO asOf、总数与桶相加一致性执行确定性 fail-closed；若任何桶被隐藏，total 必须 null 且整体状态 SUPPRESSED，避免通过减法复原。名称/标签均 HTML escape、没有任意可执行 HTML、无脚本 eval/Canvas 远端数据源。上游能力不得绕过 Owner 权限、字段安全或换企业重授权。没有数据库迁移与旧数据覆盖；回滚只撤回可选字段/受控采用，不改基础列表。

## 证据与剩余问题

真实上游源码核查：Eidos `src/visualization/{contracts,series}.ts` 只有语义模式和点转换，`capabilities/visualization/bar-chart/CAPABILITY.md`、`capabilities/data/kanban/CAPABILITY.md` maturity=planned；`renderers/echarts-adapter/RENDERER.md` 只是候选说明，不能把这三项冒充生产图表组件。选定 Eidos 原生轻量纯静态 renderer，避免追加 ECharts 依赖/第二套渲染 Host。本 PR `tests/contracts/catalog-authorized-bars.test.mjs` 检查正确总数、抑制、不可信标签转义、恶意 scope/非法日期/负数/超 12 桶拒绝；最终 CI/PR 结果以原始 Actions 为准。

Platform 采用将从固定 upstream merge SHA 定向更新 Eidos vendored contract、render、CSS 与新组件文件，然后通过原 Dictionary Host READ 接入图表；不会覆盖 Platform 持续独立演进的 Eidos 其他特性。**剩余问题**：真实授权 Chart 的浏览器同权、390px 截图、Agent 结果口径、Kanban 合法分组、Owner/Human 实际验收；CV03 SAVE、CV04 正式后台 Export 不因 Eidos 图形而开放。
