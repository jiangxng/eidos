// -------- 全局事件处理 --------
// 职责：集中处理所有 eidos-event 事件，各模块的事件在此统一分发

import { store } from './store'
import { userManager } from '../modules/data'

export async function setupEventListeners() {
  window.addEventListener('eidos-event', async (e: any) => {
    const { type, value } = e.detail

    // ---- TreeSelect 事件处理 ----
    if (type.startsWith('TREESELECT_')) {
      const parts = type.split('_')
      const action = parts[1] // TOGGLE, SELECT, SEARCH, etc.
      const name = parts[2]
      const key = parts.slice(3).join('_')

      const fieldState = store.getState()[name] || {}

      switch (action) {
        case 'TOGGLE_DROPDOWN':
          store.dispatch((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              dropdownOpen: !prev[name]?.dropdownOpen,
            },
          }), [name])
          break

        case 'TOGGLE':
          store.dispatch((prev) => {
            const expanded = prev[name]?.expanded || {}
            return {
              ...prev,
              [name]: {
                ...prev[name],
                expanded: { ...expanded, [key]: !expanded[key] },
              },
            }
          }, [name])
          break

        case 'SELECT':
          // 单选/多选逻辑（根据 fieldState.multiple 判断）
          // 省略详细实现...
          break

        case 'SEARCH':
          store.dispatch((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              searchKeyword: detail.value || '',
              dropdownOpen: true, // 搜索时自动展开
            },
          }), [name])
          break
      }
    }

    // ============================================================
    // 1. 系统级事件（导航、布局、权限）
    // ============================================================

    // -------- 导航事件 --------
    // 由菜单点击触发，格式: NAVIGATE_/path
    if (type && type.startsWith('NAVIGATE_')) {
      const path = type.replace('NAVIGATE_', '')
      window.location.hash = path
      return
    }

    // -------- 权限切换事件 --------
    // 由权限演示页面的按钮触发，格式: AUTH_SWITCH_admin
    if (type && type.startsWith('AUTH_SWITCH_')) {
      const role = type.replace('AUTH_SWITCH_', '') as 'admin' | 'manager' | 'user'
      // 动态导入权限模块
      const { switchRole } = await import('../modules/auth')
      switchRole(role)
      return
    }

    // -------- 布局折叠切换事件 --------
    // 由侧边栏折叠按钮触发，格式: LAYOUT_TOGGLE_sidebar
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
    // 由顶部搜索框触发
    if (type === 'GLOBAL_SEARCH') {
      console.log('[搜索]', value)
      return
    }

    // -------- 通知打开事件 --------
    // 由顶部通知图标触发
    if (type === 'OPEN_NOTIFICATIONS') {
      console.log('[通知] 打开通知面板')
      return
    }

    // -------- 关闭 AI 推荐事件 --------
    // 由 AI 推荐卡片的关闭按钮触发，格式: DISMISS_RECOMMEND_xxx
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
    // 2. 表单模块事件
    // ============================================================

    // -------- 表单输入事件 --------
    // 由表单字段输入触发，格式: FORM_INPUT_字段名
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

    // -------- 表单提交事件 --------
    // 由表单提交按钮触发
    if (type === 'FORM_SUBMIT') {
      const values = store.get().formValues
      console.log('📤 提交表单数据:', values)
      alert('表单已提交，请查看控制台输出。')
      return
    }

    // ============================================================
    // 3. 列表模块事件（Keyed 列表演示）
    // ============================================================

    // -------- 列表添加事件 --------
    if (type === 'LIST_ADD') {
      const items = store.get().list
      const nextId = items.length ? Math.max(...items.map((i: any) => i.id)) + 1 : 1
      store.dispatch(
        (prev: any) => ({ ...prev, list: [{ id: nextId, text: `新项 ${nextId}` }, ...prev.list] }),
        ['list']
      )
      return
    }

    // -------- 列表打乱事件 --------
    if (type === 'LIST_SHUFFLE') {
      const items = store.get().list
      const shuffled = [...items].sort(() => Math.random() - 0.5)
      store.dispatch((prev: any) => ({ ...prev, list: shuffled }), ['list'])
      return
    }

    // -------- 列表删除事件 --------
    // 格式: LIST_DELETE_数字ID
    if (type && type.startsWith('LIST_DELETE_')) {
      const id = Number(type.replace('LIST_DELETE_', ''))
      store.dispatch(
        (prev: any) => ({ ...prev, list: prev.list.filter((i: any) => i.id !== id) }),
        ['list']
      )
      return
    }

    // -------- 列表输入事件 --------
    // 格式: LIST_INPUT_数字ID
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
    // 4. 异步模块事件
    // ============================================================

    // -------- 异步加载事件 --------
    // 模拟异步请求，展示 loading / error 状态
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
    // 5. 数据管理模块事件（用户管理 CRUD）
    // ============================================================

    await handleDataModuleEvents(type, value, e)
  })
}

