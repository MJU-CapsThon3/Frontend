// src/components/BattleDetail/ResultModal.tsx

import React, { FC, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible && data) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [visible, data, onClose]);

  if (!visible) return null;

  return (
    <Overlay>
      <Container>
        {!data ? (
          <LoadingWrapper>
            <Spinner />
            <LoadingText>결과를 불러오는 중...</LoadingText>
          </LoadingWrapper>
        ) : (
          <>
            <Header>
              <Title>토론 최종 결과 및 포인트</Title>
              <CloseButton onClick={onClose} aria-label='닫기'>
                &times;
              </CloseButton>
            </Header>

            <Content>
              {/* 요약 정보: 2열 그리드 */}
              <SummaryGrid>
                <SummaryCard>
                  <CardLabel>투표 집계</CardLabel>
                  <CardValues>
                    <ValueLine>
                      <Strong>A:</Strong> {data.voteCount.A}표
                    </ValueLine>
                    <ValueLine>
                      <Strong>B:</Strong> {data.voteCount.B}표
                    </ValueLine>
                  </CardValues>
                </SummaryCard>
                <SummaryCard>
                  <CardLabel>투표 승자</CardLabel>
                  <BadgeWrapper>
                    <Badge type='voteWinner'>{data.voteWinner}</Badge>
                  </BadgeWrapper>
                </SummaryCard>
                <SummaryCard>
                  <CardLabel>AI 분석 승자</CardLabel>
                  <BadgeWrapper>
                    <Badge type='aiWinner'>{data.aiWinner}</Badge>
                  </BadgeWrapper>
                </SummaryCard>
                <SummaryCard>
                  <CardLabel>획득 포인트</CardLabel>
                  <CardValues>
                    <ValueLine>
                      <Strong>{data.pointsAwarded.toLocaleString()} P</Strong>
                    </ValueLine>
                  </CardValues>
                </SummaryCard>
              </SummaryGrid>

              <Divider />

              <DetailSection>
                <DetailTitle>판정 이유</DetailTitle>
                <DetailText>{data.judgementReason}</DetailText>
              </DetailSection>

              <Divider />

              <DetailSection>
                <DetailTitle>AI 상세 분석</DetailTitle>
                <DetailText>{data.aiAnalysis}</DetailText>
              </DetailSection>
            </Content>

            <Footer>
              <ConfirmButton onClick={onClose}>확인</ConfirmButton>
            </Footer>
          </>
        )}
      </Container>
    </Overlay>
  );
};

export default ResultModal;

/* Styled Components */

// 공통 여백
const GAP_SMALL = '0.5rem';
const GAP_MEDIUM = '1rem';
const GAP_LARGE = '1.5rem';

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

const Container = styled.div`
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const LoadingWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${GAP_LARGE} ${GAP_MEDIUM};
`;

const LoadingText = styled.span`
  margin-top: ${GAP_MEDIUM};
  font-size: 1rem;
  color: #333;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Header = styled.div`
  position: relative;
  padding: ${GAP_MEDIUM} ${GAP_LARGE};
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
`;

const CloseButton = styled.button`
  position: absolute;
  right: ${GAP_LARGE};
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${GAP_LARGE};
  display: flex;
  flex-direction: column;
  gap: ${GAP_LARGE};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: ${GAP_MEDIUM} ${GAP_LARGE};
`;

const SummaryCard = styled.div`
  background: #f9f9f9;
  padding: ${GAP_MEDIUM};
  border-radius: 6px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: ${GAP_SMALL};
  text-align: left; /* 카드 내부 왼쪽 정렬 */
  align-items: center;
`;

const CardLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
  text-align: left;
`;

const CardValues = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GAP_SMALL};
  text-align: left;
`;

const ValueLine = styled.span`
  font-size: 1rem;
  color: #111;
`;

const Strong = styled.span`
  font-weight: bold;
  color: #000;
`;

const BadgeWrapper = styled.div`
  display: flex;
  justify-content: flex-start; /* 배지 왼쪽 정렬 */
`;

const Badge = styled.span<{ type: 'voteWinner' | 'aiWinner' }>`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  background-color: ${({ type }) =>
    type === 'voteWinner' ? '#ffe082' : '#81d4fa'};
  color: #333;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 0;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GAP_SMALL};
`;

const DetailTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  align-items: center;
`;

const DetailText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  white-space: pre-wrap;
  text-align: left; /* 본문 왼쪽 정렬 */
`;

const Footer = styled.div`
  padding: ${GAP_MEDIUM} ${GAP_LARGE};
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.5rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition:
    background-color 0.2s,
    transform 0.2s;
  &:hover {
    background: #45a049;
    transform: translateY(-1px);
  }
`;
