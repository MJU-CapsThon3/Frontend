import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGift, FaClock, FaCoins } from 'react-icons/fa';

// 자정까지 남은 시간을 초 단위로 계산하는 함수
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

// 예시 데이터 (퀘스트 3종목)
// 초기 타이머는 모두 자정까지 남은 시간으로 설정
const initialQuestData: Quest[] = [
  {
    id: 1,
    title: '토론 참여하기',
    description: '토론 1회 참여 시, 선물 지급!',
    reward: '100포인트',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 1,
    rewardClaimed: false,
  },
  {
    id: 2,
    title: '글 작성하기',
    description: '게시글 5회 작성 시, 선물 지급!',
    reward: '50포인트',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 5,
    rewardClaimed: false,
  },
  {
    id: 3,
    title: '댓글 달기',
    description: '댓글 10회 작성 시, 선물 지급!',
    reward: '20포인트',
    timeLeft: getTimeUntilMidnight(),
    progress: 0,
    goal: 10,
    rewardClaimed: false,
  },
];

const QuestPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>(initialQuestData);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  // 매초 자정까지 남은 시간을 업데이트하며, 자정 지나면 퀘스트 리셋 처리
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

  // 퀘스트 완료 버튼 클릭 시 진행도를 1씩 증가
  const handleCompleteQuest = (questId: number) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) =>
        quest.id === questId && quest.progress < quest.goal
          ? { ...quest, progress: quest.progress + 1 }
          : quest
      )
    );
    console.log(`퀘스트 ID ${questId} 완료 진행 중...`);
  };

  // 선물받기 버튼 클릭 시 모달을 띄우고 보상 수령 상태를 업데이트
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

  // 초 단위 시간을 "HH시간 MM분 SS초" 형식으로 변환하는 함수
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}시간 ${m < 10 ? '0' : ''}${m}분 ${s < 10 ? '0' : ''}${s}초`;
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>미션</HeaderTitle>
        <HeaderSubTitle>일일 미션은 매일 00:00에 초기화돼요 ★</HeaderSubTitle>
      </Header>

      <QuestList>
        {quests.map((quest) => {
          // 버튼 렌더링: 진행도 미달이면 "퀘스트 완료", 완료 후 보상 미수령이면 "선물받기", 수령 후 "보상완료"
          const renderActionButton = () => {
            if (quest.progress < quest.goal) {
              return (
                <ActionButton
                  onClick={() => handleCompleteQuest(quest.id)}
                  buttonType='complete'
                >
                  퀘스트 완료
                </ActionButton>
              );
            } else if (quest.progress >= quest.goal && !quest.rewardClaimed) {
              return (
                <ActionButton
                  onClick={() => handleClaimReward(quest.id)}
                  buttonType='claim'
                >
                  선물받기
                </ActionButton>
              );
            } else {
              return (
                <ActionButton disabled buttonType='claimed'>
                  보상완료
                </ActionButton>
              );
            }
          };

          return (
            <QuestItem key={quest.id}>
              {/* 왼쪽 영역: 아이콘 및 선물 라벨 */}
              <CoinBoxWrapper>
                <GiftLabel>
                  <FaGift size={14} />
                  선물
                </GiftLabel>
                <CoinBox>
                  <FaCoins size={28} />
                </CoinBox>
              </CoinBoxWrapper>

              {/* 오른쪽 영역: 퀘스트 정보 및 진행률 */}
              <ContentWrapper>
                <InfoContainer>
                  <RowTitle>{quest.title}</RowTitle>
                  <RowDesc>내용 : {quest.description}</RowDesc>
                  <RowReward>선물 : {quest.reward}</RowReward>
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
                      {formatTime(quest.timeLeft)}
                    </TimeLeft>
                    {renderActionButton()}
                  </RightContainer>
                </BottomRow>
              </ContentWrapper>
            </QuestItem>
          );
        })}
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

// Container와 기본 테마 (블루 계열)는 그대로 유지
const Container = styled.div`
  min-width: 1000px;
  min-height: 80vh;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #3aa7f0;
  border: 3px solid #2e8bc0;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Malgun Gothic', 'Arial', sans-serif;
`;

const Header = styled.div`
  text-align: center;
  padding: 1rem;
  background: #2e8bc0;
  border: 2px solid #246a94;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: inset 0 1px 0 #cee3f8;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
`;

const HeaderSubTitle = styled.p`
  margin: 0;
  color: #e0f7ff;
  font-size: 1rem;
`;

const QuestList = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const QuestItem = styled.div`
  width: 95%;
  margin: 0 auto;
  display: flex;
  gap: 1.2rem;
  padding: 1rem;
  background: #fff;
  border: 2px solid #2e8bc0;
  border-radius: 8px;
  box-shadow: 0 3px 5px rgba(46, 139, 192, 0.2);
  animation: ${slideIn} 0.3s ease-out forwards;
`;

const CoinBoxWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
`;

const GiftLabel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: #9fd1ff;
  border: 2px solid #2e8bc0;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: bold;
  color: #034f84;
  box-shadow: inset 0 1px 0 #fff;
`;

// 코인박스는 노란색 계열로 변경
const CoinBox = styled.div`
  width: 150px;
  height: 150px;
  background: #ffd700;
  border: 2px solid #d4af37;
  border-radius: 8px;
  box-shadow: inset 0 1px 0 #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1.4rem;
  font-weight: bold;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 0.8rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
`;

const RowTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e8bc0;
`;

const RowDesc = styled.div`
  font-size: 1rem;
  color: #333;
`;

const RowReward = styled.div`
  font-size: 1rem;
  color: #333;
`;

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
  margin-right: 20px;
`;

// 진행률 게이지 배경은 연한 회색(#eee)로 설정
const ProgressBar = styled.div`
  flex: 1;
  height: 18px;
  border-radius: 9px;
  background: #eee;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

// 진행률 채워진 부분은 빨간색 계열 그라데이션
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
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #2e8bc0;
  box-shadow: inset 0 1px 0 #fff;
  display: inline-flex;
  align-items: center;
`;

// 액션 버튼의 색상 재조합
const ActionButton = styled.button<{
  buttonType: 'complete' | 'claim' | 'claimed';
}>`
  background-color: ${({ buttonType }) =>
    buttonType === 'complete'
      ? '#4caf50' // 초록 (퀘스트 완료)
      : buttonType === 'claim'
        ? '#ff9800' // 주황 (선물받기)
        : '#888'}; // 회색 (보상완료)
  color: #fff;
  border: none;
  font-size: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 0
    ${({ buttonType }) =>
      buttonType === 'complete'
        ? '#388e3c'
        : buttonType === 'claim'
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
  width: 360px;
  border-radius: 12px;
  overflow: hidden;
  animation: ${modalFadeIn} 0.3s ease forwards;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background: #2e8bc0;
  padding: 1rem;
  color: #fff;
  font-size: 1.3rem;
  text-align: center;
`;

const ModalBody = styled.div`
  padding: 1.2rem;
  font-size: 1.1rem;
  text-align: center;
  line-height: 1.5;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalFooter = styled.div`
  padding: 0.8rem;
  display: flex;
  justify-content: center;
  background: #f9f9f9;
`;

// 모달 버튼은 모달 헤더와 조화를 이루는 밝은 파란색으로 설정
const ModalButton = styled.button`
  background: #5aa9ff;
  border: none;
  color: #fff;
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:active {
    transform: translateY(1px);
  }
`;
