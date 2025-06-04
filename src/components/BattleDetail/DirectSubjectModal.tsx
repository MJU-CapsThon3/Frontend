// src/components/Battle/DirectSubjectModal.tsx

import React, { FC, ChangeEvent } from 'react';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';

interface DirectSubjectModalProps {
  visible: boolean;
  subjectAInput: string;
  subjectBInput: string;
  onChangeA: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeB: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const DirectSubjectModal: FC<DirectSubjectModalProps> = ({
  visible,
  subjectAInput,
  subjectBInput,
  onChangeA,
  onChangeB,
  onSubmit,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          <FaEdit style={{ marginRight: '0.3rem' }} />
          직접 주제 생성
        </ModalTitle>
        <ColumnContainer>
          <ModalInput
            type='text'
            placeholder='주제 A 입력...'
            value={subjectAInput}
            onChange={onChangeA}
          />
          <ModalInput
            type='text'
            placeholder='주제 B 입력...'
            value={subjectBInput}
            onChange={onChangeB}
          />
        </ColumnContainer>
        <ModalButtons>
          <ModalSubmitButton onClick={onSubmit}>생성</ModalSubmitButton>
          <ModalCancelButton onClick={onCancel}>취소</ModalCancelButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DirectSubjectModal;

/* ==========================
   Styled Components 정의
========================== */

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

const ModalContent = styled.div`
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #000;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ModalInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ModalSubmitButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ModalCancelButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;
