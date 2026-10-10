# B8g — 多方向自环避障与手工路径方向稳定（2026-10-10）

## 项目承接与边界

- 研究和决策入口：[EVO 2D Designer 交接研究 #552](https://github.com/jiangxng/EVO-App-Platform/pull/552)；本轮代码基线为 [Eidos B8f Draft #147](https://github.com/jiangxng/eidos/pull/147)。本增量对应 [Eidos B8g Draft #148](https://github.com/jiangxng/eidos/pull/148) 与 [App B8g Draft #595](https://github.com/jiangxng/EVO-App-Platform/pull/595)。本轮未重新访问外部参考资料，不把交接链接清单当作本轮已读原文。
- 属于**可见性/图形呈现层路径几何**；不改业务关系 source/target、箭头语义、Agent 授权、CAS 或业务定义版本。只在 Draft PR，不合并、不部署。
- 原来无障碍的右侧自环形状及路径类型严格保持，包括 legacy 未显式指定 pathKind 的老数据。右侧被挡时，显式样式自环可改道。

## B8g 采用的方案

1. 在可见节点中排除自环所属节点，对右、下、左、上四侧候选计算路径包围盒（含默认 22 world-unit 余量）与邻接节点矩形的面积交集；优先选零交集候选，全部有交集时按占用面积最小选；同分优先原右侧。排序和输出确定性，不依赖节点遍历顺序。
2. 对曲线、正交、圆角自环的四侧给出相同语义的默认终端和外侧控制点：右/左侧端点分别在节点边界纵向约 28%、72%，上/下侧端点分别在横向约 28%、72%。曲线保持 cubic Bézier，圆角保持 Q 转角；自环终端永远还在原节点边界。
3. 仅在首次手工操作提交后保存 `edge.waypoints`。重读手工路径时根据外侧路径点推断该路径的原方向，**不再因为其它节点出现/消失而自动更换方向**；这样无需改动投影持久化契约，保持 B8f 浏览器结果不变。
4. Canvas Designer 与只读 Viewer 仍使用同一个 `diagramSelfLoopGeometryV010`，手工预览和节点移动预览也通过相同方法。取消无写入，Undo/Redo 一次回退，只有显式保存才更新投影。
5. 大图使用已有 `createDiagramObstacleSpatialIndexV010`：当默认 reach+22 ≤134 world units 时，以自环节点矩形为范围查询（空间索引本身附加 134-unit 包围）；间距特别大则采用完整扫描，避免漏掉候选。规模较小的图沿用轻量完整扫描。已为两种结果等价补专项测试。

## 被排除的方案和原因

- 不缩小或藏起 44 CSS px 操作区域，否则会违反已经验证的操作规范。
- 不对用户已经手工调整的自环继续动态避障：会导致保存后几何跳动、View 与 Designer 看到的路径不一致。
- 不引入新的 `side` 永久字段或修改业务关系：可从合法外侧 waypoint 推断已有方向，本阶段无需迁移和写权限扩张。
- 不声称提供所有图形之间的全局最短路径或重叠优化：当前仅对可见**节点**做四侧候选评估，不包含边边交叉惩罚。

## 测试和不能扩大解释的范围

- 几何与 Surface 测试包括：原默认 right SVG 严格一致、右被挡选下、再挡下选左、再挡左选上；顺序交换稳定；非法障碍拒绝；圆角与曲线固定节点终端；手工路径锁定方向；索引查询/全扫描一致。
- App [Chrome 20-tab Browser CI #38023222999](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38023222999) 已 **PASS**（Chrome/154.0.8037.97），日志 `b8gNativeBlockedSideSaveReadViewer=true`。真实 Chrome 测试只对**隔离注入的模拟自环与模拟右侧遮挡节点**进行 CDP 鼠标操作，不能冒充真实生产关系或实体设备。第 18 页清除保存的手工覆盖后从右侧避障到底部，拖动、Undo/Redo、显式 App Host CAS Save 版本6→7；第 19 Designer 和第 20 真正只读 Viewer 重新读取时，测试遮挡节点已不存在，但仍精确保留保存的下侧 cubic SVG。
- B8g 未解决：四边全部拥堵时**仍会选择最小交叠**，不能保证物理无遮挡；没有候选方向的“拥堵提示”；其他关系线/标签重叠、视口边界裁切、曲线进一步的双控制柄和强制手工绕障尚未实现；真实 iOS/Android/macOS 触控板、多指取消、重启后的持久化、全 §14 39项仍为 **NOT TESTED**。不进行合并或发布。
