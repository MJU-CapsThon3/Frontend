import React from 'react';

interface ErrorTextProps {
  message?: string;
}

const localErrorTextStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '0.75rem',
  marginLeft: '10px',
  textAlign: 'left',
  minHeight: '1em',
};

const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  return <div style={localErrorTextStyle}>{message || ' '}</div>;
};

export default ErrorText;
