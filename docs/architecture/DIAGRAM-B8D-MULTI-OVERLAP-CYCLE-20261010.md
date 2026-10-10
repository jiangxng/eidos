# B8d — 多重重叠线段轮选（2026-10-10）

## 权威基线与范围

- 直接继承 Eidos [B8c #144](https://github.com/jiangxng/eidos/pull/144)、App [B8c #586](https://github.com/jiangxng/EVO-App-Platform/pull/586)，以代码和已记录的测试为准。原设计依据为 [App 研究交接 #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 与 39 项 §14 验收矩阵。
- 只改 Eidos `edge-waypoints.ts` / `surface.ts` 及专项测试；App 仅差分移植。44 CSS px 命中区、自动/手工路由、单 Undo、Host/CAS 和显式投影 Save 都沿用已有机制。

## 已确定操作逻辑

1. 普通拖动路径点：移动路径点，行为不变；Shift+拖动：距离最近的被遮挡正交线段，行为不变。
2. Shift+Alt+拖动：从默认的第二候选开始，行为与 B8c 相同。若重叠段数量超过两个，**Shift+Alt 单击且未达到拖动阈值**将备选移动到第三、第四……最后循环回第二。之后 Shift+Alt+拖动当前候选；Shift 单独拖仍选第一。无需缩小 44px 命中区。
3. 当前备选以非交互 SVG 小标签 `N/M`、title/aria-label 和数据属性呈现。标签不捕获指针。纯排序以屏幕 px 距离→段索引→轴稳定排序，重复同一段去重，非法相机/无候选返回空；数值 rank 越界返回 undefined，原布尔 alternate 调用兼容。
4. **单击轮选不创建 Undo、不写投影、不变更业务图、不触发隐式 Save**。只有真正可编辑的拖动提交才走原有一次 checkpoint；取消与第二指中断不改变轮选的存储内容。

## 验证和边界

- 源码单测覆盖 4 个重叠候选的稳定顺序、逐一 rank、去重、缩放阈值、非法参数、不变更原坐标，并静态检查不改变 44px hit area 和 Undo 路径。
- Eidos [Draft #145](https://github.com/jiangxng/eidos/pull/145) CI PASS；App [Draft #590](https://github.com/jiangxng/EVO-App-Platform/pull/590) 集成 CI PASS。[App Chrome 154 eleven-tab CI #38020601326](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38020601326) **PASS**：新建第十一 Chrome 标签页，以真实 Inspector 数字输入构建 5 个手工路径点、多于 2 个重叠段；CDP Shift+Alt 单击由默认第二候选切换第三候选（`3/N`），原 SVG 保持不变且 44px 命中区未缩小，再 Shift+Alt 拖动第三候选使 SVG 改变，一次 Undo 完全还原；Host 投影 Store 未隐式写入。日志 `b8dNativeDenseOverlapCycleAndUndo=true`，原 B8c、B8b、CAS 子场景同时 PASS。
- 已覆盖 Chrome 第三候选的真实浏览器鼠标场景；第四及更多候选逐个拖动尚无独立浏览器证明。Shift+Alt 为桌面键鼠增强手势，不得冒充移动端方案。复杂圆角/自环、实体 macOS/Windows/iOS/Android、触控板/辅助技术完整行为、1000 边长期操作及 §14 39 项正式验收仍未通过。
- 分支/PR 保持 Draft，未经主线集成审查不得合并、部署；不会修改全局进度文件。
