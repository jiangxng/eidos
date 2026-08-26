import { MockGraphQLAdapter, initMockData } from '../src/data/adapter-mock'
import { createDataManagerWithGraphQL } from '../src/data/adapter-graphql'

// -------- 1. 初始化 Mock 数据 ----------
const initialUsers = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800001001' },
  { id: 2, name: '李四', email: 'lisi@example.com', phone: '13800001002' },
  { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13800001003' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '13800001004' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', phone: '13800001005' },
  { id: 6, name: '周八', email: 'zhouba@example.com', phone: '13800001006' },
  { id: 7, name: '吴九', email: 'wujiu@example.com', phone: '13800001007' },
  { id: 8, name: '郑十', email: 'zhengshi@example.com', phone: '13800001008' },
]
initMockData('users', initialUsers)

// -------- 2. 创建 Mock 适配器 ----------
// 不需要真实后端，数据在浏览器内存中模拟
const mockAdapter = new MockGraphQLAdapter('users')

// -------- 3. 查询模板（与 GraphQL 版本相同，但 Mock 适配器会解析） ----------
export const userQueries = {
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
      user(id: $id) {
        id name email phone
      }
    }
  `,
  create: `
    mutation CreateUser($input: UserInput!) {
      createUser(input: $input) {
        id name email phone
      }
    }
  `,
  update: `
    mutation UpdateUser($id: ID!, $input: UserInput!) {
      updateUser(id: $id, input: $input) {
        id name email phone
      }
    }
  `,
  delete: `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `
}

// -------- 4. 创建数据管理器 ----------
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