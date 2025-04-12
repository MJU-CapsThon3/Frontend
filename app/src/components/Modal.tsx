// app/src/components/Modal.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const scaleUp = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const ModalContent = styled.div`
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${scaleUp} 0.3s ease-in-out;
`;

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, children }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
        <>{children}</>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
