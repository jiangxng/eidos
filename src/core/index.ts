// >>> EIDOS CORE BUILD: 2026-08-31 15:30:00 <<<
// ---------- 类型定义 ----------
export type VNode = {
  type: string;
  props?: Record<string, any>;
  children?: (VNode | null | undefined)[];
  key?: string | number;
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
function createElement(vnode: VNode | null | undefined): Node {
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
      for (const [styleKey, styleVal] of Object.entries(val)) {
        // 【关键修复】跳过无效的 styleKey
        if (styleKey === undefined || styleKey === null || styleKey === '') {
          continue;
        }
        if (styleVal !== undefined && styleVal !== null) {
          try {
            el.style[styleKey as any] = String(styleVal);
          } catch (e) {
            // 忽略无效的样式属性
          }
        }
      }
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

    if (key === 'style') {
      const oldStyle = oldVal || {};
      const newStyle = newVal || {};
      // 获取所有样式键
      const styleKeys = new Set([
        ...Object.keys(oldStyle),
        ...Object.keys(newStyle)
      ]);
      for (const styleKey of styleKeys) {
        // 【关键修复】跳过无效的 styleKey
        if (styleKey === undefined || styleKey === null || styleKey === '') {
          continue;
        }
        const newStyleValue = newStyle[styleKey];
        // 如果 newStyleValue 有效则设置，否则清空
        if (newStyleValue !== undefined && newStyleValue !== null) {
          try {
            el.style[styleKey as any] = String(newStyleValue);
          } catch (e) {
            // 忽略无效的样式属性
          }
        } else {
          try {
            el.style[styleKey as any] = '';
          } catch (e) {
            // 忽略无效的样式属性
          }
        }
      }
    } else if (key === 'text') {
      el.textContent = newVal ?? '';
    } else if (key === 'onClick' || key === 'onInput') {
      // 事件通过全局 eidos-event 处理，不需要重新绑定
    } else {
      if (newVal != null && newVal !== false) {
        el.setAttribute(key, String(newVal));
      } else {
        el.removeAttribute(key);
      }
    }
  }
}

// ---------- Diff 算法核心（Key-based） ----------

