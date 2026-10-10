# B6b — 手工路径吸附与多选对齐/等距分布（2026-10-10）

> Draft PR [Eidos #140](https://github.com/jiangxng/eidos/pull/140)，基于 B6a #139。保留上游 Eidos 通用绘图边界、B5a 路径手柄/取消策略。研究源自 [EVO 2D Designer 商业化需求与已确认研究索引](https://github.com/jiangxng/EVO-App-Platform/pull/552)（§6.5、§7.2、§10）。**本轮没有重新浏览 S1–S7 外部资料**；下述为明确的工程实现决策。

## 已实现的行为

1. `diagramSnapHandleOffsetV010`：手工路径点允许双轴吸附；正交路径段根据可移动的 x/y 轴仅调整合法的垂直方向。参考其他可见节点的左/中/右、上/中/下锚点，以及其他边显式路径点；不会自动创建关系、改变 source/target、pathKind、锚点或拓扑。只在开启 Align 或 Grid snap 时吸附。
2. 沿用 B6a 的 6 CSS px 容差与随缩放自适应世界网格间距。路径手柄沿已有真实 SVG hit target 移动，屏幕 44px 热区不变。临时参考线在拖动预览显示，pointercancel、lostpointercapture、多指竞争和正常放手时清除；取消恢复原路径，不创建 Undo；松手成功提交单条 Undo。
3. `diagramArrangeNodesV010` 提供六种显式对齐（左右/水平中心、上下/垂直中心）及水平/垂直**等边缘间距分布**。双节点起可对齐，至少三节点可分布；对齐的参照是当前主选中节点；等距分布将原最前和最后对象固定，中间对象按相邻 bounding-box 间距排列；空间不足时拒绝并提示，不静默重叠。
4. Surface 多选时在 More 菜单暴露真实命令按钮，针对只读业务节点依然是**本地投影位置编辑**，不改变其业务属性。一次命令一个 checkpoint，随后 Save 才持久化。手工路径只有当两个端点等量移动才整体平移其控制点，否则保持控制点不变，避免隐性重算。
5. 算法输入校验、重复 ID 和不合法模式拒绝；不隐式迁移旧投影；不附加业务记录；正常鼠标单选、触摸和双指取消沿用 B5a 机制。

## 测试与留待验证

- `tests/diagram/diagram-snapping-tools.test.mjs` 验证双轴/单轴吸附、3 倍缩放拒绝不合法吸附、10% 网格、六方向对齐/等距分布、输入不可变和非法间距失败。该文件与原 `diagram-snapping.test.mjs` 同由 Eidos CI 执行。
- App Platform 的对应 Draft PR #568 负责 vendored 差分与 Browser/Host 保存边界证明；不能把 Node 单测说成真实浏览器已验收。
- 悬而未决：路径手柄真实浏览器在曲线/正交路径上拖动的覆盖、实体触摸和触控板、隐藏/锁定对象特殊组合与密集图性能；原 §14 的 E03/A02/P01 全量验收仍须实测。
