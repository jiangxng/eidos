import { createStore } from '../../core/index'

// 模拟数据存储（全局变量，页面刷新重置）
let mockDataStore: Record<string, any[]> = {}
let mockIdCounter: Record<string, number> = {}

export function initMockData(name: string, initialData: any[]) {
  mockDataStore[name] = [...initialData]
  mockIdCounter[name] = initialData.reduce((max, item) => Math.max(max, item.id || 0), 0)
}

// Mock GraphQL 适配器
export class MockGraphQLAdapter {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  async query(queryString: string, variables?: Record<string, any>) {
    const name = this.name
    let data = mockDataStore[name] || []
    const idCounter = mockIdCounter[name] || 0

    // 简单解析查询类型（模拟 GraphQL 行为）
    if (queryString.includes('query')) {
      // 列表查询
      if (queryString.includes('List')) {
        const page = variables?.page || 1
        const limit = variables?.limit || 20
        const filter = variables?.filter || {}
        
        // 简单过滤
        let filtered = [...data]
        Object.entries(filter).forEach(([key, value]) => {
          if (value) {
            filtered = filtered.filter(item => 
              String(item[key]).toLowerCase().includes(String(value).toLowerCase())
            )
          }
        })
        
        const total = filtered.length
        const start = (page - 1) * limit
        const items = filtered.slice(start, start + limit)
        
        return { [name]: { items, total } }
      }
      
      // 详情查询
      if (queryString.includes('Detail')) {
        const id = variables?.id
        const item = data.find((d: any) => d.id === id)
        return { [name]: item || null }
      }
    }

    // Mutation: 创建
    if (queryString.includes('Create')) {
      const input = variables?.input || {}
      const newId = (idCounter || 0) + 1
      const newItem = { ...input, id: newId }
      mockDataStore[name] = [...data, newItem]
      mockIdCounter[name] = newId
      return { [name]: newItem }
    }

    // Mutation: 更新
    if (queryString.includes('Update')) {
      const id = variables?.id
      const input = variables?.input || {}
      const index = data.findIndex((d: any) => d.id === id)
      if (index === -1) throw new Error(`记录 ${id} 不存在`)
      const updated = { ...data[index], ...input }
      data[index] = updated
      mockDataStore[name] = data
      return { [name]: updated }
    }

    // Mutation: 删除
    if (queryString.includes('Delete')) {
      const id = variables?.id
      mockDataStore[name] = data.filter((d: any) => d.id !== id)
      return { [name]: true }
    }

    // 默认返回空
    return { [name]: null }
  }
}