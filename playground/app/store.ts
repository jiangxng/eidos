// -------- 全局状态 --------
// 职责：定义所有模块共享的状态

import { createStore } from 'eidos-core'

export const store = createStore({
  // 路由状态
  route: '/',
  params: {},

  // 表单模块
  formValues: {
    username: '',
    email: '',
    bio: ''
  },

  // 列表模块
  list: [
    { id: 1, text: '第一项' },
    { id: 2, text: '第二项' },
    { id: 3, text: '第三项' }
  ],

  // 错误边界模块
  shouldError: false,

  // 异步模块
  asyncState: {
    loading: false,
    data: null as string | null,
    error: null as string | null
  },

  // 数据管理模块（用户管理）
  dataPage: 'list' as 'list' | 'form',
  dataFormMode: 'create' as 'create' | 'edit',
  dataEditingId: null as number | null
})