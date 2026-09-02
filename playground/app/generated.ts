// ---------- 生成器路由处理 ----------
// 处理所有由生成器创建的动态页面

import { Generator } from '../../src/layout/generator/index'
import { store } from './store'

// 生成器状态
let generatedConfig: any = null

// 处理生成器路由
export function handleGeneratedRoute(route: string, params: Record<string, string>) {
  // 解析路由: /generated/todo 或 /generated/todo/create
  const parts = route.replace('/generated/', '').split('/')
  const target = parts[0]
  const action = parts[1] || 'list'

  // 构建意图
  const intent = {
    action: action === 'create' ? 'create' : 'list',
    target: target,
    constraints: {
      page: 1,
      pageSize: 20
    }
  }

  // 构建上下文
  const context = {
    role: store.get().userProfile?.role || 'admin',
    device: getDevice(),
    dataModel: {
      name: target,
      fields: getDataModelFields(target)
    },
    currentRoute: route
  }

  // 调用生成器
  return Generator.buildLayout(intent, context, {
    dataModels: {
      todo: {
        name: 'todo',
        label: '待办',
        fields: [
          { name: 'id', type: 'number', label: 'ID' },
          { name: 'text', type: 'string', label: '内容' },
          { name: 'done', type: 'boolean', label: '已完成' },
          { name: 'createdAt', type: 'date', label: '创建时间' }
        ]
      },
      user: {
        name: 'user',
        label: '用户',
        fields: [
          { name: 'id', type: 'number', label: 'ID' },
          { name: 'name', type: 'string', label: '姓名' },
          { name: 'email', type: 'string', label: '邮箱' },
          { name: 'role', type: 'string', label: '角色' }
        ]
      }
    },
    theme: {
      primaryColor: '#1890ff',
      mode: 'light'
    }
  })
}

// 获取当前设备类型
function getDevice(): 'desktop' | 'tablet' | 'mobile' {
  const w = window.innerWidth
  if (w >= 1024) return 'desktop'
  if (w >= 768) return 'tablet'
  return 'mobile'
}

// 获取数据模型字段
function getDataModelFields(target: string): any[] {
  const models: Record<string, any[]> = {
    todo: [
      { name: 'id', type: 'number', label: 'ID' },
      { name: 'text', type: 'string', label: '内容' },
      { name: 'done', type: 'boolean', label: '已完成' },
      { name: 'createdAt', type: 'date', label: '创建时间' }
    ],
    user: [
      { name: 'id', type: 'number', label: 'ID' },
      { name: 'name', type: 'string', label: '姓名' },
      { name: 'email', type: 'string', label: '邮箱' },
      { name: 'role', type: 'string', label: '角色' }
    ]
  }
  return models[target] || [{ name: 'id', type: 'string', label: 'ID' }]
}

// 获取生成器状态
export function getGeneratedConfig() {
  return generatedConfig
}