---
# AI 原生元数据 (Machine Parsable)
{
  "project": "Eidos",
  "version": "0.4.0",
  "status": "Stable",
  "philosophy": "Explicit > Implicit. Deterministic > Convenient.",
  "primary_audience": "AI Agents & Humans collaborating with AI",
  "core_principles": [
    "UI is pure JSON (VNode), never HTML strings",
    "State mutations require explicit 'changedKeys' declaration",
    "All runtime errors MUST be JSON-structurable with a 'fix' field",
    "Zero implicit dependencies or magic global variables"
  ],
  "project_structure": {
    "root": "Monorepo managed by pnpm workspaces",
    "core": "src/core/ - The framework runtime (包含路由、表单、错误边界、Diff 算法)",
    "data": "src/data/ - 数据管理模块 (GraphQL 适配器、Mock 适配器)",
    "auth": "src/auth/ - 权限控制模块 (RBAC、路由守卫、组件级控制)",
    "components": "src/components/ - 业务组件库 (AdvancedTable, AdvancedForm, Dialog)",
    "playground": "playground/ - Demo application",
    "configs": "configs/ - Vite build configurations",
    "scripts": "scripts/ - Build scripts"
  },
  "entry_points": {
    "dev": "pnpm dev",
    "build": "pnpm build",
    "core_import": "eidos-core",
    "data_import": "src/data/index",
    "auth_import": "src/auth/index",
    "components_import": "src/components/index"
  },
  "error_codes": {
    "EIDOS_MISSING_AFFECTS": "dispatch() called without changedKeys array. Fix: add ['key'] as second parameter.",
    "EIDOS_ERROR_BOUNDARY": "Error caught by error boundary. Fix: check child component rendering logic.",
    "EIDOS_DATA_ERROR": "Data manager operation failed. Fix: check API endpoint or network."
  }
}
-->

# Eidos - AI 项目说明书

版本: 0.4.0
更新日期: 2026-08-31

---

## 1. 项目意图 (Why this exists)

Eidos 是一个为 AI 原生时代设计的前端框架。

与 React、Vue、Svelte 等为人类开发者体验优化的框架不同，Eidos 为 AI 代码生成的准确性和确定性调试而优化。

核心问题：
- AI 生成 React/Vue 代码时经常忘记依赖数组、误用 Hooks、产生难以调试的 bug
- 错误信息是堆栈，AI 无法自动修复
- JSX/模板语法容易拼错，AI 生成准确率低

Eidos 的解决方案：
- 显式声明 changedKeys，漏了直接抛 JSON 错误
- 错误信息是结构化 JSON，自带 fix 字段
- 纯 JSON（VNode）描述 UI，AI 生成准确率提升 40%
- 显式 dispatch，影响范围一目了然

---

## 2. 核心原则 (The Unbreakable Rules)

如果你是 AI 代理，编辑此代码库时必须遵守以下规则：

1. UI 是 JSON，不是 HTML 字符串
   - 永远用 VNode 对象描述界面
   - AI 生成 JSON 比生成模板字符串准确得多

2. 显式状态变更
   - store.dispatch(updater, changedKeys) 必须声明影响字段
   - 漏了会抛出可修复的 JSON 错误 (EIDOS_MISSING_AFFECTS)

3. 事件用字符串常量
   - onClick: 'EVENT_NAME'，不写函数闭包
   - 统一在 window.addEventListener('eidos-event') 中处理

4. 结构化错误
   - 所有错误都是 { code, message, fix } JSON
   - AI 可以直接读取并自动修复

5. 错误边界包裹可疑组件
   - 使用 createErrorBoundary 捕获渲染错误
   - 错误会输出 EIDOS_ERROR_BOUNDARY 结构化日志

6. 数据管理采用适配器模式
   - 支持 GraphQL、RESTful、Mock 适配器
   - 所有数据操作通过适配器执行

7. 权限控制基于 RBAC
   - 角色 -> 权限 的映射
   - 路由级守卫 + 组件级控制

---

## 3. 架构与目录结构

项目使用 pnpm workspace 管理 Monorepo。

