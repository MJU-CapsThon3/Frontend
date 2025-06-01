// src/pages/QuestPage.tsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGift, FaClock, FaCoins } from 'react-icons/fa';
import { QuestApi } from '../../api/quest/questApi'; // 경로를 프로젝트 구조에 맞게 조절하세요.
import type {
  Quest as APIQuest,
  CompleteQuestResult,
  QuestRewardResult,
} from '../../api/quest/questApi';

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
  progress: number; // 현재 진행도 (클라이언트에서 임시로 유지)
  goal: number; // 퀘스트 목표치 (클라이언트에서 임시로 유지)
  rewardClaimed: boolean; // 보상 수령 여부 (클라이언트에서 임시로 유지)
};

const QuestPage: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  // 1) 최초 렌더링 시 서버에서 퀘스트 목록 가져와서 state 세팅
  useEffect(() => {
    (async () => {
      try {
        const apiList: APIQuest[] = await QuestApi.getQuestList();
        const mapped: Quest[] = apiList.map((item) => {
          // 예시 로직: id별 목표치 지정
          let goalCount = 1;
          switch (item.id) {
            case 2:
              goalCount = 5;
              break;
            case 3:
              goalCount = 10;
              break;
            case 6:
              goalCount = 3;
              break;
            case 7:
              goalCount = apiList.length; // 예: 전체 퀘스트 개수
              break;
            default:
              goalCount = 1;
          }
          return {
            id: item.id,
            title: item.name,
            description: item.description,
            reward: `${item.rewardPts}냥`,
            timeLeft: getTimeUntilMidnight(),
            progress: 0,
            goal: goalCount,
            rewardClaimed: false,
          };
        });
        setQuests(mapped);
      } catch (error) {
        console.error('[QuestPage] 퀘스트 목록 로딩 오류:', error);
      }
    })();
  }, []);

  // 2) 매초마다 남은 시간 업데이트, 자정 지나면 서버 및 클라이언트 동시 reset
  useEffect(() => {
    const timer = setInterval(async () => {
      const newTime = getTimeUntilMidnight();

      if (newTime <= 1) {
        // 자정 지나면
        try {
          await QuestApi.resetDailyQuests();
        } catch (error) {
          console.error('[QuestPage] 일일 퀘스트 초기화 오류:', error);
        }
        setQuests((prevQuests) =>
          prevQuests.map((q) => ({
            ...q,
            timeLeft: newTime,
            progress: 0,
            rewardClaimed: false,
          }))
        );
      } else {
        // 자정 이전엔 남은 시간만 갱신
        setQuests((prevQuests) =>
          prevQuests.map((q) => ({ ...q, timeLeft: newTime }))
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * 퀘스트 완료 처리
   * 1) 서버에 퀘스트 완료 API 호출 → 성공하면 result 반환
   * 2) local state에서 해당 퀘스트 progress +1 (최대 goal까지만)
   */
  const handleCompleteQuest = async (questId: number) => {
    try {
      // 1) 서버에 퀘스트 완료 요청
      const result: CompleteQuestResult = await QuestApi.completeQuest(questId);
      console.log(
        `[QuestPage] 퀘스트 ${result.questId} isCompleted=${result.isCompleted}`
      );

      // 2) local state에서 해당 퀘스트 progress +1 (최대 goal까지만)
      setQuests((prevQuests) =>
        prevQuests.map((q) => {
          if (q.id === questId) {
            const newProg = Math.min(q.progress + 1, q.goal);
            return { ...q, progress: newProg };
          }
          return q;
        })
      );
    } catch (error) {
      console.error(
        `[QuestPage] 퀘스트 ID ${questId} 완료 처리 중 오류:`,
        error
      );
      setModalContent('퀘스트 완료 처리 중 오류가 발생했습니다.');
      setModalVisible(true);
    }
  };

  /**
   * 퀘스트 보상 수령 처리
   * 1) local state에서 progress가 goal 이상인지 확인 → 아니면 모달로 이유 표시
   * 2) 서버에 보상 수령 API 호출 → 성공 시 rewardClaimed=true, 모달로 보상액 표시
   *    실패 시 오류 메시지 모달
   */
  const handleClaimReward = async (questId: number) => {
    // 해당 퀘스트 상태 조회
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest) return;

    // progress가 목표치 미달성인 경우
    if (targetQuest.progress < targetQuest.goal) {
      setModalContent('퀘스트 목표를 먼저 달성해야 보상을 받을 수 있습니다.');
      setModalVisible(true);
      return;
    }
    // 이미 보상받은 경우
    if (targetQuest.rewardClaimed) {
      setModalContent('이미 보상을 받았습니다.');
      setModalVisible(true);
      return;
    }

    // 보상 수령 시도
    try {
      const rewardResult: QuestRewardResult = await QuestApi.claimQuestReward({
        userId: 1, // 실제로는 로그인된 유저 ID를 전달해야 합니다.
        questId,
      });
      console.log(
        `[QuestPage] 퀘스트 ${questId} 보상 획득: ${rewardResult.reward}냥`
      );

      // local state에서 rewardClaimed=true 로 변경
      setQuests((prevQuests) =>
        prevQuests.map((q) =>
          q.id === questId ? { ...q, rewardClaimed: true } : q
        )
      );

      // 보상 모달 열기
      setModalContent(
        `축하합니다! ${rewardResult.reward}냥을(를) 획득하셨습니다!`
      );
      setModalVisible(true);
    } catch (claimError: any) {
      console.error(
        `[QuestPage] 퀘스트 ${questId} 보상 수령 중 오류:`,
        claimError
      );
      // 서버에서 받은 오류 메시지가 있으면, 그대로 띄워주고 없으면 기본 메시지
      const errMsg =
        claimError instanceof Error && claimError.message
          ? claimError.message
          : '보상 수령 중 오류가 발생했습니다.';
      setModalContent(errMsg);
      setModalVisible(true);
    }
  };

  /**
   * 초(seconds)를 "HH시간 MM분 SS초" 형태의 문자열로 변환
   */
  const formatSecondsToHMS = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}시간 ${m}분 ${s}초`;
  };

  /**
   * 퀘스트 진행 상황에 따라 버튼 텍스트 및 동작을 결정
   */
  const renderActionButton = (quest: Quest) => {
    if (quest.progress < quest.goal) {
      // 목표 미달성 → "퀘스트 완료" 버튼
      return (
        <ActionButton
          onClick={() => handleCompleteQuest(quest.id)}
          $buttonType='complete'
        >
          퀘스트 완료
        </ActionButton>
      );
    } else if (quest.progress >= quest.goal && !quest.rewardClaimed) {
      // 목표 달성했으나 보상 미수령 → "보상받기" 버튼
      return (
        <ActionButton
          onClick={() => handleClaimReward(quest.id)}
          $buttonType='claim'
        >
          보상받기
        </ActionButton>
      );
    } else {
      // 보상을 이미 받은 경우 → "보상완료" 비활성화 버튼
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
            <ModalHeader>알림</ModalHeader>
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

/* ==========================
   Styled Components 정의
========================== */

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
`;

const Header = styled.div`
  text-align: center;
  padding: 0.8rem;
  background: #2e8bc0;
  border: 2px solid #246a94;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: inset 0 1px 0 #cee3f8;
  border: 2px solid #000;
  border-radius: 4px;
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

const QuestItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.8rem;
  background: #fff;
  border: 2px solid #2e8bc0;
  border-radius: 8px;
  box-shadow: 0 3px 5px rgba(46, 139, 192, 0.2);
  animation: ${slideIn} 0.3s ease-out forwards;
  border: 2px solid #000;
  border-radius: 4px;
  background: #dcdcdc;
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
  border: 2px solid #000;
  border-radius: 4px;
  border-radius: 8px;
  box-shadow: inset 0 1px 0 #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
`;

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
  border: 2px solid #000;
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
  border: 2px solid #000;

  box-shadow: inset 0 1px 0 #fff;
  display: inline-flex;
  align-items: center;
`;

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
  border: 2px solid #000;
  border-radius: 4px;
  font-size: 0.95rem;
  padding: 0.4rem 0.8rem;

  cursor: ${({ $buttonType }) =>
    $buttonType === 'complete' || $buttonType === 'claim'
      ? 'pointer'
      : 'not-allowed'};

  transition: background-color 0.2s ease;
  v &:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

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
