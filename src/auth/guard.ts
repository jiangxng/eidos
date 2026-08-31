// ---------- 路由守卫 ----------

import type { RouteConfig } from '../core/index'
import type { AuthStore } from './store'

export type GuardConfig = {
  // 需要哪些权限才能访问
  permissions?: string[]
  // 需要哪些角色才能访问
  roles?: string[]
  // 重定向路径（无权限时跳转）
  redirectTo?: string
  // 403 页面组件（无权限时显示）
  fallback?: (path: string) => any
}

// 默认 403 页面
function defaultFallback(path: string): any {
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
      { type: 'p', props: { text: `您没有访问 ${path} 的权限` } },
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

// 路由守卫：检查路由是否需要权限
export function createRouteGuard(
  authStore: ReturnType<typeof import('./store').createAuthStore>,
  config: GuardConfig = {}
) {
  const { permissions = [], roles = [], redirectTo = '/', fallback = defaultFallback } = config

  return function guard(route: RouteConfig, path: string): any | null {
    const state = authStore.store.get()
    const userPermissions = state.user.permissions
    const userRole = state.user.role

    // 如果用户未登录且需要权限，重定向
    if (!state.initialized || !state.user.id) {
      window.location.hash = redirectTo
      return null
    }

    // 角色检查
    if (roles.length > 0) {
      const hasRole = roles.includes(userRole || '')
      if (!hasRole) {
        return fallback(path)
      }
    }

    // 权限检查
    if (permissions.length > 0) {
      const hasPermission = authStore.hasPermission(permissions[0])
      // 检查是否拥有所有权限
      const allMatch = permissions.every(p => authStore.hasPermission(p))
      if (!allMatch) {
        return fallback(path)
      }
    }

    // 通过守卫
    return null
  }
}

// 扩展路由配置：增加权限字段
export type ProtectedRouteConfig = RouteConfig & {
  permissions?: string[]
  roles?: string[]
}

// 过滤有权限的路由列表
export function filterRoutes(
  routes: ProtectedRouteConfig[],
  authStore: ReturnType<typeof import('./store').createAuthStore>
): ProtectedRouteConfig[] {
  return routes.filter(route => {
    const { permissions = [], roles = [] } = route
    const state = authStore.store.get()
    const userPermissions = state.user.permissions
    const userRole = state.user.role

    // 如果没有权限要求，直接可见
    if (permissions.length === 0 && roles.length === 0) {
      return true
    }

    // 角色检查
    if (roles.length > 0) {
      if (!roles.includes(userRole || '')) return false
    }

    // 权限检查
    if (permissions.length > 0) {
      const allMatch = permissions.every(p => authStore.hasPermission(p))
      if (!allMatch) return false
    }

    return true
  })
}