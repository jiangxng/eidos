// ---------- 主视图 ----------
// 集成布局系统 + 生成器支持

import { renderLayout } from '../../src/layout/index'
import { layoutConfig } from '../layout-config'
import { store } from './store'
import { routes } from './routes'
import { generateForRoute } from './generated'

// 记录上次生成的路由，用于判断是否需要重新生成
let lastGeneratedRoute: string | null = null

export const view = (state: any) => {
  const route = state.route || '/'
  const isGeneratedRoute = route.startsWith('/generated/')

  let contentVNode: any
  let layoutConfigToUse = layoutConfig

  if (isGeneratedRoute) {
    // 检查是否是新的生成路由，或者 store 中没有生成内容
    const shouldRegenerate = lastGeneratedRoute !== route || !state._generatedContent

    if (shouldRegenerate) {
      // 需要重新生成：显示加载状态
      contentVNode = { type: 'p', props: { text: '⏳ 生成中...', style: { textAlign: 'center', padding: '40px' } } }
      lastGeneratedRoute = route
      
      // 异步触发生成
      setTimeout(() => {
        generateForRoute(route).then((result) => {
          if (result) {
            store.dispatch(
              (prev: any) => ({
                ...prev,
                _generatedContent: result.contentVNode,
                _generatedLayout: result.layoutConfig
              }),
              ['_generatedContent', '_generatedLayout']
            )
          }
        })
      }, 0)
    } else {
      // 使用已生成的内容
      contentVNode = state._generatedContent || { type: 'p', props: { text: '⏳ 生成中...' } }
      if (state._generatedLayout) {
        layoutConfigToUse = state._generatedLayout
      }
    }
  } else {
    // 普通路由，使用已有路由配置
    const match = routes.find(r => r.path === route)
    contentVNode = match
      ? match.component(state.params)
      : { type: 'p', props: { text: '404 页面未找到' } }
    
    // 非生成路由，重置生成记录
    lastGeneratedRoute = null
  }

  // 构建布局状态
  const layoutState = {
    collapsedRegions: state.collapsedRegions || {},
    hiddenRegions: state.hiddenRegions || {},
    userProfile: state.userProfile || null,
    alerts: state.alerts || [],
    recommendations: state.recommendations || [],
    quickLinks: state.quickLinks || [],
    route: state.route || '/',
    _content: contentVNode || { type: 'p', props: { text: '内容加载中...' } }
  }

  return renderLayout(layoutConfigToUse, layoutState)
}