# Review table heading and zero-issue state

## 目标与完成条件
Business users reviewing an import can see the actual source-column count, switch directly between attention and all columns, and recognize when no current issue needs action. The application supplies all copy and facts; Eidos renders them.

## 流程与步骤
The existing select filter remains the single state. The new heading button changes that select and dispatches its change event; it never saves a mapping. The empty message appears only when the application opts in and supplies zero issues.

## 导航与信息架构
The shortcut sits beside the review-table section heading in the same task surface. It adds no route, persistent menu item, or competing navigation.

## 视觉与颜色
`src/design-language/productive-workbench-css.ts` uses existing Eidos tokens for the quiet count, text button, and positive zero-issue message. The business table and one primary submit action remain unchanged.

## 记忆与注意力
The source-column count derives from actual review groups. Returning to the attention view is a direct toggle, while the filter select remains visible. The UI does not invent historical resolved issues.

## 无障碍与跨年龄
The button has visible text, keyboard focus and a 44px narrow-screen target. The zero-issue state uses text as well as positive color and exposes status semantics.

## 安全与数据修复
The shortcut changes display filtering only. It does not modify field values, source rows, permissions, validation, or Host commit boundaries. Validation rejects an action pointing to a missing or incomplete filter.

## 证据与剩余问题
Source comparison: EVO BEX-01 V3 HTML blob `9f57e9320eb527786ff7b737be27777eba6f8a92`, mapping heading, issue section and filter handler. Automated checks cover markup, count, zero state and invalid filter IDs. Live desktop/mobile screenshots and Human acceptance are pending.
