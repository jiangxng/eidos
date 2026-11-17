# CV-02 Eidos Catalog 受管路由重查焦点恢复（2026-11-17）

> 代码归属 Eidos Owner `src/app-host/browser-shell.ts`；Platform Counterparty 只负责传入受权限裁剪的 Catalog 表格。**设计/源码评审与自动化不等于真实登录 Human、实体键盘或读屏器签收**。复用已有 quickFilters / serverSearch，不引入新的列表/导航/存储框架。

## 目标与完成条件

当用户在已有 Catalog 的状态筛选按钮或服务器端搜索框按 Enter，Owner 通过既有 Host 重新查询并重新挂载页面后，焦点回到新页面的**同一个受管控件**；避免旧 DOM 销毁使键盘位置意外回到 body。只处理两个已经存在的控件，不改变真实 Principal/Enterprise、查询结果、CSV 或 Agent READ 语义。

## 流程与步骤

用户在合法 Counterparty Catalog 快捷状态按钮或 serverSearch 搜索框进行键盘导航 → 原有 ActionHost/Domain Owner/Server READ → `renderRoute` 在当前页面控件仍存在时记录最小焦点意图 → 原有页面重挂载 → 只有对应新控件仍存在才 `focus({preventScroll:true})`。跨页、失权、无控件、无资源、手动切其他控件时不强行转移焦点。

## 导航与信息架构

视图切换、列设置、分页、返回与企业切换的语义和 Eidos/Host 原归属不变。焦点意图不转换为路由或查询值，不允许由用户字符串制造任意 CSS selector；目标仅能是 `[data-eidos-catalog-quick-filters] button[data-eidos-catalog-action]` 的同 ID 或 `[data-eidos-catalog-server-search] input[name="search"]`。

## 视觉与颜色

无新增 HTML 或 CSS，无色值/Token/图标/布局变化；延续 Eidos 原 `:focus-visible` 与原生 button/input。不能仅凭焦点恢复自动推断对比度、读屏器或真实手机验收完成。

## 记忆与注意力

当前快捷筛选的选中态仍由 Owner `aria-current=page` 输出；Eidos 仅在相同控件继续存在时恢复焦点，不跨企业保存焦点数据，不记录对象内容，不保存搜索条件、不改持久 Saved View。焦点恢复不应滚动页面。

## 无障碍与跨年龄

原生按钮 Enter/Space 和输入框 Enter 仍由浏览器触发；本改动只解决导航后内容重挂载导致的焦点断点。只读表格语义不改。需后续真正登录 Human 使用键盘、读屏器与实体 390px 设备验证完整 Tab 顺序及失权后焦点位置；模拟 Chromium 的键盘事件不能替代读屏器证据。

## 安全与数据修复

只对当前 `pageContainer` 内真实聚焦的受限控件采集意图，过滤其他 DOM、随意命名控件和业务行内容；不存储用户/企业/字段/查询敏感值；若 async Owner READ 被更新请求取代，遵守现有 `read.isCurrent()` 保护，不对过时页面恢复焦点。无匿名提升、SQL、权限门禁、SAVE 或正式 EXPORT 变更。Host 仍每次重新鉴权。

## 证据与剩余问题

上游单元结构性合同 `tests/app-host/browser-shell.test.mjs` 约束焦点捕获、受限恢复、过期请求拒绝；需要 Eidos release-check 精确 HEAD 与 Platform consumer 的真实 Chromium 1280px/390px Owner/CSV 回归才可合并采用。对比 Platform 上轮 #1337～#1340 历史主线失败并保留原证，必须有**合并后 main** 的成功记录。真实登录账号、人操作、实体手机、读屏器尚无签收，不将这次 PR 评为完整 HUMAN_PASS。


## 2026-11-17 主线缺口补证：hash 导航前捕获

Platform #1341 首次实际 Host Chromium 原证显示 ACTIVE 状态正确，但新按钮未聚焦；源代码 `renderRoute` 时才捕获焦点可能晚于 hash 导航导致的旧控件失焦。此次上游修正：只有在 `navigate` 已验证目标路由后、真正变更 hash 前记录已聚焦的受限 Catalog 控件标识；仅同一业务 pathname 的目标完整 route 才能使用一次，过期请求与跨页/未知路由不恢复焦点。仍按本页原规定不保存用户身份、数据或秘密，也不能据此把 Human/读屏器签收从 NOT_SIGNED 改成 PASS。后续 Platform 必须针对实际 Host 1280/390、合并 main、东京运行时核对。


## 2026-11-17 真实 Platform Workbench 入口纠偏

Platform `manager/app-host-client.ts` 在桌面分支调用 `mountDesktopWorkbenchRuntimeV010` → `mountWorkbenchShell`，故此前仅对 Browser Shell 的修改**不能证明实际 Counterparty 桌面页恢复焦点**。通过实际源码而非推测定位该入口后，Eidos 将已存在的受限焦点 helper 提取为单独的 `src/app-host/catalog-route-focus.ts`（Browser Shell 和 Workbench Shell 共用），并只在 `src/workbench/shell.ts` 的同一业务 pathname 导航前捕获控件、正确的有权 Owner READ 之后恢复到新 DOM，遵守 superseding read gate。跨业务页、HANDOFF、隐藏控件或无权状态不转移焦点。本修正还需 Platform 正确 vendor 采用与真 Chromium；不以先前 #215/#216 的 Browser Shell CI 宣称真实 Workbench 通过。真实登录 Human、实体手机和读屏器继续独立 NOT_SIGNED。
