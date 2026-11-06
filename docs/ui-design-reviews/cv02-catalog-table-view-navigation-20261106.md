# CV-02 Catalog Browser 可选视图导航：设计与验收（2026-11-06）

**阶段：CODE_REVIEW；CI / 真实浏览器 / 390px / Human 尚待。** Eidos owner 基线 `a6dc71a3390b5c22c4b4c91581866f8aa540b038`。关联 Platform 的 `COLLECTION-VIEW-EIDOS-PLATFORM-ADOPTION-20261106.md` 与 CV-00～07 计划。此变更发生在 **Eidos 原项目**，不建立第二个列表框架，也不直接变更 Platform vendor。

## 目标与 Page archetype

为 Eidos 现有 `CatalogBrowserV010.table` 增添**可选、声明式、受业务 owner/Host 控制的视图导航**。场景：用户在已有供应商表格中切换“全部供应商 / 我的供应商”，同时保留已有搜索、排序、分页、详情路由。未配置 views 时页面保持原样。属于既有 collection/list 页面模式，不创建新的 shell、数据查询、SavedView 存储或通用 ACL。

## 功能、布局与颜色

- 在表格上方、服务器搜索之前呈现一组有明确名称的视图导航操作；通过 Eidos 已存在的 `actionButton` 和 `data-eidos-route` 使用 Host 的现有导航。当前视图标记 `aria-current="page"`，没有新 CSS/token。
- `views` 为可选数组，每项 `id/label/route/selected`。验证非空名称、唯一 ID、至多一个 selected、受限本地绝对路径；最大 12 项。不能让外部链接或业务数据改变 Host 路由权威。
- 当前视图选中只是**呈现状态**；Eidos 不判断用户是否能打开该视图，也不更改它的数据权限。实际候选必须由 Host/业务插件根据当前 Principal、企业上下文、有效 Feature 和权限筛好后传入。
- 沿用 Eidos 自身的 Business Office 视觉、导航、按钮与多端规则；不复制 V3 原型、无私有颜色或第二套 UI。对 390px 真实 Chromium 和键盘/读屏的 Human 证据待取得，不能声称已完成。

## 完整任务和失败恢复

| 入口与操作 | 预期结果 | 负例 / 恢复 |
| --- | --- | --- |
| 进入已授权的 Supplier List，点击“我的供应商” | Host 切换到授权视图并标记 selected | 猜测无权 route，Host 仍须拒绝 |
| 在视图里搜索、排序、分页，打开详情 | 原服务器查询和页路由继续生效，返回时由 Host 恢复上下文 | 查询无权/失败不由 Eidos 伪造数据或静默覆盖 |
| 切企业、停用插件 | Host 按当前上下文更新视图候选与数据 | 旧 Context 的视图不残留 |
| 旧 CatalogBrowser 不配置 views | 与改动前的表格/卡片 UI 完全兼容 | 没有空视图栏 |
| 恶意 route、重复 ID、多个 selected | 明确拒绝渲染错误状态 | 不允许注入脚本、外部 URL 或隐藏授权边界 |

## 代码与机器验收

变更限 `src/catalog-browser/contracts.ts`、`render.ts` 和 `tests/contracts/catalog-browser-table.test.mjs`，复用原接口。测试覆盖“有授权的视图选项与搜索/表格共存、选中状态、恶意 route、重复 ID、双 selected、旧页面兼容”；CI 成功不等于完整 CV-02 Human PASS。

**下一步：** Platform 侧采用经验证的 Eidos owner commit/pin，输出受治理的真实 view routes，并以中文桌面+390px 在真实 Host 执行入口→视图→查询→详情→返回→权限拒绝及切企业。当前 Eidos 独立 PR 不承担业务 READ 查询、代理写入、共享视图持久化或按需分析；这些仍归对应 CV-01/CV-03/CV-05 owners。