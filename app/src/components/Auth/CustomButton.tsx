import React, { useState, ButtonHTMLAttributes } from 'react';

export interface CustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const defaultButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#a1c5e6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
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
    backgroundColor: isHovered ? '#8ec1f2' : '#a1c5e6',
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
