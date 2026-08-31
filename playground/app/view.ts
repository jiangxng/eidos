// -------- 主视图 --------
import { store } from './store'
import { routes } from './routes'
import { NavBar } from '../components/NavBar'

export const view = (state: any) => {
  // 精确匹配路由
  const match = routes.find(r => r.path === state.route)
  const content = match
    ? match.component(state.params)
    : { type: 'p', props: { text: '404 页面未找到' } }

  // 检查是否为 403 页面
  let is403 = false
  if (content && content.type === 'div' && content.children) {
    for (const child of content.children) {
      if (child && child.type === 'h2' && child.props && child.props.text === '🚫 403 无权限访问') {
        is403 = true
        break
      }
    }
  }

  return {
    type: 'div',
    props: {
      style: {
        maxWidth: is403 ? '600px' : '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, sans-serif'
      }
    },
    children: [
      NavBar(state),
      // 用 key 强制刷新内容区域（每次路由变化时重新创建）
      {
        type: 'div',
        key: state.route,
        props: {
          style: {
            minHeight: '300px'
          }
        },
        children: [content]
      },
      {
        type: 'div',
        props: {
          style: {
            marginTop: '30px',
            paddingTop: '12px',
            borderTop: '1px solid #e8e8e8',
            fontSize: '12px',
            color: '#bbb'
          }
        },
        children: [{ type: 'span', props: { text: `当前路由: ${state.route} | 角色: ${(window as any).__EIDOS_ROLE__ || '未登录'}` } }]
      }
    ]
  }
}