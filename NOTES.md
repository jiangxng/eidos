# Eidos 关键对话笔记

本文件记录项目中关键对话摘要，便于快速定位历史讨论内容和决策。


## 目录

1. [2026-09-02 子任务拆分方案](#2026-09-02-子任务拆分方案)
2. [2026-09-02 协作协议固化](#2026-09-02-协作协议固化)
3. [2026-09-01 布局系统集成](#2026-09-01-布局系统集成)
4. [2026-08-31 Vite 缓存问题解决](#2026-08-31-vite-缓存问题解决)
5. [2026-08-31 权限控制模块完成](#2026-08-31-权限控制模块完成)
6. [2026-08-26 数据管理模块完成](#2026-08-26-数据管理模块完成)

## 2026-09-02 Chrome 插件需求设计

**日期:** 2026-09-02
**主题:** Chrome 插件 - 主子对话通信工具
**关键词:** Chrome插件, 跨对话通信, 信息归档, 上下文共享

**摘要:**
为解决多对话协作中信息传递效率低、容易遗漏的问题，设计一个 Chrome 插件。
核心功能：在子对话中一键归档关键信息，主对话可浏览、搜索、导入所有归档内容。
设计文档已保存为 CHROME-EXTENSION.md，可发给子对话开发。

**关键决策:**
- 采用 Chrome Extension Manifest V3
- 使用 IndexedDB 本地存储对话记录
- 信息协议包含 type/content/tags/timestamp/context 字段
- 第一版 MVP：归档 + 浏览 + 搜索

**相关文件:**
- CHROME-EXTENSION.md (完整需求和设计文档)

## 2026-09-02 子任务拆分方案

**日期:** 2026-09-02
**主题:** 项目模块拆分与多对话协作
**关键词:** 多对话协作, 子任务拆分, 业务组件, 布局系统, 演示应用

**摘要:**
在项目功能增多后，讨论了如何将工作分拆到多个对话中并行推进。梳理了 10 个子任务，涵盖 TreeSelect、Upload、DatePicker、Pagination、主题切换、布局持久化、更多内容块、路由权限集成、响应式适配、虚拟滚动。

**关键决策:**
- TreeSelect、Upload、DatePicker、Pagination 适合独立子对话
- 主题切换、布局持久化可拆分子对话
- 路由权限集成、响应式适配适合独立验证
- 虚拟滚动复杂度较高，建议主对话处理
- 建立了子对话启动模板的标准格式

**相关文件:**
- EIDOS.md (第 9 章新增协作规范)
- ROADMAP.md (更新进度)
- CHANGELOG.md (记录版本变更)

**后续行动:**
- 按优先级依次拆分子任务
- 每个子任务完成后同步回主对话


## 2026-09-02 协作协议固化

**日期:** 2026-09-02
**主题:** 多对话协作协议标准化
**关键词:** 协作协议, AI 多对话, 标准启动模板, 版本同步

**摘要:**
讨论并固化了 AI 多对话协作的标准协议，包括核心原则、项目元数据文件（EIDOS.md、README.md、ROADMAP.md、CHANGELOG.md）、新对话标准启动模板、子任务完成后的同步流程、对话拆分建议、版本同步检查清单。

**关键决策:**
- 每个对话只负责一个子任务
- 所有对话共享同一套项目元数据
- 新对话必须使用标准启动模板
- 子任务完成后需同步 CHANGELOG.md 和 ROADMAP.md

**相关文件:**
- EIDOS.md (新增第 9 章: 协作规范)


## 2026-09-01 布局系统集成

**日期:** 2026-09-01
**主题:** 布局系统集成到 playground
**关键词:** 布局系统, 内容区域, 宽度问题, HOVER_LINK

**摘要:**
将 `src/layout/` 集成到 playground 应用中，发现两个问题：
1. 内容区域宽度只有 1cm（playground/index.html 中 `#app` 的 `max-width:600px` 导致）
2. 快捷链接报错 `HOVER_LINK is not defined`（blocks.ts 中 `onMouseEnter: 'HOVER_LINK'` 未定义）

**关键决策:**
- 移除 `#app` 的 `max-width` 限制，改为 `width: 100%; height: 100vh;`
- 移除 `blocks.ts` 中 `renderQuickLinks` 的 `onMouseEnter` 事件

**相关文件:**
- playground/index.html
- src/layout/blocks.ts
- src/layout/renderer.ts


## 2026-08-31 Vite 缓存问题解决

**日期:** 2026-08-31
**主题:** Vite 开发环境缓存导致代码不更新
**关键词:** 缓存, Vite, 热更新, 强制编译, 开发效率

**摘要:**
修改 `src/core/index.ts` 后浏览器代码不更新，即使添加 `console.log` 也不生效。根本原因是 Vite 的模块依赖图缓存和浏览器缓存共同作用。最终通过 `pnpm dev --force` 强制重新编译解决。

**关键决策:**
- 在 `configs/build-playground.ts` 中添加 `optimizeDeps.force: true`
- 开发时使用 `pnpm dev --force` 强制重新编译
- 必要时删除 `node_modules/.vite` 缓存目录
- 浏览器使用 `Ctrl+Shift+R` 硬刷新

**相关文件:**
- configs/build-playground.ts
- package.json (dev 命令)


## 2026-08-31 权限控制模块完成

**日期:** 2026-08-31
**主题:** 权限控制模块开发与集成
**关键词:** 权限控制, RBAC, 路由守卫, 角色切换, 组件级控制

**摘要:**
完成 `src/auth/` 权限控制模块的开发，包括 RBAC 核心（角色→权限映射）、路由级权限拦截、组件级权限控制（`ifAllowed` 函数）。集成到 playground 后，发现权限切换后页面不刷新，通过 `app.refresh()` 修复。后续集成布局系统后出现路由冲突，已修复。

**关键决策:**
- 采用 RBAC 模型，权限以字符串标识（如 `user:view`）
- 路由守卫在 `routes.ts` 中通过 `withAuth` 包装器实现
- `ifAllowed` 支持 `permissions` 和 `roles` 两种检查方式
- 权限切换使用 `localStorage` 持久化角色状态

**相关文件:**
- src/auth/index.ts, store.ts, rbac.ts, guard.ts, components.ts
- playground/modules/auth/index.ts
- playground/app/routes.ts (withAuth 包装器)
- playground/app/events.ts (AUTH_SWITCH_ 事件)


## 2026-08-26 数据管理模块完成

**日期:** 2026-08-26
**主题:** 数据管理模块开发
**关键词:** 数据管理, GraphQL, Mock, CRUD, 适配器模式

**摘要:**
完成 `src/data/` 数据管理模块，包括数据管理器核心（manager.ts）、GraphQL 适配器（adapter-graphql.ts）、Mock 适配器（adapter-mock.ts）、列表页/表单页/详情页生成器。playground 中集成 `/users` 路由演示 CRUD 操作。

**关键决策:**
- 采用适配器模式，支持 GraphQL、RESTful、Mock
- Mock 数据存储在内存中，刷新页面重置
- 列表、表单、详情页生成器返回 VNode，与框架核心无缝集成

**相关文件:**
- src/data/index.ts, manager.ts, adapter-graphql.ts, adapter-mock.ts
- src/data/list.ts, form.ts, detail.ts
- playground/modules/data/index.ts


## 空记录模板

用于后续添加新记录：

```
## YYYY-MM-DD 主题

**日期:** YYYY-MM-DD
**主题:** [一句话主题]
**关键词:** [关键词1, 关键词2, 关键词3]

**摘要:**
[简要描述讨论内容和背景]

**关键决策:**
- [决策1]
- [决策2]

**相关文件:**
- [文件路径1]
- [文件路径2]

**后续行动:**
- [行动1]
- [行动2]
```

---

这份 NOTES.md 将随着项目发展持续更新，每次关键对话后追加新记录。