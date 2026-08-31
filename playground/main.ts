// -------- 入口文件 --------
import { createApp } from 'eidos-core'
import { store } from './app/store'
import { routes } from './app/routes'
import { setupEventListeners } from './app/events'
import { view } from './app/view'
import { initAuth } from './modules/auth'

// 初始化权限模块
initAuth()

// 启动应用
const app = createApp({ store, view, container: '#app' })
setupEventListeners()

;(window as any).__EIDOS_APP__ = app
console.log('✅ Eidos 完整 Demo 已启动！')