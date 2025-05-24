import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaArrowUp, FaArrowDown, FaQuestionCircle } from 'react-icons/fa';

// ─────────────────────────────────────────────
// 아이콘 임포트 (각 파일 경로는 프로젝트 구조에 맞게 수정)
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';

// ─────────────────────────────────────────────
// 최대 플레이어 수 (예제에서는 40명)
const MAX_PLAYERS = 40;

// ─────────────────────────────────────────────
// 티어별 매핑 (티어명, 아이콘, 색상, 설명)
const tierMapping: {
  [key: string]: {
    label: string;
    color: string;
    description: string;
    icon: string;
  };
} = {
  bronze: {
    label: '브론즈',
    color: '#cd7f32',
    description: '전체 계정의 80% 초과에 해당합니다.',
    icon: BronzeIcon,
  },
  silver: {
    label: '실버',
    color: '#c0c0c0',
    description: '전체 계정의 상위 55% 초과 ~ 80% 이내에 해당합니다.',
    icon: SilverIcon,
  },
  gold: {
    label: '골드',
    color: '#ffd700',
    description: '전체 계정의 상위 20% 초과 ~ 35% 이내에 해당합니다.',
    icon: GoldIcon,
  },
  platinum: {
    label: '플레',
    color: '#e5e4e2',
    description: '전체 계정의 상위 35% 초과 ~ 55% 이내에 해당합니다.',
    icon: PlatinumIcon,
  },
  diamond: {
    label: '다이아',
    color: '#b9f2ff',
    description: '전체 계정의 상위 10% 초과 ~ 20% 이내에 해당합니다.',
    icon: DiamondIcon,
  },
  master: {
    label: '마스터',
    color: '#800080',
    description: '전체 계정의 상위 4% 초과 ~ 10% 이내에 해당합니다.',
    icon: MasterIcon,
  },
  grandmaster: {
    label: '그랜드마스터',
    color: '#ff4500',
    description: '전체 계정의 상위 1% 초과 ~ 4% 이내에 해당합니다.',
    icon: GrandMasterIcon,
  },
  challenger: {
    label: '챌린저',
    color: '#00ced1',
    description: '전체 계정의 상위 1% 이내에 해당합니다.',
    icon: ChallengerIcon,
  },
};

// ─────────────────────────────────────────────
// 순위에 따른 티어 결정 함수 (비율 기반)
const getTierByRank = (
  rank: number,
  totalPlayers: number = MAX_PLAYERS
): string => {
  const thresholds = {
    challenger: Math.ceil(totalPlayers * 0.01), // 상위 1%
    grandmaster: Math.ceil(totalPlayers * 0.04), // 상위 4%
    master: Math.ceil(totalPlayers * 0.1), // 상위 10%
    diamond: Math.ceil(totalPlayers * 0.2), // 상위 20%
    platinum: Math.ceil(totalPlayers * 0.35), // 상위 35%
    gold: Math.ceil(totalPlayers * 0.55), // 상위 55%
    silver: Math.ceil(totalPlayers * 0.8), // 상위 80%
    bronze: totalPlayers, // 그 외
  };

  if (rank <= thresholds.challenger) return 'challenger';
  else if (rank <= thresholds.grandmaster) return 'grandmaster';
  else if (rank <= thresholds.master) return 'master';
  else if (rank <= thresholds.diamond) return 'diamond';
  else if (rank <= thresholds.platinum) return 'platinum';
  else if (rank <= thresholds.gold) return 'gold';
  else if (rank <= thresholds.silver) return 'silver';
  else return 'bronze';
};

// ─────────────────────────────────────────────
// TierInfoModal Component (모달)
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
                <TierIcon>
                  <img
                    src={tier.icon}
                    alt={tier.label}
                    width='40'
                    height='40'
                  />
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
// RankingPage Component (내부 스크롤 적용)
type UserRank = {
  id: number;
  username: string;
  score: number;
  rank: number;
  change: number;
};

