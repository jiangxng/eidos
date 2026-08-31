// ---------- RBAC 核心 ----------

import type { Permission, Role } from './store'

// 检查权限是否匹配（支持通配符）
export function matchPermission(required: Permission, permissions: Permission[]): boolean {
  if (permissions.includes('*')) return true
  return permissions.includes(required)
}

// 检查用户是否拥有所有要求的权限
export function hasAllPermissions(permissions: Permission[], required: Permission[]): boolean {
  if (permissions.includes('*')) return true
  return required.every(p => permissions.includes(p))
}

// 检查用户是否拥有任一要求的权限
export function hasAnyPermission(permissions: Permission[], required: Permission[]): boolean {
  if (permissions.includes('*')) return true
  return required.some(p => permissions.includes(p))
}

// 权限解析：将权限字符串解析为资源+操作
// 例如 'user:view' → { resource: 'user', action: 'view' }
export function parsePermission(permission: Permission): { resource: string; action: string } {
  const parts = permission.split(':')
  return {
    resource: parts[0] || '',
    action: parts[1] || ''
  }
}