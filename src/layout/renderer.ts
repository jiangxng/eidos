// ---------- 布局渲染器 ----------
// 将布局配置渲染为 VNode 树

import type { VNode } from '../../core/index'
import type { LayoutConfig, LayoutRegion } from './types'
import { renderRegion } from './regions'

// 主布局渲染函数
export function renderLayout(config: LayoutConfig, state: any): VNode {
  const { regions, menu, theme } = config
  const { collapsedRegions, hiddenRegions } = state

  // 过滤出可见的区域
  const visibleRegions = regions.filter((region) => {
    if (hiddenRegions[region.id]) return false
    return isRegionVisible(region, state)
  })

  // 按位置分组
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

  // 构建布局容器
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
          height: '56px',
          padding: '0 16px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#ffffff',
          ...theme?.compact ? { height: '44px' } : {}
        }
      },
      children: regionsByPosition.top.map((r) => renderRegion(r, state, menu))
    })
  }

  // 主体区域（左侧边栏 + 内容 + 右侧边栏）
  const mainChildren: VNode[] = []

  // 左侧边栏
  if (regionsByPosition.left.length > 0) {
    const isCollapsed = collapsedRegions[regionsByPosition.left[0]?.id] || false
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
    mainChildren.push({
      type: 'div',
      props: {
        style: {
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          height: 'calc(100vh - 56px)',
          backgroundColor: '#f5f5f5'
        }
      },
      children: regionsByPosition.center.map((r) => renderRegion(r, state, menu))
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
        height: 'calc(100vh - 56px)'
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
          color: '#999'
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
        fontFamily: '-apple-system, sans-serif'
      }
    },
    children
  }
}

// 判断区域是否可见
function isRegionVisible(region: LayoutRegion, state: any): boolean {
  const vis = region.visibility
  if (!vis) return true

  // 角色检查
  if (vis.roles && vis.roles.length > 0) {
    const userRole = state.userProfile?.role || 'guest'
    if (!vis.roles.includes(userRole)) return false
  }

  // 设备检查
  if (vis.devices && vis.devices.length > 0) {
    const device = getCurrentDevice()
    if (!vis.devices.includes(device)) return false
  }

  // 条件表达式检查
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

// 获取当前设备类型
function getCurrentDevice(): 'desktop' | 'tablet' | 'mobile' {
  const w = window.innerWidth
  if (w >= 1024) return 'desktop'
  if (w >= 768) return 'tablet'
  return 'mobile'
}