// -------- 数据管理模块事件处理（独立函数） --------
// 职责：处理用户管理的 CRUD 操作事件
// 包括：分页、过滤、删除、新增、编辑、表单提交/取消
async function handleDataModuleEvents(type: string, value: any, e: any) {
  const name = 'users'

  // -------- 分页事件 --------
  // 格式: PAGE_users_页码
  if (type && type.startsWith(`PAGE_${name}_`)) {
    const page = parseInt(type.replace(`PAGE_${name}_`, ''), 10)
    if (page > 0) userManager.goToPage(page)
    return
  }

  // -------- 过滤事件 --------
  // 格式: FILTER_users_字段名
  if (type && type.startsWith(`FILTER_${name}_`)) {
    const fieldName = type.replace(`FILTER_${name}_`, '')
    const val = e.detail.value || ''
    const currentFilters = userManager.listStore.get().filters
    userManager.setFilters({ ...currentFilters, [fieldName]: val })
    return
  }

  // -------- 删除事件 --------
  // 格式: DELETE_users_数字ID
  if (type && type.startsWith(`DELETE_${name}_`)) {
    const id = parseInt(type.replace(`DELETE_${name}_`, ''), 10)
    await userManager.remove(id)
    return
  }

  // -------- 打开新增表单事件 --------
  // 格式: FORM_OPEN_users
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

  // -------- 打开编辑表单事件 --------
  // 格式: FORM_OPEN_users_数字ID
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

  // -------- 表单字段输入事件 --------
  // 格式: FORM_FIELD_users_字段名
  if (type && type.startsWith(`FORM_FIELD_${name}_`)) {
    const fieldName = type.replace(`FORM_FIELD_${name}_`, '')
    userManager.setField(fieldName, e.detail.value)
    return
  }

  // -------- 表单提交事件（数据管理） --------
  // 格式: FORM_SUBMIT_users
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

  // -------- 表单取消事件 --------
  // 格式: FORM_CANCEL_users
  if (type === `FORM_CANCEL_${name}`) {
    store.dispatch((prev: any) => ({ ...prev, dataPage: 'list' }), ['dataPage'])
    return
  }

  // -------- 返回列表事件 --------
  // 格式: LIST_BACK
  if (type === 'LIST_BACK') {
    store.dispatch((prev: any) => ({ ...prev, dataPage: 'list' }), ['dataPage'])
    return
  }

  // -------- 生成器事件 --------
  // 处理生成器创建、列表切换、提交等

  // 生成器列表切换
  if (type && type.startsWith('GENERATOR_LIST_')) {
    const target = type.replace('GENERATOR_LIST_', '')
    window.location.hash = `/generated/${target}`
    return
  }

  // 生成器创建
  if (type && type.startsWith('GENERATOR_CREATE_')) {
    const target = type.replace('GENERATOR_CREATE_', '')
    window.location.hash = `/generated/${target}/create`
    return
  }

  // 生成器字段输入
  if (type && type.startsWith('GENERATOR_INPUT_')) {
    const parts = type.replace('GENERATOR_INPUT_', '').split('_')
    const target = parts[0]
    const field = parts[1]
    // 存储到临时状态（后续可用于提交）
    console.log('[Generator] 字段输入:', target, field, value)
    return
  }

  // 生成器提交
  if (type && type.startsWith('GENERATOR_SUBMIT_')) {
    const target = type.replace('GENERATOR_SUBMIT_', '')
    console.log('[Generator] 提交:', target)
    // 这里可以调用数据管理模块的创建方法
    alert('提交成功！（演示模式）')
    // 跳转回列表
    window.location.hash = `/generated/${target}`
    return
  }

  // 生成器取消
  if (type && type.startsWith('GENERATOR_CANCEL_')) {
    const target = type.replace('GENERATOR_CANCEL_', '')
    window.location.hash = `/generated/${target}`
    return
  }

// -------- 生成器提交事件（对接数据管理模块） --------
if (type && type.startsWith('GENERATOR_SUBMIT_')) {
  const target = type.replace('GENERATOR_SUBMIT_', '')
  
  // 获取对应的数据管理器
  const { getDataManager } = await import('./data-managers')
  const dataManager = getDataManager(target)
  
  if (dataManager && dataManager.create) {
    // 从临时状态获取表单数据
    const formData = store.get()._generatorFormData || {}
    
    // 检查是否有必填字段
    const dataModel = getDataModelForTarget(target)
    const requiredFields = dataModel?.fields?.filter((f: any) => f.required) || []
    const missingFields = requiredFields.filter((f: any) => !formData[f.name])
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map((f: any) => f.label).join('、')
      alert(`⚠️ 请填写必填字段: ${fieldNames}`)
      return
    }
    
    try {
      const result = await dataManager.create(formData)
      if (result) {
        // 清空表单数据
        store.dispatch(
          (prev: any) => ({ ...prev, _generatorFormData: {} }),
          ['_generatorFormData']
        )
        // 刷新列表（通过重新生成页面）
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
        // 跳转回列表
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

  // -------- 生成器取消事件 --------
  if (type && type.startsWith('GENERATOR_CANCEL_')) {
    const target = type.replace('GENERATOR_CANCEL_', '')
    window.location.hash = `/generated/${target}`
    return
  }

  // -------- 生成器字段输入事件（存储临时数据） --------
  if (type && type.startsWith('GENERATOR_INPUT_')) {
    const parts = type.replace('GENERATOR_INPUT_', '').split('_')
    const target = parts[0]
    const field = parts.slice(1).join('_') // 支持字段名包含下划线
    // 存储到临时状态
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