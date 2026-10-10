# P01a — 2D Designer 真实 Chrome 大图基线与确定性空间索引（2026-10-10）

> [Eidos Draft #141](https://github.com/jiangxng/eidos/pull/141)，基于 B6b #140；App Platform 配对 [Draft #573](https://github.com/jiangxng/EVO-App-Platform/pull/573)。保留原商用 v1.0 §14 P01 的 200/400 和 500/1000 规模口径，原研究索引 [PR #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 未重写。本轮没有重新阅读任何外部参考站点。

## 源码发现

- 原 `surface.ts` 完整重绘时每条边都对 `renderedNodes` 做两次 `.find` 来找 source/target，理论为 O(E×N) 端点检索。
- 对显式 orthogonal / rounded-orthogonal 的自动边，每次又遍历全部可见节点，生成排除端点的障碍列表；路由内部随后以边端点局部包围盒再过滤一次。多节点多边时造成重复分配。
- 节点拖动预览之前也每帧重建 node ID lookup，现可复用本次 render 已创建的索引。

## 低耦合优化

- `obstacle-spatial-index.ts`：纯几何预处理每个可见节点的 256 世界单位桶，查询两端点外包围盒 ±(120+14) 的候选障碍。每个返回结果按原输入节点下标排序，不更改原路由的搜索平局顺序；排除当前边 source/target、隐藏节点由调用方在入索引前筛除。
- 非常宽大的节点不会展开无限桶，改存 oversized 集合；查询跨超多桶（大于 4096 格）回退有限的完整扫描。返回仅包含会被原路由局部规则纳入的节点。
- Surface 每次完整 render 构建一次 `renderedNodeById` 与空间索引，取端点和调用路由不再逐边完整扫描；拖动中复用 node lookup，DOM/标签/选中语义不变。
- `DiagramEdgeGeometryOptionsV010.forceRouteWhenEmpty` 仅用于**保留旧版所有障碍节点都在远处时路由仍会压缩重复折点**的 SVG 形状；默认外部调用语义不变。Eidos test 对相同 graph、两种路由样式逐条比较原始完整障碍列表与优化列表的 `d`、label、congested 返回，避免隐性形变。

## 验证和边界

- 自动回归 `tests/diagram/diagram-obstacle-spatial-index.test.mjs`，涵盖路径语义一致、远处障碍、巨大障碍、负坐标、极宽范围、源顺序确定性。
- App Platform `tools/diagram-performance-browser-proof.mjs` 基于真实 Chrome 的 *synthetic Eidos DOM*：200/400、500/1000；记录 render/load、节点选择重绘、原生鼠标事件调度、DOM/SVG 与 JS Heap；配套同 runner 构建 B6b 与 P01a、预热并重复 3 次/规模。测量结果应引用最终比较日志，不能用不同机器的单次结果推断提升。
- 此阶段仍完整渲染全部节点与边，没有做虚拟滚动或缩略图降质，也没有改变实际 business graph 的 API。真实多设备 FPS、触控板交互、曲线/多段自环、超大图缓存回收和 Viewer 往返**未通过 §14 P01 正式验收**。
