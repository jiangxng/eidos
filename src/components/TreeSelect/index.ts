// ---------- TreeSelect 树形选择器组件 ----------
// 完整实现：展开/折叠、搜索过滤、单选/多选、样式独立、onChange 回调

import type { VNode } from '../../core/index'
import type { TreeItem, TreeSelectConfig } from '../types'
import { treeSelectStyles, getIndent } from './style'

export function createTreeSelect(config: TreeSelectConfig) {
  // 解构配置，设置默认值
  const {
    name,
    data: rawData,
    valueKey = 'id',
    labelKey = 'label',
    childrenKey = 'children',
    placeholder = '请选择',
    multiple = false,
    checkable = true,
    onChange,
  } = config

  // ---------- 工具函数：根据 key 查找节点 ----------
  const findNodeByKey = (items: TreeItem[], key: string): TreeItem | null => {
    for (const item of items) {
      if (String(item[valueKey]) === key) return item
      if (item[childrenKey]) {
        const found = findNodeByKey(item[childrenKey], key)
        if (found) return found
      }
    }
    return null
  }

  // ---------- 工具函数：获取选中节点的显示标签 ----------
  const getSelectedLabels = (items: TreeItem[], selected: any): string[] => {
    const selectedKeys = multiple
      ? Array.isArray(selected) ? selected : []
      : selected !== null && selected !== undefined ? [selected] : []

    const labels: string[] = []
    const traverse = (list: TreeItem[]) => {
      for (const item of list) {
        const key = String(item[valueKey])
        if (selectedKeys.includes(key)) {
          labels.push(String(item[labelKey]))
        }
        if (item[childrenKey]) {
          traverse(item[childrenKey])
        }
      }
    }
    traverse(items)
    return labels
  }

  // ---------- 工具函数：搜索过滤（保留匹配节点及其父路径） ----------
  const filterTree = (items: TreeItem[], keyword: string): TreeItem[] => {
    const lowerKeyword = keyword.toLowerCase()
    const result: TreeItem[] = []

    for (const item of items) {
      const label = String(item[labelKey]).toLowerCase()
      const matchSelf = label.includes(lowerKeyword)

      let filteredChildren: TreeItem[] = []
      if (item[childrenKey]) {
        filteredChildren = filterTree(item[childrenKey], keyword)
      }

      if (matchSelf || filteredChildren.length > 0) {
        result.push({
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : item[childrenKey],
        })
      }
    }
    return result
  }

  // ---------- 渲染函数 ----------
  return function renderTreeSelect(state: any): VNode {
    // 从 store 读取当前字段状态
    const fieldState = state[name] || {}
    const selected = fieldState.selected ?? (multiple ? [] : null)
    const expanded = fieldState.expanded || {}
    const dropdownOpen = !!fieldState.dropdownOpen
    const searchKeyword = fieldState.searchKeyword || ''

    // 数据过滤
    let displayData = rawData
    if (searchKeyword.trim()) {
      displayData = filterTree(rawData, searchKeyword.trim())
    }

    // 获取选中标签显示
    const selectedLabels = getSelectedLabels(rawData, selected)
    const displayText =
      selectedLabels.length > 0
        ? selectedLabels.join(', ')
        : placeholder

    // ---------- 递归渲染树节点 ----------
    const renderTree = (items: TreeItem[], level: number = 0): VNode[] => {
      const nodes: VNode[] = []

      for (const item of items) {
        const key = String(item[valueKey])
        const hasChildren = !!(item[childrenKey] && item[childrenKey].length > 0)
        const isExpanded = !!expanded[key]
        const isSelected = multiple
          ? Array.isArray(selected) && selected.includes(key)
          : selected === key
        const isDisabled = !!item.disabled

        // 缩进
        const indent = getIndent(level)

        // 行样式组合
        const rowStyle = {
          ...treeSelectStyles.nodeRow,
          paddingLeft: (8 + indent) + 'px',
          ...(isSelected ? treeSelectStyles.nodeRowSelected : {}),
          ...(isDisabled ? treeSelectStyles.nodeRowDisabled : {}),
        }

        const rowChildren: VNode[] = []

        // 1. 展开/折叠按钮
        if (hasChildren) {
          rowChildren.push({
            type: 'span',
            props: {
              text: isExpanded ? '▼' : '▶',
              style: treeSelectStyles.toggleIcon,
              onClick: `TREESELECT_TOGGLE_${name}_${key}`,
            },
          })
        } else {
          rowChildren.push({
            type: 'span',
            props: {
              text: '',
              style: { width: '16px', display: 'inline-block' },
            },
          })
        }

        // 2. 复选框（可选）
        if (checkable) {
          rowChildren.push({
            type: 'input',
            props: {
              type: 'checkbox',
              checked: isSelected,
              disabled: isDisabled,
              style: treeSelectStyles.checkbox,
              onChange: `TREESELECT_CHECK_${name}_${key}`,
            },
          })
        }

        // 3. 图标
        if (item.icon) {
          rowChildren.push({
            type: 'span',
            props: {
              text: item.icon + ' ',
              style: { fontSize: '14px' },
            },
          })
        }

        // 4. 标签文本
        rowChildren.push({
          type: 'span',
          props: {
            text: String(item[labelKey]),
            style: {
              ...treeSelectStyles.nodeLabel,
              color: isDisabled ? '#ccc' : '#333',
            },
            onClick: isDisabled
              ? undefined
              : `TREESELECT_SELECT_${name}_${key}`,
          },
        })

        // 构建节点行
        const nodeChildren: VNode[] = [
          {
            type: 'div',
            props: {
              style: rowStyle,
              onMouseEnter: `TREESELECT_HOVER_${name}_${key}`,
            },
            children: rowChildren,
          },
        ]

        // 递归子节点
        if (hasChildren && isExpanded) {
          const childNodes = renderTree(item[childrenKey] || [], level + 1)
          nodeChildren.push({
            type: 'div',
            props: {
              style: {
                paddingLeft: '0px',
              },
            },
            children: childNodes,
          })
        }

        nodes.push({
          type: 'div',
          props: {
            style: {
              borderBottom: '1px solid #f5f5f5',
            },
          },
          children: nodeChildren,
        })
      }

      return nodes
    }

    // ---------- 主 VNode ----------
    return {
      type: 'div',
      props: {
        style: treeSelectStyles.container,
      },
      children: [
        // ---- 触发器（输入框） ----
        {
          type: 'div',
          props: {
            style: {
              ...treeSelectStyles.trigger,
              ...(fieldState.isHover ? treeSelectStyles.triggerHover : {}),
            },
            onClick: `TREESELECT_TOGGLE_DROPDOWN_${name}`,
            onMouseEnter: `TREESELECT_TRIGGER_HOVER_${name}`,
            onMouseLeave: `TREESELECT_TRIGGER_LEAVE_${name}`,
          },
          children: [
            // 显示文本
            {
              type: 'span',
              props: {
                text: displayText,
                style: {
                  ...treeSelectStyles.valueText,
                  ...(selectedLabels.length === 0 ? treeSelectStyles.placeholderText : {}),
                },
              },
            },
            // 下拉箭头
            {
              type: 'span',
              props: {
                text: '▼',
                style: {
                  ...treeSelectStyles.arrow,
                  ...(dropdownOpen ? treeSelectStyles.arrowOpen : {}),
                },
              },
            },
          ],
        },

        // ---- 下拉面板（条件渲染） ----
        dropdownOpen
          ? {
              type: 'div',
              props: {
                style: treeSelectStyles.dropdown,
              },
              children: [
                // 搜索框
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '4px 8px',
                      borderBottom: '1px solid #f0f0f0',
                    },
                  },
                  children: [
                    {
                      type: 'input',
                      props: {
                        placeholder: '搜索...',
                        value: searchKeyword,
                        style: {
                          ...treeSelectStyles.searchInput,
                          ...(fieldState.searchFocus ? treeSelectStyles.searchInputFocus : {}),
                        },
                        onInput: `TREESELECT_SEARCH_${name}`,
                        onFocus: `TREESELECT_SEARCH_FOCUS_${name}`,
                        onBlur: `TREESELECT_SEARCH_BLUR_${name}`,
                      },
                    },
                  ],
                },
                // 树内容
                ...(displayData.length > 0
                  ? renderTree(displayData)
                  : [
                      {
                        type: 'div',
                        props: {
                          style: treeSelectStyles.empty,
                        },
                        children: [
                          { type: 'span', props: { text: '🔍 无匹配结果' } },
                        ],
                      },
                    ]),
              ],
            }
          : null,
      ].filter(Boolean) as VNode[],
    }
  }
}