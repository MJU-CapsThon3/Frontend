import React from 'react';
import { rowStyle } from './styles';

interface FormRowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const FormRow: React.FC<FormRowProps> = ({ children, style }) => {
  return <div style={{ ...rowStyle, ...style }}>{children}</div>;
};

export default FormRow;
