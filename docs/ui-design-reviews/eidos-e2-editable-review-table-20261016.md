# Eidos E2｜公共可编辑审核表格设计与 Human UI 审查（2026-10-16）

## 目标与完成条件

承接已合并 E1 [PR #188](https://github.com/jiangxng/eidos/pull/188)，解决现有 Eidos Form（含 #187 分组）缺少**四列可编辑对照工作表**的问题。E2 提供框架级 `reviewTable`：每个已有 `reviewGroups` 只出现一行；四列为对象、证据、可直接编辑的决定和状态；用户按需查看行的次级字段。不是复制供应商、Excel 或“开户银行”专属页面。完成条件为已授权的同一 Form field key 和原 Host Command 仍被正常提交，默认过滤视图保留“全部”，不隐藏/清空数据。

## 流程与步骤

从已验证的 existing Form Review Groups 扩展为：查看需要关注/全部 → 在原行确认来源值 → 原生选择目标 → 按需展开详情 → 现有表单提交。主选择始终可见，筛选只改变当前已渲染行的展示，不重建字段或触发后台写入；所有隐藏行值仍留在 DOM 中并由原 Host 校验。一个表格只显示一个主动作，任何创建/提交仍由 owning Host 另行授权。

## 导航与信息架构

同一个 Form UIDL 的 `reviewTable` 是可选公共实现，不改 Workbench 路由、目录、权限或页面 archetype。选择行携带 `reviewStatus`（通用业务状态 key、可读 label、语义 tone），筛选选项也是中立 statusKeys，并强制存在覆盖所有状态的“全部”选项。当前应用通过原 `reviewGroups` 字段引用关联主/次字段，不复制第二份映射或隐式构造业务记录。

## 视觉与颜色

遵守 Experience Architecture + Productive Design Language + Business Office Visual v0.2：白色业务表面、中性表头、四列布局、控制保持 32–36px 桌面密度、辅助值自然换行；非装饰性状态才使用 warning/positive。手机宽度不将四列压缩成不可点击的小字，而是**相同语义的逐行卡片**，每张卡的目标 select 和状态可读、触控控制不低于 44px。CSS 由 Eidos `src/design-language/productive-workbench-css.ts` 的已有 token 维护，没有应用私有配色或原型 HTML 拷贝。

## 记忆与注意力

每行标题、原始/证据摘要、选择和状态出现在同一区域，用户不再需跨屏记忆；详情用 Eidos 已验证的原生 details。筛选栏立即呈现可见项目数，全部记录一键可达。当前 Form 输入不会因筛选或折叠失去值。跨页面选择、Recipe 和历史决策保持 owning Host 的持久化责任，不在 Eidos 伪造 localStorage。

## 无障碍与跨年龄

HTML 原生 `table` / `thead` / `th scope=row/col` 赋予语义列关联；浏览器窄屏通过响应式 CSS 重排而非切换另一份不受控数据。行内 label 与原 select 绑定，focus-visible 依托既有 Eidos Form。筛选是有 label 的 select，aria-live 宣告可见行数。测试需验证 390px 中文、键盘、200% 放大及真正 Host 业务页面控制可达；框架合同测试成功不能代替 downstream Human 视觉验收。

## 安全与数据修复

`src/runtime/validate.ts` 强制四列表头齐备，所有组有合法状态，筛选只引用已声明状态，防止重复选项、非法值、无“全部”选择或不存在的 field key。Eidos 不自动决定二义性候选、不选择主体身份，也不能根据折叠/筛选改变 Host 授权。所有用户原值按 HTML 规则转义，原字段排他选择及禁用校验继续由标准 Form + Host 管理。直接将该表格用于客户数据前，Platform 应核查真实两项同名字段的有效 field ID 和当前导入 Job。

## 证据与剩余问题

本 PR 仅修改 Eidos `src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/runtime/render-model.ts`、`src/renderers/html/index.ts`、`src/app-host/page-controller.ts`、`src/design-language/productive-workbench-css.ts` 和 `tests/contracts/runtime.test.mjs`。框架 E2 不得进入 Platform 业务权威文件或发布 Railway。待独立 CI 全绿后，**Platform 阶段 E4 才把当前实际 `#/data-import/jobs/:id/map` 的 22 列表单转为此 Eidos 通用四列表格**，用已授权真实 Job、桌面+390px 浏览器、原型截图和用户 Human 验收；E3 流程状态与 E4 仍未完成。本轮承接 [阶段治理文档](../architecture/EIDOS-REVIEW-WORKSPACE-PHASED-UPGRADE-20261016.md) 的 E2，不重做已合并的 E1 或 #187。
