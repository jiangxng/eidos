// ---------- 布局系统入口 ----------
// 导出所有布局相关功能

export * from './types'
export { renderLayout } from './renderer'
export { renderRegion } from './regions'
export { renderContentBlock } from './blocks'
export { createMenu } from './menu'
export { createLayoutStore } from './store'

// 默认导出布局渲染函数
import { renderLayout } from './renderer'
export default renderLayout