# CV-02 — Eidos Catalog 多组快捷筛选设计检查（2026-11-18）

> 本次审查文件对应的真实 UI 改动：`src/design-language/productive-workbench-css.ts`、`src/catalog-browser/render.ts`；契约在 `src/catalog-browser/contracts.ts`。沿用 Eidos Human UI Review Checklist v1.0 / Experience Architecture / Productive Design Language / Navigation / Mobile Design Language 的现行约束。只证明可复用 UI 工程，不代替真人/屏幕阅读器签收。

## 目标与完成条件

针对 Counterparty 中有权使用的企业/个人主体，业务用户可以同时看到两个彼此独立的筛选维度：“状态”和“主体类型”，不必进入技术设置或记忆上一轮选择。切任意组后 Owner 服务器重新查询并 AND 合并已选条件，列表结果、总数与分页遵循真实授权。Eidos 仅渲染行动按钮，不掌管业务数据与权限。

## 流程与步骤

用户在既有“我的供应商”目录搜索“香港”→点状态“启用”→点主体类型“企业”→收到有权数据；再选“个人”时保留状态/搜索而只替换主体类型。每组必须正好有一个已选项，包含“全部”以便清除该维度；未知条件失败不显示幻觉数据。没有新向导、额外确认、表内客户端筛选或擅自 SAVE。网络重查与已有返回链路保持不变。

## 导航与信息架构

两个 Group 都直接位于 Eidos Catalog 原有的搜索/表格之间，并沿用导航 Action 机制；不同组使用唯一的 `quick-filter-<group>-<option>` Action ID 避免同名“all”。业务 Owner 提供完整、合法的相对 URL，Eidos 先验证是本地路径，真实 Host/Domain 重新鉴权；不新增菜单、跨域出口或独立列表框架。旧单组 `quickFilters` 保持原样，新 `quickFilterGroups` 不能与旧字段同时给出。

## 视觉与颜色

在原 `src/design-language/productive-workbench-css.ts` 增加统一 `[data-eidos-catalog-quick-filters]` 的 wrap/spacing/selected/focus 样式，复用 `--eidos-space-*`、`--eidos-touch-target`、`--eidos-border`、`--eidos-bg`、`--eidos-primary`、`--eidos-focus`；不引入任意新色、个人插件私有 CSS 或第二个 Design System。组名文本作为认知锚点，已选态用边框、字重和 `aria-current` 而非仅靠颜色；一个列表页仍只有业务本身的一个主要操作。

## 记忆与注意力

每个 Group 显示当前选择，解决来回切换时依赖用户记忆的问题。Owner 路由在触发任一组时保留另一组条件、搜索、排序与列布局，并把分页重设为 0；真实 Host 每次更新后原有焦点恢复规则生效。Eidos 不记录筛选到跨用户存储，也不把 URL 当作持久私人 Saved View；完整 Saved View 留给独立 CV03 安全门禁。

## 无障碍与跨年龄

每组是有独立 `aria-label` 的 `nav`；按钮是原生 `button`，通过 Tab / Enter / Space 访问，选中项带 `aria-current="page"`；`:focus-visible` 为 2px 明确轮廓。CSS flex-wrap 允许手机 390px 多行，`min-width` /`min-height` 使用 44px Eidos 触控目标；系统字号放大后仍可折行。规范适用于所有使用者，不按年龄分开模式。实际实体手机、NVDA/VoiceOver 尚待单独 Human 验证，不能以 Chromium 模拟代签。

## 安全与数据修复

`src/catalog-browser/render.ts` 对组数 2–4、每组选项 2–8、唯一合法 ID、非空标签、exact one selected、相对本地 URL 做 fail-closed 验证；拒绝跨域/协议相对/反斜杠/控制字符和多组与旧单组同时提供。Eidos 不过滤当前浏览器页，不持有 Principal、不计算授权聚合与总数，无法绕开字段裁剪。选择错误或失权由 Host/Domain 原动作错误回执处理，原查询/权限不被改写；无业务保存、批量写入、数据库变更。

## 证据与剩余问题

Eidos #218 在 `tests/experience/catalog-multiple-quick-filter-groups.test.mjs` 验证两组选择/本地路线、同名选项隔离、旧单组兼容、危险路由及双选/漏选拒绝；必须以本 PR 最新准确 HEAD 的 `release-check` 与 `human-ui-design-review` 真实结果为准。后续 Platform 要证明 status + subjectType + search 由真实 Counterparty Domain Owner 查询且先授权后统计和分页，Human/Agent READ/当前页 CSV 一致，并在 1280/390 真 Chromium 交互验收。**这里没有**真实用户授权测试、独立 Human、读屏器或商业上线认证，不开启 CV03 SAVE / CV04 后台 EXPORT。