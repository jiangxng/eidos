// ---------- 内容块渲染器 ----------
// 根据内容块类型渲染对应的 VNode

import type { VNode } from '../core/index'
import type { ContentBlock, MenuItem } from './types'
import { createMenu } from './menu'

// 主渲染函数
export function renderContentBlock(
  block: ContentBlock,
  state: any,
  menu: MenuItem[]
): VNode | null {
  // 权限检查
  if (block.permission) {
    const userRole = state.userProfile?.role || 'guest'
    // 简单的权限检查：如果用户角色不匹配，返回 null
    // 实际项目中可以扩展为更复杂的权限系统
    if (!hasPermission(block.permission, userRole)) {
      return null
    }
  }

  switch (block.type) {
    case 'logo':
      return renderLogo()
    case 'menu':
      return renderMenuBlock(menu, state)
    case 'breadcrumb':
      return renderBreadcrumb(state)
    case 'user-info':
      return renderUserInfo(state)
    case 'search':
      return renderSearch()
    case 'notifications':
      return renderNotifications(state)
    case 'user-profile':
      return renderUserProfile(state)
    case 'quick-links':
      return renderQuickLinks(state)
    case 'ai-recommend':
      return renderAIRecommend(state)
    case 'alerts':
      return renderAlerts(state)
    case 'custom':
      return renderCustom(block, state)
    default:
      return null
  }
}

// 权限检查（简化版）
function hasPermission(permission: string, role: string): boolean {
  // 实际项目中应从权限配置中读取
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    manager: ['dashboard:view', 'users:view', 'reports:view'],
    user: ['dashboard:view']
  }
  const perms = rolePermissions[role] || []
  return perms.includes('*') || perms.includes(permission)
}

// -------- 各内容块渲染函数 --------

function renderLogo(): VNode {
  return {
    type: 'div',
    props: {
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '8px 0',
        color: '#1890ff'
      }
    },
    children: [{ type: 'span', props: { text: '⚡ Eidos' } }]
  }
}

function renderMenuBlock(menu: MenuItem[], state: any): VNode {
  return createMenu(menu, state)
}

function renderBreadcrumb(state: any): VNode {
  const route = state.route || '/'
  const parts = route.split('/').filter(Boolean)
  return {
    type: 'div',
    props: {
      style: {
        fontSize: '14px',
        color: '#666',
        padding: '4px 0'
      }
    },
    children: [
      {
        type: 'span',
        props: { text: '🏠 ' + (parts.length > 0 ? parts.join(' / ') : '首页') }
      }
    ]
  }
}

function renderUserInfo(state: any): VNode {
  const profile = state.userProfile
  if (!profile) {
    return { type: 'div', props: { text: '未登录', style: { fontSize: '14px', color: '#999' } } }
  }
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }
    },
    children: [
      {
        type: 'span',
        props: {
          text: profile.avatar || '👤',
          style: { fontSize: '20px' }
        }
      },
      {
        type: 'span',
        props: { text: profile.name || '用户' }
      },
      {
        type: 'span',
        props: {
          text: '[' + (profile.role || 'guest') + ']',
          style: { fontSize: '12px', color: '#999' }
        }
      }
    ]
  }
}

function renderSearch(): VNode {
  return {
    type: 'input',
    props: {
      placeholder: '搜索...',
      style: {
        padding: '6px 12px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        fontSize: '14px',
        width: '200px'
      },
      onInput: 'GLOBAL_SEARCH'
    }
  }
}

function renderNotifications(state: any): VNode {
  const count = state.notifications?.length || 0
  return {
    type: 'div',
    props: {
      style: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '20px'
      },
      onClick: 'OPEN_NOTIFICATIONS'
    },
    children: [
      { type: 'span', props: { text: '🔔' } },
      count > 0
        ? {
            type: 'span',
            props: {
              text: String(count),
              style: {
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#ff4d4f',
                color: 'white',
                borderRadius: '50%',
                padding: '0 4px',
                fontSize: '10px',
                minWidth: '16px',
                textAlign: 'center'
              }
            }
          }
        : null
    ]
  }
}

