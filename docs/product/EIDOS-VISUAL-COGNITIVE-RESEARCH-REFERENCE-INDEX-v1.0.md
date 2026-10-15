# Eidos 视觉感知、认知记忆与注意力研究来源索引 v1.0

**状态：** Eidos 设计研究库补充索引（2026-10-15）。内容继承 EVO BEX-01 多轮研究，有明确来源阅读状态；这次对齐重点在于 Eidos 已有规范，不宣称在本轮重新打开了以下全部外部链接。

**权威优先级：** 本文件是**研究依据而非设计规范**。有规范冲突时遵循 [Eidos Human Experience Design Authority](EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md)、[Navigation & IA](EIDOS-ENTERPRISE-NAVIGATION-INFORMATION-ARCHITECTURE-v0.1.md)、[Productive Design Language](EIDOS-PRODUCTIVE-DESIGN-LANGUAGE-v0.1.md)、[Business Office Visual Language](EIDOS-BUSINESS-OFFICE-VISUAL-LANGUAGE-v0.2.md) 和可访问性/权限约束。研究被转化为 [Eidos UI 设计必检规范](EIDOS-HUMAN-UI-DESIGN-REVIEW-CHECKLIST-v1.0.md)。

## 1. 来源分级

- **H：本轮 GitHub 原有规范正文已核查**。适用于 Eidos 自身权威文档，不能替代重新审阅外部资料。
- **A（前序研究记录）：** 2026-10-15 BEX 研究文档记录网页已读正文；本窗口仅确认索引条目存在，**没有逐一重开外部原文**，因此不能把本次检查标成新读原文。
- **B（前序研究记录）：** 正式学术论文**只读题录、摘要**，并非通篇全文。
- **C（前序研究记录）：** 仅搜索摘要、原文未能打开，结论必须保守。
- **D：** 仍需补查或存在变动风险，尚不构成产品事实。

当前表格原样保留前序研究文档的「已读网页正文/论文仅摘要/搜索摘要」记录，对新窗口最有价值的部分是**具体章节、适用边界和 EVO 转译**。

## 2. 视觉研究（V01–V16，2026-10-15 前序研究）

| 编号 | 资料 / 原始网址 | 阅读状态 | 研究要点、章节定位 | EVO 应用 |
|---|---|---|---|---|
| V01 | NN/g, *5 Principles of Visual Design in UX*, https://www.nngroup.com/articles/principles-visual-design/ | **已读网页正文**，§Scale / Visual Hierarchy / Balance / Contrast / Gestalt；原文 2020，显示 2026-09 reviewed | 视觉五原则，重点稀缺性；部分建议将元素大小保持少数层级 | 限制字号层级、减弱大部分重复按钮 |
| V02 | NN/g, *Visual Hierarchy in UX: Definition*, https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ | **已读网页正文**，§Color and contrast / Scale / Grouping / Squint Test | 对比、尺度、组别与模糊测试 | L1→异常→CTA 的视觉次序 |
| V03 | NN/g, *Proximity Principle in Visual Design*, https://www.nngroup.com/articles/gestalt-proximity/ | **已读网页正文**，§Place Related Elements near Each Other / Proximity May Shift in Responsive Designs | 空白间距产生分组，响应式可能破坏关系 | 4 类业务组别与窄屏排列 |
| V04 | NN/g, *The Principle of Common Region: Containers Create Groupings*, https://www.nngroup.com/articles/common-region/ | **已读网页正文**，§Use/Common Region / Conclusion | 共同边界强化分组；过多容器和强分隔产生假页面结束 | 保留少量大组、减少逐行卡片 |
| V05 | NN/g, *Text Scanning Patterns: Eyetracking Evidence*, https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/ | **已读网页正文**，§Scanning Patterns / Summary | 多种扫视模式受任务/布局影响 | 左侧高价值字段与分组标题 |
| V06 | NN/g, *F-Shaped Pattern of Reading: Misunderstood, But Still Relevant*, https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ | **已读网页正文**；不能把 F 模式普遍化 | F 只是多种扫视中的一种 | 避免机械 F 型强制排版 |
| V07 | Tuch et al. (2012), *The role of visual complexity and prototypicality regarding first impression of websites*, https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/ （DOI: 10.1016/j.ijhcs.2012.06.003） | **已读正式论文题录与摘要；未读完整论文** | 两组实验；网页低复杂度与典型性影响早期审美印象；不能推断业务任务效果 | 降低无意义视觉复杂度的辅助证据 |
| V08 | NN/g, *The Aesthetic-Usability Effect*, https://www.nngroup.com/articles/aesthetic-usability-effect/ | **已读网页正文**，原理/设计限度 | 美观可能掩盖轻微可用性问题 | 必须做真正的数据纠错与用户验收 |
| V09 | IBM Carbon, *2x Grid – Guidelines*, https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/guidelines | **已读官方正文**，§Fit for purpose / Content hierarchy / Continuity and contrast / Style models | 模块对齐，布局随产品任务在默认与高密度间切换 | 轻概览与专业表格使用不同密度模式 |
| V10 | IBM Carbon, *Spacing*, https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview | **已读官方正文**，§Spacing | 2/4/8 倍数的间距比例系统 | 拟定节奏并匹配 eidos tokens |
| V11 | USWDS, *Table*, https://designsystem.digital.gov/components/table/ | **已读官方正文**，§Striped / Scrollable / Responsive stacked table | 表格有对比优势，窄屏可堆叠 | 22 列建议在表格中对齐审查，不堆表单 |
| V12 | USWDS, *Font size*, https://designsystem.digital.gov/design-tokens/typesetting/font-size/ | **已读官方正文**，§Theme tokens / System tokens | 文字比例体系，避免随意指定大量微小字号 | 中英文标题、正文与元信息层级 |
| V13 | W3C WAI, *Understanding 1.4.3 Contrast (Minimum)*, https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum | **已读官方解释正文**，§Success Criterion / Intent | AA 正常文本 4.5:1，大文本 3:1（有条件） | 控件与正文配色可读 |
| V14 | W3C WAI, *Understanding 1.4.11 Non-text Contrast*, https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast | **已读官方解释正文**，§UI Components / Focus | 重要非文字控件与状态可感知部分 3:1 | 选择框、焦点、状态图标可辨 |
| V15 | W3C WAI, *Understanding 1.4.1 Use of Color*, https://www.w3.org/WAI/WCAG22/Understanding/use-of-color | **已读官方解释正文**，§Intent / Examples | 颜色不是唯一信息手段 | 状态显示文字 + 图标而非红绿点 |
| V16 | GOV.UK Design System, *Summary list*, https://design-system.service.gov.uk/components/summary-list/ | **已读官方正文**，§When to use / When not to use / Summary cards | key/value 摘要可用；明示不适合一般 tabular data | 概览摘要使用，完整映射网格不用 summary-list |

