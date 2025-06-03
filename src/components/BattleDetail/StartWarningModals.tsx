import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { PlayerData } from '../../page/Battle/BattleDetail';

const scaleUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

interface StartModalProps {
  onClose: () => void;
}

export const StartModal: React.FC<StartModalProps> = ({ onClose }) => {
  return (
    <Overlay>
      <Content>
        <Title>게임 시작 확인</Title>
        <Text>
          모든 플레이어가 준비되었습니다.
          <br />
          게임을 시작하시겠습니까?
        </Text>
        <ButtonGroup>
          <ConfirmButton
            onClick={() => {
              onClose();
              alert('게임 시작!');
            }}
          >
            네
          </ConfirmButton>
          <CancelButton onClick={onClose}>아니요</CancelButton>
        </ButtonGroup>
      </Content>
    </Overlay>
  );
};

interface WarningModalProps {
  onClose: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ onClose }) => {
  return (
    <Overlay>
      <Content>
        <Title>경고</Title>
        <Text>
          참가자 2명이 모두 있고 준비 완료된 상태여야 게임을 시작할 수 있습니다.
        </Text>
        <ButtonGroup>
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ButtonGroup>
      </Content>
    </Overlay>
  );
};

interface KickModalProps {
  player: PlayerData;
  onKick: () => void;
  onCancel: () => void;
}

export const KickModal: React.FC<KickModalProps> = ({
  player,
  onKick,
  onCancel,
}) => {
  return (
    <Overlay>
      <Content>
        <Title>플레이어 강퇴 확인</Title>
        <Text>{player.nickname} 플레이어를 강퇴하시겠습니까?</Text>
        <ButtonGroup>
          <ConfirmButton onClick={onKick}>네</ConfirmButton>
          <CancelButton onClick={onCancel}>아니요</CancelButton>
        </ButtonGroup>
      </Content>
    </Overlay>
  );
};

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

const Text = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.4;
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
  width: 100%;
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
  width: 100%;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;
