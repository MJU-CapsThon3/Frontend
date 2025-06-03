import React from 'react';
import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const MoveConfirmModal: React.FC<Props> = ({ onConfirm, onCancel }) => {
  return (
    <Overlay>
      <Content>
        <Title>이동 확인</Title>
        <Text>해당 슬롯으로 이동하시겠습니까?</Text>
        <ButtonGroup>
          <ConfirmButton onClick={onConfirm}>네</ConfirmButton>
          <CancelButton onClick={onCancel}>아니요</CancelButton>
        </ButtonGroup>
      </Content>
    </Overlay>
  );
};

export default MoveConfirmModal;

const Overlay = styled.div`
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

const Content = styled.div`
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${scaleUp} 0.3s ease-in-out;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #000;
  font-size: 1.1rem;
  color: #333;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;
