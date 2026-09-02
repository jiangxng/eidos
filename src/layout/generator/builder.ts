// ---------- 布局构建器 ----------
// 根据 Intent + Context 生成 LayoutConfig

import type { Intent, Context, GeneratorConfig, SceneHandler } from './types'
import { getSupportedScenes } from './intent'

/**
 * 默认数据模型注册表
 */
const DEFAULT_DATA_MODELS = {
  todo: {
    name: 'todo',
    label: '待办',
    fields: [
      { name: 'id', type: 'number', label: 'ID' },
      { name: 'text', type: 'string', label: '内容' },
      { name: 'done', type: 'boolean', label: '已完成' },
      { name: 'createdAt', type: 'date', label: '创建时间' }
    ]
  },
  user: {
    name: 'user',
    label: '用户',
    fields: [
      { name: 'id', type: 'number', label: 'ID' },
      { name: 'name', type: 'string', label: '姓名' },
      { name: 'email', type: 'string', label: '邮箱' },
      { name: 'role', type: 'string', label: '角色' }
    ]
  },
  order: {
    name: 'order',
    label: '订单',
    fields: [
      { name: 'id', type: 'number', label: '订单号' },
      { name: 'amount', type: 'number', label: '金额' },
      { name: 'status', type: 'string', label: '状态' },
      { name: 'createdAt', type: 'date', label: '创建时间' }
    ]
  }
}

/**
 * 场景处理器注册表
 */
const sceneHandlers: Record<string, SceneHandler> = {}

/**
 * 注册场景处理器
 */
export function registerScene(
  target: string,
  action: string,
  handler: SceneHandler
): void {
  const key = `${target}:${action}`
  sceneHandlers[key] = handler
}

/**
 * 构建布局
 */
export async function buildLayout(
  intent: Intent,
  context: Context,
  config: GeneratorConfig
): Promise<{
  layoutConfig: any
  contentVNode: any
}> {
  const { action, target } = intent
  const key = `${target}:${action}`

  // 查找注册的处理器
  let handler = sceneHandlers[key]

  // 如果没有精确匹配，尝试使用通配符匹配
  if (!handler) {
    // 尝试 target:* 匹配（任何 action）
    const wildcardKey = `${target}:*`
    if (sceneHandlers[wildcardKey]) {
      handler = sceneHandlers[wildcardKey]
    }
  }

  // 如果还没有处理器，使用默认处理器
  if (!handler) {
    handler = defaultHandler
  }

  const result = await handler(intent, context, config)
  return result
}

/**
 * 默认场景处理器
 */
const defaultHandler: SceneHandler = async (intent, context, config) => {
  const { target, action } = intent
  const dataModel = config.dataModels[target] || DEFAULT_DATA_MODELS[target]

  if (!dataModel) {
    // 如果数据模型不存在，生成一个简单的提示页面
    return {
      layoutConfig: generateBasicLayout(context, '提示'),
      contentVNode: {
        type: 'div',
        props: {
          style: {
            padding: '40px',
            textAlign: 'center',
            color: '#999'
          }
        },
        children: [
          {
            type: 'h2',
            props: {
              text: '📋 未找到数据模型',
              style: { color: '#ff4d4f' }
            }
          },
          {
            type: 'p',
            props: {
              text: `目标 "${target}" 不在已注册的数据模型中。可用模型: ${Object.keys(config.dataModels).join(', ')}`
            }
          }
        ]
      }
    }
  }

  // 生成列表页
  if (action === 'list') {
    return await buildListPage(target, dataModel, context, config)
  }

  // 生成创建页
  if (action === 'create') {
    return await buildCreatePage(target, dataModel, context, config)
  }

  // 生成仪表盘
  if (action === 'dashboard') {
    return await buildDashboardPage(context, config)
  }

  // 默认：列表页
  return await buildListPage(target, dataModel, context, config)
}

/**
 * 构建列表页
 * 修改 buildListPage 函数，从 context 中读取真实数据
 */
