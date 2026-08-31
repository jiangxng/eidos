// ---------- 菜单系统 ----------
// 渲染多级导航菜单

import type { VNode } from '../../core/index'
import type { MenuItem } from './types'

export function createMenu(items: MenuItem[], state: any): VNode {
  return {
    type: 'nav',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        width: '100%'
      }
    },
    children: items.map((item) => renderMenuItem(item, state))
  }
}

function renderMenuItem(item: MenuItem, state: any): VNode | null {
  // 权限检查
  if (item.permission) {
    const role = state.userProfile?.role || 'guest'
    if (!hasMenuPermission(item.permission, role)) {
      return null
    }
  }

  // 可见性检查
  if (item.visible === false) {
    return null
  }

  const isActive = state.route === item.path
  const hasChildren = item.children && item.children.length > 0

  return {
    type: 'div',
    props: {
      style: {
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#e6f7ff' : 'transparent',
        color: isActive ? '#1890ff' : '#333',
        fontSize: '14px',
        transition: 'background 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      onClick: item.path ? `NAVIGATE_${item.path}` : undefined
    },
    children: [
      item.icon
        ? { type: 'span', props: { text: item.icon, style: { fontSize: '16px' } } }
        : null,
      { type: 'span', props: { text: item.label } },
      hasChildren
        ? {
            type: 'span',
            props: {
              text: '▼',
              style: { fontSize: '10px', marginLeft: 'auto', color: '#999' }
            }
          }
        : null,
      // 子菜单（简单实现：直接展开，复杂项目可改为点击切换）
      ...(hasChildren
        ? [
            {
              type: 'div',
              props: {
                style: {
                  paddingLeft: '20px',
                  marginTop: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }
              },
              children: item.children!.map((child) => renderMenuItem(child, state))
            }
          ]
        : [])
    ]
  }
}

function hasMenuPermission(permission: string, role: string): boolean {
  // 与 blocks.ts 中的权限检查保持一致
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    manager: ['dashboard:view', 'users:view', 'reports:view'],
    user: ['dashboard:view']
  }
  const perms = rolePermissions[role] || []
  return perms.includes('*') || perms.includes(permission)
}