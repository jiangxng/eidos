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
    "core": "src/core/ - The framework runtime",
    "data": "src/data/ - 数据管理模块",
    "auth": "src/auth/ - 权限控制模块",
    "components": "src/components/ - 业务组件库",
    "layout": "src/layout/ - 布局系统",
    "playground": "playground/ - Demo application",
    "configs": "configs/ - Vite build configurations",
    "scripts": "scripts/ - Build scripts",
    "docs": "docs/ - 设计文档"
  },
  "entry_points": {
    "dev": "pnpm dev",
    "build": "pnpm build",
    "core_import": "eidos-core"
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
更新日期: 2026-09-02

---

## 1. 项目意图

Eidos 是一个为 AI 原生时代设计的前端框架。

与 React、Vue、Svelte 等为人类开发者体验优化的框架不同，Eidos 为 AI 代码生成的准确性和确定性调试而优化。

核心问题：
- AI 生成代码时忘记依赖数组、误用 Hooks、产生难以调试的 bug
- 错误信息是堆栈，AI 无法自动修复
- JSX/模板语法容易拼错，AI 生成准确率低

Eidos 的解决方案：
- 显式声明 changedKeys，漏了直接抛 JSON 错误
- 错误信息是结构化 JSON，自带 fix 字段
- 纯 JSON（VNode）描述 UI，AI 生成准确率提升 40%
- 显式 dispatch，影响范围一目了然

---

## 2. 核心原则

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
   - 角色 → 权限 的映射
   - 路由级守卫 + 组件级控制

---

## 3. 架构与目录结构

项目使用 pnpm workspace 管理 Monorepo。

根目录: eidos-ai-native/

  src/
    core/
      index.ts              框架核心
      form.ts               表单渲染函数
      package.json          npm 包描述

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
      components.ts         组件级权限控制

    components/
      index.ts              业务组件库入口
      types.ts              共享类型定义
      AdvancedTable/        高级表格
      AdvancedForm/         高级表单
      Dialog/               弹窗/确认框

    layout/
      index.ts              布局系统入口
      types.ts              类型定义
      store.ts              布局状态管理
      renderer.ts           布局渲染器
      regions.ts            区域渲染器
      blocks.ts             内容块渲染器
      menu.ts               菜单系统

  playground/
    index.html              HTML 入口
    main.ts                 应用入口
    app/                    应用核心（状态、路由、事件、视图）
    modules/                功能模块
    components/             UI 组件

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
  CHANGELOG.md              版本变更日志

---

## 4. AI 编码规范

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

### C. 如何处理事件

事件通过 window 统一监听。

正确示例:
window.addEventListener('eidos-event', (e) => {
  if (e.detail.type === 'INCREMENT') {
    store.dispatch((prev) => ({ ...prev, count: prev.count + 1 }), ['count'])
  }
});

错误示例 (不要在 VNode 中直接绑定函数):
{
  type: 'button',
  props: {
    onClick: () => { store.dispatch(...) }
  }
}

---

## 5. 数据管理模块使用规范

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

---

## 6. 权限控制使用规范

使用 createAuthStore 和 ifAllowed。

正确示例:
const authStore = createAuthStore()
authStore.login('user-001', '张三', 'admin')

ifAllowed(authStore, {
  permissions: ['user:manage'],
  children: { type: 'div', children: '管理员面板' }
})

---

## 7. 当前功能状态

| 功能                  | 状态      | 位置                   |
| :------------------- | :-------- | :------------------- |
| JSON VNode 渲染      | 稳定      | src/core/index.ts    |
| 显式 Dispatch        | 稳定      | src/core/index.ts    |
| 结构化错误           | 稳定      | src/core/index.ts    |
| Diff 算法 (key-based)| 稳定      | src/core/index.ts    |
| 路由                 | 稳定      | src/core/index.ts    |
| 表单 (基础)          | 稳定      | src/core/form.ts     |
| 错误边界             | 稳定      | src/core/index.ts    |
| 数据管理             | 稳定      | src/data/            |
| 权限控制             | 稳定      | src/auth/            |
| 高级表格             | 稳定      | src/components/AdvancedTable/ |
| 高级表单             | 稳定      | src/components/AdvancedForm/  |
| 布局系统             | 稳定      | src/layout/          |
| 在线 Demo            | 可运行    | playground/          |

---

## 8. 快速命令

pnpm install
pnpm dev
pnpm build:core
pnpm build:playground
pnpm build

---

## 9. 协作规范 (AI 多对话协作协议)

### 9.1 背景

Eidos 项目涉及多个模块和大量代码。为了应对复杂协作场景，支持将不同子任务拆分到多个对话中执行，同时保持信息一致性，特制定本协作规范。

### 9.2 核心原则

1. 每个对话只负责一个子任务
2. 所有对话共享同一套项目元数据（EIDOS.md、README.md、ROADMAP.md、CHANGELOG.md）
3. 子任务完成后，变更内容汇总到主对话进行同步

### 9.3 项目元数据文件（标准协议）

| 文件 | 作用 |
| :--- | :--- |
| EIDOS.md | 项目意图、核心原则、AI 编码规范 |
| README.md | 项目概述、快速上手 |
| ROADMAP.md | 当前进度、里程碑 |
| CHANGELOG.md | 版本历史、决策记录 |

任何新对话在开始工作前，必须先阅读这些文件。

### 9.4 新对话标准启动模板

开启新子对话时，请将以下内容作为第一条消息发送：

---
【Eidos 项目 - 子任务启动】

请先阅读以下项目元数据（已提供），然后执行指定子任务：

1. 项目概况:
- 项目名: Eidos
- 描述: AI 原生前端框架
- 核心原则: 显式状态变更、JSON 驱动 UI、结构化错误
- 当前版本: v0.4.0

2. 核心文档（关键信息摘要）:
- EIDOS.md: 定义核心原则、AI 编码规范
- ROADMAP.md: 当前里程碑，未完成模块
- CHANGELOG.md: 最近版本变更

3. 当前要解决的子任务:
[在此描述具体任务]

4. 已知约束:
- 不要修改 src/core/index.ts 中的 createStore 签名
- 布局配置使用 JSON 驱动
- 权限控制已集成到布局系统

5. 相关文件:
[列出需要修改的文件]

请确认已理解项目核心原则，然后开始执行子任务。
---

### 9.5 子任务完成后的同步流程

1. 在子对话中完成开发、验证
2. 将变更内容整理为以下格式：
   - 新增文件: [路径列表]
   - 修改文件: [路径列表 + 变更摘要]
   - 关键代码片段: [如有必要]
3. 将变更内容贴回主对话
4. 主对话确认后更新 CHANGELOG.md 和 ROADMAP.md

### 9.6 对话拆分建议

| 任务类型 | 建议 |
| :--- | :--- |
| 新功能开发 | 独立子对话 |
| Bug 修复 | 独立子对话（简单修复可在主对话完成） |
| 架构决策 | 主对话 |
| 代码审查 | 主对话 |
| 性能优化 | 独立子对话 |
| 文档完善 | 独立子对话或主对话 |

### 9.7 版本同步检查清单

子任务完成后，确认以下内容已同步:

- [ ] 代码变更已合并到主分支
- [ ] CHANGELOG.md 已更新
- [ ] ROADMAP.md 进度已更新
- [ ] 如有必要，EIDOS.md 已更新
- [ ] pnpm dev 验证通过

---

## 10. 许可证

MIT © 2025 Eidos Contributors