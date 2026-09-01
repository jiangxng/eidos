// -------- 全局状态 --------
import { createStore } from 'eidos-core'

function getCurrentRoute(): string {
  const hash = window.location.hash.slice(1) || '/'
  return hash
}

export const store = createStore({
  route: getCurrentRoute(),
  params: {},
  formValues: {
    username: '',
    email: '',
    bio: ''
  },
  list: [
    { id: 1, text: '第一项' },
    { id: 2, text: '第二项' },
    { id: 3, text: '第三项' }
  ],
  shouldError: false,
  asyncState: {
    loading: false,
    data: null as string | null,
    error: null as string | null
  },
  dataPage: 'list' as 'list' | 'form',
  dataFormMode: 'create' as 'create' | 'edit',
  dataEditingId: null as number | null,
  // 布局系统状态
  collapsedRegions: {} as Record<string, boolean>,
  hiddenRegions: {} as Record<string, boolean>,
  userProfile: {
    name: '张三',
    role: 'admin',
    greeting: '欢迎回来，今天有 3 个待办事项',
    tasks: [
      { label: '待审批', count: 3 },
      { label: '待处理', count: 5 }
    ]
  },
  alerts: [
    {
      id: '1',
      level: 'error' as const,
      message: '服务器 CPU 使用率过高',
      detail: '当前使用率 85%，建议扩容',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      level: 'warning' as const,
      message: '磁盘空间不足 20%',
      detail: '建议清理日志文件',
      timestamp: new Date().toISOString(),
      read: true
    }
  ],
  recommendations: [
    {
      id: '1',
      type: 'task' as const,
      title: '3 条待审批报销单',
      description: '请及时处理',
      actionPath: '/approvals',
      priority: 1,
      dismissible: true
    },
    {
      id: '2',
      type: 'knowledge' as const,
      title: '新版财务政策已更新',
      description: '请查看最新公告',
      priority: 2,
      dismissible: true
    }
  ],
  quickLinks: [
    { id: '1', label: '用户列表', path: '/users', frequency: 10 },
    { id: '2', label: '订单查询', path: '/orders', frequency: 8 }
  ]
})

// 监听 hash 变化
window.addEventListener('hashchange', () => {
  const path = getCurrentRoute()
  store.dispatch(
    (prev: any) => ({ ...prev, route: path }),
    ['route']
  )
})