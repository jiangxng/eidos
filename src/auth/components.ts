// ---------- 组件级权限控制 ----------

import type { VNode } from '../core/index'
import type { AuthStore } from './store'

// 条件渲染：权限通过时渲染内容，否则返回 null 或 fallback
export function ifAllowed(
  authStore: ReturnType<typeof import('./store').createAuthStore>,
  config: {
    // 需要的权限（至少满足一个）
    permissions?: string[]
    // 需要的角色（至少满足一个）
    roles?: string[]
    // 通过时渲染的内容
    children: VNode | null
    // 不通过时渲染的内容（可选）
    fallback?: VNode | null
  }
): VNode | null {
  const { permissions = [], roles = [], children, fallback = null } = config

  const state = authStore.store.get()
  const userPermissions = state.user.permissions
  const userRole = state.user.role

  // 如果没有设置任何限制，直接渲染 children
  if (permissions.length === 0 && roles.length === 0) {
    return children
  }

  // 检查角色（至少满足一个）
  let roleMatch = true
  if (roles.length > 0) {
    roleMatch = roles.includes(userRole || '')
  }

  // 检查权限（至少满足一个）
  let permissionMatch = true
  if (permissions.length > 0) {
    // 如果有通配符 * 则通过
    if (userPermissions.includes('*')) {
      permissionMatch = true
    } else {
      permissionMatch = permissions.some(p => userPermissions.includes(p))
    }
  }

  const hasAccess = roleMatch && permissionMatch
  return hasAccess ? children : fallback
}

// 快捷函数：仅权限检查
export function ifHasPermission(
  authStore: ReturnType<typeof import('./store').createAuthStore>,
  permission: string,
  children: VNode | null,
  fallback?: VNode | null
): VNode | null {
  return ifAllowed(authStore, {
    permissions: [permission],
    children,
    fallback
  })
}

// 快捷函数：仅角色检查
export function ifHasRole(
  authStore: ReturnType<typeof import('./store').createAuthStore>,
  role: string,
  children: VNode | null,
  fallback?: VNode | null
): VNode | null {
  return ifAllowed(authStore, {
    roles: [role],
    children,
    fallback
  })
}