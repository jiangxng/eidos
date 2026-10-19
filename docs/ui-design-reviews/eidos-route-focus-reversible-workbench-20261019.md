# Eidos 路由级聚焦工作台｜2026-10-19 Human UI 审查

> **依据与性质**：直接阅读 Eidos Workbench shell 和 CSS 原文、Platform V3 #1054 在 1280×900/390×844 隔离 Chromium 的已读截图（run 39277312473）、原型 PR #909；历史截图尺寸和实际页面的约 420px 侧栏来自同一隔离环境，不是客户现场生产截图。本项是可复用布局机制，不包含 BEX 业务字段、路由常量或原型固定宽度。

## 目标与完成条件

需要宽表审核的应用可以由 Host 显式选定路由，进入时工作区自动获得除活动栏之外的剩余宽度。用户仍有一键“显示导航／聚焦工作区”按钮；离开该路由即时恢复原来的侧栏状态和宽度。**不能将折叠状态永久存进用户偏好**，也不能强迫全站所有页面使用宽布局。

## 流程与步骤

Host 向 Workbench 提供 `shouldFocusWorkspaceRoute(path): boolean`；进入匹配的内部页面时 Eidos 设置 `data-eidos-workspace-focused=true`，隐藏侧栏与 splitter，扩展工作区。顶部工具栏显示可逆按钮，点击暂时展开导航，再点重新聚焦。导航到不匹配页或外部网页，恢复普通布局；下一次进入匹配页重新选择自动聚焦。手机端沿用既有单列工作区及活动栏规则，隐藏多余聚焦按钮。

## 导航与信息架构

仅新增 Workbench Shell 可选的 Host 注入 predicate 与通用语义属性。既有 route target、surface identity、资源刷新、navigation list、URL、浏览器历史、企业授权、侧栏尺寸、活动栏、用户控制、persisted layout 均不变。**Eidos 不知道“供应商”“导入”“开户银行”这些业务词或路径。**

## 视觉与颜色

重用 `--eidos-activity-width`、背景和现有工具栏。聚焦时 grid columns 为 activity / 0 / 0 / flexible workspace，桌面可以容纳较完整的四列审核表；展开导航时使用原 grid。聚焦按钮为原生控件并保留 44px 触控尺寸与 visible focus，没有额外品牌色。不能单凭本改动宣称 V3 像素完全一致，仍需原型 1280px/390px 对照。

## 记忆与注意力

窗口展示优先支持逐字段审核和异常处理，保持状态与上下文。离开工作台恢复用户惯用布局，避免错误写入 `eidos.workbench.layout` 导致别的业务页面意外失去侧栏。手动临时展开不写入此偏好。

## 无障碍与跨年龄

工具栏按钮有 `aria-label` 和 `aria-pressed`，可通过键盘触发，图标只补充不取代文字辅助名称。手机端不重复放置无意义切换按钮。用户仍能通过活动栏和原有导航访问其他工作区。窄屏及放大情况下不新增绝对定位导致遮挡。

## 安全与数据修复

所有匹配规则由 Host 提供，Eidos 不推断用户或企业上下文。聚焦纯布局，不能跳过 Host 权限、Schema 审批、原 Excel 审查、映射版本校验或正式提交。返回其他页面必须解除聚焦，不能在应用之外意外沿用。无 `project.status.json`、PA05 或 Railway 变更。

## 证据与剩余问题

修改 `src/workbench/shell.ts`、`src/design-language/productive-workbench-css.ts`，并追加 Workbench 测试。精确 Eidos HEAD CI、Human UI 门禁必须通过，再由 Platform #1054 在两个确切 V3 路由（/map、集中审核 batch）显式选择；通过 1280px/390px 隔离 Chromium 验证聚焦与导航恢复，不越权合并未完成的 Draft。工程总状态 M01–M03 完成、M04/M05/M06 仍 OPEN，3/6。
