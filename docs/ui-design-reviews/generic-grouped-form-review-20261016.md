# Eidos Generic Grouped Form Review — Human UI Design Review (2026-10-16)

## Experience owner and source files
Reusable Eidos UIDL Form contract, validator, render model and HTML renderer are the owner, with Eidos Productive Design Language token-based CSS. Changed files: `src/runtime/contracts.ts`, `src/runtime/validate.ts`, `src/runtime/render-model.ts`, `src/renderers/html/index.ts`, `src/design-language/productive-workbench-css.ts`. This is **not a BEX application page** and does not own a business importer or business storage.

## Human intent and navigation
The user scans many peer decisions without hunting through dozens of full-width independent input sections. Each review group preserves one directly operable primary select while optional supporting inputs remain available via a keyboard-accessible native disclosure. Plain form fields and existing action navigation keep their current behavior. No navigation rewrite or special one-off application route.

## Information hierarchy and cognitive load
A title and bounded source summary identify each group; primary choice is never inside collapsed details. Supporting form fields remain exactly one per declared key and belong to that group, accessible by expanding “Details”. A user may review or change a secondary field without losing the current choice; collapsing never drops input values or changes action IDs.

## Visual and typography
Token-based Eidos spacing, muted text, boundaries and focus outlines. Two-column desktop primary decision layout and one-column narrow-screen layout; no fixed pixel widths beyond a responsive threshold. No custom colors, product logos, glyphs or per-client CSS; Eidos owns all generic styling.

## Accessibility and responsive
Native `details/summary` has keyboard and assistive technology semantics. All fields keep visible labels; focus visibility is explicit. No important state communicated solely by color, no pointer-only controls, no disappearing primary submit. At narrow width content stacks and text wraps, preventing long sample strings from forcing horizontal scrolling. Programmatic contract tests do not replace real browser/Human visual acceptance.

## Safety, action integrity and recovery
UIDL validator refuses unknown group field references, duplicate group IDs, multiple group ownership or primary/details reuse. The ordinary Form ActionRequest still captures the exact same field keys, confirmation and Host-executed command, so groups never become an alternate authorization/execution path. HTML values are escaped. Business-specific requirements (Excel, field mapping, create/ignore, duplicate names, user authority) stay in the Platform consuming Experience.

## Verification and unresolved
- Run Eidos `npm run release:check`, Human UI review gate and grouped contract tests.
- Follow with separate Platform vendor snapshot consumption, its real Host Chromium 20-column review and phone/desktop tests.
- This is a reusable **framework** interaction and not a product signoff or a direct Eidos-to-business write API.

## 目标与完成条件

面向需要核对数十项已有表单条目的 Human 操作者，把每项业务工作从四五个上下堆叠控件调整为“单项标题、证据摘要、始终可操作的主要选择和按需打开的其他字段”。独立调用方的权限、业务主体和完成条件仍由 Host/应用定义，Eidos 只负责呈现经过验证的分组与稳定输入。

## 流程与步骤

原流程同一表单中从顶部向下滚动，逐项寻找输入。新流程为“识别条目→直接调整主选择→必要时展开更改详情→以原确认操作提交”。默认展开仅用于确有例外或用户需要原始证据的项。没有跳过验证、权限或二次提交，也不强制 Agent 辅助。

## 导航与信息架构

不新增 Workbench 活动、导航项或新的业务页面；只让现有表单使用通用 `reviewGroups` 宣告分组。表单原普通字段仍在原区域；分组引用现存 field key，不能构造新动作/命令，顶部面包屑仍由原应用决定。

## 视觉与颜色

使用 `src/design-language/productive-workbench-css.ts` 的现有 Productive Design Language token 生成 `data-eidos-form-review-groups` 的通用响应式列表，不使用产品 CSS。每组分隔线与可读标题、来源摘要和主选择构成同一行，支持桌面两列；二级字段位于原生 details 内，手机一列，无品牌色、图标替代文本或超宽表格。

## 记忆与注意力

主选择不隐藏，证据摘要就地可见，次要信息可以立即展开，不再要求操作人记住上一屏。展开和折叠只改变视觉呈现，不清除字段值；组内字段与命令依旧由 Eidos 标准 Form 保持。遇到例外时业务应用可以用 `defaultExpanded` 选择展开，但 Eidos 不推断异常或冒充业务裁决。

## 无障碍与跨年龄

原生 details/summary 支持 Tab/Enter 键盘访问；明确可见焦点，字段均具有 label。窄屏按一列堆叠、中文长值可以折行，文本缩放由 Eidos 现有字体 tokens 继承。状态不靠颜色识别。合同测试证明 HTML 转义和字段未丢失，仍需消费应用的浏览器/真人实际操作验证。

## 安全与数据修复

`src/runtime/validate.ts` 对重复组 ID、跨组重复 field key、未知 field key 以及主/次字段重复全部 fail-closed；`src/runtime/render-model.ts` 只转换已校验契约，`src/renderers/html/index.ts` 不修改原 submit ActionRequest。业务创建、导入、错误行修正与撤销、权限检查均归 Platform Host/业务应用，不进入 Eidos 框架。

## 证据与剩余问题

变更源文件：`src/runtime/contracts.ts`、`src/runtime/validate.ts`、`src/runtime/render-model.ts`、`src/renderers/html/index.ts`、`src/design-language/productive-workbench-css.ts`；回归：`tests/contracts/runtime.test.mjs`。Eidos CI 与 Human 设计门禁需要最后 HEAD 通过才可签框架开发验收。BEX 真实 Host 20 列批量审核页和手机交互需在 Platform 单独接入验证；客户 XLSX/Human 真正签收目前仍 OPEN。
