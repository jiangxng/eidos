import type { VNode } from './index';

export type FormField = {
  type: 'text' | 'email' | 'password' | 'textarea' | 'select';
  name: string;
  label: string;
  value: string;
  rules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
  options?: string[];
};

// 渲染整个表单
export function renderForm(fields: FormField[]): VNode {
  return {
    type: 'div',
    props: { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
    children: fields.map((field) => {
      const error = getFieldError(field);
      return {
        type: 'div',
        props: { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
        children: [
          { type: 'label', props: { text: field.label, style: { fontWeight: 'bold' } } },
          renderInput(field),
          error ? { type: 'span', props: { text: error, style: { color: '#ff4d4f', fontSize: '12px' } } } : null
        ]
      };
    })
  };
}

function renderInput(field: FormField): VNode {
  const baseProps = {
    name: field.name,
    value: field.value || '',
    onInput: `FORM_INPUT_${field.name}`,
    style: {
      padding: '8px 12px',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      fontSize: '14px'
    }
  };

  if (field.type === 'textarea') {
    return { type: 'textarea', props: { ...baseProps, rows: 4 } };
  }
  if (field.type === 'select' && field.options) {
    return {
      type: 'select',
      props: baseProps,
      children: field.options.map(opt => ({
        type: 'option',
        props: { value: opt, text: opt }
      }))
    };
  }
  return { type: 'input', props: { ...baseProps, type: field.type || 'text' } };
}

function getFieldError(field: FormField): string | null {
  const value = field.value || '';
  if (field.rules?.required && !value.trim()) {
    return field.rules.message || '此字段为必填项';
  }
  if (field.rules?.minLength && value.length < field.rules.minLength) {
    return field.rules.message || `至少 ${field.rules.minLength} 个字符`;
  }
  if (field.rules?.maxLength && value.length > field.rules.maxLength) {
    return field.rules.message || `最多 ${field.rules.maxLength} 个字符`;
  }
  if (field.rules?.pattern && !field.rules.pattern.test(value)) {
    return field.rules.message || '格式不正确';
  }
  return null;
}