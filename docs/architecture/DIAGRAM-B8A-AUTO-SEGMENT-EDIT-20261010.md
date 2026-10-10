# B8a：自动正交线段直接拖动（2026-10-10）

**工程基线**：[Eidos P01a #141](https://github.com/jiangxng/eidos/pull/141)、[B6b #140](https://github.com/jiangxng/eidos/pull/140)。需求依据是 [EVO 2D Designer 原商用化 v1.0/§14 及研究交接 #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 所保留的手柄、吸附、取消及自动/手工路由边界；**本轮没有重新查证外部参考网页**，不把索引中的网址清单当成已读原文。

## 新交互

1. **不要求先按 Add path point**：当一条已指定 `orthogonal` / `rounded-orthogonal` 的关系被选中，且没有手工 `waypoints` 时，画布直接提供自动折线段的 44 CSS px 可抓取热区；自环、普通 straight、curve 不擅自加入此手势。
2. `diagramAutomaticOrthogonalPointsV010` 从**与自动 SVG 绘制完全相同**的障碍路由计算通用折点；`diagramEditableAutomaticOrthogonalRouteV010` 构造**临时**手工控制点，不修改当前 edge。老版共线直线可包含重复中点，临时控制点会先去除坐标重复点；纯水平/垂直线可合成几何中点供直接线段拖动。超出最多 24 控制点的自动路由不显示非法控制柄，而不是截断路径。
3. 拖动预览沿用 B6b 的仅法向轴移动、6 CSS px 对齐吸附、网格及其他节点参考线。任何 pointercancel / lost capture / 多指冲突须恢复捕获到的 `originalGeometry.d` 和 label，尤其保护 rounded 细节，不在浏览器产生隐式业务写入或 checkpoint。
4. 只有实际释放并成功移动时才执行一次 `checkpoint`，把新的控制点写入 edge 的**投影展示层** `waypoints`；随后展示既有路径点属性编辑器。Undo 回到没有手工控制点的自动路由。原来明确添加过 waypoint 的路线和手柄沿用 B5a/B6b，不覆盖人工布局。
5. 本切片只负责 Eidos 演示图层交互，不接触 App Platform 的业务账本版本、权限、Agent 和 CAS；App 的差分移植必须保存其自定义 Host 导航。

## 检验

`tests/diagram/diagram-auto-route-segment.test.mjs` 用同一套自动路由验证生成控制点、绕障碍复杂线、退化水平线、端点固定、转换后的非等形移动以及 SVG 原路由恢复的代码路径。另需真实 Chrome 页面在没有点击 Add path point 情况下实际用鼠标抓取自动手柄：取消恢复原路由，再拖动释放转成手工并 Undo 恢复，且 Host 不自动写入。原 §14 的触摸设备与完整复杂业务图验收**仍 NOT TESTED**。

## 后续验收缺口

退化重叠热区的显式消歧；500/1000 拥堵图下连续自动线段编辑；rounded 转手工后半径细节验收；跨页面保存/重新读取/Viewer 显示；真实 Android/iOS 双指、触控板及硬件 FPS。以上不因纯几何单测通过而被认为完成。

## 实际 Chrome 回归证据与范围（2026-10-10）

[App Platform Browser CI 38016452101](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38016452101) Chrome/154.0.8037.97 **PASS**，六个独立页面；自动 orthogonal 边无 waypoint，原生鼠标拖动成功预览，第五标签页注入 pointercancel 后原 SVG d / 无手工控制点恢复；第六独立页面正常鼠标松手后出现显式 waypoint，随后 Undo 恢复原自动 SVG 与手工点缺席。机器输出 `autoSegmentDragCancelConvertUndo=true`，早先 B7b 并发冲突、重试、B6b 手工手柄等同时全部 PASS。

第一次测试在注入合成 DOM `pointercancel` 后试图用同页 Chrome 原生鼠标立即重新抓取，第二次输入未触发预览。由于事件为人工合成，无法确定是 CDP 鼠标状态还是真实产品丢失捕获。本次采用不同独立页面完成取消与正常提交，**同页系统级取消后重新抓取尚未被证明**，继续作为真实设备测试缺口。业务只涉及展示布局，未合并、未部署。