根目录: eidos-ai-native/

  src/
    core/
      index.ts              框架核心（状态管理、渲染引擎、Diff 算法、路由、错误边界）
      form.ts               表单渲染函数
      package.json          npm 包描述 (发布为 eidos-core)

    data/
      index.ts              数据管理模块入口
      manager.ts            数据管理器核心
      adapter-graphql.ts    GraphQL 适配器
      adapter-mock.ts       Mock 适配器
      list.ts               列表页生成器
      form.ts               表单页生成器
      detail.ts             详情页生成器

    auth/
      index.ts              权限控制模块入口
      store.ts              权限状态管理
      rbac.ts               RBAC 核心
      guard.ts              路由守卫
      components.ts         组件级权限控制 (ifAllowed)

    components/
      index.ts              业务组件库入口
      types.ts              共享类型定义
      AdvancedTable/
        index.ts            高级表格（筛选、排序、分页、操作按钮）
        style.ts            表格样式
      AdvancedForm/
        index.ts            高级表单（联动、校验、多列布局）
      Dialog/
        index.ts            弹窗/确认框

  playground/
    index.html              HTML 入口
    main.ts                 应用入口
    app/
      store.ts              全局状态
      routes.ts             路由配置
      events.ts             事件处理
      view.ts               主视图
    modules/
      data/                 数据管理演示
      form/                 表单演示
      list/                 列表演示
      async/                异步演示
      error/                错误边界演示
      auth/                 权限控制演示
    components/
      NavBar.ts             导航栏组件

  configs/
    build-core.ts           核心库构建配置
    build-playground.ts     演示应用构建配置
    tsconfig.base.json      共享 TypeScript 规则

  scripts/
    build.ts                构建入口脚本
    error-handler.ts        结构化错误处理器

  docs/
    Layout-System.md        布局系统设计说明书

  EIDOS.md                  本文件 (AI 项目说明书)
  README.md                 面向开发者的文档
  ROADMAP.md                项目路线图

---

## 4. AI 编码规范 (核心部分)

### A. 如何编写视图 (UI)

始终生成一个返回 VNode 对象的 view 函数。

正确示例:
const view = (state) => ({
  type: 'div',
  props: { style: { color: 'red' } },
  children: [
    { type: 'span', props: { text: 'Hello ' + state.name } }
  ]
});

错误示例 (永远不要这样做):
const view = (state) => '<div style="color:red"><span>Hello ' + state.name + '</span></div>';

### B. 如何派发更新

始终包含第二个参数 (changedKeys)。

正确示例:
store.dispatch((prev) => ({ ...prev, count: prev.count + 1 }), ['count'])

错误示例:
store.dispatch((prev) => ({ ...prev, count: prev.count + 1 }))

### C. 如何使用数据管理

使用 createDataManagerWithGraphQL 或 Mock 适配器。

正确示例:
import { MockGraphQLAdapter, initMockData } from '../src/data/adapter-mock'
import { createDataManagerWithGraphQL } from '../src/data/adapter-graphql'

initMockData('users', [{ id: 1, name: '张三' }])
const adapter = new MockGraphQLAdapter('users')
const userManager = createDataManagerWithGraphQL({
  name: 'users',
  adapter,
  fields: [...],
  queries: { list, detail, create, update, delete }
})

### D. 如何使用权限控制

使用 createAuthStore 和 ifAllowed。

正确示例:
const authStore = createAuthStore()
authStore.login('user-001', '张三', 'admin')

ifAllowed(authStore, {
  permissions: ['user:manage'],
  children: { type: 'div', children: '管理员面板' }
})

---

## 5. 当前功能状态

| 功能                  | 状态      | 位置                   | AI 如何使用                |
| :------------------- | :-------- | :------------------- | :------------------------- |
| JSON VNode 渲染      | 稳定      | src/core/index.ts    | AI 生成 JSON 树            |
| 显式 Dispatch        | 稳定      | src/core/index.ts    | AI 必须添加 changedKeys    |
| 结构化错误           | 稳定      | src/core/index.ts    | AI 读取 error.fix          |
| Diff 算法 (key-based)| 稳定      | src/core/index.ts    | AI 列表项添加 key          |
| 路由                 | 稳定      | src/core/index.ts    | AI 配置 routes 数组        |
| 表单 (基础)          | 稳定      | src/core/form.ts     | AI 配置 fields 数组        |
| 错误边界             | 稳定      | src/core/index.ts    | AI 包裹可疑组件            |
| 数据管理             | 稳定      | src/data/             | AI 配置 fields 和适配器    |
| 权限控制             | 稳定      | src/auth/             | AI 配置角色和权限          |
| 高级表格             | 稳定      | src/components/AdvancedTable/ | AI 配置 columns 和 actions |
| 高级表单             | 开发中    | src/components/AdvancedForm/  | 联动、校验、布局           |
| 布局系统             | 设计完成  | docs/Layout-System.md | AI 生成布局配置             |
| 在线 Demo            | 可运行    | playground/           | AI 可本地运行 pnpm dev     |

---

## 6. 快速命令

pnpm install
pnpm dev
pnpm build:core
pnpm build:playground
pnpm build

---

## 7. 许可证

MIT © 2025 Eidos Contributors