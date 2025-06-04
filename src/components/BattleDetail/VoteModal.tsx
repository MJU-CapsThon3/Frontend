// src/components/BattleDetail/VoteModal.tsx

import React, { FC } from 'react';
import styled from 'styled-components';

interface VoteModalProps {
  visible: boolean;
  onVoteA: () => void;
  onVoteB: () => void;
  onCancel: () => void;
}

const VoteModal: FC<VoteModalProps> = ({
  visible,
  onVoteA,
  onVoteB,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <Overlay>
      <Content>
        <Title>승리팀을 투표해주세요</Title>
        <Text>누가 이긴 것 같으신가요?</Text>
        <ButtonGroup>
          <VoteButtonA onClick={onVoteA}>A팀 투표</VoteButtonA>
          <VoteButtonB onClick={onVoteB}>B팀 투표</VoteButtonB>
        </ButtonGroup>
        <CancelButton onClick={onCancel}>나중에 투표</CancelButton>
      </Content>
    </Overlay>
  );
};

export default VoteModal;

/* Styled Components */

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
  width: 360px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #000;
  font-size: 1.2rem;
  color: #333;
  text-align: center;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
`;

const VoteButtonA = styled.button`
  flex: 1;
  background-color: #2196f3;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.5rem 0;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const VoteButtonB = styled(VoteButtonA)`
  /* 동일한 스타일을 재사용 */
`;

const CancelButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.4rem 0;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;
