import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaArrowUp, FaArrowDown, FaQuestionCircle } from 'react-icons/fa';
import {
  getTopRankings,
  ApiResponse,
  RankingItem,
} from '../../api/ranking/rankingApi';

// ─────────────────────────────────────────────
// 최대 플레이어 수 (예제에서는 40명)
const MAX_PLAYERS = 40;

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
// 티어별 매핑 (티어명, 아이콘, 설명)
// 정렬 순서: 챌린저, 그랜드마스터, 마스터, 다이아, 플레, 골드, 실버, 브론즈
const tierMapping: {
  [key: string]: { label: string; icon: string; description: string };
} = {
  challenger: {
    label: '챌린저',
    icon: ChallengerIcon,
    description: '상위 1% 이내',
  },
  grandmaster: {
    label: '그랜드마스터',
    icon: GrandMasterIcon,
    description: '상위 4% 이내',
  },
  master: { label: '마스터', icon: MasterIcon, description: '상위 10% 이내' },
  diamond: { label: '다이아', icon: DiamondIcon, description: '상위 20% 이내' },
  platinum: { label: '플레', icon: PlatinumIcon, description: '상위 35% 이내' },
  gold: { label: '골드', icon: GoldIcon, description: '상위 55% 이내' },
  silver: { label: '실버', icon: SilverIcon, description: '상위 80% 이내' },
  bronze: { label: '브론즈', icon: BronzeIcon, description: '하위 20% 이상' },
};

// ─────────────────────────────────────────────
// 순위에 따른 티어 결정 함수 (비율 기반)
const getTierByRank = (
  rank: number,
  totalPlayers: number = MAX_PLAYERS
): string => {
  const thresholds = {
    challenger: Math.ceil(totalPlayers * 0.01),
    grandmaster: Math.ceil(totalPlayers * 0.04),
    master: Math.ceil(totalPlayers * 0.1),
    diamond: Math.ceil(totalPlayers * 0.2),
    platinum: Math.ceil(totalPlayers * 0.35),
    gold: Math.ceil(totalPlayers * 0.55),
    silver: Math.ceil(totalPlayers * 0.8),
    bronze: totalPlayers,
  };

  if (rank <= thresholds.challenger) return 'challenger';
  if (rank <= thresholds.grandmaster) return 'grandmaster';
  if (rank <= thresholds.master) return 'master';
  if (rank <= thresholds.diamond) return 'diamond';
  if (rank <= thresholds.platinum) return 'platinum';
  if (rank <= thresholds.gold) return 'gold';
  if (rank <= thresholds.silver) return 'silver';
  return 'bronze';
};

// ─────────────────────────────────────────────
// TierInfoModal Component (모달)
// 티어를 챌린저 → 그랜드마스터 → 마스터 → 다이아 → 플레 → 골드 → 실버 → 브론즈 순으로 정렬

