import { createStore } from '../core/index'

export type FieldConfig = {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum'
  label?: string
  list?: boolean
  form?: boolean
  detail?: boolean
  rules?: string[]
  options?: { label: string; value: any }[]
}

export type DataManagerConfig = {
  name: string
  api: string
  fields: FieldConfig[]
  defaultPageSize?: number
}

export type ListState = {
  items: any[]
  total: number
  page: number
  pageSize: number
  filters: Record<string, any>
  sort: { field: string; order: 'asc' | 'desc' } | null
  loading: boolean
  error: string | null
}

export type FormState = {
  data: Record<string, any>
  errors: Record<string, string>
  submitting: boolean
}

export function createDataManager(config: DataManagerConfig) {
  const { name, api, fields, defaultPageSize = 20 } = config

  // 列表状态
  const listStore = createStore<ListState>({
    items: [],
    total: 0,
    page: 1,
    pageSize: defaultPageSize,
    filters: {},
    sort: null,
    loading: false,
    error: null
  })

  // 表单状态
  const formStore = createStore<FormState>({
    data: {},
    errors: {},
    submitting: false
  })

  // 构建查询参数
  function buildQueryParams(): Record<string, any> {
    const state = listStore.get()
    const params: Record<string, any> = {
      _page: state.page,
      _limit: state.pageSize
    }
    if (state.sort) {
      params._sort = state.sort.field
      params._order = state.sort.order
    }
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value
      }
    })
    return params
  }

  // 获取列表
  async function fetchList() {
    listStore.dispatch((prev) => ({ ...prev, loading: true, error: null }), ['loading', 'error'])
    try {
      const params = buildQueryParams()
      const query = new URLSearchParams(params).toString()
      const response = await fetch(`${api}?${query}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      // 假设后端返回 { items: [], total: number }
      // 如果返回的是数组，则包装为 { items: data, total: data.length }
      const rawData = await response.json()
      const items = Array.isArray(rawData) ? rawData : (rawData.items || [])
      const total = Array.isArray(rawData) ? items.length : (rawData.total || items.length)
      
      listStore.dispatch(
        (prev) => ({ ...prev, items, total, loading: false }),
        ['items', 'total', 'loading']
      )
    } catch (error) {
      listStore.dispatch(
        (prev) => ({ ...prev, loading: false, error: error.message || '加载失败' }),
        ['loading', 'error']
      )
    }
  }

  // 翻页
  function goToPage(page: number) {
    listStore.dispatch((prev) => ({ ...prev, page }), ['page'])
    fetchList()
  }

  // 改变每页条数
  function setPageSize(pageSize: number) {
    listStore.dispatch((prev) => ({ ...prev, pageSize, page: 1 }), ['pageSize', 'page'])
    fetchList()
  }

  // 设置过滤条件
  function setFilters(filters: Record<string, any>) {
    listStore.dispatch((prev) => ({ ...prev, filters, page: 1 }), ['filters', 'page'])
    fetchList()
  }

  // 设置排序
  function setSort(field: string, order: 'asc' | 'desc') {
    listStore.dispatch((prev) => ({ ...prev, sort: { field, order } }), ['sort'])
    fetchList()
  }

  // 创建记录（写入后刷新列表）
  async function create(data: Record<string, any>) {
    formStore.dispatch((prev) => ({ ...prev, submitting: true, errors: {} }), ['submitting', 'errors'])
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await response.json()
      formStore.dispatch((prev) => ({ ...prev, submitting: false }), ['submitting'])
      await fetchList()
      return true
    } catch (error) {
      formStore.dispatch(
        (prev) => ({ ...prev, submitting: false, errors: { _global: error.message || '提交失败' } }),
        ['submitting', 'errors']
      )
      return false
    }
  }

  // 更新记录
  async function update(id: any, data: Record<string, any>) {
    formStore.dispatch((prev) => ({ ...prev, submitting: true, errors: {} }), ['submitting', 'errors'])
    try {
      const response = await fetch(`${api}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await response.json()
      formStore.dispatch((prev) => ({ ...prev, submitting: false }), ['submitting'])
      await fetchList()
      return true
    } catch (error) {
      formStore.dispatch(
        (prev) => ({ ...prev, submitting: false, errors: { _global: error.message || '提交失败' } }),
        ['submitting', 'errors']
      )
      return false
    }
  }

  // 删除记录
  async function remove(id: any) {
    if (!confirm('确认删除？')) return false
    try {
      const response = await fetch(`${api}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await fetchList()
      return true
    } catch (error) {
      alert(error.message || '删除失败')
      return false
    }
  }

  // 重置表单数据
  function resetForm(initialData?: Record<string, any>) {
    const data: Record<string, any> = {}
    fields.forEach(f => {
      data[f.name] = initialData?.[f.name] ?? ''
    })
    formStore.dispatch((prev) => ({ ...prev, data, errors: {}, submitting: false }), ['data', 'errors', 'submitting'])
  }

  // 设置表单字段值
  function setField(name: string, value: any) {
    const state = formStore.get()
    const data = { ...state.data, [name]: value }
    // 简单校验（仅检查 required）
    const errors = { ...state.errors }
    const field = fields.find(f => f.name === name)
    if (field?.rules?.includes('required') && (value === undefined || value === null || value === '')) {
      errors[name] = `${field.label || name} 为必填项`
    } else {
      delete errors[name]
    }
    formStore.dispatch((prev) => ({ ...prev, data, errors }), ['data', 'errors'])
  }

  return {
    name,
    api,
    fields,
    listStore,
    formStore,
    fetchList,
    goToPage,
    setPageSize,
    setFilters,
    setSort,
    create,
    update,
    remove,
    resetForm,
    setField
  }
}