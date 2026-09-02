// ---------- 生成器类型定义 ----------
// 定义用户意图、上下文及生成器配置的核心数据结构

/**
 * 用户意图 - 描述用户想要执行的操作
 */
export type Intent = {
  /** 操作类型：列表、创建、编辑、查看、仪表盘 */
  action: 'list' | 'create' | 'edit' | 'view' | 'dashboard'
  /** 目标对象：如 'todo'、'user'、'order' */
  target: string
  /** 约束条件：筛选、排序、分页等 */
  constraints?: {
    filter?: Record<string, any>
    sort?: { field: string; order: 'asc' | 'desc' }
    page?: number
    pageSize?: number
  }
  /** 用户输入的原始文本（用于调试和日志） */
  rawText?: string
}

/**
 * 上下文 - 当前环境和用户状态
 */
export type Context = {
  /** 用户角色 */
  role: 'admin' | 'manager' | 'user'
  /** 设备类型 */
  device: 'desktop' | 'tablet' | 'mobile'
  /** 数据模型描述（当前可用的数据模型） */
  dataModel: {
    name: string
    fields: Array<{ name: string; type: string; label: string }>
  }
  /** 当前路由路径 */
  currentRoute?: string
}

/**
 * 数据模型注册表 - 注册所有可用的数据模型
 */
export type DataModelRegistry = Record<
  string,
  {
    name: string
    label: string
    fields: Array<{ name: string; type: string; label: string }>
  }
>

/**
 * 生成器配置
 */
export type GeneratorConfig = {
  /** 数据模型注册表 */
  dataModels: DataModelRegistry
  /** 默认主题 */
  theme?: {
    primaryColor?: string
    mode?: 'light' | 'dark' | 'auto'
    compact?: boolean
  }
}

/**
 * 生成结果
 */
export type GenerationResult = {
  /** 生成的布局配置 */
  layoutConfig: any
  /** 生成的页面内容 VNode */
  contentVNode: any
  /** 元数据：用于调试和追踪 */
  metadata: {
    intent: Intent
    context: Context
    timestamp: number
    generatedBy: 'generator'
  }
}

/**
 * 场景处理器 - 每种场景的生成逻辑
 */
export type SceneHandler = (
  intent: Intent,
  context: Context,
  config: GeneratorConfig
) => Promise<{
  layoutConfig: any
  contentVNode: any
}>