function renderUserProfile(state: any): VNode {
  const profile = state.userProfile
  if (!profile) return null

  return {
    type: 'div',
    props: {
      style: {
        padding: '12px',
        background: 'linear-gradient(135deg, #e6f7ff, #bae7ff)',
        borderRadius: '8px',
        marginBottom: '8px'
      }
    },
    children: [
      {
        type: 'p',
        props: {
          text: '👋 ' + (profile.greeting || '欢迎回来'),
          style: { margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px' }
        }
      },
      ...(profile.tasks && profile.tasks.length > 0
        ? profile.tasks.map((task: any) => ({
            type: 'p',
            props: {
              text: '📋 ' + task.label + ': ' + task.count + ' 项',
              style: { margin: '2px 0', fontSize: '12px', color: '#555' }
            }
          }))
        : [])
    ]
  }
}

function renderQuickLinks(state: any): VNode {
  const links = state.quickLinks || []
  if (links.length === 0) return null

  return {
    type: 'div',
    props: {
      style: {
        padding: '8px',
        borderTop: '1px solid #f0f0f0',
        marginTop: '8px'
      }
    },
    children: [
      {
        type: 'p',
        props: {
          text: '📌 常用链接',
          style: { fontSize: '12px', color: '#999', margin: '0 0 8px 0' }
        }
      },
      ...links.map((link: any) => ({
        type: 'a',
        props: {
          href: '#' + link.path,
          text: (link.icon || '🔗') + ' ' + link.label,
          style: {
            display: 'block',
            padding: '4px 8px',
            fontSize: '13px',
            color: '#333',
            textDecoration: 'none',
            borderRadius: '4px'
          }
          // 移除 onMouseEnter: 'HOVER_LINK'
        }
      }))
    ]
  }
}

function renderAIRecommend(state: any): VNode {
  const recs = state.recommendations || []
  if (recs.length === 0) return null

  return {
    type: 'div',
    props: {
      style: {
        padding: '8px',
        background: '#f6ffed',
        borderRadius: '8px',
        border: '1px solid #b7eb8f',
        marginBottom: '8px'
      }
    },
    children: [
      {
        type: 'p',
        props: {
          text: '🤖 AI 推荐',
          style: { fontSize: '12px', color: '#52c41a', margin: '0 0 8px 0', fontWeight: 'bold' }
        }
      },
      ...recs.map((rec: any) => ({
        type: 'div',
        props: {
          style: {
            padding: '4px 0',
            fontSize: '13px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer'
          },
          onClick: rec.actionPath ? `NAVIGATE_${rec.actionPath}` : undefined
        },
        children: [
          {
            type: 'span',
            props: {
              text: rec.title,
              style: { color: '#333' }
            }
          },
          rec.description
            ? {
                type: 'span',
                props: {
                  text: ' - ' + rec.description,
                  style: { fontSize: '12px', color: '#999' }
                }
              }
            : null,
          rec.dismissible
            ? {
                type: 'span',
                props: {
                  text: ' ✕',
                  style: { fontSize: '12px', color: '#ccc', cursor: 'pointer' },
                  onClick: `DISMISS_RECOMMEND_${rec.id}`
                }
              }
            : null
        ]
      }))
    ]
  }
}

function renderAlerts(state: any): VNode {
  const alerts = state.alerts || []
  if (alerts.length === 0) return null

  const levelColors: Record<string, string> = {
    error: '#ff4d4f',
    warning: '#faad14',
    info: '#1890ff',
    success: '#52c41a'
  }

  return {
    type: 'div',
    props: {
      style: {
        padding: '8px',
        marginBottom: '8px'
      }
    },
    children: [
      {
        type: 'p',
        props: {
          text: '⚠️ 异常信息',
          style: { fontSize: '12px', color: '#ff4d4f', margin: '0 0 8px 0', fontWeight: 'bold' }
        }
      },
      ...alerts.map((alert: any) => ({
        type: 'div',
        props: {
          style: {
            padding: '6px 10px',
            marginBottom: '4px',
            borderRadius: '4px',
            background: levelColors[alert.level] + '15',
            borderLeft: '4px solid ' + (levelColors[alert.level] || '#ccc'),
            fontSize: '13px',
            cursor: alert.link ? 'pointer' : 'default'
          },
          onClick: alert.link ? `NAVIGATE_${alert.link}` : undefined
        },
        children: [
          {
            type: 'span',
            props: {
              text: alert.message,
              style: { color: levelColors[alert.level] || '#333' }
            }
          },
          alert.detail
            ? {
                type: 'span',
                props: {
                  text: ' ' + alert.detail,
                  style: { fontSize: '12px', color: '#999' }
                }
              }
            : null,
          !alert.read
            ? {
                type: 'span',
                props: {
                  text: ' ●',
                  style: { fontSize: '8px', color: '#ff4d4f' }
                }
              }
            : null
        ]
      }))
    ]
  }
}

function renderCustom(block: ContentBlock, state: any): VNode | null {
  // 自定义内容块：由开发者注册
  // 这里提供一个占位实现，实际项目中应支持注册自定义渲染器
  if (!block.customRenderer) return null
  return {
    type: 'div',
    props: {
      style: {
        padding: '8px',
        background: '#f0f0f0',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#999'
      }
    },
    children: [{ type: 'span', props: { text: '自定义: ' + block.customRenderer } }]
  }
}