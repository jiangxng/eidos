import { VNode } from './index';

export type ErrorBoundaryProps = {
  children: VNode;
  fallback?: (error: Error) => VNode;
  onError?: (error: Error) => void;
};

export function createErrorBoundary(props: ErrorBoundaryProps): VNode {
  return {
    type: 'error-boundary',
    props: {
      // 存储错误状态（实际由框架管理）
      _fallback: props.fallback,
      _onError: props.onError,
      _children: props.children
    },
    children: [props.children]
  };
}

// 在渲染引擎中集成（需要修改 renderVNode）
// 见下面的完整 src/core/index.ts 更新