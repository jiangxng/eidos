// ---------- 意图解析器 ----------
// 将自然语言指令解析为结构化的 Intent 对象

import type { Intent } from './types'

/**
 * 关键词匹配规则
 */
const RULES: Array<{
  keywords: string[]
  action: Intent['action']
  targetExtractor: (text: string) => string
}> = [
  {
    keywords: ['列表', '所有', '查看', '显示'],
    action: 'list',
    targetExtractor: (text) => {
      const targets = ['待办', 'todo', '用户', 'user', '订单', 'order', '报表', 'report']
      for (const t of targets) {
        if (text.includes(t)) return t
      }
      return 'list'
    }
  },
  {
    keywords: ['新建', '创建', '添加', '新增', '录入'],
    action: 'create',
    targetExtractor: (text) => {
      const targets = ['待办', 'todo', '用户', 'user', '订单', 'order']
      for (const t of targets) {
        if (text.includes(t)) return t
      }
      return 'item'
    }
  },
  {
    keywords: ['编辑', '修改', '更新'],
    action: 'edit',
    targetExtractor: (text) => {
      const targets = ['待办', 'todo', '用户', 'user', '订单', 'order']
      for (const t of targets) {
        if (text.includes(t)) return t
      }
      return 'item'
    }
  },
  {
    keywords: ['详情', '查看', '信息'],
    action: 'view',
    targetExtractor: (text) => {
      const targets = ['待办', 'todo', '用户', 'user', '订单', 'order']
      for (const t of targets) {
        if (text.includes(t)) return t
      }
      return 'item'
    }
  },
  {
    keywords: ['仪表盘', '概览', 'dashboard', '总览', '看板'],
    action: 'dashboard',
    targetExtractor: () => 'dashboard'
  }
]

/**
 * 解析自然语言指令为 Intent
 */
export function parseIntent(text: string): Intent | null {
  const lowerText = text.toLowerCase().trim()

  for (const rule of RULES) {
    const matched = rule.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
    if (matched) {
      const target = rule.targetExtractor(lowerText)
      // 检查目标是否有效，如果无效则跳过规则继续匹配
      if (!target || target === 'list' || target === 'item') {
        // 如果是通用关键词但没有明确目标，尝试从文本中提取
        // 如果仍然无法提取，使用默认值
        const defaultTarget = extractTargetFromText(lowerText) || 'items'
        return {
          action: rule.action,
          target: defaultTarget,
          rawText: text,
          constraints: {
            page: 1,
            pageSize: 20
          }
        }
      }
      return {
        action: rule.action,
        target: target,
        rawText: text,
        constraints: {
          page: 1,
          pageSize: 20
        }
      }
    }
  }

  // 如果没有匹配任何规则，尝试从文本中提取目标
  const extractedTarget = extractTargetFromText(lowerText)
  if (extractedTarget) {
    return {
      action: 'list',
      target: extractedTarget,
      rawText: text,
      constraints: {
        page: 1,
        pageSize: 20
      }
    }
  }

  return null
}

/**
 * 从文本中提取目标对象名称
 */
function extractTargetFromText(text: string): string | null {
  const targetKeywords: Record<string, string[]> = {
    todo: ['待办', 'todo', '任务'],
    user: ['用户', 'user', '成员'],
    order: ['订单', 'order', '销售'],
    report: ['报表', 'report', '统计'],
    dashboard: ['仪表盘', '概览', '看板']
  }

  for (const [key, keywords] of Object.entries(targetKeywords)) {
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        return key
      }
    }
  }

  return null
}

/**
 * 获取当前支持的场景列表（用于提示用户）
 */
export function getSupportedScenes(): string[] {
  return [
    '待办列表 - 显示所有待办事项',
    '用户列表 - 显示所有用户',
    '订单列表 - 显示所有订单',
    '新建待办 - 创建一个新的待办事项',
    '仪表盘 - 显示概览数据'
  ]
}