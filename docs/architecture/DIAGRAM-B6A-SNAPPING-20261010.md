# B6a — 2D Designer 智能吸附、参考线与网格（2026-10-10）

## 依据与既有决策

依据 EVO-App-Platform [2D Designer 原始商业化需求](https://github.com/jiangxng/EVO-App-Platform/pull/552) 第 7.2、10、12、14 节：群组移动使用同一位移，网格显示/网格吸附/对齐参考线三者独立，建议 6 CSS px 吸附距离，不修改业务语义。此前已记录 Miro、React Flow、draw.io、W3C/MDN 研究于交接索引；本轮**未重新访问外部网站**，以下阈值和实现策略为项目工程决定。

## 实现边界

- `src/diagram/snapping.ts` 纯函数 `diagramSnapTranslationV010` 通过移动组的整体包围盒，与其他**可见且非移动组**节点的左/中/右、上/中/下锚点计算独立的 x/y 对齐偏移。最小调整优先、平局由坐标和 ID 决定，保证不同节点遍历顺序确定一致。
- 容差为 6 CSS px，并除以 `camera.scale` 转为世界坐标。整体组选中节点使用**同一个 dx/dy**，不独立吸附成员。网格基础间隔为 24 世界单位；缩小时通过 2 倍间隔逐级扩展，使网格屏幕间距至少约 12 CSS px（例如 10% 为 192 世界单位），显示与吸附共用间隔。对象参考线吸附优先于网格吸附。
- 工具栏明确分开 `Grid`（显示默认轻网格）、`Grid snap`（默认关闭）与 `Align`（默认启用、对齐对象并显示细虚线）；互不串改。不向业务定义写入开关状态。
- 拖动预览期间只更新目标节点 DOM、邻接边及临时 SVG 参考线；释放只触发原有一次本地 checkpoint 或 Host 操作，取消/多指竞争时回滚并清空参考线。缩放时辅助线采用 non-scaling-stroke，视觉宽度不随缩放改变。
- Eidos 不解释 App Platform 业务关系，不定义保存协议。App Platform 内置 vendor 只能差分移植，保留 `renderContextNavigationV010`。
- 本切片针对节点/群组吸附；**手工路径点/正交线段吸附、等距分布与批量对齐按钮**保留在 B6b，不将未实现部分记作 PASS。

## 自动验证与遗留风险

`tests/diagram/diagram-snapping.test.mjs` 覆盖 10%/300% 缩放容差、锁定整体组相对位置、网格和对象对齐独立、输入非法、算法确定性、SVG 引导线与取消清理结构。代码/CI 不是物理设备验收，也不保证 500/1000 规模 FPS；继续在 §14 中以真实手势/截图及性能测量登记。

## B6a 浏览器反馈引起的工程细化

App Platform 集成测试在 Chrome 154、10% 缩放下发现固定 24 世界单位网格仅对应 2.4 CSS px，测试目标易混淆且网格过密。我们没有改变 6 CSS px 的吸附容差，而是独立引入 `diagramGridStepV010` 自适应网格密度，使视觉和吸附一致。对应新增几何单测，以及 App Platform 真实 Chrome 鼠标拖动/取消测试。此为项目实测反馈，不是外部资料重新验证。
