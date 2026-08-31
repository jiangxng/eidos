// ---------- 布局系统类型定义 ----------

// 内容块类型（静态 + 动态）
export type ContentBlockType =
  | 'logo'
  | 'menu'
  | 'breadcrumb'
  | 'user-info'
  | 'search'
  | 'notifications'
  | 'user-profile'
  | 'quick-links'
  | 'ai-recommend'
  | 'alerts'
  | 'custom'

// 内容块配置
export type ContentBlock = {
  type: ContentBlockType
  dataSource?: 'static' | 'realtime' | 'ai-api'
  refreshInterval?: number // 秒
  loadingPlaceholder?: 'skeleton' | 'text' | 'none'
  errorPlaceholder?: 'retry' | 'text' | 'none'
  permission?: string // 权限标识
  customRenderer?: string // 自定义渲染器名称（仅用于 custom 类型）
}

// 布局区域位置
export type RegionPosition = 'top' | 'left' | 'right' | 'bottom' | 'center'

// 布局区域
export type LayoutRegion = {
  id: string
  name: string
  position: RegionPosition
  width?: number // 像素
  height?: number // 像素
  content: ContentBlock[]
  visibility: {
    roles?: string[]
    devices?: ('desktop' | 'tablet' | 'mobile')[]
    routes?: string[] // 路由匹配模式
    condition?: string // JavaScript 表达式字符串
  }
  behavior?: {
    collapsible?: boolean
    fixable?: boolean
    hideable?: boolean
    defaultState?: 'expanded' | 'collapsed' | 'hidden'
  }
  style?: Record<string, any> // 额外样式
}

// 菜单项
export type MenuItem = {
  id: string
  label: string
  icon?: string
  path?: string
  permission?: string
  children?: MenuItem[]
  visible?: boolean
}

// 用户画像数据
export type UserProfile = {
  name: string
  avatar?: string
  role: string
  greeting: string // AI 生成的个性化问候
  tasks?: { label: string; count: number }[]
  lastLogin?: string
}

// AI 推荐项
export type AIRecommendation = {
  id: string
  type: 'task' | 'knowledge' | 'guide' | 'alert'
  title: string
  description?: string
  actionLabel?: string
  actionPath?: string
  priority: number
  dismissible: boolean
}

// 异常/告警项
export type AlertItem = {
  id: string
  level: 'error' | 'warning' | 'info' | 'success'
  message: string
  detail?: string
  timestamp: string
  read: boolean
  link?: string
}

// 常用链接项
export type QuickLink = {
  id: string
  label: string
  icon?: string
  path: string
  frequency: number // 访问频次
}

// 完整布局配置
export type LayoutConfig = {
  name: string
  defaultLayout: 'sidebar' | 'top-nav' | 'hybrid' | 'fullscreen'
  regions: LayoutRegion[]
  menu: MenuItem[]
  theme?: {
    primaryColor?: string
    mode?: 'light' | 'dark' | 'auto'
    compact?: boolean
  }
}