// -------- 路由配置 --------
// 职责：定义所有路由及其对应的组件

import { createRouter } from 'eidos-core'
import { store } from './store'
import { renderFormModule } from '../modules/form'
import { renderListModule } from '../modules/list'
import { renderAsyncModule } from '../modules/async'
import { renderDataModule } from '../modules/data'
import { renderErrorBoundary } from '../modules/error'

export const routes = [
  {
    path: '/',
    component: () => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: '🏠 首页', style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: '欢迎使用 Eidos 完整功能演示！' } }
      ]
    })
  },
  {
    path: '/about',
    component: () => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: '📖 关于 Eidos', style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: 'Eidos 是一个 AI 原生前端框架，所有 UI 由 JSON 驱动。' } }
      ]
    })
  },
  {
    path: '/user/:id',
    component: (params: Record<string, string>) => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: `👤 用户 ${params.id}`, style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: `这是用户 ID 为 ${params.id} 的个人主页。` } }
      ]
    })
  },
  {
    path: '/form',
    component: renderFormModule
  },
  {
    path: '/list',
    component: renderListModule
  },
  {
    path: '/async',
    component: renderAsyncModule
  },
  {
    path: '/error',
    component: renderErrorBoundary
  },
  {
    path: '/users',
    component: renderDataModule
  }
]

// 初始化路由
export const router = createRouter(routes, store)