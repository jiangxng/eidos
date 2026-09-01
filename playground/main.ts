// -------- 入口文件 --------
import { createApp } from 'eidos-core'
import { store } from './app/store'
import { routes } from './app/routes'
import { setupEventListeners } from './app/events'
import { view } from './app/view'
import { initAuth } from './modules/auth'
import { createRouter } from 'eidos-core'

// 初始化权限
initAuth()

// 初始化路由
createRouter(routes, store)

// 启动应用
const app = createApp({ store, view, container: '#app' })
setupEventListeners()

// 调试
;(window as any).__EIDOS_APP__ = app
console.log('✅ Eidos 完整 Demo 已启动！')
console.log('💡 访问不同路由查看各模块功能')