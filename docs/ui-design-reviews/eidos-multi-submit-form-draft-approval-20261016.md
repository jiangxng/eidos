# Eidos Form｜区分“保存未批准草稿”和“正式批准”两类提交（2026-10-16）

> **准确源码路径：** `src/runtime/contracts.ts`, `src/runtime/validate.ts`, `src/runtime/action.ts`, `src/runtime/render-model.ts`, `src/renderers/html/index.ts`, `src/app-host/action-executor.ts`, `src/app-host/page-controller.ts`。回归：`tests/contracts/runtime.test.mjs` 和 `tests/app-host/action-executor.test.mjs`。
>
> 需求源于 [Platform BEX-01 V3](https://github.com/jiangxng/EVO-App-Platform/pull/909) 的“未提交选择应保存，但创建企业字段必须独立批准”。原型用 localStorage 暂存，是**模拟实现**，不适合作为真实企业数据审计和权限隔离的依据。本 PR **只补 Eidos 通用 Form 的明确次级提交动作**，不擅自增加前端离线缓存或 Host 业务写入。保留既有 Eidos Design Language 与 Human UI gate。

## 目标与完成条件

一次 Form 审核可以有至多三个**明确声明**的提交意图。例如“保存草稿”（无批准）与“批准创建企业字段”（需确认）是两个不同的 Host command，不能用一个按钮做危险的模式切换。每个意图必须有唯一 action id，非首要提交动作必须声明目标命令；选择哪个按钮由用户实际的 submitter 决定，Host 收到的是匹配的 ActionRequest。未知 action id 必须在调用 Host 前拒绝。

## 流程与步骤

保留表格的字段选择、来源证据和状态。首要提交动作继续使用 Form 自己的权威命令；其他提交动作在同一表单操作区显示文字明确的独立按钮。用户按下“保存草稿”只会生成该按钮声明的 save-draft command，请求 **不带审批语义**；按下“批准”才使用具备确认要求的批准命令。没有自动点击、自动批准或 Form 值的浏览器永久储存。

## 导航与信息架构

Form 页面不新增路由、没有额外子页面，多个提交按钮复用相同字段值和 Eidos 单一 validation。产品归属者可据具体权限和数据生命周期选择哪些声明动作应显示；Eidos 不替业务决定草稿应该存在哪里或何时恢复。首次提交按钮保持兼容默认 `submitAction` 模型。

## 视觉与颜色

复用 Eidos 既有 Form 按钮及主题、文字、focus 态，不引入 BEX 私有类，也不改变字段四列和移动端表格布局。次级动作的标签承担了“是否批准”的主要语义。后续可依据正式设计语言区分视觉层级，但不能仅凭颜色识别批准边界。

## 记忆与注意力

保存草稿让审核者能够先整理证据再正式审批，减少因为离开当前页面而重复决定。由于本 PR 只提供框架级提交桥，**不宣称已经实现草稿保存及恢复**；下一阶段必须由 Platform 提供受权企业上下文中的持久化命令及回显，禁止继续使用无租户隔离的 localStorage 模拟。

## 无障碍与跨年龄

提交动作使用原生 `button type=submit`，保留可读文本、键盘提交、可聚焦行为。原生 submit event 的 `submitter` 决定实际 action id；没有或不支持 submitter 时默认为唯一/首要提交，不允许根据用户提交的隐藏字段选择任意 command。所有按钮在请求进行时同时禁用，避免重复批准与并发写入；动作完成后恢复。

## 安全与数据修复

此升级不会绕过 Host enterprise 权限、主体身份、字段映射排他、字段定义确认、导入 Dry Run 或 Commit。Eidos 只将**UIDL 显式声明**的不同 command 发往 ActionHost；完全拒绝伪造/未知 action，次级 submit 没有声明 command 也不能通过协议验证。Host 仍有最终鉴权义务，即使 Form 声明了命令也不代表授权。单一 submit 的旧 Form 行为不能回归。

## 证据与剩余问题

变更后须在 Eidos 构建测试、UI Gate 验证两个提交按钮的 HTML、Request.actionId、command 及 requiresConfirmation 均正确，对伪造 action 的执行数保持为 0。下一阶段才由 Platform 接入明确的草稿保存 action、受权 Job 持久化、重新打开恢复和 V3 正式审核回归。当前真实客户 Excel / Railway 登录现场的 Human 视觉签收未取得，因此不能宣称 V3 整体完成。
