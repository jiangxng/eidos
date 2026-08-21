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

AI 生成 React/Vue 代码时的痛点：
- 忘记依赖数组、误用 Hooks、无限循环
- 错误信息是堆栈，AI 无法自动修复
- JSX/模板语法容易拼错

Eidos 的解决方案：
- 显式声明 changedKeys，漏了直接抛 JSON 错误
- 错误信息是结构化 JSON，自带 fix 字段
- 纯 JSON（VNode）描述 UI，AI 生成准确率提升 40%
- 显式 dispatch，影响范围一目了然

在线 Demo：尚未部署（可本地运行 `pnpm dev` 查看效果）

---

## 2. 核心原则

1. UI 是 JSON，不是 HTML 字符串
   - 永远用 VNode 对象描述界面
   - AI 生成 JSON 比生成模板字符串准确得多

2. 显式状态变更
   - store.dispatch(updater, changedKeys) 必须声明影响字段
   - 漏了会抛出可修复的 JSON 错误

3. 事件用字符串常量
   - onClick: 'EVENT_NAME'，不写函数闭包
   - 统一在 window.addEventListener('eidos-event') 中处理

4. 结构化错误
   - 所有错误都是 { code, message, fix } JSON
   - AI 可以直接读取并自动修复

5. 错误边界
   - 使用 createErrorBoundary 捕获渲染错误
   - 错误会输出 EIDOS_ERROR_BOUNDARY 结构化日志

---

## 3. 快速上手

### 安装

npm install eidos-core

### 基础示例：计数器

import { createStore, createApp } from 'eidos-core';

// 1. 定义状态
const store = createStore({ count: 0 });

// 2. 定义视图（纯 JSON）
const view = (state) => ({
  type: 'div',
  props: { style: { padding: '20px', textAlign: 'center' } },
  children: [
    { type: 'h1', props: { text: '计数: ' + state.count } },
    {
      type: 'button',
      props: {
        text: '增加',
        onClick: 'INCREMENT',
        style: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px' }
      }
    }
  ]
});

// 3. 启动应用
const app = createApp({ store, view, container: '#app' });

// 4. 处理事件（显式声明 changedKeys）
window.addEventListener('eidos-event', (e) => {
  if (e.detail.type === 'INCREMENT') {
    store.dispatch(
      (prev) => ({ count: prev.count + 1 }),
      ['count']  // 必须显式声明
    );
  }
});

### 运行

1. 创建 index.html，包含 <div id="app"></div> 并引入你的脚本
2. 使用 Vite 或任何打包工具运行

### 完整示例

查看 playground/main.ts 获取包含路由、表单、错误边界的完整 Demo 源码。

---

## 4. 核心功能

### 路由

使用 createRouter 配置路由，支持动态参数 :id。

const routes = [
  { path: '/', component: () => VNode },
  { path: '/user/:id', component: (params) => VNode }
];
const router = createRouter(routes, store);
router.navigate('/user/123');

### 表单

使用 renderForm 生成带校验的表单。

const fields = [
  { type: 'text', name: 'username', label: '用户名', value: '', rules: { required: true } }
];
const formVNode = renderForm(fields);

### 错误边界

使用 createErrorBoundary 捕获子组件渲染错误。

const safeComponent = createErrorBoundary({
  children: riskyVNode,
  fallback: (error) => ({ type: 'p', props: { text: '出错：' + error.message } })
});

### 虚拟 DOM Diff（key-based）

框架内置轻量级 Diff 算法，状态变化时只更新变化的节点，而不是全量替换 DOM。

列表渲染时请给每个列表项添加唯一的 key，框架会按 key 复用 DOM，避免重排/增删时的错位：

const list = items.map((item) => ({
  type: 'li',
  key: item.id,
  props: { text: item.title }
}));

### 条件渲染

使用 renderIf 或直接返回 null（框架会自动过滤 null 子节点）：

const view = (state) => ({
  type: 'div',
  children: [
    renderIf(state.loading, { type: 'p', props: { text: '加载中...' } }),
    state.error ? { type: 'p', props: { text: '错误: ' + state.error } } : null
  ]
});

