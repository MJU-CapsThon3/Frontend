import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGift, FaClock, FaCoins } from 'react-icons/fa';

/**
 * 자정까지 남은 시간을 초 단위로 계산하는 함수
 */
const getTimeUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
};

type Quest = {
  id: number;
  title: string;
  description: string;
  reward: string;
  timeLeft: number; // 남은 시간 (초 단위)
  progress: number; // 현재 진행도
  goal: number; // 퀘스트 목표치
  rewardClaimed: boolean; // 보상 수령 여부
};

// 초기 퀘스트 데이터 (7종목)
// 모든 타이머는 자정까지 남은 시간으로 초기화
const initialQuestData: Quest[] = [
  {
    id: 1,
    title: '토론 참여하기',
    description: '토론 1회 참여 시, 보상 지급!',
    reward: '100냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 1,
    rewardClaimed: false,
  },
  {
    id: 2,
    title: '글 작성하기',
    description: '게시글 5회 작성 시, 보상 지급!',
    reward: '50냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 5,
    rewardClaimed: false,
  },
  {
    id: 3,
    title: '댓글 달기',
    description: '댓글 10회 작성 시, 보상 지급!',
    reward: '20냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 10,
    rewardClaimed: false,
  },
  {
    id: 4,
    title: '로그인 유지하기',
    description: '하루 동안 연속 로그인 시, 보너스 지급!',
    reward: '30냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 1,
    rewardClaimed: false,
  },
  {
    id: 5,
    title: '프로필 수정하기',
    description: '한 번의 프로필 수정 시, 보상 지급!',
    reward: '10냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 1,
    rewardClaimed: false,
  },
  {
    id: 6,
    title: '친구 초대하기',
    description: '친구 초대 3회 완료 시, 보상 지급!',
    reward: '150냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 3,
    rewardClaimed: false,
  },
  {
    id: 7,
    title: '일일 퀘스트 클리어',
    description: '모든 퀘스트 완료 시, 보너스 지급!',
    reward: '200냥',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 7,
    rewardClaimed: false,
  },
];

const QuestPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(initialQuestData);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  /**
   * 자정까지 남은 시간을 매초 업데이트하며,
   * 자정이 지나면 퀘스트의 진행도와 보상 상태를 초기화
   */
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getTimeUntilMidnight();
      setQuests((prevQuests) =>
        prevQuests.map((quest) => {
          if (newTime <= 1) {
            return {
              ...quest,
              timeLeft: newTime,
              progress: 0,
              rewardClaimed: false,
            };
          }
          return { ...quest, timeLeft: newTime };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * 퀘스트 완료 버튼 클릭 시 현재 진행도를 1씩 증가
   */
  const handleCompleteQuest = (questId: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) =>
        quest.id === questId && quest.progress < quest.goal
          ? { ...quest, progress: quest.progress + 1 }
          : quest
      )
    );
    console.log(`퀘스트 ID ${questId} 진행 중...`);
  };

  /**
   * 보상받기 버튼 클릭 시 모달을 띄우고 보상 수령 상태를 업데이트
   */
  const handleClaimReward = (questId: number) => {
    const quest = quests.find((q) => q.id === questId);
    if (quest) {
      setModalContent(`축하합니다! ${quest.reward}을(를) 획득하셨습니다!`);
      setModalVisible(true);
      setQuests((prevQuests) =>
        prevQuests.map((q) =>
          q.id === questId ? { ...q, rewardClaimed: true } : q
        )
      );
      console.log(`퀘스트 ID ${questId} 보상 수령 완료`);
    }
  };

  /**
   * 초(seconds)를 "HH시간 MM분 SS초" 형태의 문자열로 변환
   * padStart를 이용하여 자리수를 보완해 가독성을 높임
   */
  const formatSecondsToHMS = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}시간 ${m}분 ${s}초`;
  };

  /**
   * 퀘스트 진행 상황에 따라 액션 버튼을 렌더링
   */
  const renderActionButton = (quest: Quest) => {
    if (quest.progress < quest.goal) {
      return (
        <ActionButton
          onClick={() => handleCompleteQuest(quest.id)}
          $buttonType='complete'
        >
          퀘스트 완료
        </ActionButton>
      );
    } else if (quest.progress >= quest.goal && !quest.rewardClaimed) {
      return (
        <ActionButton
          onClick={() => handleClaimReward(quest.id)}
          $buttonType='claim'
        >
          보상받기
        </ActionButton>
      );
    } else {
      return (
        <ActionButton disabled $buttonType='claimed'>
          보상완료
        </ActionButton>
      );
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>미션</HeaderTitle>
        <HeaderSubTitle>일일 미션은 매일 00:00에 초기화돼요 ★</HeaderSubTitle>
      </Header>

      {/* QuestList는 Container 내 남은 영역을 차지하며 내용이 많을 경우 스크롤됩니다 */}
      <QuestList>
        {quests.map((quest) => (
          <QuestItem key={quest.id}>
            <CoinBoxWrapper>
              <GiftLabel>
                <FaGift size={14} />
                보상
              </GiftLabel>
              <CoinBox>
                <FaCoins size={28} />
              </CoinBox>
            </CoinBoxWrapper>

            <ContentWrapper>
              <InfoContainer>
                <RowTitle>{quest.title}</RowTitle>
                <RowDesc>내용 : {quest.description}</RowDesc>
                <RowReward>보상 : {quest.reward}</RowReward>
              </InfoContainer>

              <BottomRow>
                <ProgressBarContainer>
                  <ProgressBar>
                    <ProgressFill
                      style={{
                        width: `${Math.min(
                          (quest.progress / quest.goal) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </ProgressBar>
                  <ProgressLabel>
                    {quest.progress} / {quest.goal}
                  </ProgressLabel>
                </ProgressBarContainer>

                <RightContainer>
                  <TimeLeft>
                    <FaClock style={{ marginRight: '4px' }} />
                    {formatSecondsToHMS(quest.timeLeft)}
                  </TimeLeft>
                  {renderActionButton(quest)}
                </RightContainer>
              </BottomRow>
            </ContentWrapper>
          </QuestItem>
        ))}
      </QuestList>

      {modalVisible && (
        <ModalOverlay onClick={() => setModalVisible(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>보상 수령</ModalHeader>
            <ModalBody>{modalContent}</ModalBody>
            <ModalFooter>
              <ModalButton onClick={() => setModalVisible(false)}>
                닫기
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default QuestPage;

/* =========================
   스타일 컴포넌트 정의 (가독성을 위해 효율적으로 재정렬)
========================= */

// 애니메이션 정의
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 컨테이너 스타일 (600px로 고정)
const Container = styled.div`
  width: 800px;
  height: 600px;
  margin: 20px auto 2rem;
  padding: 1rem;
  background: #3aa7f0;
  border: 3px solid #2e8bc0;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Malgun Gothic', 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
`;

// 헤더 스타일
const Header = styled.div`
  text-align: center;
  padding: 0.8rem;
  background: #2e8bc0;
  border: 2px solid #246a94;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: inset 0 1px 0 #cee3f8;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 1.4rem;
`;

const HeaderSubTitle = styled.p`
  margin: 0;
  color: #e0f7ff;
  font-size: 0.9rem;
`;

// QuestList: 남은 영역을 모두 차지하며 스크롤이 발생하도록 함
const QuestList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 0.5rem;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #cce6f4;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #2e8bc0;
    border-radius: 4px;
  }
`;

// 퀘스트 아이템 레이아웃
const QuestItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.8rem;
  background: #fff;
  border: 2px solid #2e8bc0;
  border-radius: 8px;
  box-shadow: 0 3px 5px rgba(46, 139, 192, 0.2);
  animation: ${slideIn} 0.3s ease-out forwards;
`;

const CoinBoxWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
`;

const GiftLabel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: #9fd1ff;
  border: 2px solid #2e8bc0;
  border-radius: 6px;
  padding: 0.2rem 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: bold;
  color: #034f84;
  box-shadow: inset 0 1px 0 #fff;
`;

const CoinBox = styled.div`
  width: 120px;
  height: 120px;
  background: #ffd700;
  border: 2px solid #d4af37;
  border-radius: 8px;
  box-shadow: inset 0 1px 0 #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
`;

// 콘텐츠 및 정보 레이아웃
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 0.6rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
`;

const RowTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #2e8bc0;
`;

const RowDesc = styled.div`
  font-size: 0.95rem;
  color: #333;
`;

const RowReward = styled.div`
  font-size: 0.95rem;
  color: #333;
`;

// 하단 정보 및 버튼 레이아웃
const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 14px;
  border-radius: 7px;
  background: #eee;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff5f5f, #ff7f7f);
  transition: width 0.4s ease;
`;

const ProgressLabel = styled.span`
  font-size: 0.85rem;
  color: #444;
  font-weight: bold;
`;

const RightContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TimeLeft = styled.div`
  background: #d0eaff;
  color: #034f84;
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  margin-left: 20px;
  border: 1px solid #2e8bc0;
  box-shadow: inset 0 1px 0 #fff;
  display: inline-flex;
  align-items: center;
`;

// 액션 버튼 (transient prop $buttonType 사용)
const ActionButton = styled.button<{
  $buttonType: 'complete' | 'claim' | 'claimed';
}>`
  background-color: ${({ $buttonType }) =>
    $buttonType === 'complete'
      ? '#4caf50'
      : $buttonType === 'claim'
        ? '#ff9800'
        : '#888'};
  color: #fff;
  border: none;
  font-size: 0.95rem;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 0
    ${({ $buttonType }) =>
      $buttonType === 'complete'
        ? '#388e3c'
        : $buttonType === 'claim'
          ? '#f57c00'
          : '#555'};
  transition: background-color 0.2s ease;

  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// 모달 관련 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${modalFadeIn} 0.3s ease forwards;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 320px;
  border-radius: 12px;
  overflow: hidden;
  animation: ${modalFadeIn} 0.3s ease forwards;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background: #2e8bc0;
  padding: 0.8rem;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
`;

const ModalBody = styled.div`
  padding: 0.8rem;
  font-size: 1rem;
  text-align: center;
  line-height: 1.4;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalFooter = styled.div`
  padding: 0.6rem;
  display: flex;
  justify-content: center;
  background: #f9f9f9;
`;

const ModalButton = styled.button`
  background: #5aa9ff;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:active {
    transform: translateY(1px);
  }
`;