type TierInfoModalProps = { onClose: () => void };
const TierInfoModal: React.FC<TierInfoModalProps> = ({ onClose }) => {
  const orderedTiers = [
    'challenger',
    'grandmaster',
    'master',
    'diamond',
    'platinum',
    'gold',
    'silver',
    'bronze',
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>티어 구성 안내</ModalTitle>
          <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          {orderedTiers.map((key) => {
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
// RankingPage Component (점수 기준 내림차순 정렬 + 배틀방 스타일 적용)

interface UserRank {
  id: number;
  username: string;
  score: number;
  rank: number;
  previousRank: number | null;
}

const RankingPage: React.FC = () => {
  const [rankingData, setRankingData] = useState<UserRank[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  // 초기 랭킹 데이터 로드 (점수 기준 내림차순 정렬)
  useEffect(() => {
    setLoading(true);
    getTopRankings()
      .then((res: ApiResponse<RankingItem[]>) => {
        if (res.isSuccess && res.result) {
          const mapped = res.result.map((item: RankingItem) => ({
            id: Number(item.userId),
            username: item.nickname,
            score: item.totalPoints,
            rank: item.rank,
            previousRank: item.previousRank,
          }));
          // score 기준 내림차순 정렬
          mapped.sort((a, b) => b.score - a.score);
          setRankingData(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // 스크롤 페이징 (추가 로드 시에도 내림차순 유지)
  const handleScroll = useCallback(() => {
    if (listWrapperRef.current && !loading) {
      const { scrollTop, clientHeight, scrollHeight } = listWrapperRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < 100) {
        setLoading(true);
        getTopRankings() // TODO: API가 페이지별 지원 시 수정 필요
          .then((res: ApiResponse<RankingItem[]>) => {
            if (res.isSuccess && res.result) {
              const newItems = res.result.map((item: RankingItem) => ({
                id: Number(item.userId),
                username: item.nickname,
                score: item.totalPoints,
                rank: item.rank,
                previousRank: item.previousRank,
              }));
              // 기존 데이터 + 새로운 데이터 합친 뒤 중복 제거 후 score 기준 내림차순
              const combined = [...rankingData, ...newItems];
              const uniqueMap = new Map<number, UserRank>();
              combined.forEach((u) => {
                if (!uniqueMap.has(u.id)) uniqueMap.set(u.id, u);
              });
              const uniqueArray = Array.from(uniqueMap.values());
              uniqueArray.sort((a, b) => b.score - a.score);
              setRankingData(uniqueArray);
            }
          })
          .finally(() => setLoading(false));
      }
    }
  }, [loading, rankingData]);

  useEffect(() => {
    const wrapper = listWrapperRef.current;
    if (wrapper) wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Container>
      <Header>
        <HeaderTitle>랭킹</HeaderTitle>
        <HelpIcon onClick={() => setIsModalOpen(true)}>
          <FaQuestionCircle color='#fff' size={20} />
        </HelpIcon>
      </Header>
      {/* 리스트 영역 (내부 스크롤) */}
      <ListWrapper ref={listWrapperRef}>
        {loading && rankingData.length === 0 ? (
          <LoadingText>로딩 중...</LoadingText>
        ) : (
          rankingData.map((user, idx) => {
            const change =
              user.previousRank !== null ? user.previousRank - user.rank : 0;
            const tierKey = getTierByRank(user.rank, MAX_PLAYERS);
            const tierInfo = tierMapping[tierKey];
            return (
              <CardRow key={user.id} delay={idx * 0.05}>
                <RankCell>
                  <RankText>{user.rank}</RankText>
                </RankCell>
                <ChangeCell>
                  {change > 0 ? (
                    <>
                      <FaArrowUp style={{ color: '#4caf50' }} />
                      <ChangeText positive>{change}</ChangeText>
                    </>
                  ) : change < 0 ? (
                    <>
                      <FaArrowDown style={{ color: '#f44336' }} />
                      <ChangeText negative>{Math.abs(change)}</ChangeText>
                    </>
                  ) : (
                    <ChangeText>—</ChangeText>
                  )}
                </ChangeCell>
                <TierCell>
                  <img
                    src={tierInfo.icon}
                    alt={tierInfo.label}
                    width='32'
                    height='32'
                    style={{ marginRight: '6px' }}
                  />
                  <TierLabel>{tierInfo.label}</TierLabel>
                </TierCell>
                <UsernameCell>{user.username}</UsernameCell>
                <ScoreCell>{user.score} 점</ScoreCell>
              </CardRow>
            );
          })
        )}
        {loading && rankingData.length > 0 && (
          <LoadingText>로딩 중...</LoadingText>
        )}
      </ListWrapper>

      {isModalOpen && <TierInfoModal onClose={() => setIsModalOpen(false)} />}
    </Container>
  );
};

export default RankingPage;

// ─────────────────────────────────────────────
// 애니메이션 keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ─────────────────────────────────────────────
// Styled Components (배틀방과 동일한 디자인 요소)

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 700px;
  padding: 1rem;
  background: #3aa7f0;
  border: 5px solid #000;
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Malgun Gothic', 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
`;

const Header = styled.header`
  position: relative;
  height: 3rem; /* 필요에 따라 높이 조정 */
  background-color: #48b0ff;
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
`;

// HeaderTitle은 절대 위치로 가운데 정렬
const HeaderTitle = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: #fff;
  font-size: 1.5rem;
  text-shadow: 1px 1px #000;
`;

// HelpIcon은 부모(Header) 내에서 오른쪽 끝에 배치
const HelpIcon = styled.div`
  margin-left: auto;
  cursor: pointer;
  background-color: #0050b3;
  padding: 0.3rem;
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 리스트 영역: 내부 스크롤 + 카드 간 간격 유지
const ListWrapper = styled.div`
  flex: 1;
  height: 500px;
  padding: 0.5rem 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  /* 스크롤바 스타일 (크롬 계열) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #63c8ff;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #48b0ff;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #0050b3;
  }
`;

// 카드(row) 스타일: 배틀방 카드와 유사한 테두리/둥근 모서리/그림자/호버 효과
interface CardRowProps {
  delay: number;
}
const CardRow = styled.div<CardRowProps>`
  display: grid;
  grid-template-columns: 60px 60px 200px 1fr 80px;
  align-items: center;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  animation: ${fadeIn} 0.4s ease-out forwards;
  animation-delay: ${(props) => props.delay}s;
  opacity: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    background-color 0.2s;
  &:hover {
    transform: translateY(-3px);
    background-color: #f0f8ff;
  }
`;

const RankCell = styled.div`
  text-align: center;
`;
const RankText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #004a66;
`;

const ChangeCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ChangeText = styled.span<{ positive?: boolean; negative?: boolean }>`
  margin-left: 0.3rem;
  font-size: 1rem;
  font-weight: bold;
  color: ${(props) =>
    props.positive ? '#4caf50' : props.negative ? '#f44336' : '#999'};
`;

const TierCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const TierLabel = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #004a66;
`;

const UsernameCell = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  padding-left: 0.5rem;
`;

const ScoreCell = styled.div`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #004a66;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #fff;
  margin: 2rem 0;
`;

// ─────────────────────────────────────────────
// Modal Styled Components (변경 없음)
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
  border: 2px solid #000;
  border-radius: 4px;
  width: 400px;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background-color: #48b0ff;
  color: #fff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #000;
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

const TierIcon = styled.span`
  display: inline-flex;
`;

const TierDescription = styled.span`
  font-size: 0.95rem;
  color: #555;
`;
