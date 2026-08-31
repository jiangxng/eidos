// -------- 入口文件 --------
// 职责：启动应用，组合各模块

import { createApp } from 'eidos-core'
import { store } from './app/store'
import { routes } from './app/routes'
import { setupEventListeners } from './app/events'
import { view } from './app/view'

// 启动应用
const app = createApp({ store, view, container: '#app' })

// 设置全局事件监听
setupEventListeners()

// 调试工具
;(window as any).__EIDOS_APP__ = app

console.log('✅ Eidos 完整 Demo 已启动！')
console.log('💡 访问不同路由查看各模块功能')