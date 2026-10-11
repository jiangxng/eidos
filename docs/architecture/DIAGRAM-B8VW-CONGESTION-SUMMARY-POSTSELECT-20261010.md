# B8v+B8w｜可见拥塞统计与跨浏览器选中后重排（2026-10-10）

## 交接与确定边界

当前为 Eidos [Draft #158](https://github.com/jiangxng/eidos/pull/158)，**基于** Eidos B8t+B8u [#157](https://github.com/jiangxng/eidos/pull/157)，并行差分集成在 EVO-App-Platform [Draft #606](https://github.com/jiangxng/EVO-App-Platform/pull/606)，基于 App [#604](https://github.com/jiangxng/EVO-App-Platform/pull/604)。同一 2D Designer B 类专项，未合并、未部署，不修改 TR-01、Host/Agent 授权、投影 CAS/业务端点、手工路径与已有局部 A* 22/2600 安全预算。上轮决策与原始官方参考见 B8r+s、B8t+u 文档与历史 S1–S7 索引，本轮没有重新浏览那些官网。

## 为什么做 B8v

真正 Chrome 154 B8t 合成图发现：**300/900 中 21 条、400/1200 中 27 条**自动正交线仍处于 `route-congested`。旧 DOM 每条线已有 aria 警告，但画布全局 `inkQuality=full` 只描述墨迹空间索引精度，**不表示没有任何路线拥堵**。正常用户难以发现需要手工审查的剩余连接。不能通过默默增加 22 障碍/2600 网格预算或制造碰撞路线“骗过”测试。

### 采用的实现

- Eidos `src/diagram/surface.ts` 每次新 render 从**真正可见边的实际 `geometry.congested`** 累加一次，写入当前 SVG 上只读 `data-eidos-diagram-congested-count`。不依赖合成数据推断或外部统计。
- **仅有拥塞时**出现独立小型文本 `N routes need review`，辅助信息 `N of M visible connectors need manual route review`，语义为 `role=note`、`pointer-events:none`；不拦截 44px 线柄或读图拖动，且不把每次重绘当作会反复播报的警报。
- 仍完整保留 B8m 原 `full/coarse/node-only` 墨迹提示；拥塞与墨迹降级是**两个不同指标**，不能互相替代。
- 画布本身每次重绘有 `canvas.replaceChildren()`；旧警告随重绘消失，新的可见关系数/拥塞数可即时重算，不持久化、不改变业务关系和人工路径。
- App 仅针对 `vendor/eidos/src/diagram/surface.ts` 做三处同样的精确增量，不用整文件覆盖，以免破坏 App 的 `renderContextNavigationV010` 定制。

### 自动化验证路线

Eidos 和 App 各有本轮结构回归测试（**结构检查不是完整浏览器验收**），真实 Browser 断言为：

1. B8t 合法 300/900、400/1200 **全自动 orthogonal/rounded** 图，真正 Chrome DOM 读取 `route-congested` path 数，并逐一对照 SVG `congested-count` 与仅在正数时存在的非阻挡 `role=note`；检查原先每条拥塞线的 `aria-label` 未丢。
2. 无拥塞的单条真实 curve 关系，Firefox/WebKit 的原图以及点击节点后重绘，应始终 `congested-count=0`、没有总结条；不会错误向客户展示“有线路拥塞”。
3. Chrome 34-tab 原历史回归和 App / Eidos 原有 CI 必须仍通过；修改的 DOM 仅属于展示信息，不会授权保存。

## B8w｜真实选择操作后的复杂字体再验证

在 B8u 已有 **7 类受控标题 × 两个真实 Linux 浏览器引擎**的 RTL/LTR、`getBBox` 实宽/左右位置约束外，增加浏览器**实际鼠标点击**同源节点 `a` 的操作。在 Selection 触发新 render 后重新检验：

- 关联关系标题还存在；实际父 SVG `getBBox().x/right` 与**原始世界坐标 `data-eidos-diagram-caption-world-x`**及 Eidos `diagramCaptionLayoutV010` 预留框一致。
- 逻辑原始业务字符串没有因 RTL 重排/选中丢失；`direction` 仍正确；WebKit / Firefox 字形差异不需要强制一致。
- 零拥塞场景依然不显示全局警告；不把 Chromium-only 验证冒充真实 Firefox/WebKit。
- 单独保留 B8u 的 **258 可见 RTL 标签 / 256 次昂贵 `getBBox`** 上限，保证浏览器再次输入交互后仍能稳定运行。

**严格限制**：CI Firefox/WebKit/Linux + Playwright 点击是“真实引擎自动化”，不是 macOS Safari、iOS/Android 物理触控或无障碍完整审计。原 §14 39 项完整商业验收仍全为 NOT TESTED。现有设计与风险不因新增子场景测试自动改变。

## 最新证据和后续

用以下可复核 run/commit 填充最终验收，而不是仅凭 PR 为 Draft 或新增文件宣布通过：

- Eidos #158 / App #606 实时 head、逐文件 diff 与相同提交 CI。
- App 专项 `Diagram B8t Automatic Routing Budget CI` 与 `Diagram RTL Cross Browser CI` 的实际运行日志及输出。
- 商用证据矩阵只追加子场景，不把整个 V/E/P 条目改成商业 PASS。

下一轮关注：拥塞计数在节点拖动、撤销、保存重开及 Viewer 只读呈现的一致性；独立图实例隔离；真实业务图样本和物理触控/字体。修正必须附完整失败与复测日志，不能隐藏失败证据。
