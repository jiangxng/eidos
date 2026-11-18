# CV06 — 只读看板与 Eidos 多展示模式 Owner 评审（2026-11-18）

> 本次上游严格限于 `src/catalog-browser/contracts.ts`、`src/catalog-browser/render.ts`、`src/design-language/productive-workbench-css.ts`；不重写 Catalog、不新增 React 库或 Agent 调用。业务数据和权限由采用方 Host/Domain Owner 决定。自动化测试不是 Human 物理设备或独立读屏验收。

## 目标与完成条件

现有 Catalog 表格和全量授权图表已可显示；缺少真正分列的只读 Kanban。Eidos 允许业务 Owner 在同一已授权 Catalog Page 声明三种可选显示模式 `table/chart/board`；`board` 只分组**当前已授权分页记录**而非整库，必须精确分配每一个 `items[]` 到有限枚举组一次；`chart` 必须提供独立授权 `authorizedChart`，不能基于分页卡片求总数。新导航按 Host 提供的合法本地路由刷新，不改变数据授予、业务对象或明示业务状态。

## 流程与步骤

Human 在 Eidos 业务集合页当前筛选条件下选择「看板」→ Host/Domain Owner 重新授权、排序分页并分组自己的当前页记录 → Eidos 结构校验 `readOnlyKanban` 与 `table.rows`、`items[]` 完全一一对应 → 以同组状态列和原 Catalog 卡片显示 → 每个卡片沿原 Detail 按钮打开；用户点「表格」或「图表」就导航原 Owner 查询。看板不响应拖拽、拖放状态更新或任何隐式 Write。图表需要另一条独立 Host 聚合 READ。撤权/Feature 停用后 Host 不提供 Board 或 Chart，Eidos 不能自造或重复上次结果。

## 导航与信息架构

在现有 Table `presentationViews` 的单选路由里展示「表格／图表／看板」，避免混淆业务系统 `table.views`（全部/草稿/发布/个人视图）与展示方式。既有 `table.views` 和 server search / quickFilter / columnControls / pagination 仍可使用。显示模式只影响呈现：列表/看板保留当前页分页；图表有授权全量聚合时隐藏与其不同口径的当前页记录和分页。不存在新增业务导航或独立第二套列表框架。

## 视觉与颜色

只读 Kanban 的列使用 `--eidos-bg-subtle`、`--eidos-border`、`--eidos-radius-md` 和间距/字号 token。每列保留原 Catalog 卡片的信息密度、状态文案与详情按钮，不设可拖动 handle。展示切换按钮最小高度 44px，选中态使用 `--eidos-primary` 但同时以 `aria-current="page"` 表达；390px 以单列顺序呈现，消除水平溢出。只添加必要的 scoped CSS，不修改全局品牌颜色。

## 记忆与注意力

展示切换是短时路由意图；Host 构造路径保留原搜索、排序、列、页码和业务 scope。Eidos 不存储用户视图、不创建 Saved View、不缓存越权数据或推断受限字段。看板标题与说明明确写 `AUTHORIZED_CURRENT_PAGE` 的当前页范围，不能把同组卡片数量写成整库总数。可读文字和原卡片点击保持一致，减少用户在复杂查询后重新设置的负担。

## 无障碍与跨年龄

原生 `nav` 及按键可激活的 Eidos 按钮，选中态 `aria-current`，看板 `section/h2/h3` 具可读列标题与空列说明。无颜色独占信息、无隐藏拖动、无需手势。手机 390px 用单列并允许原生页面滚动，遵循系统文本缩放；用户可以使用既有原生 Detail 路由。此次测试仅验证 HTML、CSS 字节与协议，不冒充独立 NVDA/VoiceOver/物理手机通过。

## 安全与数据修复

`renderCatalogBrowserToHtml` 对 Board 核验版本、显示 Scope、最多 8 个合法组、最多 100 条**原页面 Item**、组 ID 不重复、无额外/重复/遗漏 ID，且 `table.rows` 数量和 `items` 一致。不允许把 `AUTHORIZED_ALL_MATCHING_ROWS` 冒充当前页真实列表；不相信任意外链的 `presentationViews`，只允许当前站点本地路由且正好选中一项。图表若没有 Owner 授权 `authorizedChart` 则直接拒绝显示。所有标签、描述、数据均在原 Escaper 下输出；没有 SQL、第三方 iframe、图表虚构度量、写入或持久化变更。

## 证据与剩余问题

新增 `tests/contracts/catalog-read-only-kanban.test.mjs` 验证原 Detail 与分页路由、选中提示、实体 HTML 转义、重复/越权/丢失组拒绝、无授权图表拒绝及响应式 CSS token。后续由 Platform 主仓业务 Owner 在真实 Dictionary 查询下完成归类、服务端集合和图表授权；采用前必须让此上游 PR 的 release-check、Human UI Review 和 protected-main 均 SUCCESS。未包含任意业务对象拖放变更、全量看板（需要独立服务器分组查询与跨页遍历）、商业生产 IAM/Human 签署。浏览器 1280px/390px 真点击和正式 Human 可用性须由采用方以后另行验收。