async function buildListPage(
  target: string,
  dataModel: any,
  context: Context,
  config: GeneratorConfig
): Promise<{
  layoutConfig: any
  contentVNode: any
}> {
  const label = dataModel.label || target
  const fields = dataModel.fields || []

  // 从 context 中获取数据
  const listData = (context as any).data?.list || []
  const hasData = listData.length > 0

  // 构建列表页内容
  const contentVNode = {
    type: 'div',
    children: [
      // 标题和新建按钮（保持不变）
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }
        },
        children: [
          { type: 'h2', props: { text: `📋 ${label}列表`, style: { margin: 0 } } },
          {
            type: 'button',
            props: {
              text: '➕ 新建',
              onClick: `GENERATOR_CREATE_${target}`,
              style: {
                padding: '8px 16px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }
            }
          }
        ]
      },
      // 表格（使用真实数据）
      {
        type: 'div',
        props: {
          style: {
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            overflow: 'hidden',
            minHeight: '200px'
          }
        },
        children: [
          // 表头（保持不变）
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                background: '#fafafa',
                borderBottom: '1px solid #e8e8e8',
                padding: '8px 12px',
                fontWeight: 'bold'
              }
            },
            children: fields
              .filter((f: any) => f.name !== 'id' || true) // 显示所有字段
              .map((f: any) => ({
                type: 'div',
                props: {
                  style: {
                    flex: 1,
                    minWidth: '80px',
                    fontSize: '13px',
                    color: '#666'
                  },
                  text: f.label
                }
              }))
          },
          // 数据行（真实数据）
          ...(hasData
            ? listData.map((item: any) => ({
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  borderBottom: '1px solid #f0f0f0',
                  padding: '8px 12px',
                  background: 'white'
                }
              },
              children: fields
                .filter((f: any) => f.name !== 'id' || true)
                .map((f: any) => ({
                  type: 'div',
                  props: {
                    style: {
                      flex: 1,
                      minWidth: '80px',
                      fontSize: '13px',
                      color: '#333'
                    },
                    text: String(item[f.name] ?? '-')
                  }
                }))
            }))
            : [
              // 空状态
              {
                type: 'div',
                props: {
                  style: {
                    padding: '40px',
                    textAlign: 'center',
                    color: '#bbb'
                  }
                },
                children: [{ type: 'span', props: { text: '📭 暂无数据，点击"新建"添加' } }]
              }
            ])
        ]
      }
    ]
  }

  const layoutConfig = generateFullLayout(
    context,
    `${label}列表`,
    target,
    config.theme
  )

  return { layoutConfig, contentVNode }
}

/**
 * 构建创建页
 */
async function buildCreatePage(
  target: string,
  dataModel: any,
  context: Context,
  config: GeneratorConfig
): Promise<{
  layoutConfig: any
  contentVNode: any
}> {
  const label = dataModel.label || target
  const fields = dataModel.fields || []

  const contentVNode = {
    type: 'div',
    children: [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }
        },
        children: [
          { type: 'h2', props: { text: `📝 新建${label}`, style: { margin: 0 } } },
          {
            type: 'button',
            props: {
              text: '返回列表',
              onClick: `GENERATOR_LIST_${target}`,
              style: {
                padding: '8px 16px',
                background: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }
            }
          }
        ]
      },
      {
        type: 'div',
        props: {
          style: {
            background: 'white',
            padding: '24px',
            borderRadius: '4px',
            border: '1px solid #e8e8e8'
          }
        },
        children: [
          ...fields
            .filter((f: any) => f.name !== 'id' && f.name !== 'createdAt')
            .map((f: any) => ({
              type: 'div',
              props: {
                style: {
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }
              },
              children: [
                {
                  type: 'label',
                  props: {
                    text: f.label + (f.required ? ' *' : ''),
                    style: {
                      fontWeight: '500',
                      fontSize: '14px',
                      color: f.required ? '#333' : '#666'
                    }
                  }
                },
                {
                  type: 'input',
                  props: {
                    placeholder: `请输入${f.label}`,
                    style: {
                      padding: '8px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '14px'
                    },
                    onInput: `GENERATOR_INPUT_${target}_${f.name}`
                  }
                }
              ]
            })),
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '8px',
                marginTop: '16px'
              }
            },
            children: [
              {
                type: 'button',
                props: {
                  text: '保存',
                  style: {
                    padding: '8px 24px',
                    background: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  },
                  onClick: `GENERATOR_SUBMIT_${target}`
                }
              },
              {
                type: 'button',
                props: {
                  text: '取消',
                  style: {
                    padding: '8px 24px',
                    background: 'white',
                    color: '#333',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  },
                  onClick: `GENERATOR_CANCEL_${target}`
                }
              }
            ]
          }
        ]
      }
    ]
  }

  const layoutConfig = generateFullLayout(
    context,
    `新建${label}`,
    target,
    config.theme
  )

  return { layoutConfig, contentVNode }
}

