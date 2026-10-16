# Eidos E1 Review Workspace｜Human UI 审查（2026-10-16）

## 目标与完成条件

让既有 Review Queue 在不丢掉原有问题、动作和业务证据的情况下，提供一眼可识别的当前对象、整体情况与需要处理的项。Human 不需要滚遍所有完整明细才能发现重要问题。完成条件是**Eidos 公共能力**可由任意已授权应用声明 `context`、`overviewMetrics`、`stateFilter`；不是 BEX 的最终截图验收。

## 流程与步骤

从已有的“标题→所有审核项目”变为“当前工作对象与来源→有意义的整体指标→筛选需要关注/全部→直接修改该项目→Host 提交/恢复”。筛选只隐藏已加载项目，不执行审批。全部选项始终存在，恢复后仍能查看完整授权数据。业务定义、精确受控操作保持原 Review Queue 使用者拥有。

## 导航与信息架构

不增加导航入口或新一层 Workbench；只是给 Review Queue 已有页面扩展可选上下文与状态筛选。仅局部视图过滤，不改变 Host route 或 Item ID；任何应用仍通过同一个页面或其他受控路由继续。

## 视觉与颜色

使用 Eidos Productive Design Language 的 4px 间距节奏、Business Office Visual v0.2 的浅背景/白色业务表面/中性边框、状态色仅用于有意义的异常数。紧凑文件/对象信息、可读指标和普通状态筛选，不复制供应商原型视觉资产。Eidos `src/design-language/productive-workbench-css.ts` 一处维护通用 CSS，无插件品牌特定颜色。

## 记忆与注意力

来源上下文与状态紧贴本次决定，整体摘要可提供真实数量和待处理数；筛选设置只调整本次界面内容，不覆盖 Host 状态，且随时可以回到“全部”。后续跨页面记忆与草稿属于 E3 + Platform 的真实持久化/Recipe。现阶段禁止假装已有保存能力。

## 无障碍与跨年龄

筛选使用原生有 label 的 select、键盘/屏幕阅读器可操作；可见条目计数通过 aria-live 显示，空结果有文字说明。窄屏重排且不靠水平溢出来显示。每个 Item 保持原表单、状态、label、焦点与 Host 动作。新原始值统一转义。测试验证中英文标签和机器 ID 不互相混淆；模拟验证不能代替真实设备/用户签收。

## 安全与数据修复

上下文、指标都是后端应用授权给当前页面的显示信息，Eidos 不重新计算字段决策、不估计主体类型、不猜重复银行业务用途。所有筛选选项只引用现有四种通用状态，要求至少一个包含全部状态的选项；非法、重复筛选和脏指标必须 fail-closed。原先 Host action 继续携带相同的 item ID、字段与受控命令；页面没有新增后台写操作。

## 证据与剩余问题

本阶段公共代码：`src/review-queue/contracts.ts`、`src/review-queue/render.ts`、`src/app-host/page-controller.ts`、`src/design-language/productive-workbench-css.ts`、`src/localization/localize.ts`。测试：`tests/review-queue/review-queue.test.mjs`，另有全部 Eidos Release Gate 和现有 Review Queue/App Host 回归。详细方案与 E2/E3/E4 责任见 `docs/architecture/EIDOS-REVIEW-WORKSPACE-PHASED-UPGRADE-20261016.md`。E2 的行内可编辑审核表与 E4 的真实 BEX `/map` 页面仍未完成；本 PR 不作为 V3 高保真落地签收。
