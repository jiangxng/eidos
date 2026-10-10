# B8c — 重叠控制柄消歧与 Chrome 同页触摸取消后重新抓取（2026-10-10）

## 基线和来源

以 Eidos B8a [Draft #143](https://github.com/jiangxng/eidos/pull/143) 为独立基线；配对 App Platform B8c [Draft #586](https://github.com/jiangxng/EVO-App-Platform/pull/586) 叠加 B8b #583，不影响项目其他主线。需求来自已确认的 [2D Designer 研究交接 #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 及商用 v1.0 §14、B5a 的 **44 CSS px 热区**及 B6b 路由、B8a 的自动线段。未重新浏览外部设计站点，不将旧资料网址当成新阅读证据。

## 产品交互

- 手工 waypoint 的 44px 目标保持绘制在 segment 命中区域的上层，普通左键拖动仍只编辑路径点；原有手工点/正交段的几何、撤销和单次 checkpoint 完全不变。
- 若 segment 44px 热区与 waypoint 热区重叠，目标路径点增加可读 `title` / `aria-label` 提示：**Shift+拖动**该路径点改为拖动距离最近的重叠正交段；有多个候选时 **Shift+Alt+拖动**指向第二个。鼠标手势基于实际 `pointerdown.shiftKey/altKey`，不用 Agent、不会模拟鼠标指令或修改业务关系语义。
- 纯几何 `diagramOverlappingSegmentForWaypointV010` 以真实 `camera.scale` 转换距离，44 CSS px 范围内按距离、segment.index、axis 稳定排序；无重叠、无有效坐标、非法缩放时 fail closed。不更改可见 SVG 点/段位置、无 shrink 热区。
- Shift 拖动复用原有屏幕像素吸附、segment 法向位移、SVG 预览、pointercancel 恢复、单 Undo checkpoint、显式投影 Save；当 pointer capture 仍发生在 waypoint 元素上，不虚假移动其 waypoint marker，而只预览最终 segment 形状。

## 已执行证据

- Eidos `tests/diagram/diagram-overlapping-handles.test.mjs`：最近/备选重叠候选、不同缩放、顺序确定性、无候选行为、端点和原 waypoint 不突变、重叠共线线段可移动及 SVG 变化；检查源文件保留 22px radius、Shift/Alt 实际路由、单次 checkpoint。
- Eidos [Draft #144](https://github.com/jiangxng/eidos/pull/144) CI PASS；App [Chrome Browser CI #38018569747](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38018569747) PASS，Chrome/154.0.8037.97 实际 **10 标签页**。第九标签页在真实投影关系统一自动路由→手工单点，使 waypoint 覆盖 segment，使用 CDP 原生鼠标带 Shift 修饰键发起拖动，验证遮挡线段能移动、松手写入本地多个控制点、Undo 恢复原单点及原 SVG 且不隐式保存。第十标签页利用 Chrome DevTools `Input.dispatchTouchEvent` 执行同页 `touchStart→touchMove→touchCancel→touchStart→touchMove→touchEnd`，检验 cancel 后 SVG d 和无手工点完全复原、第二次触摸实际重新预览并松手转换手工点、无 Host 自动写入。
- 浏览器证据位 `b8cNativeShiftOverlapSegmentUndo=true`、`b8cNativeTouchCancelRegrab=true`，旧 B7b CAS、B8a 拖动和 B8b Save→刷新 Designer→Viewer 亦全部 PASS。

## 尚未被证据覆盖的边界

这里的触摸是 **Chrome CDP 浏览器层输入**，比此前手动 `element.dispatchEvent(new PointerEvent("pointercancel"))` 更接近平台指针生命周期，但**不是 iOS Safari/Android Chrome 实机触摸或系统真正手势打断**。此前 DOM 人造 cancel 后再 CDP 鼠标重抓失败，并不能判定用户设备存在 BUG；现在证明真正浏览器 touchCancel 重抓有效，但两者不同。

Shift+Alt 手势目前由纯几何确定性测试及事件分派代码保护，尚未在实体设备键盘操作验证；多于两个完全重叠候选的逐一选择、更复杂圆角控制柄、长期绘图性能、移动真机/触控板、安全冲突的全量 §14 39 项验收继续 `NOT TESTED`。本分支 Draft，不合并/不部署。