## 3. 记忆、注意力、跨年龄与任务负荷（M01–M08，2026-10-15 前序研究）

| 编号 | 原始标题 / URL | 前序研究时的阅读状态 | 证据核心与章节 | Eidos/UI 设计用途 |
|---|---|---|---|---|
| M01 | Raluca Budiu, NN/g (2024), Memory Recognition and Recall in User Interfaces, https://www.nngroup.com/articles/recognition-and-recall/ | 已读原网页正文，§Recognition vs. Recall、§Promote Recognition | 可见选择和上下文帮助识别，历史活动提示恢复 | 历史映射/建议直接显示于来源列旁 |
| M02 | Nelson Cowan (2001), The magical number 4 in short-term memory, https://pubmed.ncbi.nlm.nih.gov/11515286/  DOI 10.1017/S0140525X01003922 | 已读 PubMed 正式题录和摘要，**未读论文全文** | 条件受控时短时记忆容量平均约四组块，不是所有场景的普适 UI 限制 | 不要求用户暂时记住 22 项选择；不创设「4 个按钮」规则 |
| M03 | W3C COGA (2021), Making Content Usable for People with Cognitive and Learning Disabilities, https://www.w3.org/TR/coga-usable/ | 已读官方指南相关 §4.5、§4.6.2、§4.6.3、§4.7.5 正文 | 减步骤、保留信息、避免丢失、能返回和更正；这是 Working Group Note，非 WCAG 额外合规门槛 | 同一页面双状态、持续上下文、草稿与恢复 |
| M04 | Kate Kaplan, NN/g (2021), Designing for Long Waits and Interruptions, https://www.nngroup.com/articles/designing-for-waits-and-interruptions/ | 已读正文及五项建议 | 中断与等待需要进度、历史、上下文摘要和后台进展 | 上次作业恢复与已保存的决定 |
| M05 | Lexie Kane, NN/g (2019), Usability for Older Adults: Challenges and Changes, https://www.nngroup.com/articles/usability-for-senior-citizens/ | 已读网页正文，Research Program / Changes Over Time / Challenges | 三轮研究总计 123 位 65+ 参与者；技术经验各异，排版和点击目标不可过小 | 不按年龄分流，所有人默认容易看、点、修复 |
| M06 | Raluca Budiu, NN/g (2013, revised 2024), Interaction Cost, https://www.nngroup.com/articles/interaction-cost-definition/ | 已读原网页正文，§What Is Interaction Cost | 成本涵盖阅读、操作、等待、切换注意力和记忆 | 减少真实工作负担，不只是计算点击次数 |
| M07 | National Institute on Aging, Memory Problems, Forgetfulness, and Aging, https://www.nia.nih.gov/health/memory-loss-and-forgetfulness/memory-forgetfulness-and-aging-whats-normal-and-whats-not | **仅看搜索结果摘要**，原站打开失败 | 年龄相关记忆变化存在但表现有差异，未证实其他细节 | 仅作为背景，不用于年龄阈值/能力标签 |
| M08 | NN/g, Usability for Senior Citizens: Improved, But Still Lacking (2013), https://www.nngroup.com/articles/usability-seniors-improvements/ | **仅看详细搜索摘要**，未打开全文 | 早期年龄组使用差异有特定年代数字经验影响 | 不将旧样本数字当作现今普遍定律 |

