// ---------- 主视图 ----------
// 集成布局系统 + 生成器支持

import { renderLayout } from '../../src/layout/index'
import { layoutConfig } from '../layout-config'
import { store } from './store'
import { routes } from './routes'
import { generateForRoute } from './generated'

export const view = (state: any) => {
  const route = state.route || '/'
  const isGeneratedRoute = route.startsWith('/generated/')

  let contentVNode: any
  let layoutConfigToUse = layoutConfig

  if (isGeneratedRoute) {
    // 检查 store 中是否已有生成内容
    const generatedContent = state._generatedContent
    const generatedLayout = state._generatedLayout

    if (generatedContent) {
      contentVNode = generatedContent
      if (generatedLayout) {
        layoutConfigToUse = generatedLayout
      }
    } else {
      // 没有生成内容，显示加载状态，并触发生成
      contentVNode = { type: 'p', props: { text: '⏳ 生成中...', style: { textAlign: 'center', padding: '40px' } } }
      // 异步触发生成（在下一帧执行，避免阻塞渲染）
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

  return renderLayout(layoutConfigToUse, layoutState)
}