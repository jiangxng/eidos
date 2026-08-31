// ---------- 高级表格组件 ----------
// 支持筛选、排序、分页、列配置、行选择

import type { VNode } from '../../../core/index'
import type { Column, Pagination, Sort, TableAction } from '../types'
import { tableStyles } from './style'
import { showConfirm } from '../Dialog/index'

export type TableConfig = {
  columns: Column[]
  data: any[]
  pagination?: Pagination
  sort?: Sort
  actions?: TableAction[]
  rowSelection?: boolean
  loading?: boolean
  onSort?: (field: string, order: 'asc' | 'desc') => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onFilter?: (key: string, value: string) => void
}

// 主渲染函数
export function renderAdvancedTable(config: TableConfig): VNode {
  const {
    columns,
    data = [],
    pagination,
    sort,
    actions = [],
    rowSelection = false,
    loading = false,
    onSort,
    onPageChange,
    onPageSizeChange,
    onFilter
  } = config

  // 可见列
  const visibleColumns = columns.filter(c => !c.hidden)

  // 筛选状态（本地存储）
  const filters: Record<string, string> = {}

  return {
    type: 'div',
    props: { style: tableStyles.container },
    children: [
      // 表头
      {
        type: 'div',
        props: { style: tableStyles.header },
        children: [
          // 选择框列
          rowSelection
            ? {
                type: 'div',
                props: {
                  style: { ...tableStyles.headerCell, flex: '0 0 40px', minWidth: '40px', justifyContent: 'center' }
                },
                children: [
                  {
                    type: 'input',
                    props: {
                      type: 'checkbox',
                      style: { cursor: 'pointer' },
                      onClick: 'TABLE_SELECT_ALL'
                    }
                  }
                ]
              }
            : null,
          ...visibleColumns.map(col => ({
            type: 'div',
            props: {
              style: {
                ...tableStyles.headerCell,
                width: col.width,
                flex: col.width ? '0 0 ' + col.width : 1,
                minWidth: col.minWidth || '100px',
                cursor: col.sortable ? 'pointer' : 'default'
              }
            },
            children: [
              { type: 'span', props: { text: col.title } },
              col.sortable
                ? {
                    type: 'span',
                    props: {
                      text: sort && sort.field === col.key ? (sort.order === 'asc' ? '▲' : '▼') : '⇅',
                      style: {
                        ...tableStyles.sortIcon,
                        ...(sort && sort.field === col.key ? tableStyles.sortIconActive : {})
                      },
                      onClick: `TABLE_SORT_${col.key}`
                    }
                  }
                : null,
              col.filterable
                ? {
                    type: 'input',
                    props: {
                      placeholder: '筛选',
                      style: tableStyles.filterInput,
                      onInput: `TABLE_FILTER_${col.key}`,
                      value: filters[col.key] || ''
                    }
                  }
                : null
            ]
          })),
          // 操作列
          actions.length > 0
            ? {
                type: 'div',
                props: {
                  style: {
                    ...tableStyles.headerCell,
                    flex: '0 0 120px',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }
                },
                children: [{ type: 'span', props: { text: '操作' } }]
              }
            : null
        ]
      },
      // 数据行
      loading
        ? {
            type: 'div',
            props: {
              style: {
                padding: '40px',
                textAlign: 'center',
                color: '#999',
                fontSize: '14px'
              }
            },
            children: [{ type: 'span', props: { text: '加载中...' } }]
          }
        : data.length === 0
        ? {
            type: 'div',
            props: {
              style: {
                padding: '40px',
                textAlign: 'center',
                color: '#bbb',
                fontSize: '14px'
              }
            },
            children: [{ type: 'span', props: { text: '暂无数据' } }]
          }
        : data.map((record, index) => ({
            type: 'div',
            props: {
              key: record.id || index,
              style: {
                ...tableStyles.row,
                background: index % 2 === 0 ? 'white' : '#fafafa'
              },
              onMouseEnter: `TABLE_ROW_HOVER_${index}`
            },
            children: [
              rowSelection
                ? {
                    type: 'div',
                    props: {
                      style: {
                        ...tableStyles.cell,
                        flex: '0 0 40px',
                        minWidth: '40px',
                        justifyContent: 'center'
                      }
                    },
                    children: [
                      {
                        type: 'input',
                        props: {
                          type: 'checkbox',
                          style: { cursor: 'pointer' },
                          onClick: `TABLE_SELECT_${record.id || index}`
                        }
                      }
                    ]
                  }
                : null,
              ...visibleColumns.map(col => ({
                type: 'div',
                props: {
                  style: {
                    ...tableStyles.cell,
                    width: col.width,
                    flex: col.width ? '0 0 ' + col.width : 1,
                    minWidth: col.minWidth || '100px'
                  }
                },
                children: [
                  {
                    type: 'span',
                    props: {
                      text: col.render
                        ? col.render(record[col.key], record)
                        : String(record[col.key] ?? '-')
                    }
                  }
                ]
              })),
              actions.length > 0
                ? {
                    type: 'div',
                    props: {
                      style: {
                        ...tableStyles.cell,
                        flex: '0 0 120px',
                        minWidth: '120px',
                        justifyContent: 'center',
                        gap: '8px'
                      }
                    },
                    children: actions
                      .filter(action => {
                        if (action.visible && !action.visible(record)) return false
                        return true
                      })
                      .map(action => ({
                        type: 'button',
                        props: {
                          text: action.icon ? action.icon + ' ' + action.label : action.label,
                          style: {
                            padding: '4px 12px',
                            background: 'transparent',
                            border: 'none',
                            color: '#1890ff',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textDecoration: 'underline'
                          },
                          onClick: `TABLE_ACTION_${action.key}_${record.id || index}`
                        }
                      }))
                  }
                : null
            ]
          })),
      // 分页
      pagination
        ? {
            type: 'div',
            props: { style: tableStyles.pagination },
            children: [
              {
                type: 'span',
                props: {
                  text: `共 ${pagination.total} 条，第 ${pagination.page}/${Math.ceil(pagination.total / pagination.pageSize)} 页`
                },
                style: tableStyles.paginationInfo
              },
              {
                type: 'div',
                props: { style: { display: 'flex', gap: '8px' } },
                children: [
                  {
                    type: 'button',
                    props: {
                      text: '上一页',
                      style: {
                        ...tableStyles.paginationButton,
                        ...(pagination.page <= 1 ? tableStyles.paginationButtonDisabled : {})
                      },
                      onClick: pagination.page > 1 ? `TABLE_PAGE_${pagination.page - 1}` : undefined
                    }
                  },
                  {
                    type: 'button',
                    props: {
                      text: '下一页',
                      style: {
                        ...tableStyles.paginationButton,
                        ...(pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                          ? tableStyles.paginationButtonDisabled
                          : {})
                      },
                      onClick:
                        pagination.page < Math.ceil(pagination.total / pagination.pageSize)
                          ? `TABLE_PAGE_${pagination.page + 1}`
                          : undefined
                    }
                  }
                ]
              }
            ]
          }
        : null
    ]
  }
}

