// -------- 高级表单演示 --------

import { renderAdvancedForm } from '../../../src/components/index'
import { store } from '../../app/store'

export const renderFormModule = () => {
  const values = store.get().formValues

  return {
    type: 'div',
    children: [
      { type: 'h2', props: { text: '📝 高级表单（联动 + 校验）', style: { margin: '0 0 16px 0' } } },
      renderAdvancedForm({
        fields: [
          {
            name: 'username',
            label: '用户名',
            type: 'text',
            placeholder: '请输入用户名',
            required: true,
            rules: [
              (v) => {
                if (v && v.length < 3) return '用户名至少 3 个字符'
                return null
              }
            ]
          },
          {
            name: 'email',
            label: '邮箱',
            type: 'email',
            placeholder: '请输入邮箱',
            required: true,
            rules: [
              (v) => {
                if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
                  return '请输入有效的邮箱地址'
                }
                return null
              }
            ]
          },
          {
            name: 'role',
            label: '角色',
            type: 'select',
            options: [
              { label: '管理员', value: 'admin' },
              { label: '经理', value: 'manager' },
              { label: '普通用户', value: 'user' }
            ],
            defaultValue: 'user'
          },
          {
            name: 'bio',
            label: '个人简介',
            type: 'textarea',
            placeholder: '请输入个人简介',
            // 联动：当 role 为 admin 时显示
            visible: (vals) => vals.role === 'admin'
          }
        ],
        values: values,
        layout: 'vertical',
        columns: 2,
        submitText: '提交',
        cancelText: '取消',
        onCancel: () => {
          console.log('取消')
        },
        onSubmit: (data) => {
          console.log('📤 提交数据:', data)
          // 更新 store 中的表单数据
          store.dispatch(
            (prev: any) => ({
              ...prev,
              formValues: data
            }),
            ['formValues']
          )
          alert('表单已提交，请查看控制台输出。')
        },
        onChange: (name, value, allValues) => {
          console.log('字段变化:', name, value, allValues)
        },
        touched: {}
      })
    ]
  }
}