const RankingPage: React.FC = () => {
  const [rankingData, setRankingData] = useState<UserRank[]>([
    { id: 1, username: '홍길동', score: 1500, rank: 1, change: 0 },
    { id: 2, username: '김철수', score: 1400, rank: 2, change: 1 },
    { id: 3, username: '이영희', score: 1300, rank: 3, change: -1 },
    { id: 4, username: '박지민', score: 1200, rank: 4, change: 2 },
    { id: 5, username: '최수정', score: 1100, rank: 5, change: 0 },
  ]);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const fetchRankingData = (_: number): Promise<UserRank[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentCount = rankingData.length;
        if (currentCount >= MAX_PLAYERS) {
          resolve([]);
          return;
        }
        const newData: UserRank[] = [];
        for (let i = 0; i < 5; i++) {
          const newRank = currentCount + i + 1;
          if (newRank > MAX_PLAYERS) break;
          newData.push({
            id: newRank,
            username: `유저 ${newRank}`,
            score: 1500 - newRank * 10,
            rank: newRank,
            change: newRank % 3 === 0 ? -1 : newRank % 3 === 1 ? 1 : 0,
          });
        }
        resolve(newData);
      }, 1000);
    });
  };

  // TableWrapper 내부 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (tableWrapperRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = tableWrapperRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < 100 && !loading) {
        setLoading(true);
        fetchRankingData(page).then((newData) => {
          if (newData.length > 0) {
            setRankingData((prevData) => [...prevData, ...newData]);
            setPage((prevPage) => prevPage + 1);
          }
          setLoading(false);
        });
      }
    }
  }, [loading, page, rankingData]);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <RankingContainer>
      <RankingHeader>
        <HeaderTitleWrapper>
          <HeaderTitle>랭킹</HeaderTitle>
          <HelpIcon onClick={() => setIsModalOpen(true)}>
            <FaQuestionCircle />
          </HelpIcon>
        </HeaderTitleWrapper>
      </RankingHeader>
      <TableWrapper ref={tableWrapperRef}>
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
              const tierKey = getTierByRank(user.rank, MAX_PLAYERS);
              const tierInfo = tierMapping[tierKey];
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
                      <TierIcon>
                        <img
                          src={tierInfo.icon}
                          alt={tierInfo.label}
                          width='40'
                          height='40'
                          style={{ marginRight: '0.5rem' }}
                        />
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
        {loading && <LoadingText>로딩 중...</LoadingText>}
      </TableWrapper>
      {isModalOpen && <TierInfoModal onClose={() => setIsModalOpen(false)} />}
    </RankingContainer>
  );
};

export default RankingPage;

// ─────────────────────────────────────────────
// 애니메이션 keyframes
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
const RankingContainer = styled.div`
  width: 800px;
  height: 600px;
  margin: 20px auto 2rem;
  background: linear-gradient(135deg, #ffdb4b, #ffa136);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

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

const TableWrapper = styled.div`
  height: 400px; /* 내부 스크롤 영역의 고정 높이 */
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;

  /* 스크롤바 전체 영역 */
  &::-webkit-scrollbar {
    width: 10px; /* 스크롤바 폭 */
  }

  /* 스크롤 트랙: 밝은 회색 배경에 라운드 효과 */
  &::-webkit-scrollbar-track {
    background: #ffdb4b;
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  }

  /* 스크롤 thumb: 중간 회색 계열, 테두리는 트랙 색상과 동일하게 설정 */
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 5px;
    border: 2px solid #ffdb4b;
    transition: background 0.3s;
  }

  /* 스크롤 thumb hover: 좀 더 어두운 회색으로 변경 */
  &::-webkit-scrollbar-thumb:hover {
    background: #ffa136;
  }
`;

const RankingTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

const TableHead = styled.th`
  background: #ff6e40;
  color: #fff;
  padding: 1.2rem 1.5rem;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 2px solid #ffa136;
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

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

const TableCell = styled.td`
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
`;

const TierCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const TierIcon = styled.span`
  display: inline-flex;
`;

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

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 1rem;
`;

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
