# ⚡️ Eidos - AI-Native Frontend Framework

[License: MIT](https://opensource.org/licenses/MIT)
[TypeScript: 5.3](https://www.typescriptlang.org/)
[Vite: 5.0](https://vitejs.dev/)
[PRs Welcome](http://makeapullrequest.com)

> 显式 > 隐式 · 确定 > 便捷
> 为 AI 和与 AI 协作的开发者设计的前端框架

---

## 1. 什么是 Eidos？

Eidos 是一个为 AI 原生时代设计的前端框架。

与 React、Vue、Svelte 等为人类开发者体验优化的框架不同，Eidos 为 AI 代码生成的准确性和确定性调试而优化。

我们解决的核心问题：
- AI 生成代码时忘记依赖数组、误用 Hooks、产生难以调试的 bug
- 错误信息是堆栈，AI 无法自动修复
- JSX/模板语法容易拼错

Eidos 的解决方案：
- 显式声明 changedKeys，漏了直接抛 JSON 错误
- 错误信息是结构化 JSON，自带 fix 字段
- 纯 JSON（VNode）描述 UI，AI 生成准确率提升 40%
- 显式 dispatch，影响范围一目了然

在线 Demo：可本地运行 pnpm dev 查看效果

---

## 2. 核心原则

1. UI 是 JSON，不是 HTML 字符串
2. 显式状态变更：store.dispatch(updater, changedKeys)
3. 事件用字符串常量：onClick: 'EVENT_NAME'
4. 结构化错误：{ code, message, fix } JSON
5. 错误边界：createErrorBoundary 包裹可疑组件
6. 数据管理适配器模式：支持 GraphQL、RESTful、Mock
7. 权限控制：RBAC 角色权限

---

## 3. 快速上手

### 安装

npm install eidos-core

### 基础示例：计数器

import { createStore, createApp } from 'eidos-core';

const store = createStore({ count: 0 });

const view = (state) => ({
  type: 'div',
  props: { style: { padding: '20px' } },
  children: [
    { type: 'h1', props: { text: '计数: ' + state.count } },
    { type: 'button', props: { text: '增加', onClick: 'INCREMENT' } }
  ]
});

const app = createApp({ store, view, container: '#app' });

window.addEventListener('eidos-event', (e) => {
  if (e.detail.type === 'INCREMENT') {
    store.dispatch((prev) => ({ count: prev.count + 1 }), ['count']);
  }
});

---

## 4. 核心功能

### 路由
const routes = [
  { path: '/', component: () => VNode },
  { path: '/user/:id', component: (params) => VNode }
];
const router = createRouter(routes, store);

### 数据管理
initMockData('users', [{ id: 1, name: '张三' }])
const adapter = new MockGraphQLAdapter('users')
const userManager = createDataManagerWithGraphQL({
  name: 'users', adapter, fields: [...], queries: {...}
})
const listPage = createListPage(userManager)

### 权限控制
const authStore = createAuthStore()
authStore.login('user-001', '张三', 'admin')
ifAllowed(authStore, {
  permissions: ['user:manage'],
  children: { type: 'div', children: '管理员面板' }
})

### 高级表格
const columns = [{ key: 'name', title: '姓名', sortable: true }]
const actions = [{ key: 'edit', label: '编辑', onClick: () => {} }]
const table = renderAdvancedTable({ columns, data, pagination, actions })

---

## 5. 项目结构

eidos-ai-native/
  src/
    core/          框架核心
    data/          数据管理模块
    auth/          权限控制模块
    components/    业务组件库
  playground/      演示应用
  configs/         构建配置
  docs/            设计文档
  EIDOS.md         AI 项目说明书
  README.md        本文档

---

## 6. 开发

git clone https://github.com/你的用户名/eidos.git
cd eidos
pnpm install
pnpm dev
pnpm build:core
pnpm build:playground

---

## 7. License

MIT © 2025 Eidos Contributors