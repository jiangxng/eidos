// ---------- 文件上传组件 Upload ----------
// 纯 VNode 渲染，文件选择通过事件传递 File 对象

import type { VNode } from '../../core/index'
import type { UploadConfig } from '../types'

export function createUpload(config: UploadConfig) {
  return function renderUpload(state: any): VNode {
    const {
      name,
      accept = '*/*',
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB
      autoUpload = false,
      action = '',
      dragDrop = true,
      maxCount = 0,
    } = config

    const fieldState = state[name] || {}
    const fileList: File[] = fieldState.fileList || []
    const uploadStatus = fieldState.status || 'idle' // idle | uploading | success | error
    const progress = fieldState.progress || 0
    const errorMsg = fieldState.error || ''

    // 格式化文件大小
    const formatSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + 'B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
      return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
    }

    // 文件列表渲染
    const renderFileList = (): VNode[] => {
      return fileList.map((file, index) => ({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',
            background: '#fafafa',
            borderRadius: '4px',
            marginBottom: '4px',
            fontSize: '13px',
          },
        },
        children: [
          {
            type: 'span',
            props: {
              text: `📄 ${file.name} (${formatSize(file.size)})`,
              style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
            },
          },
          {
            type: 'span',
            props: {
              text: '✕',
              style: {
                cursor: 'pointer',
                color: '#ff4d4f',
                marginLeft: '8px',
                padding: '0 4px',
                fontSize: '14px',
              },
              onClick: `UPLOAD_REMOVE_${name}_${index}`,
            },
          },
        ],
      }))
    }

    // 主容器
    return {
      type: 'div',
      props: {
        style: {
          width: '100%',
          fontFamily: '-apple-system, sans-serif',
        },
      },
      children: [
        // 拖拽/上传区域
        {
          type: 'div',
          props: {
            style: {
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              padding: '24px 16px',
              textAlign: 'center',
              background: '#fafafa',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              position: 'relative',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
            onDragOver: `UPLOAD_DRAGOVER_${name}`,
            onDragLeave: `UPLOAD_DRAGLEAVE_${name}`,
            onDrop: `UPLOAD_DROP_${name}`,
            onClick: `UPLOAD_CLICK_${name}`,
          },
          children: [
            // 隐藏的文件输入
            {
              type: 'input',
              props: {
                type: 'file',
                accept,
                multiple: multiple ? 'multiple' : undefined,
                style: {
                  display: 'none',
                },
                onChange: `UPLOAD_SELECT_${name}`,
                // 使用 ref 或 id 来触发点击，这里通过事件联动
              },
            },
            // 提示文字
            {
              type: 'div',
              props: {
                style: { color: '#999', fontSize: '14px', pointerEvents: 'none' },
              },
              children: [
                { type: 'span', props: { text: '📤 点击或拖拽文件到此区域上传' } },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '12px', color: '#bfbfbf', marginTop: '4px' },
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        text: accept !== '*/*' ? `支持格式: ${accept}` : '支持所有文件格式',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        text: ` 最大 ${formatSize(maxSize)}`,
                        style: { marginLeft: '8px' },
                      },
                    },
                  ],
                },
              ],
            },
            // 上传进度
            uploadStatus === 'uploading'
              ? {
                  type: 'div',
                  props: {
                    style: {
                      width: '100%',
                      marginTop: '12px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      height: '6px',
                      overflow: 'hidden',
                    },
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: progress + '%',
                          height: '100%',
                          background: '#1890ff',
                          transition: 'width 0.3s',
                        },
                      },
                      children: [],
                    },
                  ],
                }
              : null,
            uploadStatus === 'error'
              ? {
                  type: 'div',
                  props: {
                    style: { color: '#ff4d4f', fontSize: '13px', marginTop: '8px' },
                  },
                  children: [{ type: 'span', props: { text: '❌ ' + errorMsg } }],
                }
              : null,
            uploadStatus === 'success'
              ? {
                  type: 'div',
                  props: {
                    style: { color: '#52c41a', fontSize: '13px', marginTop: '8px' },
                  },
                  children: [{ type: 'span', props: { text: '✅ 上传成功' } }],
                }
              : null,
          ].filter(Boolean) as VNode[],
        },
        // 文件列表
        fileList.length > 0
          ? {
              type: 'div',
              props: {
                style: {
                  marginTop: '12px',
                  padding: '8px 4px',
                  borderTop: '1px solid #f0f0f0',
                },
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: '#666',
                      marginBottom: '8px',
                    },
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        text: `已选文件 (${fileList.length}${maxCount > 0 ? '/' + maxCount : ''})`,
                      },
                    },
                  ],
                },
                ...renderFileList(),
              ],
            }
          : null,
        // 操作按钮
        fileList.length > 0 && autoUpload === false
          ? {
              type: 'div',
              props: {
                style: { marginTop: '12px', display: 'flex', gap: '8px' },
              },
              children: [
                {
                  type: 'button',
                  props: {
                    text: '📤 开始上传',
                    style: {
                      padding: '6px 16px',
                      background: '#1890ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    },
                    onClick: `UPLOAD_SUBMIT_${name}`,
                  },
                },
                {
                  type: 'button',
                  props: {
                    text: '清空列表',
                    style: {
                      padding: '6px 16px',
                      background: '#fff',
                      color: '#ff4d4f',
                      border: '1px solid #ff4d4f',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    },
                    onClick: `UPLOAD_CLEAR_${name}`,
                  },
                },
              ],
            }
          : null,
      ].filter(Boolean) as VNode[],
    }
  }
}