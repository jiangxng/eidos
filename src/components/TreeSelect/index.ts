// TreeSelect 树形选择器组件
// 完整实现：展开/折叠、搜索过滤、单选/多选、样式独立、onChange 回调
// 回调通过 store.subscribe 实现，不依赖全局注册表
// 使用简洁的事件命名：TREESELECT_{ACTION}_{name}_{key}

import type { VNode } from '../../core/index'
import type { TreeItem, TreeSelectConfig } from '../types'
import { treeSelectStyles, getIndent } from './style'

export function createTreeSelect(config: TreeSelectConfig) {
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

  // 工具函数：根据 key 查找节点
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

  // 获取选中节点的显示文本
  const getSelectedLabels = (items: TreeItem[], selected: any): string[] => {
    const selectedKeys = multiple
      ? Array.isArray(selected) ? selected : []
      : selected !== null && selected !== undefined ? [selected] : []

    const labels: string[] = []
    for (const key of selectedKeys) {
      const node = findNodeByKey(items, String(key))
      if (node) {
        labels.push(String(node[labelKey]))
      }
    }
    return labels
  }

  // 搜索过滤
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

  // 注册 store 订阅，监听状态变化触发 onChange
  let storeInstance: any = null

  const component = function renderTreeSelect(state: any): VNode {
    // 首次渲染时注册 store 订阅
    if (!storeInstance && state._store) {
      storeInstance = state._store
      // 监听当前组件状态变化
      storeInstance.subscribe(() => {
        const newState = storeInstance.get()
        const fieldState = newState[name]
        if (fieldState) {
          const currentValue = fieldState.selected
          const prevValue = fieldState._prevSelected
          if (JSON.stringify(currentValue) !== JSON.stringify(prevValue) && onChange) {
            onChange(currentValue, name)
            // 更新记录的上次值
            storeInstance.dispatch(
              (prev: any) => ({
                ...prev,
                [name]: { ...prev[name], _prevSelected: currentValue }
              }),
              [name]
            )
          }
        }
      })
    }

    const fieldState = state[name] || {}
    const selected = fieldState.selected ?? (multiple ? [] : null)
    const expanded = fieldState.expanded || {}
    const dropdownOpen = !!fieldState.dropdownOpen
    const searchKeyword = fieldState.searchKeyword || ''

    let displayData = rawData
    if (searchKeyword.trim()) {
      displayData = filterTree(rawData, searchKeyword.trim())
    }

    const selectedLabels = getSelectedLabels(rawData, selected)
    const displayText = selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder

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

        const indent = getIndent(level)

        const rowStyle = {
          ...treeSelectStyles.nodeRow,
          paddingLeft: (8 + indent) + 'px',
          ...(isSelected ? treeSelectStyles.nodeRowSelected : {}),
          ...(isDisabled ? treeSelectStyles.nodeRowDisabled : {}),
        }

        const rowChildren: VNode[] = []

        if (hasChildren) {
          rowChildren.push({
            type: 'span',
            props: {
              text: isExpanded ? '▼' : '▶',
              style: treeSelectStyles.toggleIcon,
              onClick: 'TREESELECT_TOGGLE_' + name + '_' + key,
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

        if (checkable) {
          rowChildren.push({
            type: 'input',
            props: {
              type: 'checkbox',
              checked: isSelected,
              disabled: isDisabled,
              style: treeSelectStyles.checkbox,
              onChange: 'TREESELECT_CHECK_' + name + '_' + key,
            },
          })
        }

        if (item.icon) {
          rowChildren.push({
            type: 'span',
            props: {
              text: item.icon + ' ',
              style: { fontSize: '14px' },
            },
          })
        }

        rowChildren.push({
          type: 'span',
          props: {
            text: String(item[labelKey]),
            style: {
              ...treeSelectStyles.nodeLabel,
              color: isDisabled ? '#ccc' : '#333',
            },
            onClick: isDisabled ? undefined : 'TREESELECT_SELECT_' + name + '_' + key,
          },
        })

        const nodeChildren: VNode[] = [
          {
            type: 'div',
            props: {
              style: rowStyle,
              onMouseEnter: 'TREESELECT_HOVER_' + name + '_' + key,
            },
            children: rowChildren,
          },
        ]

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

    return {
      type: 'div',
      props: {
        style: treeSelectStyles.container,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              ...treeSelectStyles.trigger,
              ...(fieldState.isHover ? treeSelectStyles.triggerHover : {}),
            },
            onClick: 'TREESELECT_TOGGLE_DROPDOWN_' + name,
            onMouseEnter: 'TREESELECT_TRIGGER_HOVER_' + name,
            onMouseLeave: 'TREESELECT_TRIGGER_LEAVE_' + name,
          },
          children: [
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

        dropdownOpen ? {
          type: 'div',
          props: {
            style: treeSelectStyles.dropdown,
          },
          children: [
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
                    onInput: 'TREESELECT_SEARCH_' + name,
                    onFocus: 'TREESELECT_SEARCH_FOCUS_' + name,
                    onBlur: 'TREESELECT_SEARCH_BLUR_' + name,
                  },
                },
              ],
            },
          ].concat(displayData.length > 0 ? renderTree(displayData) : [
            {
              type: 'div',
              props: {
                style: treeSelectStyles.empty,
              },
              children: [
                { type: 'span', props: { text: '无匹配结果' } },
              ],
            },
          ]),
        } : null,
      ].filter(Boolean) as VNode[],
    }
  }

  // 暴露 store 引用，供订阅使用
  ;(component as any)._storeRef = null

  return component
}