# B8h — 多自环方向分配、向外错层与拥堵提示（2026-10-10）

## 基线、资料和已确认边界
- 交接与商业化研究继承 [EVO 2D Designer 研究 PR #552](https://github.com/jiangxng/EVO-App-Platform/pull/552) 及现有 §14 验收矩阵；本轮没有重新阅读外部网站原文，相关来源不冒充当轮网络实证。
- B8g 上游 [Eidos Draft #148](https://github.com/jiangxng/eidos/pull/148) / [App Draft #595](https://github.com/jiangxng/EVO-App-Platform/pull/595) 已通过 CI 和 20-tab Chrome；本轮 [Eidos Draft #149](https://github.com/jiangxng/eidos/pull/149) 与 [App Draft #596](https://github.com/jiangxng/EVO-App-Platform/pull/596) 均只堆叠在自己的 B8g 分支，不合并、不部署。
- 只改 2D 图形呈现和本地交互。保持业务关系 source/target、箭头、业务定义 revision、Agent 授权、投影 CAS、44 CSS px 热区、Save/Undo/Redo、Viewer 只读；不修改项目主线权威文件。

## B8h 可验收的实现决策
1. **多条同节点自环**：在同一节点按关系 ID 排序，先处理显式样式的自环。前序关系已用方向作为临时保留槽位，每条后续自动自环在节点可见障碍面积评分上再加同侧保留惩罚。四个空侧按右→下→左→上的稳定顺序分配，不受数据列举顺序影响；已手工编辑的自环从 waypoints 推断侧别，先占用该槽位而不改用户存储点。
2. **第五条及更多**：四侧均被前序关系占用时允许重复较优侧，而不是隐藏关系。重复使用侧的路径向外错层（每个同侧前序自环增加 32 世界单位延伸），保持几何可区分；重复侧标记为拥堵，而不是声称完全避碰。单条无遮挡右侧 SVG 与 B8g 严格一致。
3. **四侧节点拥堵**：通过原有四侧矩形相交面积计算最低冲突方向；若所选方向仍与其它可见节点区域相交，`geometry.congested=true`，Canvas edge hit path 加 `data-eidos-diagram-route-congested` 与可访问说明，旁边有不吃指针事件的紧凑感叹号提示。警示不缩小、遮盖 44 CSS px 指针区域；Viewer 同样通过相同 Surface 几何进行只读呈现。
4. **取消/重抓与保存**：B8f/B8g 的普通路径拖动与手工 side locking 原样保留；警示与保留槽位不产生持久字段、业务更新或自动 Save。手工提交后的路线优先按照原 waypoint 还原，不能被其它自环或邻接节点变化悄悄改方向。

## 排除方案和边界
- 不把全部四侧有交叉的关系硬称为已清除避障。多自环仍可能出现与其它业务连接线、文字标签或节点的局部覆盖；提示代表可编辑的拥堵状态，不是自动修复成功。
- 不把 44px 热区改小，不让 LLM 模拟鼠标，不把显示层拥堵写入企业主数据，不进行已有投影迁移。
- 当前多自环分配是**同一节点的局部启发式规划**，并非全图全局最优。若相邻节点特别密集、同侧有很多关系，可能仍然要手工调整。未针对任意别的连线、标签交叉做全局惩罚评分；应作为下一切片。
- 正式 §14 **39项验收仍 NOT TESTED**，实体 iOS/Android/Windows/macOS、触控板、多指中断、持久数据库重启和真实企业高度复杂图均不声明通过。

## 本轮测试矩阵
- Eidos test：单条原右 SVG 一致；四条自环稳定分配；第 5/6 条错层与诚实拥堵；四方向都被节点覆盖时拥堵/面积非零；手工侧别不跳；非法输入拒绝；Surface DOM 警示 pointer-events:none；B8f/B8g 测试继续通过。
- App 集成、浏览器专项：使用**隔离模拟自环关系**，不改真实业务定义。新增实际 Chrome 23-tab 场景检查 5 条自环的绘制、目标区域拖动、拥堵标记、Viewer 只读和四侧障碍警示；是否 PASS 必须以 [App Draft #596](https://github.com/jiangxng/EVO-App-Platform/pull/596) 最新运行报告确认，不能以计划代替实际证据。

## B8h 补充核验与优先级修正

- **手工路径优先**：同一节点的全部已保存手工自环先占外侧方向，不论其关系 ID 在自动自环之前还是之后；其余自动自环按稳定 ID 次序择侧。这样不会因新添 ID 更小的自环使先前保存的手工路径被覆盖或视觉交错。对应 Surface 代码与测试均已增加约束。
- [B8h Chrome 23 标签页实测 #38024189776](https://github.com/jiangxng/EVO-App-Platform/actions/runs/38024189776) **PASS**，Chrome/154.0.8037.97，日志 `b8hMultiLoopCongestionNativePointerViewer=true`；B8g/B8f/B8e/B8d/B8c/B8b/CAS 历史验证同时为 true。第 21 页：5 条合成自环稳定分右、下、左、上、右，第五条有警示和能命中的 44px bulge；CDP 原生鼠标拖动成功但不自动 Save。第 22 页真实只读 Viewer 仍保持原测试源的未保存形状。第 23 页四侧被模拟节点遮挡，所有自环均带 aria 拥堵说明和 pointer-events:none 警示。请勿将这项隔离测试解释为现网真实企业图验收。
- 代码、性能和浏览器最终是否都 PASS，以本轮 GitHub 最新 PR head 的 CI 为准；上一份浏览器运行是已完成的实证，但后续优先级修正仍需最新 CI 回归。
