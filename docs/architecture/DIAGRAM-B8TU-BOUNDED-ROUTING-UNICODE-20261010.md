# B8t + B8u｜2D Designer 有界寻路与国际化边界验收准备（2026-10-10）

## 定位与安全边界

- 本轮是 B8r+B8s 后续**两个独立专项增量**，不重新研究既有官方资料；[前序决策文档](./DIAGRAM-B8RS-AUTO-ROUTING-CROSS-BROWSER-20261010.md)和 [旧研究恢复入口（docs-only Draft）](https://github.com/jiangxng/eidos/pull/156)继续有效。
- [Eidos Draft #157](https://github.com/jiangxng/eidos/pull/157) 是基于 Eidos #155 的测试增量；[EVO-App-Platform Draft #604](https://github.com/jiangxng/EVO-App-Platform/pull/604) 基于 App #602。**均不合并、不部署，不影响 TR-01。**
- 本轮 Eidos 侧没有改动 `routeDiagramOrthogonalV010` / `diagramCaptionLayoutV010` 的正式源代码。仍沿用相关障碍 **22**、网格点 **2600**，不可达时明确返回 `undefined`；`source/target`、手工路径、Host/Agent 授权和业务历史不变。

## B8t｜不是把 12,001 条降级图冒充全自动正交

已提交 `tests/diagram/diagram-b8tu-budget-grapheme.test.mjs` 与 App vendor 对应测试，直接执行真实 Eidos 的纯几何函数，校验：
1. 22 个相关障碍仍能确定性选择安全绕行，重复运算结果完全相同且全段与 **14 world-unit 清障区**不交叉。
2. 23 个相关障碍命中原安全上限，返回 `undefined` 而非静默绘制碰撞路径。
3. 大量**无关的远处障碍**不挤占局部路由上限。
4. 64 组合法路线验证起终点、安全性；有界搜索合法拒绝不得假装成功。

App 工作流另新增 `EVO_AUTO_B8T=1` 的**更大合成图** 300 节点/900 边和 400/1200 边，所有关系均真实自动 `orthogonal / rounded-orthogonal`（不插入人工 waypoint）。调用 Eidos `validateDiagramEditorStateV010` 合法性检查后才启动真正 Chrome，记录每档独立预热、两轮样本、完整 SVG DOM 节点/边数、选择与原生 CDP 拖动耗时、JS heap、墨迹精度和降级警示。原始 B8r 的 100/300、200/600 和 B8o 的 12,001 straight-heavy 原结果、模式、日志不变。

[App B8t 实测 #38058967105](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38058967105) 的首个独立 2 轮样本：300/900 挂载 147.9ms、选择 74.8ms、拖动 CDP p95 20.43ms、JS heap 4.72MB；400/1200 挂载 179.6ms、选择 94.3ms、CDP p95 22.68ms、heap 6.73MB。测试 5/5 PASS。**仅对当轮合成 fixture 和 runner 成立，不得据此声称真实企业生产 SLA、12k 全自动正交或实体 FPS。**

## B8u｜强脚本字体与可见标签上限

Eidos 新增回归检查带注音希伯来文、复杂 Unicode 组合、ZWJ 家庭/职业 emoji 的词界和字素边界，保障最长四行、最终省略号、RTL 方向、同一预留框与重复确定性。

App `tools/diagram-cross-browser-label-proof.mjs` 在原 4 组 × Firefox/WebKit 基础上追加：
- 带音标的阿拉伯文、带元音标记的希伯来文和英文 + Indic/CJK + ZWJ emoji 混排，合计 **7 样例 × 2 引擎 = 14** 次真实 SVG 排版断言。
- SVG 实际 `getBBox()` 左右位置、宽度与 Eidos 同一世界坐标预留范围；原文保留、字体度量差异记录；不能要求 Linux WebKit 与 Firefox 像素尺寸一致。
- 专门构造 258 条带 RTL 标签的边，检测**实际可见**标签超过现存单 render 最多 256 次 `getBBox` 校准的诊断。前轮首测对默认 258 条**未选中**边直接检查标签数量，结果为零；定位原因为 Eidos 的有意显示契约：>18 边时默认不展示普通非关联关系标题，只有选中/关联关系才展示。测试随后改为先选中 258 边共用端点，让对应标题确实绘制，再验证上限。保留首次红色 [CI #38058967083](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38058967083)，不得误将“密图隐藏文字”认定为字体故障。

## 验收等级及还欠缺的事项

- Eidos [#157 首轮 CI #38058814582](https://github.com/jiangxng/eidos/actions/runs/38058814582)：`npm run release:check` 321/321 PASS，含新增 5 条。
- App 完整最后提交的 CI 必须按 **最新 head SHA** 重新核验；任何老 run 的成功不能冒充后续提交验证。
- 没有进行 Windows/macOS/iOS/Android **实体设备**、真实企业数据、大量全自动路径长时间稳态 FPS、数据库重启持久化及 §14 **39 项正式商用验收**。继续保持 `NOT TESTED`，子场景 CI PASS 不转化为整项人工签收。

## 后续可以不暂停确认继续推进的方向

B8t 下一档采用固定合法合成图加强有界退化/告警和重复多轮内存；B8u 补 Safari/iOS、macOS 与 Windows 系统字体以及真实鼠标/触摸板/手机手势，与团队一起逐条完成人工验收。不得扩增现有全局路由上限来骗取通过。
