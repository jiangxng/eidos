# Eidos 三列确认表（2026-10-29）

> UI 源码：`src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/renderers/html/index.ts`、`src/design-language/productive-workbench-css.ts`。来源是 EVO BEX-01 V3 可编辑 HTML 的 `#confirm`，仅抽取领域中立的三列表现。

## 目标与完成条件

让 Human 在独立确认步骤核对来源、新对象名称和可编辑类型；所有输入仍属于原 Form 和 Host 命令。

## 流程与步骤

应用提供完整、已授权的 reviewGroups 和 Form 字段；Eidos 仅按三列呈现，提交与返回由应用已有动作负责。

## 导航与信息架构

不新增导航；页面位置、返回路径由应用的 contextNavigation 和 reviewTask.footer 决定。

## 视觉与颜色

沿用 Eidos 表格边框、背景、文字和控件 token。桌面三列 30/40/30；700px 以下沿用卡片模式和触控尺寸。不固定行高。

## 记忆与注意力

只呈现确认任务必要的三项信息；不重复展示先前映射页的四列状态表。

## 无障碍与跨年龄

列头/行头保留语义；字段标签仅视觉隐藏，屏幕阅读器仍可读。手机卡片保留字段标题和 44px 控件。

## 安全与数据修复

`presentation` 只影响渲染，不改变字段键、值、校验、权限、Host 提交或确认语义；应用负责完整恢复路径。

## 证据与剩余问题

`npm run build`、`tests/design-language/design-language.test.mjs` 18/18 通过；真实桌面/手机浏览器和 Human 验收待取得。Platform 业务联动另行审查。
