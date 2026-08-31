// -------- 数据管理模块 --------
// 职责：用户管理的 CRUD 配置和渲染

import { createListPage, createFormPage } from '../../../src/data/index'
import { MockGraphQLAdapter, initMockData } from '../../../src/data/adapter-mock'
import { createDataManagerWithGraphQL } from '../../../src/data/adapter-graphql'
import { store } from '../../app/store'

// 初始化 Mock 数据
initMockData('users', [
  { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800001001' },
  { id: 2, name: '李四', email: 'lisi@example.com', phone: '13800001002' },
  { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13800001003' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '13800001004' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', phone: '13800001005' }
])

const mockAdapter = new MockGraphQLAdapter('users')

const userQueries = {
  list: `
    query ListUsers($page: Int, $limit: Int, $filter: UserFilter, $sort: SortInput) {
      users(page: $page, limit: $limit, filter: $filter, sort: $sort) {
        items { id name email phone }
        total
      }
    }
  `,
  detail: `
    query UserDetail($id: ID!) {
      user(id: $id) { id name email phone }
    }
  `,
  create: `
    mutation CreateUser($input: UserInput!) {
      createUser(input: $input) { id name email phone }
    }
  `,
  update: `
    mutation UpdateUser($id: ID!, $input: UserInput!) {
      updateUser(id: $id, input: $input) { id name email phone }
    }
  `,
  delete: `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `
}

export const userManager = createDataManagerWithGraphQL({
  name: 'users',
  adapter: mockAdapter,
  fields: [
    { name: 'id', type: 'number', list: true, detail: true },
    { name: 'name', type: 'string', label: '姓名', list: true, form: true, detail: true, rules: ['required'] },
    { name: 'email', type: 'string', label: '邮箱', list: true, form: true, detail: true, rules: ['required'] },
    { name: 'phone', type: 'string', label: '电话', list: true, form: true, detail: true }
  ],
  defaultPageSize: 5,
  queries: userQueries
})

// 渲染函数
export const renderDataModule = () => {
  const page = store.get().dataPage
  const listState = userManager.listStore.get()

  // 自动加载数据
  if (listState.items.length === 0 && !listState.loading) {
    setTimeout(() => userManager.fetchList(), 0)
  }

  if (page === 'list') {
    return {
      type: 'div',
      children: [createListPage(userManager)]
    }
  }

  if (page === 'form') {
    return createFormPage(userManager, store.get().dataFormMode)
  }

  return { type: 'p', props: { text: '数据页面加载中...' } }
}