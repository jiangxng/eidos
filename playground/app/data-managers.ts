// ---------- 数据管理器注册表 ----------
// 供生成器调用，根据 target 获取对应的数据管理器
// 这样生成器就能动态支持 user、todo、order 等多种数据模型

import { userManager } from '../modules/data'
// 后续可以新增 todoManager、orderManager 等

// 数据管理器注册表
// key: 目标名称 (如 'user', 'todo', 'order')
// value: 数据管理器实例 (包含 fetchList, create, update, remove 等方法)
export const dataManagerRegistry: Record<string, any> = {
  // 当前只有 userManager，但我们可以把 'todo' 也映射到 userManager 用于演示
  // 实际项目中，每个数据模型应有独立的数据管理器
  user: userManager,
  // 为演示目的，把 'todo' 也指向 userManager（后续可替换为独立的 todoManager）
  todo: userManager,
  // 可以把 'order' 也指向 userManager，或保持空
  // order: userManager,
}

/**
 * 根据目标名称获取对应的数据管理器
 */
export function getDataManager(target: string): any | null {
  return dataManagerRegistry[target] || null
}

/**
 * 检查目标是否已注册数据管理器
 */
export function hasDataManager(target: string): boolean {
  return target in dataManagerRegistry
}

/**
 * 获取所有已注册的目标名称列表
 */
export function getRegisteredTargets(): string[] {
  return Object.keys(dataManagerRegistry)
}