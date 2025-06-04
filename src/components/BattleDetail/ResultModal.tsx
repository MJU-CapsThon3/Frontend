// src/components/BattleDetail/ResultModal.tsx

import React, { FC } from 'react';
import styled from 'styled-components';

interface ResultData {
  voteCount: { A: number; B: number };
  voteWinner: 'A' | 'B' | 'DRAW';
  aiWinner: 'A' | 'B' | 'DRAW';
  judgementReason: string;
  aiAnalysis: string;
  pointsAwarded: number;
}

interface ResultModalProps {
  visible: boolean;
  data: ResultData | null;
  onClose: () => void;
}

const ResultModal: FC<ResultModalProps> = ({ visible, data, onClose }) => {
  if (!visible || !data) return null;

  return (
    <Overlay>
      <Content>
        <Title>토론 최종 결과 및 포인트</Title>
        <Body>
          <Row>
            <Label>투표 집계</Label>
            <Value>
              A: {data.voteCount.A}표&nbsp;&nbsp;B: {data.voteCount.B}표
            </Value>
          </Row>
          <Row>
            <Label>투표 승자</Label>
            <Value>{data.voteWinner}</Value>
          </Row>
          <Row>
            <Label>AI 분석 승자</Label>
            <Value>{data.aiWinner}</Value>
          </Row>
          <Divider />
          <SectionTitle>판정 이유</SectionTitle>
          <SectionText>{data.judgementReason}</SectionText>
          <Divider />
          <SectionTitle>AI 상세 분석</SectionTitle>
          <SectionText style={{ whiteSpace: 'pre-wrap' }}>
            {data.aiAnalysis}
          </SectionText>
          <Divider />
          <Row>
            <Label>획득 포인트</Label>
            <Value>{data.pointsAwarded.toLocaleString()} P</Value>
          </Row>
        </Body>
        <ButtonWrapper>
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ButtonWrapper>
      </Content>
    </Overlay>
  );
};

export default ResultModal;

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
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
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

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-weight: bold;
  color: #333;
`;

const Value = styled.span`
  color: #000;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

const SectionText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;
