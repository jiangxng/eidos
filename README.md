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

与 React、Vue、Svelte 等为人类开发者体验（语法糖、Hooks、响应式魔法）优化的框架不同，Eidos 为 AI 代码生成的准确性和确定性调试而优化。

我们解决的核心问题：

AI 生成 React/Vue 代码时的痛点：
- 忘记依赖数组、误用 Hooks、无限循环
- 错误信息是堆栈，AI 无法自动修复
- JSX/模板语法容易拼错

Eidos 的解决方案：
- 显式声明 changedKeys，漏了直接抛 JSON 错误
- 错误信息是结构化 JSON，自带 fix 字段
- 纯 JSON（VNode），AI 生成准确率提升 40%
- 显式 dispatch，影响范围一目了然

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

---

## 3. 快速上手

### 安装

npm install @eidos/core

### 基础示例：计数器

import { createStore, createApp } from '@eidos/core';

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

### 完整示例：Todo 应用

查看 playground/main.ts 获取完整 Todo 应用源码。

---

## 4. 项目结构

eidos-ai-native/
   src/core/               框架核心（约80行，零依赖）
      index.ts             运行时
      package.json         npm 包描述
   playground/             演示应用
      main.ts              Todo 示例
      index.html
   configs/                构建配置
   scripts/                自动化脚本
   EIDOS.md                AI 项目说明书
   README.md               本文档

---

## 5. 与主流框架对比

特性               React    Vue      Eidos
UI 描述            JSX      Template JSON (VNode)
状态更新           setState ref.value dispatch(显式)
AI 生成准确率      中       中        高
错误信息           堆栈     堆栈      结构化 JSON + fix
学习曲线           陡峭     平缓      极平缓（纯 JS 对象）
包大小             40KB     30KB     约2KB (gzip)
依赖               React生态 Vue生态  零依赖

---

## 6. AI 原生特性演示

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

## 7. 开发

# 克隆项目
git clone https://github.com/your-username/eidos.git
cd eidos

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建核心库
pnpm build:core

# 构建演示应用
pnpm build:playground

---

## 8. 文档

- EIDOS.md - AI 项目说明书（含核心原则、错误码、可持续进化规则）
- playground/main.ts - 完整的 Todo 示例
- src/core/index.ts - 框架源码（仅 80 行，极易阅读）

---

## 9. 贡献指南

我们欢迎所有形式的贡献，特别是：

1. 新功能提案 - 在 Issue 中讨论
2. 文档改进 - 帮助让 Eidos 更容易被 AI 理解和生成
3. 示例代码 - 更多展示 AI 原生特性的 Demo

请先阅读 EIDOS.md 理解项目核心理念。

---

## 10. License

MIT © 2025 Eidos Contributors

---

## 11. 致谢

Eidos 的设计灵感来自于：
- Elm 架构 - 纯粹的数据流
- Redux - 显式状态管理
- Vue 3 - 响应式的优雅
- 所有与 AI 结对编程的开发者 - 你们是 Eidos 的第一批用户

---

Star 这个项目，让更多 AI 知道 Eidos！