// -------- 全局事件处理 --------
import { store } from './store'
import { userManager } from '../modules/data'

export async function setupEventListeners() {
  window.addEventListener('eidos-event', async (e: any) => {
    const { type, value } = e.detail

    // 导航事件
    if (type && type.startsWith('NAVIGATE_')) {
      const path = type.replace('NAVIGATE_', '')
      window.location.hash = path
      return
    }

    // -------- 权限切换事件 --------
    if (type && type.startsWith('AUTH_SWITCH_')) {
      const role = type.replace('AUTH_SWITCH_', '') as 'admin' | 'manager' | 'user'
      // 动态导入权限模块
      const { switchRole } = await import('../modules/auth')
      switchRole(role)
      return
    }

    // 布局折叠切换
    if (type && type.startsWith('LAYOUT_TOGGLE_')) {
      const regionId = type.replace('LAYOUT_TOGGLE_', '')
      const state = store.get()
      const current = state.collapsedRegions[regionId] || false
      store.dispatch(
        (prev: any) => ({
          ...prev,
          collapsedRegions: { ...prev.collapsedRegions, [regionId]: !current }
        }),
        ['collapsedRegions']
      )
      return
    }

    // 全局搜索
    if (type === 'GLOBAL_SEARCH') {
      console.log('[搜索]', value)
      return
    }

    // 通知打开
    if (type === 'OPEN_NOTIFICATIONS') {
      console.log('[通知] 打开通知面板')
      return
    }

    // 关闭 AI 推荐
    if (type && type.startsWith('DISMISS_RECOMMEND_')) {
      const id = type.replace('DISMISS_RECOMMEND_', '')
      const state = store.get()
      store.dispatch(
        (prev: any) => ({
          ...prev,
          recommendations: prev.recommendations.filter((r: any) => r.id !== id)
        }),
        ['recommendations']
      )
      return
    }

    // -------- 表单模块事件 --------
    if (type && type.startsWith('FORM_INPUT_')) {
      const fieldName = type.replace('FORM_INPUT_', '')
      store.dispatch(
        (prev: any) => ({
          ...prev,
          formValues: { ...prev.formValues, [fieldName]: value }
        }),
        ['formValues']
      )
      return
    }

    if (type === 'FORM_SUBMIT') {
      const values = store.get().formValues
      console.log('📤 提交表单数据:', values)
      alert('表单已提交，请查看控制台输出。')
      return
    }

    // -------- 列表模块事件 --------
    if (type === 'LIST_ADD') {
      const items = store.get().list
      const nextId = items.length ? Math.max(...items.map((i: any) => i.id)) + 1 : 1
      store.dispatch(
        (prev: any) => ({ ...prev, list: [{ id: nextId, text: `新项 ${nextId}` }, ...prev.list] }),
        ['list']
      )
      return
    }

    if (type === 'LIST_SHUFFLE') {
      const items = store.get().list
      const shuffled = [...items].sort(() => Math.random() - 0.5)
      store.dispatch((prev: any) => ({ ...prev, list: shuffled }), ['list'])
      return
    }

    if (type && type.startsWith('LIST_DELETE_')) {
      const id = Number(type.replace('LIST_DELETE_', ''))
      store.dispatch(
        (prev: any) => ({ ...prev, list: prev.list.filter((i: any) => i.id !== id) }),
        ['list']
      )
      return
    }

    if (type && type.startsWith('LIST_INPUT_')) {
      const id = Number(type.replace('LIST_INPUT_', ''))
      store.dispatch(
        (prev: any) => ({
          ...prev,
          list: prev.list.map((i: any) =>
            i.id === id ? { ...i, text: value } : i
          )
        }),
        ['list']
      )
      return
    }

    // -------- 异步模块事件 --------
    if (type === 'ASYNC_LOAD') {
      store.dispatch(
        (prev: any) => ({
          ...prev,
          asyncState: { loading: true, data: null, error: null }
        }),
        ['asyncState']
      )
      setTimeout(() => {
        const ok = Math.random() > 0.3
        if (ok) {
          store.dispatch(
            (prev: any) => ({
              ...prev,
              asyncState: { loading: false, data: `数据 #${Date.now()}`, error: null }
            }),
            ['asyncState']
          )
        } else {
          store.dispatch(
            (prev: any) => ({
              ...prev,
              asyncState: { loading: false, data: null, error: '模拟加载失败' }
            }),
            ['asyncState']
          )
        }
      }, 1000)
      return
    }

    // -------- 数据管理模块事件 --------
    await handleDataModuleEvents(type, value, e)
  })
}

async function handleDataModuleEvents(type: string, value: any, e: any) {
  const name = 'users'

  if (type && type.startsWith(`PAGE_${name}_`)) {
    const page = parseInt(type.replace(`PAGE_${name}_`, ''), 10)
    if (page > 0) userManager.goToPage(page)
    return
  }

  if (type && type.startsWith(`FILTER_${name}_`)) {
    const fieldName = type.replace(`FILTER_${name}_`, '')
    const val = e.detail.value || ''
    const currentFilters = userManager.listStore.get().filters
    userManager.setFilters({ ...currentFilters, [fieldName]: val })
    return
  }

  if (type && type.startsWith(`DELETE_${name}_`)) {
    const id = parseInt(type.replace(`DELETE_${name}_`, ''), 10)
    await userManager.remove(id)
    return
  }

  if (type === `FORM_OPEN_${name}`) {
    userManager.resetForm()
    store.dispatch(
      (prev: any) => ({
        ...prev,
        dataPage: 'form',
        dataFormMode: 'create',
        dataEditingId: null
      }),
      ['dataPage', 'dataFormMode', 'dataEditingId']
    )
    return
  }

  if (type && type.startsWith(`FORM_OPEN_${name}_`)) {
    const id = parseInt(type.replace(`FORM_OPEN_${name}_`, ''), 10)
    const item = userManager.listStore.get().items.find((i: any) => i.id === id)
    if (item) {
      userManager.resetForm(item)
      store.dispatch(
        (prev: any) => ({
          ...prev,
          dataPage: 'form',
          dataFormMode: 'edit',
          dataEditingId: id
        }),
        ['dataPage', 'dataFormMode', 'dataEditingId']
      )
    }
    return
  }

  if (type && type.startsWith(`FORM_FIELD_${name}_`)) {
    const fieldName = type.replace(`FORM_FIELD_${name}_`, '')
    userManager.setField(fieldName, e.detail.value)
    return
  }

  if (type === `FORM_SUBMIT_${name}`) {
    const data = userManager.formStore.get().data
    const mode = store.get().dataFormMode
    let success = false
    if (mode === 'create') {
      const result = await userManager.create(data)
      success = !!result
    } else {
      const id = store.get().dataEditingId
      if (id) {
        const result = await userManager.update(id, data)
        success = !!result
      }
    }
    if (success) {
      store.dispatch((prev: any) => ({ ...prev, dataPage: 'list' }), ['dataPage'])
    }
    return
  }

  if (type === `FORM_CANCEL_${name}`) {
    store.dispatch((prev: any) => ({ ...prev, dataPage: 'list' }), ['dataPage'])
    return
  }

  if (type === 'LIST_BACK') {
    store.dispatch((prev: any) => ({ ...prev, dataPage: 'list' }), ['dataPage'])
    return
  }
}