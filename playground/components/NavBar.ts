// -------- 导航栏组件 --------
export const NavBar = (state: any) => {
  const role = (window as any).__EIDOS_ROLE__ || '未登录'
  const currentPath = state.route || '/'

  const links = [
    { href: '#/', label: '首页', path: '/' },
    { href: '#/about', label: '关于', path: '/about' },
    { href: '#/user/123', label: '用户 123', path: '/user/123' },
    { href: '#/form', label: '表单', path: '/form' },
    { href: '#/list', label: '列表', path: '/list' },
    { href: '#/async', label: '异步', path: '/async' },
    { href: '#/error', label: '错误边界', path: '/error' },
    { href: '#/users', label: '用户管理', path: '/users' },
    { href: '#/auth', label: '权限', path: '/auth' }
  ]

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #e8e8e8',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }
    },
    children: [
      {
        type: 'nav',
        props: {
          style: {
            display: 'flex',
            gap: '16px',
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
              color: currentPath === link.path ? '#1890ff' : '#333',
              fontWeight: currentPath === link.path ? 'bold' : 'normal',
              borderBottom: currentPath === link.path ? '2px solid #1890ff' : 'none',
              paddingBottom: '2px'
            }
          }
        }))
      },
      {
        type: 'span',
        props: {
          text: `当前角色: ${role}`,
          style: {
            fontSize: '12px',
            color: '#1890ff',
            background: '#e6f7ff',
            padding: '2px 12px',
            borderRadius: '12px',
            border: '1px solid #91d5ff'
          }
        }
      }
    ]
  }
}