## 4. 流程与人机交互的前序参考（不扩大已读声称）

2026-10-15 BEX 流程研究另外记录了以下实用性来源和阅读状态。详细原始研究及对照见 [EVO 流程研究文档](https://github.com/jiangxng/EVO-App-Platform/blob/docs/bex01-import-ux-simplification-research-20261015/docs/plans/foundation-list-experience/BEX-01-IMPORT-UX-SIMPLIFICATION-RESEARCH-20261015.md) 与 [BEX 研究决策索引](https://github.com/jiangxng/EVO-App-Platform/blob/main/docs/plans/foundation-list-experience/BEX-01-RESEARCH-DECISION-REFERENCE-INDEX-20261015.md)。

| 编号 | 来源与原始网址 | 前序阅读状态 | 对设计的作用 |
|---|---|---|---|
| F01 | Apple HIG, Design Principles — https://developer.apple.com/design/human-interface-guidelines/design-principles/ | BEX 流程记录：**搜索摘要，原文无法读取** | 操作简洁与用户自主；不称已读全文 |
| F02 | Apple HIG, Disclosure Controls — https://developer.apple.com/design/human-interface-guidelines/disclosure-controls | BEX 流程记录：**搜索摘要，原文无法读取** | 渐进展开，不在首屏堆全部高级项 |
| F03 | NN/g, Progressive Disclosure — https://www.nngroup.com/articles/progressive-disclosure/ | BEX 流程记录：**读过网页正文** | 主要选择先可见、专业细节按需呈现 |
| F04 | NN/g, Ten Usability Heuristics — https://www.nngroup.com/articles/ten-usability-heuristics/ | BEX 流程记录：**读过网页正文** | 识别大于回忆、状态可见、错误可恢复 |
| F05 | GOV.UK Summary List — https://design-system.service.gov.uk/components/summary-list/ | BEX 流程记录：**读过网页正文** | 决策摘要可修改；大量字段明细应是表格而不是 summary list |

Eidos 原有 [DESIGN-RESEARCH-SOURCES-v0.1.md](DESIGN-RESEARCH-SOURCES-v0.1.md) 已记录 VS Code、Fluent 2、Carbon、Apple、WAI ARIA、Agent/混合主动等行业权威。这里不重复把旧清单所有链接算作本轮新阅读。

## 5. 研究冲突与规范裁决

1. **「极简」vs「操作/审计完整」**：用户感知可以缩短为上传与核对导入，但独立风险审批、权限确认、字段创建确认、dry-run 与最终提交不能假装消失。
2. **「总览少量信息」vs「专业全量审阅」**：首屏只展示关键业务结果/异常；完整字段可在同一上下文展开，不能删除细节。
3. **「工作记忆约四块」vs「控件数量」**：Cowan 的实验结论不等于硬性 4 个菜单；应用「系统记住用户选择」而非照抄数字。
4. **「跨年龄群体差异」vs「个体差异」**：不按年龄假定能力、不自动划分弱化权限模式；提供统一可读、可放大、可操作默认界面。
5. **「设计外观更简洁」vs「可访问性」**：不能为追求清爽使用低对比度、隐藏焦点、过小控件。
6. **「外部 Fluent/Carbon 具体 token」vs「Eidos 现行 token」**：外部数值是参考；Eidos 正式色彩、间距、字号等权威仍拥有决定权。
7. **「视觉第一印象」vs「业务成功率」**：Tuch 研究支持审美印象关联，不证明某个 ERP 页面导入更正确；需要实机测试任务时间、出错率和修复路径。

## 6. 易变化资料、保全边界和后续方向

- 官方网页可能更新；此索引保留原始 URL、章节和用途，但不镜像全文/附属截图。真正需要发表学术断言时优先寻找 V07 和 M02 论文全文，不从摘要推出未经验证的细节。
- BEX 的用户截图依赖聊天附件，**未另行存放在 GitHub**，交接需记原消息/Import Job ID 并在获得原件后追加永久附件。
- 继续研究优先方向：任务中断后可恢复性的真实实测；对不同数字经验用户的比较试验；Eidos 的原生表格/行内决策交互能否复用，而不是另造 CSS。
