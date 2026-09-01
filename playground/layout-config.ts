// ---------- 布局系统配置 ----------
// 定义演示应用的整体布局

import type { LayoutConfig } from '../src/layout/types'

export const layoutConfig: LayoutConfig = {
  name: 'Eidos 演示布局',
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
      visibility: {
        devices: ['desktop', 'tablet', 'mobile']
      }
    }
  ],
  menu: [
    {
      id: 'dashboard',
      label: '仪表盘',
      icon: '📊',
      path: '/',
      permission: 'dashboard:view'
    },
    {
      id: 'users',
      label: '用户管理',
      icon: '👤',
      path: '/users',
      permission: 'users:manage'
    },
    {
      id: 'form',
      label: '表单演示',
      icon: '📝',
      path: '/form'
    },
    {
      id: 'list',
      label: '列表演示',
      icon: '📋',
      path: '/list',
      permission: 'user:view'
    },
    {
      id: 'auth',
      label: '权限控制',
      icon: '🔐',
      path: '/auth'
    },
    {
      id: 'async',
      label: '异步操作',
      icon: '⏳',
      path: '/async'
    },
    {
      id: 'error',
      label: '错误边界',
      icon: '⚠️',
      path: '/error'
    }
  ]
}