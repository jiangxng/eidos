// ---------- 生成器路由处理 ----------
// 处理所有由生成器创建的动态页面
// 整合数据管理模块，展示真实数据

import { Generator } from '../../src/layout/generator/index'
import { store } from './store'
import { getDataManager, hasDataManager } from './data-managers'

// 数据模型注册表（用于生成器）
const dataModels = {
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
  },
  order: {
    name: 'order',
    label: '订单',
    fields: [
      { name: 'id', type: 'number', label: '订单号' },
      { name: 'amount', type: 'number', label: '金额' },
      { name: 'status', type: 'string', label: '状态' },
      { name: 'createdAt', type: 'date', label: '创建时间' }
    ]
  }
}

/**
 * 为指定路由生成内容
 */
export async function generateForRoute(route: string): Promise<{
  contentVNode: any
  layoutConfig: any
} | null> {
  try {
    const parts = route.replace('/generated/', '').split('/')
    const target = parts[0] || 'todo'
    const action = parts[1] || 'list'

    // 验证目标是否在数据模型中
    if (!dataModels[target]) {
      return generateErrorPage(`未知数据模型 "${target}"，可用: ${Object.keys(dataModels).join(', ')}`)
    }

    // 检查是否有对应的数据管理器
    const dataManager = getDataManager(target)
    const hasData = hasDataManager(target)

    // 构建意图
    const intent = {
      action: action === 'create' ? 'create' : 'list',
      target: target,
      constraints: {
        page: 1,
        pageSize: 20
      }
    }

    // 获取真实数据（如果有数据管理器）
    let listData: any[] = []
    let totalCount = 0

    if (hasData && action !== 'create') {
      try {
        // 调用数据管理器的 fetchList 获取真实数据
        // 注意：如果数据管理器已经有缓存数据，直接读取
        const listState = dataManager.listStore?.get()
        if (listState && listState.items && listState.items.length > 0) {
          listData = listState.items
          totalCount = listState.total || listState.items.length
        } else {
          // 如果没有缓存数据，尝试加载
          if (dataManager.fetchList) {
            await dataManager.fetchList()
            const newState = dataManager.listStore?.get()
            if (newState) {
              listData = newState.items || []
              totalCount = newState.total || listData.length
            }
          }
        }
      } catch (error) {
        console.warn('[Generator] 加载数据失败，使用空数据:', error)
        listData = []
        totalCount = 0
      }
    }

    // 构建上下文（包含数据）
    const context = {
      role: store.get().userProfile?.role || 'admin',
      device: getDevice(),
      dataModel: {
        name: target,
        fields: dataModels[target].fields
      },
      currentRoute: route,
      // 注入数据，让生成器可以渲染真实列表
      data: {
        list: listData,
        total: totalCount,
        hasData: hasData
      }
    }

    // 调用生成器
    const result = await Generator.buildLayout(intent, context, {
      dataModels: dataModels,
      theme: {
        primaryColor: '#1890ff',
        mode: 'light'
      }
    })

    return result
  } catch (error) {
    console.error('[Generator] 生成失败:', error)
    return generateErrorPage('生成失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

/**
 * 生成错误页面
 */
function generateErrorPage(message: string): {
  contentVNode: any
  layoutConfig: any
} {
  return {
    contentVNode: {
      type: 'div',
      props: { style: { padding: '40px', textAlign: 'center' } },
      children: [
        { type: 'h2', props: { text: '❌ 错误', style: { color: '#ff4d4f' } } },
        { type: 'p', props: { text: message } },
        {
          type: 'a',
          props: {
            href: '#/',
            text: '返回首页',
            style: { color: '#1890ff', textDecoration: 'none' }
          }
        }
      ]
    },
    layoutConfig: {
      name: '错误页面',
      defaultLayout: 'hybrid',
      regions: [
        {
          id: 'content',
          name: '主内容区',
          position: 'center',
          content: [],
          visibility: { devices: ['desktop', 'tablet', 'mobile'] }
        }
      ],
      menu: []
    }
  }
}

/**
 * 获取当前设备类型
 */
function getDevice(): 'desktop' | 'tablet' | 'mobile' {
  const w = window.innerWidth
  if (w >= 1024) return 'desktop'
  if (w >= 768) return 'tablet'
  return 'mobile'
}

/**
 * 获取数据模型字段
 */
export function getDataModelFields(target: string): any[] {
  return dataModels[target]?.fields || []
}

// 在 generated.ts 末尾添加
export function getDataModelForTarget(target: string): any | null {
  return dataModels[target] || null
}