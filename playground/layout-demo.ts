// ---------- 布局演示配置 ----------
// 为 playground 提供完整的布局配置示例

import type { LayoutConfig } from '../src/layout/types'

// 企业后台布局配置（含动态内容块）
export const enterpriseLayout: LayoutConfig = {
  name: '企业后台布局',
  defaultLayout: 'hybrid',
  theme: {
    primaryColor: '#1890ff',
    mode: 'light',
    compact: false
  },
  regions: [
    {
      id: 'header',
      name: '顶部导航',
      position: 'top',
      height: 56,
      content: [
        { type: 'logo' },
        { type: 'search' },
        { type: 'notifications' },
        { type: 'user-info' }
      ],
      visibility: {
        devices: ['desktop', 'tablet', 'mobile']
      }
    },
    {
      id: 'sidebar',
      name: '侧边栏',
      position: 'left',
      width: 240,
      content: [
        { type: 'user-profile' },
        { type: 'menu' },
        { type: 'quick-links' }
      ],
      visibility: {
        roles: ['admin', 'manager'],
        devices: ['desktop']
      },
      behavior: {
        collapsible: true,
        defaultState: 'expanded'
      }
    },
    {
      id: 'sidebar-right',
      name: '右侧边栏',
      position: 'right',
      width: 280,
      content: [
        { type: 'ai-recommend' },
        { type: 'alerts' }
      ],
      visibility: {
        roles: ['admin'],
        devices: ['desktop']
      }
    },
    {
      id: 'content',
      name: '主内容区',
      position: 'center',
      content: [],
      visibility: { devices: ['desktop', 'tablet', 'mobile'] }
    },
    {
      id: 'footer',
      name: '底部',
      position: 'bottom',
      height: 40,
      content: [
        {
          type: 'custom',
          customRenderer: 'footer-text',
          dataSource: 'static'
        }
      ],
      visibility: { devices: ['desktop'] }
    }
  ],
  menu: [
    {
      id: 'dashboard',
      label: '仪表盘',
      icon: '📊',
      path: '/dashboard',
      permission: 'dashboard:view',
      children: [
        { id: 'dashboard-overview', label: '概览', path: '/dashboard/overview', permission: 'dashboard:view' },
        { id: 'dashboard-analytics', label: '分析', path: '/dashboard/analytics', permission: 'dashboard:analytics' }
      ]
    },
    {
      id: 'users',
      label: '用户管理',
      icon: '👤',
      path: '/users',
      permission: 'users:manage'
    },
    {
      id: 'orders',
      label: '订单管理',
      icon: '📦',
      path: '/orders',
      permission: 'orders:view'
    },
    {
      id: 'reports',
      label: '报表中心',
      icon: '📈',
      path: '/reports',
      permission: 'reports:view'
    },
    {
      id: 'settings',
      label: '系统设置',
      icon: '⚙️',
      path: '/settings',
      permission: 'settings:manage',
      children: [
        { id: 'settings-general', label: '通用设置', path: '/settings/general' },
        { id: 'settings-security', label: '安全设置', path: '/settings/security' }
      ]
    }
  ]
}

// 为不同角色生成简化的菜单
export function getMenuForRole(role: string, menu: LayoutConfig['menu']): LayoutConfig['menu'] {
  if (role === 'admin') return menu
  if (role === 'manager') {
    return menu.filter((item) =>
      item.permission !== 'settings:manage' && item.permission !== 'users:manage'
    )
  }
  // user 角色
  return menu.filter((item) =>
    item.permission === 'dashboard:view' || item.permission === 'orders:view'
  )
}