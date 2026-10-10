# 2D Designer 旧窗口上下文与研究证据恢复记录（2026-10-10）

> **文档性质：可接续的历史恢复快照，不是新的产品方案，也不是商业验收完成证明。**
> 保存位置：Eidos `docs/architecture/`；本记录为独立 docs-only stacked 分支，从 Eidos #155 的 `802edccfeca022b484a1d122b94e946e415ec67f` 建立，**未改动 main / 原有 Draft PR / 生产**。下文“当前”仅代表 2026-10-10 本次核对时点。下一次接续必须重新读实时 PR head 与 CI。

## A. 完整历史资料的入口（优先复用、不得重做全部研究）

1. **旧研究交接入口**：[App `EOG-2D-DESIGNER-RESEARCH-HANDOFF-20261010.md`](https://github.com/jiangxng/EVO-App-Platform/blob/docs/diagram-commercial-research-handoff-20261010/docs/architecture/EOG-2D-DESIGNER-RESEARCH-HANDOFF-20261010.md)，来自 [docs-only Draft #552](https://github.com/jiangxng/EVO-App-Platform/pull/552)。
2. **原始研究索引**：[App `EOG-2D-DESIGNER-RESEARCH-REFERENCE-INDEX-20261010.md`](https://github.com/jiangxng/EVO-App-Platform/blob/docs/diagram-commercial-research-handoff-20261010/docs/architecture/EOG-2D-DESIGNER-RESEARCH-REFERENCE-INDEX-20261010.md)，S1–S7 官方文献、P1–P14 项目依据、事实/项目选择、取舍/冲突及章节位置。索引在旧窗口中声明 **2026-10-09 初读、2026-10-10 再读官网原文**；**本次恢复只重新读取了保存的索引原文，没有再次打开这七个官网**，故不能将其谎称为本窗口外站新研究。
3. **原始商用要求全文**：[App `EOG-2D-DESIGNER-COMMERCIAL-REQUIREMENTS-v1.0.md`](https://github.com/jiangxng/EVO-App-Platform/blob/docs/diagram-commercial-research-handoff-20261010/docs/architecture/EOG-2D-DESIGNER-COMMERCIAL-REQUIREMENTS-v1.0.md)，其来源是旧会话文件库的《EVO-2D-Designer-商业化交互与视觉实施要求-v1.0.md》；旧交接记录了逐字符核对。§1–§16，尤其 §7–§12、§14 的 **39 条**验收和 §16 来源。不重写或删改这份基线。
4. **B8r/s 当前两仓设计记录**：[Eidos `DIAGRAM-B8RS-AUTO-ROUTING-CROSS-BROWSER-20261010.md`](https://github.com/jiangxng/eidos/blob/feat/diagram-commercial-auto-routing-cross-browser-b8rs-20261010/docs/architecture/DIAGRAM-B8RS-AUTO-ROUTING-CROSS-BROWSER-20261010.md)；[App `DIAGRAM-B8RS-AUTO-ROUTING-CROSS-BROWSER-INTEGRATION-20261010.md`](https://github.com/jiangxng/EVO-App-Platform/blob/feat/diagram-commercial-auto-routing-cross-browser-integration-b8rs-20261010/docs/architecture/DIAGRAM-B8RS-AUTO-ROUTING-CROSS-BROWSER-INTEGRATION-20261010.md)。
5. **逐阶段证据账本**：[App `DIAGRAM-COMMERCIAL-ACCEPTANCE-EVIDENCE-MATRIX-20261010.md`](https://github.com/jiangxng/EVO-App-Platform/blob/feat/diagram-commercial-auto-routing-cross-browser-integration-b8rs-20261010/docs/architecture/DIAGRAM-COMMERCIAL-ACCEPTANCE-EVIDENCE-MATRIX-20261010.md)：涵盖 B5、B6、B7、P01、B8a–B8s 的递进证据及明确的 NOT TESTED。该文件已经具有历史时间线，不再复制成第二份“真相”。

**恢复完备性**：已检索到原版 44KB 要求及原先的研究交接/索引，足以恢复已明确的方案和引用链；**没有定位到旧窗口每一条消息、每次浏览器画面或全部原始研究会话的无损导出**。下文只复用仓库能验证的记录及当前用户提供的最后进展；无法直接追溯的个人讨论不补造。

## B. 用户已经明确的要求与决定（[聊天确认/需求]，非“全部实现”）

- **范围**：只对 EOG **2D Designer** 做商业化整体升级，不泛化改造 Eidos；Viewer 使用同一通用几何/渲染语义。使业务人员完成看图→选中/框选→整理布局/路径→撤销→保存→刷新/Viewer 复现。不能要求用户把所有 UI 缺陷逐项提出后才改。
- **视觉/连线**：安静商务视觉、清楚的选中/拥塞/权限提示；推荐新投影的圆角正交外观，但旧投影若无 `pathKind` 必须保持直线，不允许被动改变；直线、正交、圆角正交、曲线均应可选；纹理 `solid/dashed` 与路由路径区分，业务箭头方向不允许任意伪造。新投影“默认圆角正交”**属于产品推荐，最终是否在创建流程默认启用未复核**。
- **桌面交互**：默认 Select，左键选/框选/拖对象；右键拖、鼠标中键与 Space+拖平移；右键原地菜单；热区尽量 44 CSS px；拖动冲突、失焦、Esc、pointercancel 不得错误提交。重叠手柄使用显式区分/轮选，不用缩小可操作热区硬避让。
- **触控**：触控板双指导航，手机/平板有自己的可用布局；触屏单指优先阅读/选择，双指保持平移/缩放；二指加入中止未提交编辑；必须有可点击/数值的非拖动替代路径；**Chrome DevTools 注入触摸事件不等于实体 iOS/Android 验收**。
- **权限边界**：投影只影响图的可见性与展示/手工路由，不应新造业务关系或变动 `source/target`、账本定义与版本、Host/Agent 授权、CAS/并发写入。自动排版是**固定产品能力**，不是强制依赖 Agent 代替鼠标。Eidos 管可复用 Surface/input/geometry，App 管业务权限、持久保存、Viewer/投影回显。
- **协作**：独立 feature/docs 分支，堆叠 Draft PR；**不推 main、不擅自合并、不部署、不修改全局 status/authority**。App 的 `vendor/eidos` 差异集成，不得整文件覆盖 Host context-navigation 等定制。
- **进度与验收**：可按双增量节奏推进，但必须始终区分“提出 / 代码 / CI / 真实浏览器 / 实体设备 / 正式商用验收”。

## C. 保存的历史官方参考：状态、关键事实与取舍

以下 **“历史已读原文”** 完全按照上列 #552 参考索引的原有访问记录；本次没有重访官网，且外站内容以后可能变动。详细原章节/插图位置、事实与推断标记请读原索引 S1–S7。

| ID | 资料、原始网址 | 历史访问状态与结论 | EVO 采用/放弃（项目决定） |
| --- | --- | --- | --- |
| S1 | [Miro — Using Miro with a mouse, trackpad, or touchscreen](https://help.miro.com/hc/en-us/articles/360017731053-Using-Miro-with-a-mouse-trackpad-or-touchscreen) | 2026-10-09/10 历史已读原文；Select/Hand、右键平移、触控板双指和触屏导航 | 借鉴导航一致性；不将触屏长按框选作为手机唯一操作 |
| S2 | [React Flow — Panning and Zooming](https://reactflow.dev/learn/concepts/the-viewport) | 2026-10-09/10 历史已读；map-first 与 design-tool viewport 两种交互 | 采用设计工具式“左拖框选”；不采用地图式默认左拖平移，也不因参考就引入 React |
| S3 | [draw.io — Style connectors](https://www.drawio.com/docs/manual/styles/connector-styles/) | 2026-10-09/10 历史已读；形状、圆角、颜色与箭头可分开编辑 | 拆分 route kind / style / arrow；不让展示路径修改业务关系含义 |
| S4 | [draw.io — Work with waypoints](https://www.drawio.com/docs/manual/connectors/waypoints-connectors/) | 2026-10-09/10 历史已读；waypoint 增删、坐标、清除、Follow Terminals | 采用手工点与恢复自动路由；不把 waypoint 作为业务节点 |
| S5 | [draw.io — Work with connectors](https://www.drawio.com/docs/manual/connectors/) | 2026-10-09/10 历史已读；floating / fixed endpoints | 独立指定端点展示锚点；不授权通过画布重连业务 source/target |
| S6 | [W3C WAI — WCAG 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | 2026-10-09/10 历史已读；除适用例外，应提供单指针非拖动替代 | 采用数值编辑、按钮、显式多选；**并未完成 WCAG 合规审核** |
| S7 | [MDN — Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) | 2026-10-09/10 历史已读；pointercancel、capture 与 touch-action 事件边界 | 二指加入/取消不提交及捕获释放；不将规范本身当实机运行证明 |

项目权威 P1–P14 与源码的具体链接、版本和“已读/待重核”见原索引 §2。最重要的：[Eidos Constitution](https://github.com/jiangxng/eidos/blob/df6b09c8b21f15bdd5b96c4983a54f21f49e7ccb/CONSTITUTION.md)、[Human Experience Design Authority](https://github.com/jiangxng/eidos/blob/df6b09c8b21f15bdd5b96c4983a54f21f49e7ccb/docs/product/EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md)、[Mobile Design Language](https://github.com/jiangxng/eidos/blob/df6b09c8b21f15bdd5b96c4983a54f21f49e7ccb/MOBILE-DESIGN-LANGUAGE.md)、[App project boundaries](https://github.com/jiangxng/EVO-App-Platform/blob/9920870b09b39885614732d582b3f937fe2366ff/docs/architecture/EVO-ECOSYSTEM-PROJECT-BOUNDARIES-v0.1.md)；基线代码 `src/diagram/surface.ts`、`viewport.ts`，App `apps/eog-2d-designer/definition-projection-editor.ts` 与 projection 合同。

**方案对比及张力（不得丢失）**：设计工具式比地图式更契合 Designer，但 Viewer 可使用另一导航模型；外部图编辑器是参考而非替换目标，**未选完整引入 React Flow / draw.io，也未授权收费绘图库**；手工路径是可保存的覆盖层而非自动布线全部手动化；SVG Canvas2D 与 WebKit 的字形轮廓不等价，不能以统一字体倍率推导跨平台零碰撞；不盲目扩展路由预算使 UI 卡死。原参考索引未声称读过 tldraw/Excalidraw/Figma/GoJS/yFiles 的特定文档，不能新增“已读”来源。

## D. GitHub 当前快照：按证据级别划分

| 层次 | 可核事实（截至 2026-10-10） | 证据 |
| --- | --- | --- |
| **[聊天/需求]** | B8r 优化自动正交路由；B8s 实机浏览器引擎的国际文字边界，下一轮 B8t+B8u；不得改变源/目标、手工路径、安全预算、主线 | 用户本轮最后状态、既有 B8RS 设计文档 |
| **[代码实现]** | Eidos [Draft #155](https://github.com/jiangxng/eidos/pull/155) `802edccfeca022b484a1d122b94e946e415ec67f`：`src/diagram/obstacle-routing.ts` A* Manhattan priority 和障碍占用缓存；`label-reservation.ts` RTL 1.25 宽度余量；`surface.ts` DOM `getBBox` RTL 校准、最多 256 个可见标签和只读 `data-eidos-diagram-caption-world-x`；专用测试与设计文档。Eidos #155 基于 [#154](https://github.com/jiangxng/eidos/pull/154) head。 | 已获取 PR changed-file 列表与每文件补丁，不是只读 PR 标题 |
| **[代码实现/集成]** | App [Draft #602](https://github.com/jiangxng/EVO-App-Platform/pull/602) `ed69eb538cee6eb13b5575f0af7cd5f3f9f667f5`：差分集成同构 Eidos vendor、RTL 跨引擎 / 全自动路由 Chrome 工作流与脚本、集成测试、证据矩阵。#602 基于 [#601](https://github.com/jiangxng/EVO-App-Platform/pull/601) head。 | 已获取 App PR changed-file 列表与每文件补丁 |
| **[CI 工作流结论已核验]** | Eidos 同 head **1/1 success**：[CI #38057230348](https://github.com/jiangxng/eidos/actions/runs/38057230348)。App 同 head **9/9 success**：包括 Integration、Platform、Project Continuity、Performance、Dense DOM、Complex DOM、34 tabs、Auto DOM、RTL。 | GitHub 按精确 commit SHA 查询工作流结论，并复核后三个关键 run 的 jobs/steps 和日志 |
| **[实际 Chrome 自动化]** | 34 个真实 Chrome 标签页同轮 DOM/CAS/编辑回归标记 PASS；B8r 100/300 和 200/600 合法自动正交图、真实 DOM 自动化 PASS。**注：最终 head run #38057259990 日志 2 次正式样本：100/300 mount 83.0ms、select 17.9ms；200/600 mount 82.5ms、select 31.8ms；与旧报告 #38056106595 的 116.2/39.1 和 164.6/63.5 不是同一轮测量，二者均不能转成生产性能 SLA。** | [最终自动路由 #38057259990](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38057259990)；[34-tabs #38057260254](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38057260254)；前轮 [#38056106595](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38056106595) |
| **[真实 Firefox/WebKit 引擎自动化]** | 最新 Linux runner 使用真正 Firefox 142.0.1、WebKit 26.0（Playwright）；阿拉伯 RTL、希伯来 RTL、英文词界、中日文/emoji × 双引擎 **8 样本**有效，原文保留，SVG `getBBox` 等真实断言通过；保留首轮 WebKit 多行锚点偏移的负证据和后续双层修复，不把首次宽度余量误说成充分条件。 | [最终 RTL #38057259961](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38057259961) 的 job 日志 `B8S_CROSS_BROWSER_RESULT`；历史失败/修正记于 B8RS 文档 |
| **[合并/部署/商用验收]** | 两个 PR **open + draft + unmerged**；不是 main 代码、更不是 production 部署。完整 §14 **39 项人工商业化验收仍 NOT TESTED**（即使自动化覆盖了大量子场景）。 | 精确 PR 元数据 + App 商业验收矩阵 |

**历史演进不丢失**：初始 A1–B4a PR 链见 #552 交接；B6a/b、B7/b、P01a、B8a–B8s 各阶段的 Chrome 证据及保留的限制见 App 验收矩阵。B8q 早期“90 秒复杂寻路瓶颈”曾误判：测试 fixture 末行生成非法 `n160/n320`，后纠正并在挂载前增加 production `validateDiagramEditorStateV010`；**不可继续引用那次失败证明路由慢**。B8s 初期 Firefox/WebKit 方向/全文成功不能等于严格 bbox 左右位置成功；后续检测暴露水平偏移，先失败再修复，最后才成功。

## E. 现在仍缺的证据与真正下一步

1. **B8t（建议先做）**：在不增加 22 个相关障碍/2600 网格点原预算的前提下，测试更大比例真正自动正交/圆角正交、多密度、多障碍图；明确 `full/coarse/node-only/congested` 分层、路由失败告警和成本；选择/拖动延迟、内存、温升/长期稳态，重复对照前后版本并固定合法 fixture，**不可把 12,001 条以 straight-heavy 为主的 B8o 降级测试宣称为 12k 全自动正交路由能力**。预算调整若必要须有新证据与明确决策，不得暗改安全兜底。
2. **B8u（与 B8t 交替推进）**：复杂混排脚本、emoji ZWJ、字体 fallback、字号/缩放、长 RTL 多行在 WebKit/Firefox/Chrome 的真实墨迹 bbox 与 label/route 避让；特别测试 256 个 RTL label 上限被触发时的诊断及性能。制定 Windows Chrome/Edge、macOS Safari/触控板、iPhone/iPad Safari、Android Chrome 的**实体设备**操作、撤销/失焦/cancel/regrab、44px 命中和文本可访问清单。当前 CI 无法代替。
3. **补足真实企业交付闭环**：真实客户图而非模拟 S2C/P2P fixture；保存/并发冲突/重启后数据回读、Readonly Viewer、业务权限、投影版本不增加，跨设备实际操作；真实采样与视觉评估。按原 §14 39 项逐行人工签收并关联证据，未完成前维持 NOT TESTED。
4. **继续沿现有文档留痕**：Eidos 2D 专项设计文档记录纯几何/UI，App 侧集成笔记与验收矩阵记录集成/Host/CI；新增调研注明是已读原文还是摘要、查阅时间和理由。独立 Draft PR，不更新全局权威/项目状态文件，不触碰 TR-01 主线；不要对同一文件在两个窗口并行提交。
5. **仍无法恢复的材料**：旧聊天的无损全量逐字稿、未保存的单机触控视频、真实企业数据样本与设备端验收、Windows/macOS/iOS/Android 的物理硬件表现；另须在真正计划改动时重核各项当前 GitHub head、交叉依赖和测试结果。本次恢复文档不把它们假定已存在。

**下次接续短路径**：本文件 → #552 历史入口/参考索引/44KB 原文 → Eidos #155 / App #602 最新 head 和 B8RS 设计记录 → App 39 项矩阵 → 只对 B8t/B8u 的真实缺口补研究和代码。
