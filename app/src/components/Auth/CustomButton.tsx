import React, { useState, ButtonHTMLAttributes } from 'react';

export interface CustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

// 최적화된 버튼 스타일 (밝은 파란색 계열)
const defaultButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  marginTop: '30px',
  fontSize: '1rem',
  backgroundColor: '#2196f3', // 기본 배경색: 명확하고 밝은 파란색
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition:
    'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const CustomButton: React.FC<CustomButtonProps> = ({
  type = 'button',
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

  const combinedStyle: React.CSSProperties = {
    ...defaultButtonStyle,
    ...style,
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    backgroundColor: isHovered ? '#1976d2' : '#2196f3', // 호버 시 어두운 파란색 적용
    boxShadow: isHovered
      ? '0 4px 8px rgba(0, 0, 0, 0.2)'
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;
