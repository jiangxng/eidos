// ---------- 高级表单组件 ----------
// 支持字段联动、实时校验、多列布局

import type { VNode } from '../../../core/index'
import type { FormField, FormLayout } from '../types'

export type FormConfig = {
  fields: FormField[]
  layout?: FormLayout
  columns?: number
  values: Record<string, any>
  errors?: Record<string, string>
  touched?: Record<string, boolean>
  onSubmit?: (values: Record<string, any>) => void | Promise<void>
  onChange?: (name: string, value: any, values: Record<string, any>) => void
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
}

// 校验函数
function validateField(
  field: FormField,
  value: any,
  values: Record<string, any>
): string | null {
  // 必填校验
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} 为必填项`
  }

  // 自定义规则
  if (field.rules) {
    for (const rule of field.rules) {
      const result = rule(value)
      if (result) return result
    }
  }

  return null
}

// 校验整个表单
export function validateForm(
  fields: FormField[],
  values: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    // 跳过不可见的字段
    if (field.visible && !field.visible(values)) continue
    const value = values[field.name]
    const error = validateField(field, value, values)
    if (error) {
      errors[field.name] = error
    }
  }
  return errors
}

// 主渲染函数
export function renderAdvancedForm(config: FormConfig): VNode {
  const {
    fields,
    layout = 'vertical',
    columns = 1,
    values,
    errors = {},
    touched = {},
    onSubmit,
    onChange,
    submitText = '提交',
    cancelText = '取消',
    onCancel,
    loading = false
  } = config

  // 校验所有字段（显示所有错误）
  const allErrors = validateForm(fields, values)

  // 布局样式
  const layoutStyles = {
    vertical: { flexDirection: 'column' as const, gap: '16px' },
    horizontal: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: '16px' },
    inline: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: '8px', alignItems: 'center' }
  }

  // 计算列宽
  const columnWidth = layout === 'vertical' ? '100%' : `${100 / columns}%`

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }
    },
    children: [
      // 表单字段
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: layoutStyles[layout].flexDirection,
            flexWrap: layoutStyles[layout].flexWrap,
            gap: layoutStyles[layout].gap,
            alignItems: layout === 'inline' ? 'center' : 'flex-start'
          }
        },
        children: fields.map((field) => {
          const isVisible = field.visible ? field.visible(values) : true
          if (!isVisible) return null

          const isDisabled = field.disabled ? field.disabled(values) : false
          const value = values[field.name] ?? field.defaultValue ?? ''
          const isTouched = touched[field.name] || false
          const error = errors[field.name] || (isTouched ? allErrors[field.name] : null)

          return {
            type: 'div',
            props: {
              key: field.name,
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                flex: layout === 'inline' ? '0 0 auto' : `0 0 ${columnWidth}`,
                minWidth: layout === 'inline' ? 'auto' : '200px',
                maxWidth: layout === 'inline' ? 'auto' : '100%',
                boxSizing: 'border-box' as const
              }
            },
            children: [
              {
                type: 'label',
                props: {
                  text: field.label + (field.required ? ' *' : ''),
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: field.required ? '#333' : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }
                }
              },
              renderField(field, value, isDisabled, onChange, values),
              error
                ? {
                    type: 'span',
                    props: {
                      text: error,
                      style: { color: '#ff4d4f', fontSize: '12px', marginTop: '2px' }
                    }
                  }
                : null
            ]
          }
        })
      },
      // 提交按钮
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
            justifyContent: 'flex-end'
          }
        },
        children: [
          onCancel
            ? {
                type: 'button',
                props: {
                  text: cancelText,
                  style: {
                    padding: '8px 24px',
                    background: 'white',
                    color: '#333',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  },
                  onClick: 'FORM_CANCEL'
                }
              }
            : null,
          {
            type: 'button',
            props: {
              text: loading ? '提交中...' : submitText,
              style: {
                padding: '8px 24px',
                background: loading ? '#bae7ff' : '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: loading ? 0.7 : 1
              },
              onClick: onSubmit ? 'FORM_SUBMIT' : undefined
            }
          }
        ]
      }
    ]
  }
}

function renderField(
  field: FormField,
  value: any,
  disabled: boolean,
  onChange?: (name: string, value: any, values: Record<string, any>) => void,
  values?: Record<string, any>
): VNode {
  const baseProps = {
    style: {
      padding: '8px 12px',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%',
      minHeight: field.type === 'textarea' ? '80px' : 'auto',
      background: disabled ? '#f5f5f5' : 'white',
      cursor: disabled ? 'not-allowed' : 'default',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.15s'
    },
    onInput: onChange ? `FORM_INPUT_${field.name}` : undefined,
    value: value ?? '',
    disabled: disabled
  }

  // 如果字段有自定义渲染
  if (field.render) {
    return field.render({ value, disabled, onChange, values })
  }

  switch (field.type) {
    case 'textarea':
      return {
        type: 'textarea',
        props: {
          ...baseProps,
          rows: 3
        }
      }
    case 'select':
      return {
        type: 'select',
        props: {
          ...baseProps,
          value: value ?? ''
        },
        children: (field.options || []).map(opt => ({
          type: 'option',
          props: { value: opt.value, text: opt.label }
        }))
      }
    case 'number':
      return {
        type: 'input',
        props: {
          ...baseProps,
          type: 'number'
        }
      }
    case 'custom':
      return field.render ? field.render({ value, disabled, onChange, values }) : { type: 'span', props: { text: '自定义字段' } }
    default:
      return {
        type: 'input',
        props: {
          ...baseProps,
          type: field.type || 'text'
        }
      }
  }
}

// 表单事件处理辅助
export function handleFormEvents(
  type: string,
  e: any,
  config: FormConfig & { onSuccess?: () => void }
) {
  const { fields, values, onSubmit, onChange, onSuccess } = config

  // 字段输入
  if (type && type.startsWith('FORM_INPUT_')) {
    const name = type.replace('FORM_INPUT_', '')
    const value = e.detail.value
    if (onChange) {
      const newValues = { ...values, [name]: value }
      onChange(name, value, newValues)
    }
    return
  }

  // 表单提交
  if (type === 'FORM_SUBMIT' && onSubmit) {
    const errors = validateForm(fields, values)
    const hasError = Object.keys(errors).length > 0

    if (hasError) {
      // 触发错误事件，显示第一条错误
      const firstError = Object.values(errors)[0]
      window.dispatchEvent(new CustomEvent('eidos-event', {
        detail: { type: 'FORM_ERROR', message: firstError }
      }))
      return
    }

    onSubmit(values)
    if (onSuccess) onSuccess()
  }

  // 表单取消
  if (type === 'FORM_CANCEL' && config.onCancel) {
    config.onCancel()
  }
}