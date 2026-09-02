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

// ---------- TreeSelect 类型 ----------
export interface TreeItem {
  id: string | number
  label: string
  icon?: string
  disabled?: boolean
  children?: TreeItem[]
}

export interface TreeSelectConfig {
  name: string                // 字段名，用于状态路径
  items: TreeItem[]           // 树数据
  valueKey?: string           // 选中值字段，默认 'id'
  labelKey?: string           // 显示字段，默认 'label'
  childrenKey?: string        // 子节点字段，默认 'children'
  placeholder?: string
  multiple?: boolean
  checkable?: boolean         // 是否显示复选框
}

// ---------- Upload 类型 ----------
export interface UploadConfig {
  name: string
  accept?: string             // 如 'image/*' 或 '.pdf,.doc'
  multiple?: boolean
  maxSize?: number            // 字节，默认 10MB
  autoUpload?: boolean        // 是否选择后自动上传
  action?: string             // 上传地址（由事件监听器处理）
  dragDrop?: boolean          // 是否支持拖拽
  maxCount?: number           // 最大文件数
}

// ---------- DatePicker 类型 ----------
export interface DatePickerConfig {
  name: string
  value?: string              // 初始值 'YYYY-MM-DD'
  format?: string             // 显示格式，默认 'YYYY-MM-DD'
  placeholder?: string
  disabled?: boolean
  minDate?: string
  maxDate?: string
  clearable?: boolean
}