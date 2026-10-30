# 互斥选择中的已占用候选

## 目标与完成条件

在导入字段核对等任务中，操作者打开下拉框时能看见哪些候选已由其他来源列使用，并且不能重复选择。业务提交继续由 Host 校验。

## 流程与步骤

保留当前表单和原生 select。具有互斥声明的字段可以选择显示已占用候选及本地化文案；其他使用者继续沿用隐藏候选的既有行为。更改选择后即时更新其他控件，释放的候选重新可选。

## 导航与信息架构

这是 `src/app-host/page-controller.ts` 内的表单控件行为，无新增页面或导航。状态直接出现在对应字段的选项中。

## 视觉与颜色

使用浏览器原生禁用选项和 Eidos 现有 select、焦点、颜色与布局，不添加局部调色板。状态用文字而非仅用灰色说明。

## 记忆与注意力

已占用字段仍可见，操作者不用在多个来源列之间记忆字段去向；重选、释放与重置时，选项由当前表单状态重算。

## 无障碍与跨年龄

禁用选项使用 HTML `disabled`，文案说明占用状态，保留原生键盘操作、屏幕阅读器语义及移动设备原生选择器。

## 安全与数据修复

只控制本地候选可选性；既有任务中重复映射的当前值不被静默改写，服务端仍负责拒绝冲突。无新增权限或数据写入。

## 证据与剩余问题

V3 来源：Platform 原型 `docs/plans/foundation-list-experience/BEX-01-IMPORT-V3-IN-CONTEXT-HIGH-FIDELITY-20261015.html`，blob `9f57e9320eb527786ff7b737be27777eba6f8a92`，`fillMappings()` 将其他列占用的 option 禁用并附加“已占用”。本轮修改 `src/app-host/page-controller.ts`、`src/runtime/contracts.ts` 与 `src/runtime/validate.ts`；`npm run build`、`node --test tests/contracts/runtime.test.mjs` 通过。真实 Host Chromium 与 Human 签收由 Platform 消费端另行记录，当前尚未取得。
