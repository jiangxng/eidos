// -------- 全局事件处理 --------
// 职责：集中处理所有 eidos-event 事件，各模块的事件在此统一分发

import { store } from './store'
import { userManager } from '../modules/data'

export async function setupEventListeners() {
  window.addEventListener('eidos-event', async (e: any) => {
    const { type, value } = e.detail

    // ============================================================
    // 1. 系统级事件（导航、布局、权限）
    // ============================================================

    // -------- 导航事件 --------
    if (type && type.startsWith('NAVIGATE_')) {
      const path = type.replace('NAVIGATE_', '')
      window.location.hash = path
      return
    }

    // -------- 权限切换事件 --------
    if (type && type.startsWith('AUTH_SWITCH_')) {
      const role = type.replace('AUTH_SWITCH_', '') as 'admin' | 'manager' | 'user'
      const { switchRole } = await import('../modules/auth')
      switchRole(role)
      return
    }

    // -------- 布局折叠切换事件 --------
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

    // -------- 全局搜索事件 --------
    if (type === 'GLOBAL_SEARCH') {
      console.log('[搜索]', value)
      return
    }

    // -------- 通知打开事件 --------
    if (type === 'OPEN_NOTIFICATIONS') {
      console.log('[通知] 打开通知面板')
      return
    }

    // -------- 关闭 AI 推荐事件 --------
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

    // ============================================================
    // 2. TreeSelect 组件事件
    // ============================================================

    if (type && type.startsWith('TREESELECT_')) {
      const parts = type.split('_')
      const action = parts[1]
      const name = parts[2]
      const key = parts.slice(3).join('_')

      switch (action) {
        case 'TOGGLE_DROPDOWN':
          store.dispatch(
            (prev: any) => ({
              ...prev,
              [name]: {
                ...prev[name],
                dropdownOpen: !prev[name]?.dropdownOpen
              }
            }),
            [name]
          )
          break

        case 'TOGGLE':
          store.dispatch(
            (prev: any) => {
              const expanded = prev[name]?.expanded || {}
              return {
                ...prev,
                [name]: {
                  ...prev[name],
                  expanded: { ...expanded, [key]: !expanded[key] }
                }
              }
            },
            [name]
          )
          break

        case 'SELECT':
          // 单选/多选逻辑由组件内部处理，这里只做状态同步
          // 实际项目中根据需求扩展
          console.log('[TreeSelect] 选择:', name, key, value)
          break

        case 'SEARCH':
          store.dispatch(
            (prev: any) => ({
              ...prev,
              [name]: {
                ...prev[name],
                searchKeyword: value || '',
                dropdownOpen: true
              }
            }),
            [name]
          )
          break
      }
      return
    }

    // ============================================================
    // 3. 表单模块事件
    // ============================================================

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

    // ============================================================
    // 4. 列表模块事件
    // ============================================================

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

    // ============================================================
    // 5. 异步模块事件
    // ============================================================

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

    // ============================================================
    // 6. 数据管理模块事件
    // ============================================================

    await handleDataModuleEvents(type, value, e)
  })
}

// -------- 数据管理模块事件处理 --------
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

  // ============================================================
  // 7. 生成器事件
  // ============================================================

  if (type && type.startsWith('GENERATOR_LIST_')) {
    const target = type.replace('GENERATOR_LIST_', '')
    window.location.hash = `/generated/${target}`
    return
  }

  if (type && type.startsWith('GENERATOR_CREATE_')) {
    const target = type.replace('GENERATOR_CREATE_', '')
    window.location.hash = `/generated/${target}/create`
    return
  }

  if (type && type.startsWith('GENERATOR_CANCEL_')) {
    const target = type.replace('GENERATOR_CANCEL_', '')
    window.location.hash = `/generated/${target}`
    return
  }

  if (type && type.startsWith('GENERATOR_SUBMIT_')) {
    const target = type.replace('GENERATOR_SUBMIT_', '')

    const { getDataManager } = await import('./data-managers')
    const { getDataModelForTarget } = await import('./generated')
    const dataManager = getDataManager(target)
    const dataModel = getDataModelForTarget(target)

    if (dataManager && dataManager.create) {
      const formData = store.get()._generatorFormData || {}

      const requiredFields = dataModel?.fields?.filter((f: any) => f.required) || []
      const missingFields = requiredFields.filter((f: any) => {
        const val = formData[f.name]
        return val === undefined || val === null || val === ''
      })

      if (missingFields.length > 0) {
        const fieldNames = missingFields.map((f: any) => f.label).join('、')
        alert(`⚠️ 请填写必填字段: ${fieldNames}`)
        return
      }

      try {
        const result = await dataManager.create(formData)
        if (result) {
          store.dispatch(
            (prev: any) => ({ ...prev, _generatorFormData: {} }),
            ['_generatorFormData']
          )

          const currentRoute = store.get().route
          const { generateForRoute } = await import('./generated')
          const newResult = await generateForRoute(currentRoute)
          if (newResult) {
            store.dispatch(
              (prev: any) => ({
                ...prev,
                _generatedContent: newResult.contentVNode,
                _generatedLayout: newResult.layoutConfig
              }),
              ['_generatedContent', '_generatedLayout']
            )
          }

          window.location.hash = `/generated/${target}`
          console.log('[Generator] ✅ 创建成功:', result)
        }
      } catch (error) {
        console.error('[Generator] ❌ 创建失败:', error)
        alert('创建失败: ' + (error instanceof Error ? error.message : '未知错误'))
      }
    } else {
      alert(`⚠️ 目标 "${target}" 暂不支持创建功能`)
    }
    return
  }

  if (type && type.startsWith('GENERATOR_INPUT_')) {
    const parts = type.replace('GENERATOR_INPUT_', '').split('_')
    const target = parts[0]
    const field = parts.slice(1).join('_')

    console.log('[Generator] 字段输入:', 'target:', target, 'field:', field, 'value:', value)

    const currentFormData = store.get()._generatorFormData || {}
    store.dispatch(
      (prev: any) => ({
        ...prev,
        _generatorFormData: { ...currentFormData, [field]: value }
      }),
      ['_generatorFormData']
    )
    return
  }
}