// 在事件处理中使用的辅助函数
export function handleTableEvents(
  type: string,
  e: any,
  config: TableConfig & { onSelect?: (ids: any[]) => void }
) {
  const { onSort, onPageChange, onFilter, data, onSelect } = config

  // 排序
  if (type && type.startsWith('TABLE_SORT_')) {
    const field = type.replace('TABLE_SORT_', '')
    const currentSort = config.sort
    let order: 'asc' | 'desc' = 'asc'
    if (currentSort && currentSort.field === field && currentSort.order === 'asc') {
      order = 'desc'
    }
    if (onSort) onSort(field, order)
    return
  }

  // 分页
  if (type && type.startsWith('TABLE_PAGE_')) {
    const page = parseInt(type.replace('TABLE_PAGE_', ''), 10)
    if (onPageChange) onPageChange(page)
    return
  }

  // 筛选
  if (type && type.startsWith('TABLE_FILTER_')) {
    const field = type.replace('TABLE_FILTER_', '')
    const value = e.detail.value || ''
    if (onFilter) onFilter(field, value)
    return
  }

  // 操作按钮点击
  if (type && type.startsWith('TABLE_ACTION_')) {
    const parts = type.replace('TABLE_ACTION_', '').split('_')
    const actionKey = parts[0]
    const id = parts.slice(1).join('_')
    const record = data.find((r: any) => String(r.id) === id)
    if (record && config.actions) {
      const action = config.actions.find(a => a.key === actionKey)
      if (action) {
        // 如果操作有权限检查，在此处理
        action.onClick(record)
      }
    }
    return
  }

  // 全选
  if (type === 'TABLE_SELECT_ALL') {
    const checked = e.target?.checked
    // 此处应触发选中所有行的事件
    return
  }
}