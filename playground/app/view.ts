// -------- 主视图 --------
// 职责：渲染当前路由对应的内容 + 导航栏

import { store } from './store'
import { routes } from './routes'
import { NavBar } from '../components/NavBar'

export const view = (state: any) => {
  const match = routes.find(r => r.path === state.route)
  const content = match
    ? match.component(state.params)
    : { type: 'p', props: { text: '404 页面未找到' } }

  return {
    type: 'div',
    props: {
      style: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, sans-serif'
      }
    },
    children: [
      NavBar(state),
      content,
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
        children: [{ type: 'span', props: { text: `当前路由: ${state.route}` } }]
      }
    ]
  }
}