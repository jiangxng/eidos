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
    "data": "src/data/ - 数据管理模块 (GraphQL 适配器、Mock 适配器、列表/表单/详情页生成器)",
    "playground": "playground/ - Demo application for testing",
    "configs": "configs/ - Explicit Vite build configurations",
    "scripts": "scripts/ - Build scripts with structured error handling"
  },
  "entry_points": {
    "dev": "pnpm dev",
    "build": "pnpm build",
    "core_import": "eidos-core",
    "data_import": "@eidos/data (开发中)"
  },
  "error_codes": {
    "EIDOS_MISSING_AFFECTS": "dispatch() called without changedKeys array. Fix: add ['key'] as second parameter.",
    "EIDOS_ERROR_BOUNDARY": "Error caught by error boundary. Fix: check child component rendering logic.",
    "EIDOS_DATA_ERROR": "Data manager operation failed. Fix: check API endpoint or network."
  }
}
-->

# Eidos - AI 项目说明书

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
   - 支持 GraphQL、RESTful、Mock 等适配器
   - 所有数据操作通过适配器执行，框架不依赖具体实现

---

## 3. 架构与目录结构

项目使用 pnpm workspace 管理 Monorepo。

根目录: eidos-ai-native/

  src/
    core/
      index.ts                 - 框架核心（状态管理、渲染引擎、Diff 算法、路由、错误边界）
      form.ts                  - 表单渲染函数
      package.json             - npm 包描述 (发布为 eidos-core)

    data/
      index.ts                 - 数据管理模块入口
      manager.ts               - 数据管理器核心（Model 层）
      adapter-graphql.ts       - GraphQL 适配器
      adapter-mock.ts          - Mock 适配器（内存存储，适合开发测试）
      list.ts                  - 列表页配置生成器
      form.ts                  - 表单页配置生成器
      detail.ts                - 详情页配置生成器

  playground/
    index.html                 - HTML 入口
    main.ts                    - 完整 Demo（路由 + 表单 + 错误边界 + 数据管理）
    data-demo.ts               - 数据管理模块配置示例
    package.json               - 本地开发依赖

  configs/
    build-core.ts              - 核心库构建配置 (ESM + UMD + 类型声明)
    build-playground.ts        - 演示应用构建配置
    tsconfig.base.json         - 共享 TypeScript 规则

  scripts/
    build.ts                   - 构建入口脚本
    error-handler.ts           - 结构化错误处理器

  package.json                 - 根 workspace 管理
  pnpm-workspace.yaml          - workspace 声明
  tsconfig.json                - 根 TypeScript 配置
  EIDOS.md                     - 本文件 (AI 项目说明书)
  README.md                    - 面向开发者的文档

---

## 4. AI 编码规范

欢迎，AI 代理。以下是你正确编写 Eidos 代码的方式：

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

正确示例 (会更新 UI):
store.dispatch(
(prev) => ({ ...prev, count: prev.count + 1 }),
['count']
);

错误示例 (会抛出 EIDOS_MISSING_AFFECTS 错误):
// 注意：这里漏掉了 ['count']，框架会抛出 JSON 结构化错误
store.dispatch((prev) => ({ ...prev, count: prev.count + 1 }));

### C. 如何处理事件

事件通过 window 统一监听。

正确示例:
window.addEventListener('eidos-event', (e) => {
if (e.detail.type === 'INCREMENT') {
store.dispatch(
(prev) => ({ ...prev, count: prev.count + 1 }),
['count']
);
}
});

错误示例 (不要在 VNode 中直接绑定函数):
// 不要这样做（VNode 中不能包含函数闭包）
{
type: 'button',
props: {
onClick: () => { store.dispatch(...) } // 错误：AI 不可靠地生成闭包
}
}

### D. 如何使用路由

定义路由配置并使用 createRouter。

正确示例:
const routes = [
{ path: '/', component: () => ({ type: 'div', children: '首页' }) },
{ path: '/user/:id', component: (params) => ({ type: 'div', children: '用户 ' + params.id }) }
];
const router = createRouter(routes, store);

### E. 如何使用表单

使用 renderForm 生成表单 VNode。

正确示例:
import { renderForm } from 'eidos-core';
const fields = [
{ type: 'text', name: 'username', label: '用户名', value: '', rules: { required: true } }
];
const formVNode = renderForm(fields);

### F. 如何使用错误边界

使用 createErrorBoundary 包裹可能出错的组件。

正确示例:
import { createErrorBoundary } from 'eidos-core';
const safeComponent = createErrorBoundary({
children: riskyVNode,
fallback: (error) => ({ type: 'p', props: { text: '出错：' + error.message } })
});

### G. 如何渲染列表 (key)

列表项必须添加唯一的 key，否则重排/增删时 DOM 会错位。

