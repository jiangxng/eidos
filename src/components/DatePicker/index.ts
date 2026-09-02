// ---------- 日期选择器 DatePicker ----------
// 纯 VNode 渲染，日历网格由 JS 生成

import type { VNode } from '../../core/index'
import type { DatePickerConfig } from '../types'

export function createDatePicker(config: DatePickerConfig) {
  return function renderDatePicker(state: any): VNode {
    const {
      name,
      value = '',
      format = 'YYYY-MM-DD',
      placeholder = '请选择日期',
      disabled = false,
      minDate = '',
      maxDate = '',
      clearable = false,
    } = config

    const fieldState = state[name] || {}
    const selectedDate = fieldState.value || value
    const showPicker = !!fieldState.showPicker
    const viewYear = fieldState.viewYear || new Date().getFullYear()
    const viewMonth = fieldState.viewMonth ?? new Date().getMonth()
    const viewMode = fieldState.viewMode || 'day' // 'day' | 'month' | 'year'

    // 工具函数：日期格式化
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return ''
      const parts = dateStr.split('-')
      if (parts.length !== 3) return dateStr
      const y = parts[0]
      const m = parts[1]
      const d = parts[2]
      return format
        .replace('YYYY', y)
        .replace('MM', m)
        .replace('DD', d)
        .replace('YY', y.slice(2))
    }

    const displayValue = selectedDate ? formatDate(selectedDate) : ''

    // 生成日历网格
    const generateDays = (): VNode[] => {
      const firstDay = new Date(viewYear, viewMonth, 1).getDay()
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
      const today = new Date()
      const todayStr =
        today.getFullYear() +
        '-' +
        String(today.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(today.getDate()).padStart(2, '0')

      const cells: VNode[] = []

      // 星期头
      const weekDays = ['日', '一', '二', '三', '四', '五', '六']
      for (const wd of weekDays) {
        cells.push({
          type: 'div',
          props: {
            style: {
              textAlign: 'center',
              fontSize: '12px',
              color: '#999',
              padding: '4px 0',
              fontWeight: 'bold',
            },
          },
          children: [{ type: 'span', props: { text: wd } }],
        })
      }

      // 空白占位
      for (let i = 0; i < firstDay; i++) {
        cells.push({
          type: 'div',
          props: { style: { padding: '4px 0' } },
          children: [],
        })
      }

      // 日期格子
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr =
          viewYear +
          '-' +
          String(viewMonth + 1).padStart(2, '0') +
          '-' +
          String(d).padStart(2, '0')
        const isToday = dateStr === todayStr
        const isSelected = dateStr === selectedDate
        const isPastMin = minDate && dateStr < minDate
        const isFutureMax = maxDate && dateStr > maxDate
        const isDisabled = isPastMin || isFutureMax || disabled

        cells.push({
          type: 'div',
          props: {
            style: {
              textAlign: 'center',
              padding: '4px 0',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              background: isSelected ? '#1890ff' : isToday ? '#e6f7ff' : 'transparent',
              color: isDisabled ? '#d9d9d9' : isSelected ? '#fff' : '#333',
              fontWeight: isToday && !isSelected ? 'bold' : 'normal',
              transition: 'background 0.15s',
            },
            onClick: isDisabled ? undefined : `DATEPICKER_SELECT_${name}_${dateStr}`,
            onMouseEnter: `DATEPICKER_HOVER_${name}_${dateStr}`,
          },
          children: [{ type: 'span', props: { text: String(d) } }],
        })
      }

      return cells
    }

    // 月份切换按钮
    const renderHeader = (): VNode => {
      const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderBottom: '1px solid #f0f0f0',
          },
        },
        children: [
          {
            type: 'button',
            props: {
              text: '◀',
              style: {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666',
                padding: '4px 8px',
              },
              onClick: `DATEPICKER_PREV_${name}`,
            },
          },
          {
            type: 'span',
            props: {
              text: viewYear + '年 ' + monthNames[viewMonth],
              style: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
            },
          },
          {
            type: 'button',
            props: {
              text: '▶',
              style: {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666',
                padding: '4px 8px',
              },
              onClick: `DATEPICKER_NEXT_${name}`,
            },
          },
        ],
      }
    }

    // 主容器
    return {
      type: 'div',
      props: {
        style: {
          position: 'relative',
          width: '100%',
          fontFamily: '-apple-system, sans-serif',
        },
      },
      children: [
        // 输入框
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              padding: '4px 8px',
              background: disabled ? '#f5f5f5' : '#fff',
              cursor: disabled ? 'not-allowed' : 'pointer',
              minHeight: '32px',
              transition: 'border-color 0.2s',
            },
            onClick: disabled ? undefined : `DATEPICKER_TOGGLE_${name}`,
          },
          children: [
            {
              type: 'span',
              props: {
                text: '📅',
                style: { marginRight: '8px', fontSize: '16px' },
              },
            },
            {
              type: 'span',
              props: {
                text: displayValue || placeholder,
                style: {
                  flex: 1,
                  color: displayValue ? '#333' : '#bfbfbf',
                  fontSize: '14px',
                },
              },
            },
            clearable && selectedDate
              ? {
                  type: 'span',
                  props: {
                    text: '✕',
                    style: {
                      cursor: 'pointer',
                      color: '#ccc',
                      fontSize: '12px',
                      padding: '0 4px',
                    },
                    onClick: `DATEPICKER_CLEAR_${name}`,
                  },
                }
              : null,
          ].filter(Boolean) as VNode[],
        },
        // 日历弹出面板
        showPicker
          ? {
              type: 'div',
              props: {
                style: {
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  width: '280px',
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  zIndex: 1000,
                  padding: '4px 0',
                },
              },
              children: [
                renderHeader(),
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      padding: '4px 8px 8px 8px',
                      gap: '2px',
                    },
                  },
                  children: generateDays(),
                },
                // 底部快捷按钮
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'flex-end',
                      padding: '4px 12px 8px 12px',
                      borderTop: '1px solid #f0f0f0',
                      gap: '8px',
                    },
                  },
                  children: [
                    {
                      type: 'button',
                      props: {
                        text: '今天',
                        style: {
                          padding: '2px 12px',
                          background: '#fff',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          color: '#666',
                        },
                        onClick: `DATEPICKER_TODAY_${name}`,
                      },
                    },
                    {
                      type: 'button',
                      props: {
                        text: '确定',
                        style: {
                          padding: '2px 12px',
                          background: '#1890ff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          color: '#fff',
                        },
                        onClick: `DATEPICKER_CONFIRM_${name}`,
                      },
                    },
                  ],
                },
              ],
            }
          : null,
      ].filter(Boolean) as VNode[],
    }
  }
}