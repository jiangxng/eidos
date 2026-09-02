# Eidos 项目变更日志

本文件记录 Eidos 项目的发展过程，包括版本变更、功能演进、关键决策和问题修复。

### v0.4.0 - 2026-09-02

#### 新增功能

- TreeSelect 树形选择器组件
  - 支持无限层级数据渲染
  - 展开/折叠交互
  - 搜索过滤
  - 单选/多选模式
  - playground 演示路由 /tree-select

---

## v0.4.0 - 2026-09-01

### 新增功能

- 布局系统集成
  - 实现 `src/layout/` 核心模块（`renderer.ts`、`regions.ts`、`blocks.ts`、`menu.ts`、`store.ts`）
  - 支持多区域布局（顶部、左侧、右侧、中心、底部）
  - 支持区域折叠、设备响应式、角色可见性
  - 内容块类型：菜单、面包屑、用户信息、搜索、通知、用户画像、常用链接、AI推荐、告警

- 业务组件库
  - 高级表格（`AdvancedTable`）：支持排序、筛选、分页、行选择、操作按钮
  - 高级表单（`AdvancedForm`）：支持字段联动、校验、多列布局
  - 弹窗/确认框（`Dialog`）：统一确认、提示、错误弹窗

- 布局系统集成到 playground
  - 侧边栏菜单与路由联动
  - 用户画像、AI推荐、告警等动态内容在布局中展示

### 技术决策

- 布局系统使用 JSON 配置驱动，AI 可直接生成布局配置
- 内容块采用插件化设计，可独立扩展
- 权限控制与布局系统解耦，通过 `userProfile.role` 联动

### 问题修复

- 修复 `patchChildren` 中 `el` 为 `null` 时的空指针错误
- 修复 `updateProps` 中样式属性为 `undefined` 时的报错
- 修复 `AdvancedForm` 中 `disabled` 属性错误传递导致输入框只读的问题
- 修复布局系统中 `HOVER_LINK` 未定义的事件报错
- 解决 Vite 开发环境缓存导致代码不更新的问题（建议使用 `pnpm dev --force`）

---

## v0.3.0 - 2026-08-31

### 新增功能

- 权限控制模块（`src/auth/`）
  - RBAC 核心：角色 → 权限 映射
  - 路由守卫：路由级权限拦截
  - 组件级权限控制：`ifAllowed` 函数
  - playground 集成演示

- 高级表单（`AdvancedForm`）初版
  - 字段联动（`visible` 和 `disabled` 函数）
  - 校验规则
  - 多列布局

- 高级表格（`AdvancedTable`）
  - 列配置、排序、筛选、分页
  - 行选择、操作按钮、加载/空状态

- 数据管理模块完整实现（`src/data/`）
  - 数据管理器核心（`manager.ts`）
  - GraphQL 适配器（`adapter-graphql.ts`）
  - Mock 适配器（`adapter-mock.ts`）
  - 列表页、表单页、详情页生成器

- playground 模块化重构
  - 拆分为 `app/`（状态、路由、事件、视图）和 `modules/`（各功能模块）
  - 导航栏独立为 `components/NavBar.ts`

### 技术决策

- 权限控制采用 RBAC 模型，权限以字符串标识（如 `user:view`）
- `ifAllowed` 函数支持 `permissions` 和 `roles` 两种检查方式
- 数据管理采用适配器模式，支持 GraphQL、RESTful、Mock

### 问题修复

- 修复 `patchNode` 中 `oldEl` 为 `null` 时的报错
- 修复权限切换后页面不刷新的问题（添加 `app.refresh()`）
- 修复 `createApp` 中根节点丢失的问题

---

## v0.2.0 - 2026-08-26

### 新增功能

- 数据管理模块初版（`src/data/`）
  - Mock 数据支持
  - 列表页生成器（`createListPage`）
  - 表单页生成器（`createFormPage`）
  - 详情页生成器（`createDetailPage`）

- playground 集成 `/users` 路由演示数据管理

### 技术决策

- 采用 Mock 数据优先策略，无需后端即可开发
- 适配器模式预留 GraphQL 接口

### 问题修复

- 修复 `playground/main.ts` 中 `dataPage` 字段缩进错误
- 修复 `window.addEventListener` 缺少 `async` 导致的 `await` 报错

---

## v0.1.0 - 2026-08-20

### 新增功能

- 框架核心（`src/core/`）
  - 状态管理器（`createStore`）：显式 `changedKeys` 强制声明
  - 渲染引擎：JSON 驱动的 VNode 渲染
  - Key-based Diff 算法
  - 路由模块（`createRouter`）：支持动态参数 `:id`
  - 错误边界（`createErrorBoundary`）
  - 表单渲染（`renderForm`）
  - 条件渲染（`renderIf`）

- 项目基建
  - pnpm workspace Monorepo 结构
  - Vite 构建配置（`configs/build-core.ts`、`configs/build-playground.ts`）
  - TypeScript 类型声明
  - npm 包发布：`eidos-core`

- playground 演示应用
  - 路由演示（首页、关于、用户详情）
  - 表单演示
  - Keyed 列表演示（Diff 算法验证）
  - 异步操作演示（显式 loading/error）
  - 错误边界演示

- 文档体系
  - `EIDOS.md`：AI 项目说明书
  - `README.md`：开发者文档
  - `ROADMAP.md`：项目路线图

### 技术决策

- 框架核心零依赖，保持轻量
- 所有 UI 由 JSON（VNode）描述，便于 AI 生成
- 状态变更必须显式声明 `changedKeys`，杜绝隐式副作用
- 错误信息采用结构化 JSON 格式，AI 可自动修复
- 采用 pnpm workspace 管理 Monorepo

### 已知问题

- Diff 算法在某些边界条件下需要增强防御
- 开发环境下 Vite 缓存可能导致代码不更新

---

## 版本规划

### v0.5.0（计划中）

- [ ] 树形选择器组件
- [ ] 文件上传组件
- [ ] 日期选择器组件
- [ ] 在线 Demo 部署（GitHub Pages）

### v1.0.0（目标）

- [ ] 完整的企业级 ERP 演示应用
- [ ] 生产环境优化
- [ ] 完整的 API 文档
- [ ] 单元测试覆盖

---

## 更新记录

| 日期 | 版本 | 主要变更 |
| :--- | :--- | :--- |
| 2026-09-01 | v0.4.0 | 布局系统集成，业务组件库完善 |
| 2026-08-31 | v0.3.0 | 权限控制模块，高级表格，高级表单 |
| 2026-08-26 | v0.2.0 | 数据管理模块 |
| 2026-08-20 | v0.1.0 | 框架核心，项目基建 |