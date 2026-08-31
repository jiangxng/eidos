// ---------- 组件库共享类型 ----------

// 列配置
export type Column = {
  key: string
  title: string
  width?: number | string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any) => any  // 自定义渲染
  align?: 'left' | 'center' | 'right'
  hidden?: boolean
}

// 分页配置
export type Pagination = {
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
}

// 排序配置
export type Sort = {
  field: string
  order: 'asc' | 'desc'
} | null

// 表格操作按钮
export type TableAction = {
  key: string
  label: string
  icon?: string
  onClick: (record: any) => void
  permission?: string
  visible?: (record: any) => boolean
}

// 表单字段配置（扩展版，支持联动）
export type FormField = {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'custom'
  placeholder?: string
  defaultValue?: any
  required?: boolean
  rules?: ((value: any) => string | null)[]
  options?: { label: string; value: any }[]  // 用于 select
  visible?: (values: Record<string, any>) => boolean  // 联动显示
  disabled?: (values: Record<string, any>) => boolean // 联动禁用
  render?: (props: any) => any // 自定义渲染
  width?: number | string
}

// 表单布局
export type FormLayout = 'vertical' | 'horizontal' | 'inline'