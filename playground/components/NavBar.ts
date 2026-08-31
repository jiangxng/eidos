// -------- 导航栏组件 --------
// 职责：渲染导航链接

export const NavBar = (state: any) => {
  const links = [
    { href: '#/', label: '首页' },
    { href: '#/about', label: '关于' },
    { href: '#/user/123', label: '用户 123' },
    { href: '#/form', label: '表单' },
    { href: '#/list', label: '列表' },
    { href: '#/async', label: '异步' },
    { href: '#/error', label: '错误边界' },
    { href: '#/users', label: '用户管理' },
    { href: '#/auth', label: '权限' }
  ]

  return {
    type: 'nav',
    props: {
      style: {
        display: 'flex',
        gap: '16px',
        padding: '12px 0',
        borderBottom: '1px solid #e8e8e8',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }
    },
    children: links.map(link => ({
      type: 'a',
      props: {
        href: link.href,
        text: link.label,
        style: {
          textDecoration: 'none',
          color: state.route === link.href.replace('#', '') ? '#1890ff' : '#333',
          fontWeight: state.route === link.href.replace('#', '') ? 'bold' : 'normal'
        }
      }
    }))
  }
}