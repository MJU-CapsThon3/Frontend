import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaCrown,
  FaArrowUp,
  FaArrowDown,
  FaQuestionCircle,
} from 'react-icons/fa';

// ─────────────────────────────────────────────
// 티어별 매핑 (티어명, 아이콘 색상, 설명)
// ─────────────────────────────────────────────
const tierMapping: {
  [key: string]: { label: string; color: string; description: string };
} = {
  bronze: {
    label: '브론즈',
    color: '#cd7f32',
    description: '입문자 및 초보자 티어입니다.',
  },
  silver: {
    label: '실버',
    color: '#c0c0c0',
    description: '경험이 쌓여 안정적인 플레이를 보여주는 티어입니다.',
  },
  gold: {
    label: '골드',
    color: '#ffd700',
    description: '높은 스킬을 보유한 플레이어가 속한 티어입니다.',
  },
  platinum: {
    label: '플레',
    color: '#e5e4e2',
    description: '매우 높은 실력을 가진 상위권 플레이어입니다.',
  },
  diamond: {
    label: '다이아',
    color: '#b9f2ff',
    description: '최상위 플레이어들이 모여있는 티어입니다.',
  },
  master: {
    label: '마스터',
    color: '#800080',
    description: '게임에 정통하며 전략적인 플레이를 하는 티어입니다.',
  },
  grandmaster: {
    label: '그랜드마스터',
    color: '#ff4500',
    description: '상위 1%의 실력을 가진 플레이어가 속한 티어입니다.',
  },
  challenger: {
    label: '챌린저',
    color: '#00ced1',
    description: '최고의 기량을 갖춘 플레이어들이 경쟁하는 티어입니다.',
  },
};

// ─────────────────────────────────────────────
// TierInfoModal Component (모달)
// ─────────────────────────────────────────────
type TierInfoModalProps = {
  onClose: () => void;
};

const TierInfoModal: React.FC<TierInfoModalProps> = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>티어 구성 안내</ModalTitle>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          {Object.keys(tierMapping).map((key) => {
            const tier = tierMapping[key];
            return (
              <TierInfo key={key}>
                <TierIcon color={tier.color}>
                  <FaCrown />
                </TierIcon>
                <TierDetail>
                  <TierLabel>{tier.label}</TierLabel>
                  <TierDescription>{tier.description}</TierDescription>
                </TierDetail>
              </TierInfo>
            );
          })}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// ─────────────────────────────────────────────
// RankingPage Component
// ─────────────────────────────────────────────
const RankingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 샘플 랭킹 데이터 (실제 구현 시 API 호출 등으로 받아올 수 있음)
  const rankingData = [
    {
      id: 1,
      username: '홍길동',
      score: 1500,
      tier: 'challenger',
      rank: 1,
      change: 0,
    },
    {
      id: 2,
      username: '김철수',
      score: 1400,
      tier: 'grandmaster',
      rank: 2,
      change: 1,
    },
    {
      id: 3,
      username: '이영희',
      score: 1300,
      tier: 'master',
      rank: 3,
      change: -1,
    },
    {
      id: 4,
      username: '박지민',
      score: 1200,
      tier: 'diamond',
      rank: 4,
      change: 2,
    },
    {
      id: 5,
      username: '최수정',
      score: 1100,
      tier: 'gold',
      rank: 5,
      change: 0,
    },
  ];

  return (
    <RankingContainer>
      <RankingHeader>
        <HeaderTitleWrapper>
          <HeaderTitle>랭킹 페이지</HeaderTitle>
          <HelpIcon onClick={() => setIsModalOpen(true)}>
            <FaQuestionCircle />
          </HelpIcon>
        </HeaderTitleWrapper>
      </RankingHeader>
      <TableWrapper>
        <RankingTable>
          <thead>
            <tr>
              <TableHead>순위</TableHead>
              <TableHead>변동</TableHead>
              <TableHead>티어</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>점수</TableHead>
            </tr>
          </thead>
          <tbody>
            {rankingData.map((user, index) => {
              const tierInfo = tierMapping[user.tier];
              return (
                <TableRow key={user.id} delay={index * 0.1}>
                  <TableCell>{user.rank}</TableCell>
                  <TableCell>
                    <ChangeCell>
                      {user.change > 0 ? (
                        <>
                          <FaArrowUp style={{ color: '#4caf50' }} />
                          <ChangeText positive>{user.change}</ChangeText>
                        </>
                      ) : user.change < 0 ? (
                        <>
                          <FaArrowDown style={{ color: '#f44336' }} />
                          <ChangeText negative>
                            {Math.abs(user.change)}
                          </ChangeText>
                        </>
                      ) : (
                        <ChangeText>—</ChangeText>
                      )}
                    </ChangeCell>
                  </TableCell>
                  <TableCell>
                    <TierCell>
                      <TierIcon color={tierInfo.color}>
                        <FaCrown />
                      </TierIcon>
                      {tierInfo.label}
                    </TierCell>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.score} 점</TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </RankingTable>
      </TableWrapper>
      {isModalOpen && <TierInfoModal onClose={() => setIsModalOpen(false)} />}
    </RankingContainer>
  );
};

export default RankingPage;

// ─────────────────────────────────────────────
// 애니메이션 keyframes
// ─────────────────────────────────────────────
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// ─────────────────────────────────────────────
// Styled Components (공통 스타일)
// ─────────────────────────────────────────────

// 전체 랭킹 페이지 컨테이너
const RankingContainer = styled.div`
  min-width: 1000px;
  min-height: 80vh;
  margin: 2rem auto;
  background: linear-gradient(135deg, #ffdb4b, #ffa136);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

// 헤더 영역
const RankingHeader = styled.div`
  background-color: #1c87c9;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const HeaderTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 2rem;
  letter-spacing: 1px;
`;

const HelpIcon = styled.div`
  position: absolute;
  right: 0;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`;

// 테이블 래퍼
const TableWrapper = styled.div`
  padding: 2rem;
  overflow-x: auto;
`;

// 랭킹 테이블
const RankingTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

// 테이블 헤드 셀
const TableHead = styled.th`
  background: linear-gradient(135deg, #ff9e80, #ff6e40);
  color: #fff;
  padding: 1rem;
  text-align: center;
  font-size: 1.1rem;
  border-bottom: 2px solid #ffa136;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

// 테이블 행
interface TableRowProps {
  delay: number;
}
const TableRow = styled.tr<TableRowProps>`
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${(props) => props.delay}s;
  opacity: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.3s;
  &:hover {
    background-color: #f1f1f1;
    transform: translateY(-3px);
  }
`;

// 테이블 셀
const TableCell = styled.td`
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  border-bottom: none;
`;

// 티어 셀
const TierCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

// 티어 아이콘
const TierIcon = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 1.8rem;
  margin-right: 0.5rem;
  display: inline-flex;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

// 순위 변동 정보
const ChangeCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChangeText = styled.span<{ positive?: boolean; negative?: boolean }>`
  font-size: 1rem;
  font-weight: bold;
  margin-left: 0.3rem;
  color: ${(props) =>
    props.positive ? '#4caf50' : props.negative ? '#f44336' : '#999'};
`;

// ─────────────────────────────────────────────
// Modal 관련 Styled Components
// ─────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 500px;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background-color: #1c87c9;
  color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const ModalCloseButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const TierInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const TierDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0.8rem;
`;

const TierLabel = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const TierDescription = styled.p`
  font-size: 0.95rem;
  margin: 0;
  color: #555;
`;