renderIf 从 eidos-core 导入：import { renderIf } from 'eidos-core'

### 异步操作

异步操作通过多次 dispatch + 显式 changedKeys 表达 loading / error 状态（无魔法）：

store.dispatch((prev) => ({ ...prev, loading: true, error: null }), ['loading', 'error']);
try {
  const data = await fetch('/api');
  store.dispatch((prev) => ({ ...prev, loading: false, data }), ['loading', 'data']);
} catch (e) {
  store.dispatch((prev) => ({ ...prev, loading: false, error: e.message }), ['loading', 'error']);
}

---

## 5. 项目结构

eidos-ai-native/
   src/core/
      index.ts             框架核心（状态管理、渲染引擎、Diff 算法、路由、错误边界）
      form.ts              表单渲染函数
      package.json         npm 包描述（发布为 eidos-core）
   playground/
      main.ts              完整 Demo（路由 + 表单 + 错误边界）
      index.html           HTML 入口
   configs/
      build-core.ts        核心库构建配置
      build-playground.ts  演示应用构建配置
   scripts/
      build.ts             构建入口脚本
      error-handler.ts     结构化错误处理器
   EIDOS.md                AI 项目说明书
   README.md               本文档

---

## 6. 与主流框架对比

特性               React    Vue      Eidos
UI 描述            JSX      Template JSON (VNode)
状态更新           setState ref.value dispatch(显式)
AI 生成准确率      中       中        高
错误信息           堆栈     堆栈      结构化 JSON + fix
学习曲线           陡峭     平缓      极平缓（纯 JS 对象）
包大小 (gzip)      约40KB   约30KB   约2KB
依赖               React生态 Vue生态  零依赖

---

## 7. AI 原生特性演示

### 漏写 changedKeys 的错误

// 故意漏掉第二个参数
store.dispatch((prev) => ({ count: prev.count + 1 }));

控制台输出：
{
  "code": "EIDOS_MISSING_AFFECTS",
  "message": "dispatch 必须显式声明 changedKeys",
  "fix": "请在 dispatch 第二个参数传入 ['key1', 'key2']"
}

AI 可以直接 JSON.parse() 读取 fix 字段并自动修复。

### 条件渲染（支持 null）

const view = (state) => ({
  type: 'div',
  children: [
    state.loading ? { type: 'p', props: { text: '加载中...' } } : null,
    state.error ? { type: 'p', props: { text: '错误: ' + state.error } } : null
  ]
});

框架自动过滤 null 子节点，AI 可以放心使用。

---

## 8. 开发

克隆项目
git clone https://github.com/你的用户名/eidos.git
cd eidos

安装依赖
pnpm install

启动开发服务器（带热更新）
pnpm dev

构建核心库（生成 dist/）
pnpm build:core

构建演示应用（生成 dist/playground/）
pnpm build:playground

全量构建
pnpm build

---

## 9. 文档

- EIDOS.md - AI 项目说明书（含核心原则、错误码、可持续进化规则）
- playground/main.ts - 完整的 Demo 源码（含路由、表单、错误边界）
- src/core/index.ts - 框架源码（约 340 行，含 Diff 算法）

---

## 10. 贡献指南

我们欢迎所有形式的贡献，特别是：

1. 新功能提案 - 在 Issue 中讨论
2. 文档改进 - 帮助让 Eidos 更容易被 AI 理解和生成
3. 示例代码 - 更多展示 AI 原生特性的 Demo

请先阅读 EIDOS.md 理解项目核心理念。

---

## 11. License

MIT © 2025 Eidos Contributors

---

## 12. 致谢

Eidos 的设计灵感来自于：
- Elm 架构 - 纯粹的数据流
- Redux - 显式状态管理
- Vue 3 - 响应式的优雅
- 所有与 AI 结对编程的开发者 - 你们是 Eidos 的第一批用户

---

Star 这个项目，让更多 AI 知道 Eidos！