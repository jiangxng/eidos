// ---------- 主视图 ----------
import { renderLayout } from '../../src/layout/index'
import { layoutConfig } from '../layout-config'
import { store } from './store'
import { routes } from './routes'
import { handleGeneratedRoute, getGeneratedConfig } from './generated'

export const view = (state: any) => {
  let contentVNode: any
  let layoutConfigToUse = layoutConfig

  // 检查是否为生成器路由
  const route = state.route || '/'
  const isGeneratedRoute = route.startsWith('/generated/')

  if (isGeneratedRoute) {
    // 使用生成器生成的配置
    const generated = state._generatedConfig || getGeneratedConfig()
    if (generated) {
      contentVNode = generated.contentVNode
      layoutConfigToUse = generated.layoutConfig
    } else {
      // 第一次访问，触发生成
      const match = routes.find(r => r.path === route)
      if (match) {
        // 异步生成，暂时显示加载
        contentVNode = { type: 'p', props: { text: '⏳ 生成中...' } }
        // 触发异步生成（在路由匹配时已触发）
      }
    }
  } else {
    // 普通路由，使用已有路由配置
    const match = routes.find(r => r.path === route)
    contentVNode = match
      ? match.component(state.params)
      : { type: 'p', props: { text: '404 页面未找到' } }
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

  // 使用布局系统渲染
  return renderLayout(layoutConfigToUse, layoutState)
}