// patch 单个节点：给定旧 DOM（可能为 null）、旧/新 VNode，返回更新后的 DOM
function patchNode(
  oldEl: Node | null,
  oldVNode: VNode | null | undefined,
  newVNode: VNode | null | undefined
): Node {
  if (newVNode == null) {
    return document.createTextNode('')
  }

  if (oldVNode == null || oldVNode.type !== newVNode.type) {
    const newEl = createElement(newVNode)
    if (oldEl && oldEl.parentNode) {
      oldEl.parentNode.replaceChild(newEl, oldEl)
    }
    return newEl
  }

  // 【关键】如果 oldEl 为 null，直接创建新节点，不再调用 patchChildren
  if (oldEl == null) {
    return createElement(newVNode)
  }

  const el = oldEl as HTMLElement
  updateProps(el, oldVNode.props || {}, newVNode.props || {})

  // 【关键】只有 el 存在且是元素节点时才处理子节点
  if (el && el.nodeType === 1 && el.childNodes) {
    const oldChildren = oldVNode.children || []
    const newChildren = newVNode.children || []
    // 只有有子节点时才调用 patchChildren
    if (oldChildren.length > 0 || newChildren.length > 0) {
      patchChildren(el, oldChildren, newChildren)
    }
  }

  return el
}
// 子节点 diff：优先按 key 匹配，无 key 时按位置 fallback（类型相同才复用）
function patchChildren(
  el: HTMLElement | null,
  oldChildren: (VNode | null | undefined)[],
  newChildren: (VNode | null | undefined)[]
): void {
  // ----- 防御检查 -----
  if (el == null) {
    console.warn('[patchChildren] el is null, skipping')
    return
  }
  if (typeof el !== 'object') {
    console.warn('[patchChildren] el is not an object, skipping')
    return
  }
  if (el.nodeType !== 1) {
    console.warn('[patchChildren] el is not an element node, skipping')
    return
  }
  if (!el.childNodes) {
    console.warn('[patchChildren] el has no childNodes, skipping')
    return
  }
  if (oldChildren.length === 0 && newChildren.length === 0) {
    return
  }
  // ----- 防御检查结束 -----

  const oldKeyMap = new Map<string | number, number>()
  oldChildren.forEach((child, i) => {
    if (child != null && child.key != null) {
      oldKeyMap.set(child.key, i)
    }
  })

  const used = new Array(oldChildren.length).fill(false)
  const newNodes: Node[] = []

  for (const newChild of newChildren) {
    if (newChild == null) {
      newNodes.push(document.createTextNode(''))
      continue
    }

    let matchedIndex = -1
    if (newChild.key != null && oldKeyMap.has(newChild.key)) {
      const idx = oldKeyMap.get(newChild.key)!
      if (!used[idx]) matchedIndex = idx
    }

    if (matchedIndex === -1) {
      for (let j = 0; j < oldChildren.length; j++) {
        if (used[j]) continue
        const oldC = oldChildren[j]
        if (oldC != null && oldC.type === newChild.type) {
          matchedIndex = j
          break
        }
      }
    }

    let resultNode: Node
    if (matchedIndex >= 0) {
      used[matchedIndex] = true
      const oldC = oldChildren[matchedIndex]
      const oldNode = el.childNodes[matchedIndex] || null
      const patched = patchNode(oldNode, oldC, newChild)
      resultNode = patched instanceof Node ? patched : document.createTextNode('')
    } else {
      const created = createElement(newChild)
      resultNode = created instanceof Node ? created : document.createTextNode('')
    }

    if (!(resultNode instanceof Node)) {
      resultNode = document.createTextNode('')
    }
    newNodes.push(resultNode)
  }

  // 删除未被复用的旧节点
  for (let i = oldChildren.length - 1; i >= 0; i--) {
    if (!used[i]) {
      const oldNode = el.childNodes[i] || null
      if (oldNode && oldNode.parentNode) {
        oldNode.parentNode.removeChild(oldNode)
      }
    }
  }

  // 按新顺序重排 DOM
  let anchor: Node | null = null
  for (let i = newNodes.length - 1; i >= 0; i--) {
    const node = newNodes[i]
    if (!(node instanceof Node)) {
      continue
    }
    if (node.parentNode && node.parentNode !== el) {
      node.parentNode.removeChild(node)
    }
    if (node.parentNode === el) {
      const currentIndex = Array.from(el.childNodes).indexOf(node)
      if (currentIndex !== i) {
        el.insertBefore(node, anchor)
      }
    } else {
      el.insertBefore(node, anchor)
    }
    anchor = node
  }

  // 清理多余的尾部节点
  while (el.childNodes.length > newNodes.length) {
    const last = el.lastChild
    if (last) {
      el.removeChild(last)
    } else {
      break
    }
  }
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
  const root = document.querySelector<HTMLElement>(container);
  if (!root) throw new Error(`[Eidos] 容器 ${container} 未找到`);

  let prevVNode: VNode | null = null;

  function render() {
    const state = store.get();
    const newVNode = view(state);
    if (prevVNode == null) {
      // 首次渲染：直接创建
      root!.innerHTML = '';
      const el = createElement(newVNode);
      root!.appendChild(el);
    } else {
      // 后续渲染：使用 key-based diff
      patchNode(root!.firstChild, prevVNode, newVNode);
    }
    prevVNode = newVNode;
  }

  store.subscribe(render);
  render();

  return { store, render, refresh: () => render() };
}

// ---------- 条件渲染辅助函数 ----------
// 条件为真时返回 VNode，否则返回 null（框架会自动过滤 null 子节点）
export function renderIf(condition: boolean, vnode: VNode | null): VNode | null {
  return condition ? vnode : null
}

// ---------- 表单模块（re-export，保持单一入口） ----------
export { renderForm } from './form';
export type { FormField } from './form';