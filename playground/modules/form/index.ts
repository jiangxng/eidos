// -------- 表单模块 --------
// 职责：表单示例

import { renderForm } from 'eidos-core'
import type { FormField } from 'eidos-core'
import { store } from '../../app/store'

export const renderFormModule = () => {
  const fields: FormField[] = [
    {
      type: 'text',
      name: 'username',
      label: '用户名',
      value: store.get().formValues.username || '',
      rules: { required: true, minLength: 3, message: '用户名至少 3 个字符' }
    },
    {
      type: 'email',
      name: 'email',
      label: '邮箱',
      value: store.get().formValues.email || '',
      rules: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }
    },
    {
      type: 'textarea',
      name: 'bio',
      label: '个人简介',
      value: store.get().formValues.bio || '',
      rules: { maxLength: 200, message: '最多 200 个字符' }
    }
  ]

  return {
    type: 'div',
    children: [
      { type: 'h2', props: { text: '📝 注册表单', style: { margin: '0 0 16px 0' } } },
      renderForm(fields),
      {
        type: 'button',
        props: {
          text: '提交',
          onClick: 'FORM_SUBMIT',
          style: {
            padding: '8px 16px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '12px'
          }
        }
      }
    ]
  }
}