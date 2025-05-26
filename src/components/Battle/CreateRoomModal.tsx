// src/components/Battle/CreateRoomModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const Header = styled.div`
  background: #0050b3;
  color: #fff;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
`;

const CloseButton = styled(FaTimes)`
  cursor: pointer;
  font-size: 1.2rem;
`;

const Body = styled.div`
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #0050b3;
    box-shadow: 0 0 0 2px rgba(0, 80, 179, 0.2);
  }
`;

const Footer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  color: #fff;
  background-color: ${({ primary }) => (primary ? '#0050b3' : '#ffa700')};
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background-color: ${({ primary }) => (primary ? '#003e8a' : '#cc8500')};
  }
`;

interface CreateRoomModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onCreate(trimmed);
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>새 방 만들기</Title>
          <CloseButton onClick={onClose} />
        </Header>
        <Body>
          <Form onSubmit={handleSubmit}>
            <Label htmlFor='room-name'>방 이름</Label>
            <Input
              id='room-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='예: 초보자 환영 방'
              maxLength={20}
            />
            <Footer>
              <Button type='button' onClick={onClose}>
                취소
              </Button>
              <Button type='submit' primary>
                생성
              </Button>
            </Footer>
          </Form>
        </Body>
      </ModalBox>
    </Overlay>
  );
};

export default CreateRoomModal;