/**
 * 构建仪表盘页
 */
async function buildDashboardPage(
  context: Context,
  config: GeneratorConfig
): Promise<{
  layoutConfig: any
  contentVNode: any
}> {
  const contentVNode = {
    type: 'div',
    children: [
      { type: 'h2', props: { text: '📊 仪表盘', style: { margin: '0 0 16px 0' } } },
      {
        type: 'div',
        props: {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }
            },
            children: [
              { type: 'h3', props: { text: '📋 待办总数', style: { margin: '0 0 8px 0' } } },
              { type: 'p', props: { text: '0', style: { fontSize: '32px', fontWeight: 'bold', margin: 0 } } }
            ]
          },
          {
            type: 'div',
            props: {
              style: {
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }
            },
            children: [
              { type: 'h3', props: { text: '✅ 已完成', style: { margin: '0 0 8px 0' } } },
              { type: 'p', props: { text: '0', style: { fontSize: '32px', fontWeight: 'bold', margin: 0 } } }
            ]
          },
          {
            type: 'div',
            props: {
              style: {
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }
            },
            children: [
              { type: 'h3', props: { text: '⏳ 进行中', style: { margin: '0 0 8px 0' } } },
              { type: 'p', props: { text: '0', style: { fontSize: '32px', fontWeight: 'bold', margin: 0 } } }
            ]
          }
        ]
      },
      {
        type: 'p',
        props: {
          text: '💡 提示：使用数据管理模块填充仪表盘数据',
          style: { color: '#999', fontSize: '13px' }
        }
      }
    ]
  }

  const layoutConfig = generateFullLayout(
    context,
    '仪表盘',
    'dashboard',
    config.theme
  )

  return { layoutConfig, contentVNode }
}

/**
 * 生成基础布局（无菜单）
 */
function generateBasicLayout(context: Context, title: string): any {
  const isMobile = context.device === 'mobile'

  return {
    name: `${title} - Eidos 生成`,
    defaultLayout: isMobile ? 'top-nav' : 'hybrid',
    regions: [
      {
        id: 'content',
        name: '主内容区',
        position: 'center',
        content: [],
        visibility: {
          devices: ['desktop', 'tablet', 'mobile']
        }
      }
    ],
    menu: [],
    theme: {
      primaryColor: '#1890ff',
      mode: 'light',
      compact: isMobile
    }
  }
}

/**
 * 生成完整布局（包含侧边栏）
 */
function generateFullLayout(context: Context, title: string, target: string, theme?: any): any {
  const isMobile = context.device === 'mobile'
  const isAdmin = context.role === 'admin'

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: '📊', path: '/generated/dashboard' },
    { id: 'todo', label: '待办列表', icon: '📋', path: '/generated/todo' },
    { id: 'users', label: '用户管理', icon: '👤', path: '/generated/users', permission: 'users:manage' },
    { id: 'orders', label: '订单管理', icon: '📦', path: '/generated/orders' }
  ]

  // 根据目标高亮对应的菜单项
  const activeMenu = menuItems.find(item => item.id === target)?.id || menuItems[0]?.id

  return {
    name: `${title} - Eidos 生成`,
    defaultLayout: isMobile ? 'top-nav' : 'hybrid',
    regions: [
      {
        id: 'header',
        name: '顶部导航',
        position: 'top',
        height: 56,
        content: [
          { type: 'logo' },
          { type: 'user-info' }
        ],
        visibility: {
          devices: ['desktop', 'tablet', 'mobile']
        }
      },
      {
        id: 'sidebar',
        name: '侧边栏',
        position: 'left',
        width: 240,
        content: [{ type: 'menu' }],
        visibility: {
          roles: ['admin', 'manager'],
          devices: ['desktop']
        },
        behavior: {
          collapsible: true,
          defaultState: 'expanded'
        }
      },
      {
        id: 'content',
        name: '主内容区',
        position: 'center',
        content: [],
        visibility: {
          devices: ['desktop', 'tablet', 'mobile']
        }
      }
    ],
    menu: menuItems,
    theme: {
      primaryColor: theme?.primaryColor || '#1890ff',
      mode: theme?.mode || 'light',
      compact: isMobile
    }
  }
}