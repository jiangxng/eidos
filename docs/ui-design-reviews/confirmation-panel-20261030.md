# Confirmation panel for focused review

## 目标与完成条件

在已建立任务上下文的表单中，操作者核对一组待确认的字段，能把说明、表格和返回/确认操作识别为同一个决定区域。仅对现有 `reviewTable.presentation: "confirmation"` 生效。

## 流程与步骤

保留原 Form 的输入、Host 命令、键盘顺序和提交行为；将字段表和操作区放在同一白色确认面板内。表单顶部仍是任务标题/阶段，文件等来源事实仍在面板之前。

## 导航与信息架构

这是任务内的确认步骤，不新增入口或页面。返回操作仍由现有 `reviewTask.footer.back` 路由提供；确认按钮仍是唯一主操作。

## 视觉与颜色

采用 Eidos Business Office 的浅色页面、白色面板、轻边框和语义蓝色按钮。面板包含局部标题/说明、三列表格与底部分隔线；不复制业务原型的私有 CSS，也不改其他表单。

## 记忆与注意力

来源文件和当前步骤紧邻决定区域；表格行保留来源列、目标名称和类型。返回后恢复既有 Import Job 的选择，不要求操作者记忆上一屏。

## 无障碍与跨年龄

使用原生 form/section/table/select/button，保持标题层级与焦点顺序。窄屏依现有 Review Table 语义重排，控件和操作至少 44px，不依赖颜色区分操作。

## 安全与数据修复

结构与样式不改变提交的值、权限和 Host 预检查。失败与取消仍由原业务路径处理；此通用组件不会自行创建字段或导入数据。

## 证据与剩余问题

Platform 已批准 V3 原型 `docs/plans/foundation-list-experience/BEX-01-IMPORT-V3-IN-CONTEXT-HIGH-FIDELITY-20261015.html` blob `9f57e9320eb527786ff7b737be27777eba6f8a92` 的 `#confirm > .panelbody` 将标题、说明、表格、操作区放在同一面板。上轮只实现三列与颜色变量，实际页面仍分散。Eidos 本轮修改 `src/renderers/html/index.ts` 与 `src/design-language/productive-workbench-css.ts`，`npm run build`、设计语言测试 18/18 PASS。实际浏览器及 Human 签收仍独立，不能据源码判定完成。
