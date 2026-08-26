// 如果之前已有则跳过，没有则创建此文件
import { createStore } from '../core/index'

export type GraphQLConfig = {
  endpoint: string
  headers?: Record<string, string>
}

export class GraphQLAdapter {
  private config: GraphQLConfig

  constructor(config: GraphQLConfig) {
    this.config = config
  }

  async query<T = any>(queryString: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers
      },
      body: JSON.stringify({
        query: queryString,
        variables: variables || {}
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GraphQL 请求失败: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    if (result.errors) {
      const messages = result.errors.map((e: any) => e.message).join(', ')
      throw new Error(`GraphQL 错误: ${messages}`)
    }

    return result.data
  }
}

export function createDataManagerWithGraphQL(config: {
  name: string
  adapter: GraphQLAdapter
  fields: any[]
  defaultPageSize?: number
  queries: {
    list: string
    detail: string
    create: string
    update: string
    delete: string
  }
}) {
  const { name, adapter, fields, defaultPageSize = 20, queries } = config

  const listStore = createStore({
    items: [],
    total: 0,
    page: 1,
    pageSize: defaultPageSize,
    filters: {},
    sort: null as { field: string; order: 'asc' | 'desc' } | null,
    loading: false,
    error: null as string | null
  })

  const formStore = createStore({
    data: {},
    errors: {},
    submitting: false
  })

  function buildFilters() {
    const state = listStore.get()
    const filters: Record<string, any> = {}
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        filters[key] = value
      }
    })
    return filters
  }

  async function fetchList() {
    listStore.dispatch((prev) => ({ ...prev, loading: true, error: null }), ['loading', 'error'])
    try {
      const state = listStore.get()
      const variables = {
        page: state.page,
        limit: state.pageSize,
        filter: buildFilters(),
        sort: state.sort ? { field: state.sort.field, order: state.sort.order } : null
      }

      const data = await adapter.query(queries.list, variables)
      const key = name
      const result = data[key] || { items: [], total: 0 }
      
      listStore.dispatch(
        (prev) => ({ ...prev, items: result.items, total: result.total, loading: false }),
        ['items', 'total', 'loading']
      )
    } catch (error) {
      listStore.dispatch(
        (prev) => ({ ...prev, loading: false, error: error.message || '加载失败' }),
        ['loading', 'error']
      )
    }
  }

  async function fetchDetail(id: any) {
    const data = await adapter.query(queries.detail, { id })
    const key = name
    return data[key] || null
  }

  async function create(data: Record<string, any>) {
    formStore.dispatch((prev) => ({ ...prev, submitting: true, errors: {} }), ['submitting', 'errors'])
    try {
      const result = await adapter.query(queries.create, { input: data })
      const key = name
      const created = result[key] || {}
      formStore.dispatch((prev) => ({ ...prev, submitting: false }), ['submitting'])
      await fetchList()
      return created
    } catch (error) {
      formStore.dispatch(
        (prev) => ({ ...prev, submitting: false, errors: { _global: error.message || '提交失败' } }),
        ['submitting', 'errors']
      )
      return null
    }
  }

  async function update(id: any, data: Record<string, any>) {
    formStore.dispatch((prev) => ({ ...prev, submitting: true, errors: {} }), ['submitting', 'errors'])
    try {
      const result = await adapter.query(queries.update, { id, input: data })
      const key = name
      const updated = result[key] || {}
      formStore.dispatch((prev) => ({ ...prev, submitting: false }), ['submitting'])
      await fetchList()
      return updated
    } catch (error) {
      formStore.dispatch(
        (prev) => ({ ...prev, submitting: false, errors: { _global: error.message || '提交失败' } }),
        ['submitting', 'errors']
      )
      return null
    }
  }

  async function remove(id: any) {
    if (!confirm('确认删除？')) return false
    try {
      await adapter.query(queries.delete, { id })
      await fetchList()
      return true
    } catch (error) {
      alert(error.message || '删除失败')
      return false
    }
  }

  function goToPage(page: number) {
    listStore.dispatch((prev) => ({ ...prev, page }), ['page'])
    fetchList()
  }

  function setPageSize(pageSize: number) {
    listStore.dispatch((prev) => ({ ...prev, pageSize, page: 1 }), ['pageSize', 'page'])
    fetchList()
  }

  function setFilters(filters: Record<string, any>) {
    listStore.dispatch((prev) => ({ ...prev, filters, page: 1 }), ['filters', 'page'])
    fetchList()
  }

  function setSort(field: string, order: 'asc' | 'desc') {
    listStore.dispatch((prev) => ({ ...prev, sort: { field, order } }), ['sort'])
    fetchList()
  }

  function resetForm(initialData?: Record<string, any>) {
    const data: Record<string, any> = {}
    fields.forEach(f => {
      data[f.name] = initialData?.[f.name] ?? ''
    })
    formStore.dispatch((prev) => ({ ...prev, data, errors: {}, submitting: false }), ['data', 'errors', 'submitting'])
  }

  function setField(name: string, value: any) {
    const state = formStore.get()
    const data = { ...state.data, [name]: value }
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
    fields,
    adapter,
    listStore,
    formStore,
    fetchList,
    fetchDetail,
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