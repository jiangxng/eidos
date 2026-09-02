// ---------- TreeSelect 演示模块 ----------
// 在 playground 中展示树形选择器

import type { VNode } from '../../../src/core/index'
import { createTreeSelect } from '../../../src/components/index'
import type { TreeItem } from '../../../src/components/types'

// ---- 模拟树形数据 ----
const treeData: TreeItem[] = [
  {
    id: '1',
    label: '📁 总公司',
    icon: '🏢',
    children: [
      {
        id: '1-1',
        label: '技术部',
        icon: '💻',
        children: [
          { id: '1-1-1', label: '前端组' },
          { id: '1-1-2', label: '后端组' },
          { id: '1-1-3', label: '运维组' },
        ],
      },
      {
        id: '1-2',
        label: '市场部',
        icon: '📊',
        children: [
          { id: '1-2-1', label: '品牌组' },
          { id: '1-2-2', label: '渠道组' },
        ],
      },
      {
        id: '1-3',
        label: '人力资源部',
        icon: '👥',
        children: [
          { id: '1-3-1', label: '招聘组' },
          { id: '1-3-2', label: '培训组' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: '📁 分公司',
    icon: '🏢',
    children: [
      { id: '2-1', label: '上海分公司' },
      { id: '2-2', label: '深圳分公司' },
    ],
  },
]

// ---- 创建组件实例（单选） ----
const treeSelectSingle = createTreeSelect({
  name: 'treeSelectSingle',
  data: treeData,
  placeholder: '请选择部门（单选）',
  multiple: false,
  checkable: true,
  onChange: (selected, name) => {
    console.log(`[${name}] 选中:`, selected)
  },
})

// ---- 创建组件实例（多选） ----
const treeSelectMultiple = createTreeSelect({
  name: 'treeSelectMultiple',
  data: treeData,
  placeholder: '请选择部门（多选）',
  multiple: true,
  checkable: true,
  onChange: (selected, name) => {
    console.log(`[${name}] 多选:`, selected)
  },
})

// ---- 视图渲染（与现有模块保持一致的导出方式） ----
export function renderTreeSelectDemo(state: any): VNode {
  // 从 store 读取当前选中值（用于展示）
  const singleVal = state.treeSelectSingle?.selected || null
  const multiVal = state.treeSelectMultiple?.selected || []

  return {
    type: 'div',
    props: {
      style: {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: '-apple-system, sans-serif',
      },
    },
    children: [
      // 标题
      {
        type: 'h1',
        props: {
          style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' },
        },
        children: [{ type: 'span', props: { text: '🌳 TreeSelect 树形选择器演示' } }],
      },
      // 说明
      {
        type: 'p',
        props: {
          style: { color: '#666', marginBottom: '24px', fontSize: '14px' },
        },
        children: [
          {
            type: 'span',
            props: {
              text: '支持展开/折叠、搜索过滤、单选/多选。选择结果会同步到下方展示区。',
            },
          },
        ],
      },

      // ---- 单选示例 ----
      {
        type: 'div',
        props: {
          style: { marginBottom: '32px' },
        },
        children: [
          {
            type: 'label',
            props: {
              style: { display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' },
            },
            children: [{ type: 'span', props: { text: '单选模式' } }],
          },
          treeSelectSingle(state),
          {
            type: 'div',
            props: {
              style: {
                marginTop: '8px',
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#333',
              },
            },
            children: [
              {
                type: 'span',
                props: {
                  text: `当前选中: ${singleVal ? singleVal : '（未选择）'}`,
                },
              },
            ],
          },
        ],
      },

      // ---- 多选示例 ----
      {
        type: 'div',
        props: {
          style: { marginBottom: '32px' },
        },
        children: [
          {
            type: 'label',
            props: {
              style: { display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' },
            },
            children: [{ type: 'span', props: { text: '多选模式（带复选框）' } }],
          },
          treeSelectMultiple(state),
          {
            type: 'div',
            props: {
              style: {
                marginTop: '8px',
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#333',
              },
            },
            children: [
              {
                type: 'span',
                props: {
                  text: `已选: ${multiVal.length > 0 ? multiVal.join('、') : '（未选择）'}`,
                },
              },
            ],
          },
        ],
      },

      // 使用提示
      {
        type: 'div',
        props: {
          style: {
            padding: '12px 16px',
            background: '#e6f7ff',
            borderRadius: '4px',
            border: '1px solid #91d5ff',
            fontSize: '13px',
            color: '#0050b3',
          },
        },
        children: [
          {
            type: 'span',
            props: {
              text: '💡 提示：点击节点标签选择，点击箭头展开/折叠子节点，支持搜索过滤。',
            },
          },
        ],
      },
    ],
  }
}

// ---- 导出初始状态（供 store 初始化使用） ----
export const treeSelectInitialState = {
  treeSelectSingle: {
    selected: null,
    expanded: {},
    dropdownOpen: false,
    searchKeyword: '',
  },
  treeSelectMultiple: {
    selected: [],
    expanded: {},
    dropdownOpen: false,
    searchKeyword: '',
  },
}