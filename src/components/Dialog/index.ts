// ---------- 轻量级弹窗 ----------
// 独立于框架核心，用于表格和表单的交互反馈

import type { VNode } from '../../../core/index'

export type DialogOptions = {
  title?: string
  content: VNode | string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  type?: 'info' | 'warning' | 'error' | 'success'
}

// 显示确认框
export function showConfirm(options: DialogOptions): void {
  const {
    title = '确认',
    content,
    confirmText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel,
    type = 'info'
  } = options

  // 创建遮罩层
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `

  // 创建弹窗容器
  const dialog = document.createElement('div')
  dialog.style.cssText = `
    background: white; border-radius: 8px; padding: 24px;
    max-width: 480px; width: 90%; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  `

  // 标题
  const titleEl = document.createElement('div')
  titleEl.style.cssText = 'font-weight: 600; font-size: 16px; margin-bottom: 12px;'
  titleEl.textContent = title

  // 内容
  let contentEl: Node
  if (typeof content === 'string') {
    contentEl = document.createTextNode(content)
  } else {
    // 如果是 VNode，需要用框架渲染，但这里简单处理为文本
    // 实际项目中可以使用 renderVNode
    contentEl = document.createTextNode('内容')
  }
  const contentWrapper = document.createElement('div')
  contentWrapper.style.cssText = 'margin-bottom: 20px; color: #555;'
  contentWrapper.appendChild(contentEl)

  // 按钮区域
  const buttonWrapper = document.createElement('div')
  buttonWrapper.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;'

  // 取消按钮
  const cancelBtn = document.createElement('button')
  cancelBtn.textContent = cancelText
  cancelBtn.style.cssText = `
    padding: 8px 16px; background: #f5f5f5; border: 1px solid #d9d9d9;
    border-radius: 4px; cursor: pointer; font-size: 14px;
  `
  cancelBtn.onclick = () => {
    document.body.removeChild(overlay)
    if (onCancel) onCancel()
  }

  // 确认按钮
  const confirmBtn = document.createElement('button')
  confirmBtn.textContent = confirmText
  const colors: Record<string, string> = {
    info: '#1890ff',
    warning: '#faad14',
    error: '#ff4d4f',
    success: '#52c41a'
  }
  confirmBtn.style.cssText = `
    padding: 8px 16px; background: ${colors[type] || '#1890ff'};
    color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;
  `
  confirmBtn.onclick = () => {
    document.body.removeChild(overlay)
    if (onConfirm) onConfirm()
  }

  buttonWrapper.appendChild(cancelBtn)
  buttonWrapper.appendChild(confirmBtn)

  dialog.appendChild(titleEl)
  dialog.appendChild(contentWrapper)
  dialog.appendChild(buttonWrapper)
  overlay.appendChild(dialog)

  document.body.appendChild(overlay)
}

// 快捷函数
export function showAlert(message: string, title: string = '提示') {
  showConfirm({
    title,
    content: message,
    confirmText: '知道了',
    cancelText: ''
  })
}

export function showError(message: string) {
  showConfirm({
    title: '错误',
    content: message,
    confirmText: '确定',
    cancelText: '',
    type: 'error'
  })
}