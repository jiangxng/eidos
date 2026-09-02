// ---------- TreeSelect 样式常量 ----------
// 使用 Eidos 内联样式风格，导出可复用的样式对象

export const treeSelectStyles = {
  // 容器
  container: {
    position: 'relative' as const,
    width: '100%',
    fontFamily: '-apple-system, sans-serif',
    fontSize: '14px',
  },

  // 触发器输入框
  trigger: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    padding: '4px 8px',
    background: '#fff',
    cursor: 'pointer',
    minHeight: '32px',
    transition: 'border-color 0.2s',
    justifyContent: 'space-between' as const,
  },

  triggerHover: {
    borderColor: '#40a9ff',
  },

  triggerDisabled: {
    background: '#f5f5f5',
    cursor: 'not-allowed',
    color: '#bfbfbf',
  },

  // 选中值文本
  valueText: {
    flex: 1,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  placeholderText: {
    color: '#bfbfbf',
  },

  // 下拉箭头
  arrow: {
    fontSize: '10px',
    color: '#999',
    marginLeft: '8px',
    transition: 'transform 0.2s',
  },

  arrowOpen: {
    transform: 'rotate(180deg)',
  },

  // 下拉面板
  dropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    maxHeight: '300px',
    overflowY: 'auto' as const,
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    zIndex: 1000,
    padding: '4px 0',
  },

  // 搜索框
  searchInput: {
    width: '100%',
    padding: '6px 12px',
    border: 'none',
    borderBottom: '1px solid #f0f0f0',
    outline: 'none',
    fontSize: '13px',
    background: 'transparent',
    boxSizing: 'border-box' as const,
  },

  searchInputFocus: {
    borderBottomColor: '#40a9ff',
  },

  // 树节点行
  nodeRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  nodeRowHover: {
    background: '#f5f5f5',
  },

  nodeRowSelected: {
    background: '#e6f7ff',
  },

  nodeRowDisabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },

  // 展开/折叠图标
  toggleIcon: {
    fontSize: '10px',
    marginRight: '4px',
    cursor: 'pointer',
    color: '#999',
    width: '16px',
    display: 'inline-block',
    textAlign: 'center' as const,
  },

  // 复选框
  checkbox: {
    marginRight: '4px',
    cursor: 'pointer',
  },

  // 节点标签
  nodeLabel: {
    padding: '2px 4px',
    borderRadius: '2px',
    flex: 1,
  },

  // 空状态
  empty: {
    padding: '16px',
    color: '#bfbfbf',
    textAlign: 'center' as const,
  },

  // 多选标签（触发器内）
  tags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    flex: 1,
  },

  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1px 6px',
    background: '#f0f0f0',
    borderRadius: '2px',
    fontSize: '12px',
    color: '#333',
  },

  tagRemove: {
    cursor: 'pointer',
    marginLeft: '4px',
    color: '#999',
    fontSize: '12px',
  },
}

// 树节点缩进计算
export const getIndent = (level: number): number => level * 20