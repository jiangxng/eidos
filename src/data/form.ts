import { VNode } from '../../core/index'

export function createFormPage(manager: any, mode: 'create' | 'edit' = 'create'): VNode {
  const { fields, formStore, setField } = manager
  const state = formStore.get()

  return {
    type: 'div',
    props: { style: { padding: '16px', maxWidth: '600px' } },
    children: [
      {
        type: 'h2',
        props: { text: mode === 'create' ? '新增' : '编辑' }
      },
      // 表单字段
      ...fields.filter(f => f.form).map(f => ({
        type: 'div',
        props: { style: { marginBottom: '16px' } },
        children: [
          {
            type: 'label',
            props: { text: f.label || f.name, style: { display: 'block', marginBottom: '4px', fontWeight: 'bold' } }
          },
          f.type === 'enum' ? {
            type: 'select',
            props: {
              value: state.data[f.name] || '',
              onInput: `FORM_FIELD_${manager.name}_${f.name}`,
              style: { width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px' }
            },
            children: (f.options || []).map(opt => ({
              type: 'option',
              props: { value: opt.value, text: opt.label }
            }))
          } : f.type === 'textarea' ? {
            type: 'textarea',
            props: {
              value: state.data[f.name] || '',
              onInput: `FORM_FIELD_${manager.name}_${f.name}`,
              style: { width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', minHeight: '80px' }
            }
          } : {
            type: 'input',
            props: {
              type: f.type === 'number' ? 'number' : 'text',
              value: state.data[f.name] || '',
              onInput: `FORM_FIELD_${manager.name}_${f.name}`,
              style: { width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px' }
            }
          },
          state.errors[f.name] ? {
            type: 'span',
            props: { text: state.errors[f.name], style: { color: '#ff4d4f', fontSize: '12px' } }
          } : null
        ]
      })),
      // 全局错误
      state.errors._global ? {
        type: 'div',
        props: { style: { color: '#ff4d4f', marginBottom: '12px' }, text: state.errors._global }
      } : null,
      // 操作按钮
      {
        type: 'div',
        props: { style: { display: 'flex', gap: '8px' } },
        children: [
          {
            type: 'button',
            props: {
              text: state.submitting ? '提交中...' : '提交',
              onClick: `FORM_SUBMIT_${manager.name}`,
              style: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: state.submitting ? 'not-allowed' : 'pointer' }
            }
          },
          {
            type: 'button',
            props: {
              text: '取消',
              onClick: `FORM_CANCEL_${manager.name}`,
              style: { padding: '8px 16px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }
            }
          }
        ]
      }
    ]
  }
}