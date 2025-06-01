// app/src/components/Modal.tsx
import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed; /* 뷰포트 기준 고정 */
  top: 0;
  left: 0;
  width: 100vw; /* 화면 전체 너비 */
  height: 100vh; /* 화면 전체 높이 */
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: fixed; /* 뷰포트 기준으로 위치 고정 */
  top: 50%; /* 세로 중앙 */
  left: 50%; /* 가로 중앙 */
  transform: translate(-50%, -50%); /* 실제 중앙으로 보정 */
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  z-index: 1001; /* 오버레이 위에 표시 */
  border: 3px solid #000;
  border-radius: 6px;
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
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
