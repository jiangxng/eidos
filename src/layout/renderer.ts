// ---------- 布局渲染器 ----------
// 将布局配置渲染为 VNode 树

import type { VNode } from '../core/index'
import type { LayoutConfig, LayoutRegion } from './types'
import { renderRegion } from './regions'

export function renderLayout(config: LayoutConfig, state: any): VNode {
  const { regions, menu, theme } = config
  const { collapsedRegions, hiddenRegions } = state

  const visibleRegions = regions.filter((region) => {
    if (hiddenRegions[region.id]) return false
    return isRegionVisible(region, state)
  })

  const regionsByPosition: Record<string, LayoutRegion[]> = {
    top: [],
    left: [],
    right: [],
    bottom: [],
    center: []
  }

  for (const region of visibleRegions) {
    if (regionsByPosition[region.position]) {
      regionsByPosition[region.position].push(region)
    }
  }

  const children: VNode[] = []

  // 顶部区域
  if (regionsByPosition.top.length > 0) {
    children.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: theme?.compact ? '44px' : '56px',
          padding: '0 16px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#ffffff',
          flexShrink: 0
        }
      },
      children: regionsByPosition.top.map((r) => renderRegion(r, state, menu))
    })
  }

  const mainChildren: VNode[] = []

  // 左侧边栏
  if (regionsByPosition.left.length > 0) {
    const isCollapsed = regionsByPosition.left.some(r => collapsedRegions[r.id]) || false
    const width = isCollapsed ? 56 : (regionsByPosition.left[0]?.width || 240)
    mainChildren.push({
      type: 'div',
      props: {
        style: {
          width: width + 'px',
          minWidth: width + 'px',
          height: 'calc(100vh - 56px)',
          overflowY: 'auto',
          borderRight: '1px solid #e8e8e8',
          backgroundColor: '#fafafa',
          transition: 'width 0.2s ease',
          flexShrink: 0
        }
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              padding: isCollapsed ? '8px' : '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }
          },
          children: regionsByPosition.left.map((r) => renderRegion(r, state, menu))
        }
      ]
    })
  }

  // 内容区
  if (regionsByPosition.center.length > 0) {
    const contentVNode = state._content || { type: 'p', props: { text: '内容加载中...' } }
    
    mainChildren.push({
      type: 'div',
      props: {
        style: {
          flex: 1,
          minWidth: 0,
          width: '100%',
          padding: '16px',
          overflowY: 'auto',
          backgroundColor: '#f5f5f5'
        }
      },
      children: [contentVNode]
    })
  }

  // 右侧边栏
  if (regionsByPosition.right.length > 0) {
    mainChildren.push({
      type: 'div',
      props: {
        style: {
          width: (regionsByPosition.right[0]?.width || 280) + 'px',
          minWidth: (regionsByPosition.right[0]?.width || 280) + 'px',
          height: 'calc(100vh - 56px)',
          overflowY: 'auto',
          borderLeft: '1px solid #e8e8e8',
          backgroundColor: '#fafafa',
          flexShrink: 0
        }
      },
      children: regionsByPosition.right.map((r) => renderRegion(r, state, menu))
    })
  }

  children.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: 0,
        width: '100%'
      }
    },
    children: mainChildren
  })

  // 底部区域
  if (regionsByPosition.bottom.length > 0) {
    children.push({
      type: 'div',
      props: {
        style: {
          height: '40px',
          padding: '0 16px',
          borderTop: '1px solid #e8e8e8',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          fontSize: '12px',
          color: '#999',
          flexShrink: 0
        }
      },
      children: regionsByPosition.bottom.map((r) => renderRegion(r, state, menu))
    })
  }

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: '-apple-system, sans-serif',
        width: '100%'
      }
    },
    children
  }
}

function isRegionVisible(region: LayoutRegion, state: any): boolean {
  const vis = region.visibility
  if (!vis) return true

  if (vis.roles && vis.roles.length > 0) {
    const userRole = state.userProfile?.role || 'guest'
    if (!vis.roles.includes(userRole)) return false
  }

  if (vis.devices && vis.devices.length > 0) {
    const device = getCurrentDevice()
    if (!vis.devices.includes(device)) return false
  }

  if (vis.condition) {
    try {
      const fn = new Function('state', `return ${vis.condition}`)
      if (!fn(state)) return false
    } catch {
      return false
    }
  }

  return true
}

function getCurrentDevice(): 'desktop' | 'tablet' | 'mobile' {
  const w = window.innerWidth
  if (w >= 1024) return 'desktop'
  if (w >= 768) return 'tablet'
  return 'mobile'
}