// -------- 路由配置 --------
// 职责：定义所有路由及其对应的组件

import { createRouter } from 'eidos-core'
import { store } from './store'
import { renderFormModule } from '../modules/form'
import { renderListModule } from '../modules/list'
import { renderAsyncModule } from '../modules/async'
import { renderDataModule } from '../modules/data'
import { renderErrorBoundary } from '../modules/error'
import { renderAuthDemo, authStore } from '../modules/auth'
import { renderTreeSelectDemo } from '../modules/tree-select'

// 无权限时的 403 页面
function render403() {
  return {
    type: 'div',
    props: {
      style: {
        padding: '40px',
        textAlign: 'center',
        color: '#999'
      }
    },
    children: [
      { type: 'h2', props: { text: '🚫 403 无权限访问', style: { color: '#ff4d4f' } } },
      { type: 'p', props: { text: '您没有权限访问此页面' } },
      {
        type: 'a',
        props: {
          href: '#/',
          text: '返回首页',
          style: { color: '#1890ff', textDecoration: 'none' }
        }
      }
    ]
  }
}

// 权限检查包装器
function withAuth(
  component: () => any,
  requiredPermissions: string[] = [],
  requiredRoles: string[] = []
): () => any {
  return () => {
    const state = authStore.store.get()
    const userPermissions = state.user.permissions
    const userRole = state.user.role || ''

    // 角色检查
    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(userRole)
      if (!hasRole) return render403()
    }

    // 权限检查
    if (requiredPermissions.length > 0) {
      // 如果有通配符 * 则通过
      if (!userPermissions.includes('*')) {
        const hasPermission = requiredPermissions.some(p => userPermissions.includes(p))
        if (!hasPermission) return render403()
      }
    }

    return component()
  }
}

export const routes = [
  {
    path: '/',
    component: () => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: '🏠 首页', style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: '欢迎使用 Eidos 完整功能演示！' } }
      ]
    })
  },
  {
    path: '/about',
    component: () => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: '📖 关于 Eidos', style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: 'Eidos 是一个 AI 原生前端框架，所有 UI 由 JSON 驱动。' } }
      ]
    })
  },
  {
    path: '/user/:id',
    component: (params: Record<string, string>) => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: `👤 用户 ${params.id}`, style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: `这是用户 ID 为 ${params.id} 的个人主页。` } }
      ]
    })
  },
  {
    path: '/form',
    component: renderFormModule
  },
  {
    path: '/list',
    // 需要 user:view 权限才能访问
    component: withAuth(renderListModule, ['user:view'])
  },
  {
    path: '/async',
    component: renderAsyncModule
  },
  {
    path: '/error',
    component: renderErrorBoundary
  },
  {
    path: '/users',
    // 需要 admin 角色才能访问
    component: withAuth(renderDataModule, [], ['admin'])
  },
  {
    path: '/auth',
    component: () => renderAuthDemo()
  },
  {
    path: '/tree-select',
    component: renderTreeSelectDemo
  },
  {
    path: '/generated/:target/:action?',
    component: async (params: Record<string, string>) => {
      const target = params.target || 'todo'
      const action = params.action || 'list'
      const route = `/generated/${target}/${action}`
      const result = await handleGeneratedRoute(route, params)
      if (result) {
        generatedConfig = result
        // 更新 store 中的 _generatedContent
        store.dispatch(
          (prev: any) => ({
            ...prev,
            _generatedContent: result.contentVNode,
            _generatedLayout: result.layoutConfig
          }),
          ['_generatedContent', '_generatedLayout']
        )
        return result.contentVNode
      }
      return { type: 'p', props: { text: '生成失败' } }
    }
  }
]

// 初始化路由
export const router = createRouter(routes, store)