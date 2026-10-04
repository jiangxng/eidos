# Eidos 2D Modeling Workbench 能力边界 v0.1

**状态：架构基线**  
**日期：2026-10-04**

## 1. 定位

Eidos 2D Core 不只是 Diagram Viewer 基础，也应成长为领域无关的完整图编辑 / 建模工作台基础。

目标类似成熟图编辑基础库所覆盖的交互能力，但不复制任何特定产品 API。

Eidos 负责：

> 如何画、如何选、如何拖、如何编组、如何对齐、如何导航。

Eidos 不负责：

> 这些节点在业务上是什么。

Application、Ledger、组织、人员、产品、设备等领域语义由上层产品/插件定义。

## 2. Toolbox / Palette

Eidos 提供通用工具箱机制：

- Toolbox 容器；
- Toolbox 分组；
- Toolbox Item；
- 图标插槽；
- Label / Tooltip；
- 默认 Shape / Size；
- Drag payload；
- Toolbox → Canvas drop；
- drop position；
- drop 后触发上层 operation command。

Eidos 不内置具体企业对象。

例如：

```text
Eidos Toolbox mechanism
        ↓
EOG contributes:
- Application
- Ledger
- Organization
- Product
- ...
```

## 3. 第一阶段必须进入 Eidos Core 的能力

### 3.1 拖拽建节点

- 从 Toolbox 拖拽图元到 Canvas；
- 支持 drop preview；
- 支持 drop 坐标；
- Eidos 只生成 generic create intent；
- 上层产品负责把 create intent 转成领域 mutation。

### 3.2 框选

- Canvas marquee / rubber-band selection；
- 支持从空白区域开始框选；
- 支持包含/相交策略后续扩展。

### 3.3 多选

Selection 从单个：

```text
selected?: { kind, id }
```

升级为通用 Selection Set：

```text
selection: Array<{ kind, id }>
```

并保留 primary selection 概念以驱动 Inspector。

### 3.4 批量交互基础

Eidos 提供：

- selected ids；
- selection bounds；
- batch move；
- batch alignment；
- generic batch operation request seam。

是否允许某项批量业务修改，由上层产品决定。

### 3.5 对齐

至少支持：

- 左对齐；
- 水平居中；
- 右对齐；
- 顶部对齐；
- 垂直居中；
- 底部对齐。

后续预留：

- 水平分布；
- 垂直分布；
- 等间距；
- smart guides；
- snap to grid。

### 3.6 Group / Subgraph primitive

Eidos 提供领域无关的：

- parent / child group；
- group / ungroup；
- group bounds；
- fold / expand；
- enter group / exit group；
- navigation stack；
- breadcrumb seam。

上层产品决定 Group/Subgraph 在业务上表示什么。

## 4. 后续预留能力

参考成熟图编辑工作台能力覆盖，预留：

- Undo / Redo；
- Copy / Paste；
- Resize；
- Edge reconnect；
- Connection constraints；
- Grid；
- Snap；
- Alignment Guides；
- Auto Layout；
- Layer / Z-order；
- Lock；
- Keyboard shortcuts；
- Swimlane / Container；
- Minimap；
- Search / Locate；
- Large graph virtualization / LOD；
- Clipboard / serialization seams。

这些能力不要求一次实现。

## 5. Node Visual / Icon seam

Eidos Node Contract 应逐步从当前：

```text
shape = rectangle | rounded-rectangle
```

扩展为领域无关 Visual Descriptor。

建议模型方向：

```text
visual:
  shape
  icon
  label placement
  badge slots
```

`icon` 只表示一个可解析的 visual token / contribution id。

Eidos 不认识：

- `eog.application`
- `eog.ledger`

EOG 可以贡献：

```text
eog.application -> Application icon
eog.ledger      -> Ledger icon
```

## 6. Viewer / Designer 共模

所有选择、导航、Inspector、Group/Subgraph 浏览能力同时服务 Viewer 与 Designer。

只有 mutation 能力由 Designer Capability 打开。

```text
2D Workspace
├─ Selection
├─ Navigation
├─ Inspector
├─ Group/Subgraph
├─ Pan/Zoom
└─ Viewer-safe interaction

2D Modeling Capability
├─ Toolbox drag/drop
├─ Move/resize
├─ Multi-select mutation
├─ Alignment
├─ Group/Ungroup
└─ other edit operations
```

这样 Viewer 与 Designer 不会形成两套画布。

## 7. 与 mxGraph 的关系

mxGraph 作为能力清单和成熟交互经验参考：

- drag / clone / resize / connect；
- external drag & drop；
- selection；
- grouping / subgraph；
- folding；
- drill-down / step-up；
- alignment；
- guide / snapping；
- layout。

Eidos 不依赖 mxGraph，不复制其 API；只借鉴成熟图编辑器已经验证过的能力边界。

## 8. EOG 对接原则

EOG 只通过 Eidos 公共 2D API 使用这些能力。

禁止：

```text
Eidos -> EOG semantic types
Eidos -> Enterprise Context internals
Eidos -> Application/Ledger hard-coded behavior
```

允许：

```text
EOG -> Eidos Toolbox Contract
EOG -> Eidos Selection Set
EOG -> Eidos Alignment Command
EOG -> Eidos Group/Subgraph primitives
EOG -> Eidos Icon/Visual seam
```

## 9. 建议实现顺序

1. Toolbox + Visual/Icon seam；
2. Selection Set + marquee；
3. Toolbox drag/drop create intent；
4. Alignment；
5. Group/Subgraph + drill navigation；
6. Batch move / generic batch operation；
7. guides/grid/distribution；
8. undo/redo、copy/paste 等后续成熟能力。
