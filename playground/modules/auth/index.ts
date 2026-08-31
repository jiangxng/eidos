// -------- 权限控制演示模块 --------

import { createAuthStore } from '../../../src/auth/index'
import { ifAllowed } from '../../../src/auth/components'

// 从 localStorage 读取角色，实现持久化
const STORAGE_KEY = 'eidos_demo_role'

// 创建权限存储
export const authStore = createAuthStore()

// 初始化：从 localStorage 读取角色，默认 manager
export function initAuth() {
  const savedRole = localStorage.getItem(STORAGE_KEY) || 'manager'
  const role = savedRole as 'admin' | 'manager' | 'user'
  authStore.login('user-001', `用户 (${role})`, role)
  ;(window as any).__EIDOS_ROLE__ = role
  console.log('[Auth] 已登录，角色:', role)
}

// 切换角色（用于演示）
export function switchRole(role: 'admin' | 'manager' | 'user') {
  localStorage.setItem(STORAGE_KEY, role)
  authStore.login('user-001', `用户 (${role})`, role)
  // 同步到全局变量，方便调试
  ;(window as any).__EIDOS_ROLE__ = role
  const app = (window as any).__EIDOS_APP__
  if (app) {
    app.refresh()
  }
  console.log('[Auth] 已切换角色:', role)
}

// 权限控制演示视图
export function renderAuthDemo() {
  const state = authStore.store.get()
  const user = state.user

  // 调试：打印当前权限
  console.log('[Auth Demo] 当前角色:', user.role, '权限:', user.permissions)

  return {
    type: 'div',
    children: [
      { type: 'h2', props: { text: '🔐 权限控制演示', style: { margin: '0 0 16px 0' } } },
      {
        type: 'div',
        props: {
          style: {
            padding: '12px',
            background: '#e6f7ff',
            borderRadius: '4px',
            marginBottom: '16px'
          }
        },
        children: [
          { type: 'p', props: { text: `当前用户: ${user.name} (${user.role})`, style: { margin: '0' } } },
          { type: 'p', props: { text: `权限列表: ${user.permissions.join(', ') || '无'}`, style: { margin: '4px 0 0 0', fontSize: '12px', color: '#666' } } }
        ]
      },
      {
        type: 'div',
        props: { style: { display: 'flex', gap: '8px', marginBottom: '16px' } },
        children: [
          { type: 'button', props: { text: '切换为 admin', onClick: 'AUTH_SWITCH_admin', style: { padding: '6px 12px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } } },
          { type: 'button', props: { text: '切换为 manager', onClick: 'AUTH_SWITCH_manager', style: { padding: '6px 12px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } } },
          { type: 'button', props: { text: '切换为 user', onClick: 'AUTH_SWITCH_user', style: { padding: '6px 12px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } } }
        ]
      },
      {
        type: 'div',
        props: { style: { border: '1px solid #e8e8e8', borderRadius: '4px', padding: '16px' } },
        children: [
          { type: 'p', props: { text: '以下内容根据权限显示/隐藏', style: { margin: '0 0 12px 0', fontSize: '14px', color: '#666' } } },
          // 管理员可见（需要 user:manage）
          ifAllowed(authStore, {
            permissions: ['user:manage'],
            children: {
              type: 'div',
              props: { style: { padding: '12px', background: '#f6ffed', borderRadius: '4px', marginBottom: '8px', border: '1px solid #b7eb8f' } },
              children: [{ type: 'span', props: { text: '🔑 管理员专属：用户管理面板 (需要 user:manage 权限)' } }]
            },
            fallback: {
              type: 'div',
              props: { style: { padding: '12px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '8px', color: '#ccc' } },
              children: [{ type: 'span', props: { text: '🔒 用户管理面板 (当前无权限，需要 user:manage)' } }]
            }
          }),
          // 经理可见（order:view 或 report:view）
          ifAllowed(authStore, {
            permissions: ['order:view', 'report:view'],
            children: {
              type: 'div',
              props: { style: { padding: '12px', background: '#e6f7ff', borderRadius: '4px', marginBottom: '8px', border: '1px solid #91d5ff' } },
              children: [{ type: 'span', props: { text: '📊 经理专属：订单和报表面板 (需要 order:view 或 report:view)' } }]
            },
            fallback: {
              type: 'div',
              props: { style: { padding: '12px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '8px', color: '#ccc' } },
              children: [{ type: 'span', props: { text: '📊 订单和报表面板 (当前无权限，需要 order:view 或 report:view)' } }]
            }
          }),
          // 普通用户可见（dashboard:view）
          ifAllowed(authStore, {
            permissions: ['dashboard:view'],
            children: {
              type: 'div',
              props: { style: { padding: '12px', background: '#fafafa', borderRadius: '4px', marginBottom: '8px', border: '1px solid #d9d9d9' } },
              children: [{ type: 'span', props: { text: '👤 用户面板 (需要 dashboard:view)' } }]
            },
            fallback: {
              type: 'div',
              props: { style: { padding: '12px', background: '#f5f5f5', borderRadius: '4px', marginBottom: '8px', color: '#ccc' } },
              children: [{ type: 'span', props: { text: '👤 用户面板 (当前无权限，需要 dashboard:view)' } }]
            }
          }),
          // 无条件显示的内容
          {
            type: 'div',
            props: { style: { padding: '12px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', color: '#999', marginTop: '8px' } },
            children: [{ type: 'span', props: { text: '💡 提示：切换角色后，页面会自动更新，展示不同角色的权限边界' } }]
          }
        ]
      }
    ]
  }
}