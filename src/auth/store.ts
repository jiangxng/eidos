// ---------- 权限状态管理 ----------

import { createStore } from '../core/index'

export type Permission = string  // 如 'user:view', 'order:create'
export type Role = string        // 如 'admin', 'manager', 'user'

export type AuthState = {
  // 当前用户信息
  user: {
    id: string | null
    name: string | null
    role: Role | null
    permissions: Permission[]
  }
  // 权限配置（角色 → 权限列表）
  rolePermissions: Record<Role, Permission[]>
  // 是否已初始化
  initialized: boolean
}

// 默认权限配置（可被覆盖）
const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['*'],  // 通配符表示所有权限
  manager: [
    'dashboard:view',
    'user:view',
    'user:create',
    'user:edit',
    'order:view',
    'order:create',
    'order:edit',
    'report:view'
  ],
  user: [
    'dashboard:view',
    'order:view',
    'order:create'
  ]
}

export function createAuthStore(initialRolePermissions?: Record<Role, Permission[]>) {
  const store = createStore<AuthState>({
    user: {
      id: null,
      name: null,
      role: null,
      permissions: []
    },
    rolePermissions: initialRolePermissions || DEFAULT_ROLE_PERMISSIONS,
    initialized: false
  })

  // 登录/设置用户
  function login(userId: string, name: string, role: Role) {
    const state = store.get()
    const permissions = state.rolePermissions[role] || []
    store.dispatch(
      (prev: any) => ({
        ...prev,
        user: { id: userId, name, role, permissions },
        initialized: true
      }),
      ['user', 'initialized']
    )
  }

  // 登出
  function logout() {
    store.dispatch(
      (prev: any) => ({
        ...prev,
        user: { id: null, name: null, role: null, permissions: [] },
        initialized: true
      }),
      ['user', 'initialized']
    )
  }

  // 更新用户权限（动态权限）
  function setPermissions(permissions: Permission[]) {
    const state = store.get()
    store.dispatch(
      (prev: any) => ({
        ...prev,
        user: { ...prev.user, permissions }
      }),
      ['user']
    )
  }

  // 检查当前用户是否有某个权限
  function hasPermission(permission: Permission): boolean {
    const state = store.get()
    const perms = state.user.permissions
    // 如果有通配符 * 则拥有所有权限
    if (perms.includes('*')) return true
    return perms.includes(permission)
  }

  // 检查当前用户是否为某个角色
  function hasRole(role: Role): boolean {
    const state = store.get()
    return state.user.role === role
  }

  return {
    store,
    login,
    logout,
    setPermissions,
    hasPermission,
    hasRole
  }
}