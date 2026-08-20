// ---------- 类型定义 ----------
export type VNode = {
  type: string;
  props?: Record<string, any>;
  children?: (VNode | null | undefined)[];
};

// ---------- 状态管理器 ----------
export function createStore<T extends Record<string, any>>(initial: T) {
  let state = { ...initial };
  const listeners = new Set<() => void>();

  return {
    get: () => ({ ...state }),
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    dispatch: (updater: (prev: T) => T, changedKeys: string[]) => {
      if (!changedKeys || changedKeys.length === 0) {
        throw new Error(JSON.stringify({
          code: 'EIDOS_MISSING_AFFECTS',
          message: '❌ dispatch 必须显式声明 changedKeys',
          fix: '请在 dispatch 第二个参数传入 ["key1", "key2"]'
        }));
      }
      state = { ...updater(state) };
      listeners.forEach(cb => cb());
    }
  };
}

// ---------- 渲染引擎（包含 Diff 算法）----------

// 创建真实 DOM 节点
function createElement(vnode: VNode): Node {
  if (vnode == null || typeof vnode !== 'object' || !('type' in vnode)) {
    return document.createTextNode('');
  }

  // 错误边界处理（如果有）
  if (vnode.type === 'error-boundary') {
    try {
      const children = vnode.children || [];
      if (children.length > 0) {
        return createElement(children[0]);
      }
    } catch (error) {
      const fallback = vnode.props?._fallback || defaultFallback;
      const errorObj = error instanceof Error ? error : new Error(String(error));
      if (vnode.props?._onError) {
        vnode.props._onError(errorObj);
      }
      console.error(JSON.stringify({
        code: 'EIDOS_ERROR_BOUNDARY',
        message: errorObj.message,
        fix: '检查子组件的渲染逻辑'
      }));
      return createElement(fallback(errorObj));
    }
  }

  const el = document.createElement(vnode.type);
  setProps(el, vnode.props || {});
  if (vnode.children) {
    for (const child of vnode.children) {
      el.appendChild(createElement(child));
    }
  }
  return el;
}

// 设置属性（包括事件）
function setProps(el: HTMLElement, props: Record<string, any>) {
  for (const [key, val] of Object.entries(props)) {
    if (key === 'style' && typeof val === 'object') {
      Object.assign(el.style, val);
    } else if (key === 'text') {
      el.textContent = val;
    } else if (key === 'onClick') {
      el.addEventListener('click', (event) => {
        window.dispatchEvent(new CustomEvent('eidos-event', {
          detail: { type: val, target: el, originalEvent: event }
        }));
      });
    } else if (key === 'onInput') {
      el.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        window.dispatchEvent(new CustomEvent('eidos-event', {
          detail: { type: val, value: target.value, target: el, originalEvent: event }
        }));
      });
    } else {
      el.setAttribute(key, String(val));
    }
  }
}

// 更新属性（比较新旧 props）
function updateProps(el: HTMLElement, oldProps: Record<string, any>, newProps: Record<string, any>) {
  const allKeys = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);
  for (const key of allKeys) {
    const oldVal = oldProps?.[key];
    const newVal = newProps?.[key];
    if (oldVal === newVal) continue;

    // 处理特殊键
    if (key === 'style') {
      const oldStyle = oldVal || {};
      const newStyle = newVal || {};
      for (const styleKey of Object.keys({ ...oldStyle, ...newStyle })) {
        if (oldStyle[styleKey] !== newStyle[styleKey]) {
          if (newStyle[styleKey] != null) {
            el.style[styleKey as any] = newStyle[styleKey];
          } else {
            el.style[styleKey as any] = '';
          }
        }
      }
    } else if (key === 'text') {
      el.textContent = newVal ?? '';
    } else if (key === 'onClick') {
      // 简单处理：移除旧监听器，添加新监听器（实际应该使用事件委托优化，但简化）
      // 这里我们仅模拟：因为事件是通过全局监听，所以不需要重新绑定，但为了 demo 我们保留
      // 实际项目中，为了避免内存泄漏，我们应该在删除节点时清理监听器，但这里保持简单。
      // 我们假设事件绑定是一次性的，通过全局 eidos-event 处理，所以不需要改变。
    } else if (key === 'onInput') {
      // 同 onClick
    } else {
      if (newVal != null && newVal !== false) {
        el.setAttribute(key, String(newVal));
      } else {
        el.removeAttribute(key);
      }
    }
  }
}

