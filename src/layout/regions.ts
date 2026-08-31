// ---------- 区域渲染器 ----------
// 渲染单个布局区域

import type { VNode } from '../../core/index'
import type { LayoutRegion, LayoutConfig, MenuItem } from './types'
import { renderContentBlock } from './blocks'

export function renderRegion(
  region: LayoutRegion,
  state: any,
  menu: MenuItem[]
): VNode {
  const isCollapsed = state.collapsedRegions[region.id] || false

  // 如果区域被折叠，显示折叠指示器
  if (isCollapsed && region.behavior?.collapsible) {
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          justifyContent: 'center',
          padding: '8px 0'
        }
      },
      children: [
        {
          type: 'button',
          props: {
            text: '▶',
            onClick: `LAYOUT_TOGGLE_${region.id}`,
            style: {
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#999'
            }
          }
        }
      ]
    }
  }

  // 正常渲染区域内容
  const contentNodes: VNode[] = []

  for (const block of region.content) {
    const node = renderContentBlock(block, state, menu)
    if (node) {
      contentNodes.push(node)
    }
  }

  // 如果区域有折叠按钮，添加到区域顶部
  if (region.behavior?.collapsible) {
    contentNodes.unshift({
      type: 'div',
      props: {
        style: {
          textAlign: 'right',
          fontSize: '12px',
          padding: '4px 8px',
          cursor: 'pointer',
          color: '#bbb'
        }
      },
      children: [
        {
          type: 'span',
          props: {
            text: '◀',
            onClick: `LAYOUT_TOGGLE_${region.id}`
          }
        }
      ]
    })
  }

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }
    },
    children: contentNodes
  }
}