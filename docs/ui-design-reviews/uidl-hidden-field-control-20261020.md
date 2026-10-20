# Eidos｜不可见 Host 身份字段（2026-10-20）

## 目标与完成条件

支持通用表单保留 Host 必需的不可变身份值，而不为了提交一个唯一选项的内部 ID 强迫用户看到冗余选择器。完成条件是：隐藏值仍有稳定 name/value，进入既有 Host command 提交；默认表单与未显式声明 hidden 的字段完全不变；无初始值、文件控件或带上下文导航的 hidden 字段必须被严格拒绝。

## 流程与步骤

业务应用在 UidlField 上显式声明 `hidden: true` 和 primitive `initialValue` → validator 校验形状 → render model 保留该标记 → HTML renderer 输出有 name、semanticType、value 的原生 hidden input → 现有表单序列化与 Host 命令处理继续运行。该能力不发起请求、不执行命令，也不在客户端推断权限。

## 导航与信息架构

改动文件：`src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/renderers/html/index.ts`。这是通用 UIDL 字段呈现能力，不包含 Platform 路由、供应商字段或具体 Host 命令。上下文导航依然应使用既有 contextNavigation/contextLink，不允许 hidden 字段承载导航。

## 视觉与颜色

隐藏字段不生成可见 label、select、输入框、占位或额外间距。普通字段的现有 Eidos 设计 token 与 CSS 不变。隐藏值只是表单序列化细节，不是新的视觉控件或主题。

## 记忆与注意力

只在字段本身明确声明 hidden 时启用；未声明 hidden 的普通表单不变。避免用户把注意力耗费在不可编辑且仅有一个选项的技术 ID 上，同时不删除文件名、任务统计或真实审核问题等必要业务信息。

## 无障碍与跨年龄

隐藏字段不是用户可交互控件，不进入 Tab 顺序，不要求屏幕阅读器朗读；因此只允许 primitive initialValue，不能包含 contextLink 或 file input。所有可编辑字段仍保留原有标签、焦点顺序与验证行为。Host 身份字段是否可隐藏由业务应用决定，不是自动推断。

## 安全与数据修复

隐藏值仍是客户端提交数据，绝不视为授权或可信身份。Host 必须继续从授权上下文校验 importJobId、租户、主体和命令权限；hidden input 可被客户端篡改。validator 要求 primitive initialValue，拒绝缺值、file control 和 contextLink。此改动不放宽任何 Host authorization 或 command contract。

## 证据与剩余问题

变更与回归文件：`src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/renderers/html/index.ts`、`tests/contracts/runtime.test.mjs`。测试覆盖合法 hidden input、无可见 label、render model 保留标记、ActionRequest 保留值、非法标记与缺少初始值。CI 和 Human UI Design Review Gate 必须在该 PR 的精确 HEAD 上通过；当前此文档只记录设计与实现，不等于 UI 质量人工签收或生产授权。


## 补充：文件摘要卡图标标记

为支持真实导入工作台原型中的 XLSX/CSV 文件标记，Review Task subject 增加可选的 `iconLabel`（1–8 字符，仅装饰）。Host/应用必须明确提供，不根据文件名猜测业务身份。HTML renderer 将其输出为 `aria-hidden` 的文件类型标记，Eidos CSS 使用现有设计 token；未提供时普通任务标题布局保持不变。回归覆盖合法 XLSX 标记、CSS 规则与超长标记拒绝。图标不承载状态或权限含义。
