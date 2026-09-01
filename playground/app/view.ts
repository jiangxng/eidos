// ---------- 主视图 ----------
// 集成布局系统

import { renderLayout } from '../../src/layout/index'
import { layoutConfig } from '../layout-config'
import { store } from './store'
import { routes } from './routes'

export const view = (state: any) => {
  // 根据当前路由获取页面内容
  const match = routes.find(r => r.path === state.route)
  const content = match
    ? match.component(state.params)
    : { type: 'p', props: { text: '404 页面未找到' } }

  // 构建布局状态（包含内容）
  const layoutState = {
    collapsedRegions: state.collapsedRegions || {},
    hiddenRegions: state.hiddenRegions || {},
    userProfile: state.userProfile || null,
    alerts: state.alerts || [],
    recommendations: state.recommendations || [],
    quickLinks: state.quickLinks || [],
    route: state.route || '/',
    // 将页面内容传递给布局系统
    _content: content
  }

  // 使用布局系统渲染
  return renderLayout(layoutConfig, layoutState)
}