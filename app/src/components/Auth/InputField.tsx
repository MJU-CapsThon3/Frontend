import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  // onChange 등은 이미 InputHTMLAttributes에 정의되어 있음
}

// 기본 스타일 (필요에 따라 수정 가능)
const defaultInputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  transition: 'border-color 0.3s ease',
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { id, type = 'text', placeholder, value, onChange, onBlur, style, ...rest },
    ref
  ) => {
    return (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{ ...defaultInputStyle, ...style }}
        ref={ref}
        {...rest}
      />
    );
  }
);

InputField.displayName = 'InputField';
export default InputField;
