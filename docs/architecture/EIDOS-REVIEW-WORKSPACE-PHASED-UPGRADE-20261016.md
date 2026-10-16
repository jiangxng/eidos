# Eidos｜从独立控件到业务审核工作页：阶段性升级评估与门禁（2026-10-16）

**评估类型：** Eidos 正式设计语言下的前端框架能力审计，不是客户业务系统需求说明或新产品皮肤。Eidos 基线 `main@a082de4cc03a448e368881fd025be9dd8deee448`。Platform 业务体验保留在其应用中，客户真实 Job 的状态不能从设计原型推断。用户提供了当前真实 `/data-import/jobs/.../map` 截图及 V3 高保真原型对比；详细原型存 Platform Draft [#909](https://github.com/jiangxng/EVO-App-Platform/pull/909)，不应直接合并为产品代码。

## 评估结论与权威

**需要阶段性升级 Eidos，但不需要替换设计语言或重写框架。** 已读 Eidos 以下主仓原文：

- `docs/product/EIDOS-HUMAN-EXPERIENCE-DESIGN-AUTHORITY-v1.0.md`
- `docs/product/EIDOS-EXPERIENCE-ARCHITECTURE-CONSTITUTION-v0.1.md`
- `docs/product/EIDOS-PRODUCTIVE-DESIGN-LANGUAGE-v0.1.md`
- `docs/product/EIDOS-BUSINESS-OFFICE-VISUAL-LANGUAGE-v0.2.md`
- `docs/product/REVIEW-QUEUE-EXPERIENCE-PATTERN-v0.1.md`
- `docs/architecture/GENERIC-GROUPED-FORM-REVIEW-v0.1.md`（Eidos #187）
- 实际代码 `src/review-queue/`、`src/catalog-browser/`、`src/data-grid/`、`src/runtime/`、`src/app-host/page-controller.ts`。

**权威顺序：** Experience Architecture（Human 任务/状态/完成、反馈恢复）→ Navigation / IA → Productive Design Language（决定、证据、密度）→ Business Office Visual v0.2（办公视觉、色彩、字体、移动端）。只凭浅色卡片、折叠或 6/6 CI，不能声称已实现完整业务体验。

Eidos 的五项正式原则为**功能就近、信息就地、系统记忆、异常驱动、操作连续**。本次评估将其转为可测试交付；每一层新增契约都不得预设“供应商/Excel/银行/导入”，否则属于 Platform 业务职责。

## 现有公共能力与差距

| Eidos 已有能力 | 可复用部分 | 缺口／约束 | 决定 |
| --- | --- | --- | --- |
| `Form` + #187 `reviewGroups` | 原命令、label/option、字段状态、折叠详情 | 20 多列仍需一条条浏览，不能独立提供文件上下文、整体进度、异常优先及可编辑表格 | **继续复用**，不再把 Form 视为完整审核工作页 |
| `review-queue@0.1.0` | 问题、证据、字段、状态、就地修复动作，Host 执行权限 | 没有页面级当前对象/文件/任务、整页指标、可过滤的需处理视图 | **E1 小步增强**，向后兼容 |
| `catalog-browser` | 列表、只读表格、查找、分页与动作 | 表格 `cells` 只接受纯值，不能直接选择对应字段；强加表单会侵犯责任边界 | 不勉强改为映射编辑器，**E2 另做通用可编辑审核表格契约** |
| `data-grid` | 内存筛选排序与选择模型 | 没有完整 Eidos 交互呈现/ Host 决策提交契约 | E2 可复用语义，**不另起一套业务数据表** |
| `setup-flow` + Experience descriptors | 步骤语义、页面状态、导航 | 导入页面跨步骤的真实恢复/失效/预检查由 Platform Host 控制 | **E3** 公共步骤/反馈呈现，Host 持久化仍由 Platform 担当 |

## E1｜当前实施：通用审核任务上下文、总览和状态筛选

**Eidos owner：** `src/review-queue/contracts.ts`、`src/review-queue/render.ts`、`src/app-host/page-controller.ts`、`src/design-language/productive-workbench-css.ts`、`src/localization/localize.ts`。

新增可选 `context`（任务对象标题、上下文事实及状态）、`overviewMetrics`（真实业务数据由 Host 提供的整页汇总）、`stateFilter`（已授权加载项目的纯视图筛选）。之前 Review Queue 不传这些可选属性时必须逐字语义兼容，不得改变命令、授权、表单字段或副作用。过滤始终有“全部”入口；选中只改变当前已授权项目的浏览器可见性，不删除 Host 数据或修改审核决定。标题/原值等所有可变文本需安全转义。须满足键盘、屏幕阅读器状态、窄屏和中文。

**验收：** Eidos `npm run release:check` + 原 Review Queue 契约测试、新增合法/非法状态过滤、原状态恢复与本地化回归、Human UI 设计门禁；最新 main 无冲突后才合并。E1 完成只证明框架可组合这些概览，不等于 BEX 页面已更新。

## E2｜下一步：可编辑、可过滤的业务审核表格（影响最大）

**框架需求：** 可配置列（业务对象/示例/待选择目标/状态）、一行一个明确决定、从真实字段选项即时选择、排他目标反馈、行级例外/证据查看、需要关注/全部/待处理切换；手机使用语义卡片保证每个控制可见。Eidos 必须提供键盘焦点、输入标签、只读/待决/已确认状态、撤销选择的通用交互合同。不要复制 #909 的固定 HTML、表头或业务类名。选择结果继续送到 Platform 已有 Host `DATA_IMPORT_REVIEW_COMMAND`；真实可选 field ID、候选用途、默认建议、权限、一对一验证都归 Platform。

**验收：** Eidos 公共组件契约和浏览器示例；Platform 只能依赖已合并的组件版本。使用用户真正的 `#/data-import/jobs/:id/map` 路径做 22 列/20 待确认、桌面和 390px 输入可达测试，并与**当时的高保真原型截图人工对照**；仅通过某个独立批量审核路径不算通过。

## E3｜业务流程连续性与反馈

应用按 Experience Architecture 提供任务上下文/阶段、已保存与未保存的清晰反馈、预检查前后状态、问题数及重新验证的提示、最后唯一主操作、回退/撤销/恢复位置。Eidos 只规范语义布局与反馈，不在客户端创建第二个持久化数据库、不决定 Schema 或用户主体身份，也不自动提交。

**验收：** Eidos 公共体验契约 + Platform 实际 Job 断点恢复、Host revision 检验、三条缺失 `subjectType` Human 核对、两个同名银行 field ID 选择、无目标/忽略可撤销、重检/二次提交阻止及权限回归。原始来源列与单元值完整保留。

## E4｜正式 Platform 消费与 Human 验收

按页面 owner 修改 `apps/data-import/page.ts` 及必要的插件 Experience；应用层将真实 Host Job 投影为文件卡片、真实统计、需处理问题与可编辑映射表。不得把业务逻辑搬进 Eidos。**验收以用户正在使用的真实地址、真实数据和视觉原型逐项对照**，不能拿另一个路由的测试、静态 demo 或“折叠表单”替代。只有视觉和 Human 交互确认后，才能称 V3 高保真已落地。Platform main 正常合并后可由已有 Railway main 开发服务自动部署。

## 协作与治理门禁

1. 每阶段单独、最小 PR，先 Eidos 框架 owner、再 Platform 消费；不在一个 PR 混 Eidos/Host 商业规则/Agent、不得直接改 Platform main。  
2. PR 审查必须同时核对：权威、行为、源码的真实 owner、真实 Host、中文 390px/可读性、恢复、证据等级。  
3. 不扩散旧过程分支：正常合并并清理分支，保留开放研究 PR #909，不把合成 172 行数据当客户文件。  
4. 每段报告 **目标｜完成｜验收｜距离最终 V3 还缺什么**，不能用 PR 个数作为倒计时。  

**当前完成范围：** E1 在独立 PR 开发验证中；E2/E3/E4 均未实施，不得宣称 Railway 已获得 V3 原型全体验。
