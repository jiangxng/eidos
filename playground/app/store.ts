// -------- 全局状态 --------
import { createStore } from 'eidos-core'

// 获取当前 hash 路径
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
  dataEditingId: null as number | null
})

// 监听 hash 变化，更新 store
window.addEventListener('hashchange', () => {
  const path = getCurrentRoute()
  store.dispatch(
    (prev: any) => ({ ...prev, route: path }),
    ['route']
  )
})