import React from 'react';
import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

interface Props {
  subjectInput: string;
  setSubjectInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  onClose: () => void;
}

const SubjectModal: React.FC<Props> = ({
  subjectInput,
  setSubjectInput,
  onSubmit,
  onClose,
}) => {
  return (
    <Overlay>
      <Content>
        <Title>주제 입력 (예: 사자 vs 코끼리)</Title>
        <Input
          type='text'
          placeholder='주제를 입력하세요. 예: 사자 vs 코끼리'
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
        />
        <ButtonGroup>
          <SubmitButton onClick={onSubmit}>생성</SubmitButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonGroup>
      </Content>
    </Overlay>
  );
};

export default SubjectModal;

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
  width: 400px;
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

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
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