// ---------- Diff 算法核心 ----------
function patch(
  parent: Node,
  oldVNode: VNode | null | undefined,
  newVNode: VNode | null | undefined,
  index: number = 0
): Node {
  // 如果新节点为 null/undefined，移除旧节点
  if (newVNode == null) {
    const child = parent.childNodes[index];
    if (child) parent.removeChild(child);
    return document.createTextNode(''); // placeholder
  }

  // 如果旧节点为 null/undefined，创建新节点
  if (oldVNode == null) {
    const newEl = createElement(newVNode);
    parent.insertBefore(newEl, parent.childNodes[index] || null);
    return newEl;
  }

  // 类型不同或一个是文本节点（用 type 判断），替换整个节点
  if (oldVNode.type !== newVNode.type) {
    const newEl = createElement(newVNode);
    const oldChild = parent.childNodes[index];
    if (oldChild) {
      parent.replaceChild(newEl, oldChild);
    } else {
      parent.appendChild(newEl);
    }
    return newEl;
  }

  // 类型相同，复用节点
  const el = parent.childNodes[index] as HTMLElement;
  if (!el) {
    // 理论上不应发生，但若不存在则创建
    const newEl = createElement(newVNode);
    parent.appendChild(newEl);
    return newEl;
  }

  // 更新属性
  updateProps(el, oldVNode.props || {}, newVNode.props || {});

  // 递归处理子节点
  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const maxLen = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLen; i++) {
    patch(el, oldChildren[i], newChildren[i], i);
  }

  // 如果新子节点比旧子节点少，移除多余的节点
  if (oldChildren.length > newChildren.length) {
    for (let i = newChildren.length; i < oldChildren.length; i++) {
      const child = el.childNodes[i];
      if (child) el.removeChild(child);
    }
  }

  return el;
}

// 默认错误降级 UI
function defaultFallback(error: Error): VNode {
  return {
    type: 'div',
    props: {
      style: {
        padding: '16px',
        background: '#fff2f0',
        border: '1px solid #ff4d4f',
        borderRadius: '4px',
        color: '#ff4d4f'
      }
    },
    children: [
      { type: 'strong', props: { text: '⚠️ 组件渲染出错' } },
      { type: 'p', props: { text: error.message } }
    ]
  };
}

// ---------- 创建错误边界辅助函数 ----------
export function createErrorBoundary(props: {
  children: VNode;
  fallback?: (error: Error) => VNode;
  onError?: (error: Error) => void;
}): VNode {
  return {
    type: 'error-boundary',
    props: {
      _fallback: props.fallback,
      _onError: props.onError
    },
    children: [props.children]
  };
}

// ---------- 路由模块 ----------
export type RouteConfig = {
  path: string;
  component: (params: Record<string, string>) => VNode;
};

export function createRouter(
  routes: RouteConfig[],
  store: ReturnType<typeof createStore<any>>
) {
  function getCurrentPath(): string {
    return window.location.hash.slice(1) || '/';
  }

  function matchRoute(path: string): { route: RouteConfig; params: Record<string, string> } | null {
    for (const route of routes) {
      const pathParts = route.path.split('/');
      const currentParts = path.split('/');
      if (pathParts.length !== currentParts.length) continue;

      const params: Record<string, string> = {};
      let match = true;
      for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i].startsWith(':')) {
          params[pathParts[i].slice(1)] = currentParts[i];
        } else if (pathParts[i] !== currentParts[i]) {
          match = false;
          break;
        }
      }
      if (match) return { route, params };
    }
    return null;
  }

  function navigate(path: string): void {
    const match = matchRoute(path);
    if (match) {
      store.dispatch(
        (prev: any) => ({ ...prev, route: match.route.path, params: match.params }),
        ['route', 'params']
      );
      window.location.hash = path;
    } else {
      console.warn(`[Eidos Router] 路径 ${path} 未匹配`);
    }
  }

  window.addEventListener('hashchange', () => {
    const path = getCurrentPath();
    const match = matchRoute(path);
    if (match) {
      store.dispatch(
        (prev: any) => ({ ...prev, route: match.route.path, params: match.params }),
        ['route', 'params']
      );
    }
  });

  const initPath = getCurrentPath();
  const initMatch = matchRoute(initPath);
  if (initMatch) {
    store.dispatch(
      (prev: any) => ({ ...prev, route: initMatch.route.path, params: initMatch.params }),
      ['route', 'params']
    );
  }

  return { navigate, getCurrentPath };
}

// ---------- 创建应用（带 Diff） ----------
export function createApp<T extends Record<string, any>>(
  config: {
    store: ReturnType<typeof createStore<T>>;
    view: (state: T) => any;
    container: string;
  }
) {
  const { store, view, container } = config;
  const root = document.querySelector(container);
  if (!root) throw new Error(`[Eidos] 容器 ${container} 未找到`);

  let prevVNode: VNode | null = null;

  function render() {
    const state = store.get();
    const newVNode = view(state);
    if (prevVNode == null) {
      // 首次渲染：直接创建
      root.innerHTML = '';
      const el = createElement(newVNode);
      root.appendChild(el);
    } else {
      // 后续渲染：使用 patch
      patch(root, prevVNode, newVNode, 0);
    }
    prevVNode = newVNode;
  }

  store.subscribe(render);
  render();

  return { store, render, refresh: () => render() };
}