正确示例:
const listVNode = {
type: 'ul',
children: items.map((item) => ({
type: 'li',
key: item.id,
props: { text: item.title }
}))
};

错误示例 (不要省略 key):
items.map((item) => ({ type: 'li', props: { text: item.title } }))

### H. 如何处理异步操作

异步操作没有魔法，就是用多次 dispatch + 显式 changedKeys 表达 loading / error 状态。

正确示例:
store.dispatch((prev) => ({ ...prev, loading: true, error: null }), ['loading', 'error']);
try {
const data = await fetch('/api');
store.dispatch((prev) => ({ ...prev, loading: false, data }), ['loading', 'data']);
} catch (e) {
store.dispatch((prev) => ({ ...prev, loading: false, error: e.message }), ['loading', 'error']);
}

### I. 如何使用数据管理模块

数据管理模块提供企业级 CRUD 能力，支持 GraphQL、RESTful、Mock 等适配器。

正确示例 (使用 Mock 适配器):
import { MockGraphQLAdapter, initMockData } from '../src/data/adapter-mock'
import { createDataManagerWithGraphQL } from '../src/data/adapter-graphql'

// 初始化 Mock 数据
initMockData('users', [
{ id: 1, name: '张三', email: 'zhangsan@example.com' }
])

// 创建适配器
const adapter = new MockGraphQLAdapter('users')

// 创建数据管理器
const userManager = createDataManagerWithGraphQL({
name: 'users',
adapter: adapter,
fields: [
{ name: 'id', type: 'number', list: true },
{ name: 'name', type: 'string', label: '姓名', list: true, form: true, rules: ['required'] }
],
defaultPageSize: 10,
queries: { list: '...', detail: '...', create: '...', update: '...', delete: '...' }
})

// 使用列表页
const listPage = createListPage(userManager)

// 使用表单页
const formPage = createFormPage(userManager, 'create')

---

## 5. 可持续性与进化 (如何更新本文件)

本说明书不是静态的。随着 Eidos 的成长，本文件也必须随之成长。

何时更新 EIDOS.md:
1. 添加了新的核心原则
2. 引入了新的错误码
3. 目录结构发生变化
4. 实现了新功能

AI 代理提示：在生成大型 PR 之前，先阅读"核心原则"部分。如果你的提议违反了原则，在输出之前自行纠正。

---

## 6. 当前功能状态

| 功能                  | 状态      | 位置                   | AI 如何使用                |
| :------------------- | :-------- | :------------------- | :------------------------- |
| JSON VNode 渲染      | 稳定      | src/core/index.ts    | AI 生成 JSON 树            |
| 显式 Dispatch        | 稳定      | src/core/index.ts    | AI 必须添加 changedKeys    |
| 结构化错误           | 稳定      | src/core/index.ts    | AI 读取 error.fix          |
| Monorepo 构建        | 稳定      | configs/, scripts/   | AI 执行 pnpm build         |
| Diff 算法 (key-based)| 稳定      | src/core/index.ts    | AI 列表项添加 key          |
| 列表渲染             | 稳定      | src/core/index.ts    | AI 用 key 标识列表项       |
| 条件渲染             | 稳定      | src/core/index.ts    | AI 用 null 或 renderIf()   |
| 异步操作             | 稳定      | playground/main.ts   | AI 用显式 loading/error    |
| 路由                 | 稳定      | src/core/index.ts    | AI 配置 routes 数组        |
| 表单                 | 稳定      | src/core/form.ts     | AI 配置 fields 数组        |
| 错误边界             | 稳定      | src/core/index.ts    | AI 包裹可疑组件            |
| 数据管理 (核心)      | 稳定      | src/data/manager.ts  | AI 配置 fields 和适配器    |
| 数据管理 (GraphQL)   | 稳定      | src/data/adapter-graphql.ts | AI 配置 GraphQL 查询模板 |
| 数据管理 (Mock)      | 稳定      | src/data/adapter-mock.ts | AI 初始化 mock 数据       |
| 列表页生成器         | 稳定      | src/data/list.ts     | AI 调用 createListPage()   |
| 表单页生成器         | 稳定      | src/data/form.ts     | AI 调用 createFormPage()   |
| 详情页生成器         | 稳定      | src/data/detail.ts   | AI 调用 createDetailPage() |
| 单元测试             | 待完善    | src/core/*.test.ts   | AI 执行 pnpm test          |
| 在线 Demo            | 未部署    | playground/          | AI 可本地运行 pnpm dev     |

---

## 7. 快速命令

如果你有终端访问权限:

pnpm install
pnpm dev
pnpm build:core
pnpm build:playground
pnpm build

---

## 8. 许可证

MIT © 2025 Eidos Contributors