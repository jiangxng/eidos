# B8f — 自环显示层可编辑正交、圆角与曲线（2026-10-10）

## 基线和权限边界

- Eidos 自 [B8e Draft #146](https://github.com/jiangxng/eidos/pull/146) 继承，在独立 [Draft #147](https://github.com/jiangxng/eidos/pull/147) 实施；App 对应 [Draft #593](https://github.com/jiangxng/EVO-App-Platform/pull/593)。
- 按既有 [2D Designer 研究决策交接 #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 延续。只改变 **路径外观**，不写业务拓扑、业务定义版本、关系端点、Agent 权限。保留 44 CSS px 操作区域、显式投影 Save、CAS 写令牌、单撤销/重做。

## 已实现设计

- 原有 `diagramSelfLoopGeometryV010(node,kind,lane)` 四类默认外观均保持。自环仍接在原业务节点右边界上侧约 28% 和下侧约 72% 的固定终端，不把自环错误变成从节点中心到自身的零长度线。
- 新增 `diagramSelfLoopRouteControlsV010` 纯几何：正交及圆角回环默认右侧两拐角；曲线自环默认外凸中点一个可拖动 bulge。**选择而不拖动时不写任何手工路径点**。
- 手工编辑后 `edge.waypoints` 是显示层覆盖：正交和圆角线段沿法向拖动；曲线 bulge 用固定两端 cubic Bézier 控制点适度外扩/抬高，仍为 `C` 曲线而非直线。不支持向节点内部翻转（`reach<=8` 拒绝非法曲线）。
- `surface.ts` 的 render、drag preview、节点位置预览统一优先读取显示层自环手工路径；Viewer 用同一只读图形函数。取消/丢失 pointer capture 复原原路径；确认拖动单本地 Undo，显式 Save 后才改变投影 Store。普通关系及 B8e 重叠/圆角路线保留。
- Inspector 对无手工点的自环执行「添加路径点」时，会先生成节点外侧的正确默认控制点，而不是生成位于节点中心的无效路径点。straight 自环仍保持原有自动回环，不虚假声称可直接作为 straight 手工折点拖动。

## 证据状态

- Eidos [#147](https://github.com/jiangxng/eidos/pull/147) release-check CI **PASS**。纯几何测试覆盖四种默认自环 SVG 的非变性，正交/圆角控制柄、端点不移动、曲线 bulge、节点整体平移、非法坐标，以及 Surface 的渲染/编辑联动。
- App 普通 14 标签页 Chrome 回归、CI 集成与平台层已通过；B8f 专属 **17 标签页自环 Chrome** 使用隔离的测试自环注入到测试用 artifact source，并使用真实 App Host/CAS 与只读 Viewer；以对应 GitHub Actions **完成结果**为准，尚不可自动视为通过。
- 测试自环不是生产企业关系，本轮**没有**改动实际业务图的关系结构。自环在现有密集图中仍有被右侧邻接节点覆盖的可能；测试将控制柄放在画布内、右侧空旷的位置，不能作为「自动自环避障」已完成的证据。
- 物理 iOS/Android、Windows/macOS 实体鼠标/触控板、系统触摸中断、复杂多自环与跨关系避障、重启后数据库持久化、完整 §14 39 项商用验收继续 **NOT TESTED**。Draft、未合并、未部署。
