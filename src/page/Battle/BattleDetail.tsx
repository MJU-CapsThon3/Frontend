// src/pages/Battle/BattleDetail.tsx

import React, { useState, useEffect, useRef, PropsWithChildren } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaCommentDots,
  FaUserAlt,
  FaSignOutAlt,
  FaRandom,
  FaEdit,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// ───── API import ──────────────────────────────
import BattleChatApi, { ChatMessage } from '../../api/chat/chatApi';
import AiApi from '../../api/Ai/AiApi'; // ← AiApi import

// ───── 아이콘 임포트 ──────────────────────────────
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';

// ───── 타입 및 테스트 데이터 ──────────────────────────────
type Tier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'grandmaster'
  | 'challenger';

type Role = 'participant' | 'spectator';

export type PlayerData = {
  id: number;
  nickname: string;
  avatarUrl?: string;
  isReady?: boolean;
  team?: 'blue' | 'red';
  role: Role;
  tier: Tier;
};

const initialPlayers: PlayerData[] = [
  {
    id: 1,
    nickname: '테스트1',
    avatarUrl: '',
    isReady: true,
    role: 'participant',
    tier: 'challenger',
  },
  {
    id: 2,
    nickname: '플레이어2',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'gold',
  },
  {
    id: 3,
    nickname: '플레이어3',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'silver',
  },
  {
    id: 4,
    nickname: '플레이어4',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'platinum',
  },
  {
    id: 5,
    nickname: '플레이어5',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'bronze',
  },
  {
    id: 6,
    nickname: '플레이어6',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'diamond',
  },
  {
    id: 7,
    nickname: '플레이어7',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'master',
  },
  {
    id: 8,
    nickname: '플레이어8',
    avatarUrl: '',
    isReady: true,
    role: 'spectator',
    tier: 'grandmaster',
  },
];

const keywordPool: string[] = [
  '기린',
  '코끼리',
  '호랑이',
  '사자',
  '펭귄',
  '코알라',
  '토끼',
  '거북이',
];

// ───── 상수 정의 ──────────────────────────────
const OWNER_ID = 1;
const TOTAL_SLOTS = 8;
const BOX_SIZE = '150px';

// ───── 티어 아이콘 매핑 ──────────────────────────────
const tierIcons: { [key in Tier]: string } = {
  bronze: BronzeIcon,
  silver: SilverIcon,
  gold: GoldIcon,
  platinum: PlatinumIcon,
  diamond: DiamondIcon,
  master: MasterIcon,
  grandmaster: GrandMasterIcon,
  challenger: ChallengerIcon,
};

// ───── keyframes 정의 ──────────────────────────────
const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const scaleUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

// ───── BattleDetail 컴포넌트 ──────────────────────────────
type TargetSlot = { area: 'participant' | 'spectator'; index: number };

const BattleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  if (!roomId) {
    return <div>유효하지 않은 방 ID입니다.</div>;
  }

  const [ownerSide, setOwnerSide] = useState<'left' | 'right'>('left');
  const [ownerSpectatorSlot, setOwnerSpectatorSlot] = useState<number | null>(
    null
  );
  const [pendingMoveSlot, setPendingMoveSlot] = useState<TargetSlot | null>(
    null
  );
  const [players, setPlayers] = useState<PlayerData[]>(initialPlayers);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [subject, setSubject] = useState<string>('사자 vs 코끼리');
  const [sideAOption, setSideAOption] = useState<string>('찬성');
  const [sideBOption, setSideBOption] = useState<string>('반대');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [keywordOne, setKeywordOne] = useState<string>('');
  const [keywordTwo, setKeywordTwo] = useState<string>('');
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [kickModalVisible, setKickModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [isSpectatorsCollapsed, setIsSpectatorsCollapsed] = useState(false);

  const ownerData = players.find((p) => p.id === OWNER_ID);
  const nonOwnerParticipants = players.filter(
    (p) => p.role === 'participant' && p.id !== OWNER_ID
  );
  const nonOwnerSpectators = players.filter(
    (p) => p.role === 'spectator' && p.id !== OWNER_ID
  );

  const canStartGame =
    ownerData &&
    ownerData.role === 'participant' &&
    ownerData.isReady &&
    nonOwnerParticipants.length >= 1 &&
    nonOwnerParticipants[0].isReady;

  // ─── 수정: handleRandomSubject → AiApi.generateTopic 호출 ─────────────────────
  const handleRandomSubject = async () => {
    try {
      // API에서 topic, option_a, option_b 반환
      const res = await AiApi.generateTopic();
      const { topic, option_a, option_b } = res.result as any;
      setSubject(topic);
      setSideAOption(option_a);
      setSideBOption(option_b);
    } catch (err) {
      console.error('랜덤 토론 주제 생성 오류:', err);
      // 폴백: 키워드 풀에서 랜덤 주제 생성
      const shuffled = [...keywordPool].sort(() => 0.5 - Math.random());
      setSubject(`${shuffled[0]} vs ${shuffled[1]}`);
      setSideAOption(shuffled[0]);
      setSideBOption(shuffled[1]);
    }
  };
  // ───────────────────────────────────────────────────────────────

  const handleDirectSubject = () => {
    setModalVisible(true);
    setKeywordOne('');
    setKeywordTwo('');
  };

  const handleModalSubmit = () => {
    if (!keywordOne.trim() || !keywordTwo.trim()) {
      alert('두 개의 키워드를 모두 입력해주세요.');
      return;
    }
    setSubject(`${keywordOne.trim()} vs ${keywordTwo.trim()}`);
    setSideAOption(keywordOne.trim());
    setSideBOption(keywordTwo.trim());
    setModalVisible(false);
  };

  // ─── 채팅 내역 불러오기 ─────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await BattleChatApi.getChatMessages(roomId);
        const merged = [...res.result.sideA, ...res.result.sideB];
        merged.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setChatMessages(merged);
      } catch (err) {
        console.error('채팅 내역 조회 오류:', err);
      }
    })();
  }, [roomId]);

  // ─── 채팅 전송 ─────────────────────────────
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const side = ownerSide === 'left' ? 'A' : 'B';
    try {
      const payload = { side, message: chatInput.trim() };
      const res = await BattleChatApi.postChatMessage(roomId, payload);
      setChatMessages((prev) => [...prev, res.result]);
      setChatInput('');
    } catch (err) {
      console.error('채팅 메시지 전송 오류:', err);
    }
  };

  // ─── 채팅 스크롤 자동 최하단 유지 ─────────────────────
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleExit = () => navigate(-1);

  const handleStartGame = () => {
    if (canStartGame) setStartModalVisible(true);
    else setWarningModalVisible(true);
  };

  const handleReadyToggle = () => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === OWNER_ID ? { ...p, isReady: !p.isReady } : p))
    );
  };

  const handleKickPlayer = () => {
    if (selectedPlayer) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedPlayer.id));
      setKickModalVisible(false);
      setSelectedPlayer(null);
    }
  };

  const handleConfirmMove = () => {
    if (!pendingMoveSlot || !ownerData) return;
    const { area, index } = pendingMoveSlot;
    if (area === 'spectator') {
      if (ownerData.role === 'participant') {
        setPlayers((prev) =>
          prev.map((p) => (p.id === OWNER_ID ? { ...p, role: 'spectator' } : p))
        );
      }
      setOwnerSpectatorSlot(index);
    } else {
      if (ownerData.role === 'spectator') {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === OWNER_ID ? { ...p, role: 'participant' } : p
          )
        );
      }
      setOwnerSide(index === 0 ? 'left' : 'right');
    }
    setPendingMoveSlot(null);
  };

  const handleCancelMove = () => {
    setPendingMoveSlot(null);
  };

  // ─── PlayerCard 컴포넌트 ─────────────────────
  const PlayerCard: React.FC<{
    player: PlayerData;
    isOwner?: boolean;
    isSpectator?: boolean;
  }> = ({ player, isOwner = false, isSpectator = false }) => {
    const bgColor =
      player.team === 'blue'
        ? '#33bfff'
        : player.team === 'red'
          ? '#ff6b6b'
          : '#fff';
    return (
      <StyledPlayerCard $bgColor={bgColor}>
        <Nickname>
          {player.nickname} {isOwner && '(나)'}
        </Nickname>
        <TierIcon src={tierIcons[player.tier]} alt={player.tier} />
        {player.avatarUrl && player.avatarUrl.trim() !== '' ? (
          isSpectator ? (
            <SpectatorImage src={player.avatarUrl} alt='avatar' />
          ) : (
            <PlayerImage src={player.avatarUrl} alt='avatar' />
          )
        ) : (
          <DefaultAvatar>
            <FaUserAlt style={{ fontSize: '2rem', color: '#888' }} />
          </DefaultAvatar>
        )}
        <RankArea>
          {isOwner ? (
            <OwnerBadge>방 장</OwnerBadge>
          ) : (
            player.isReady && <ReadyBadge>준 비</ReadyBadge>
          )}
        </RankArea>
      </StyledPlayerCard>
    );
  };

  // ─── 왼쪽 슬롯 렌더링 ─────────────────────
  const renderLeftSlot = () => (
    <CenteredDiv>
      <ParticipantKeyword>{sideAOption}</ParticipantKeyword>
      {ownerData &&
      ownerData.id === OWNER_ID &&
      ownerData.role === 'participant' &&
      ownerSide === 'left' ? (
        <PlayerCard player={ownerData} isOwner />
      ) : nonOwnerParticipants.length > 0 && ownerSide !== 'left' ? (
        <PlayerCard player={nonOwnerParticipants[0]} />
      ) : (
        <CommonCard
          onClick={() => setPendingMoveSlot({ area: 'participant', index: 0 })}
        >
          <EmptySlotText>플레이어 대기중</EmptySlotText>
        </CommonCard>
      )}
    </CenteredDiv>
  );

  // ─── 오른쪽 슬롯 렌더링 ─────────────────────
  const renderRightSlot = () => (
    <CenteredDiv>
      <ParticipantKeyword>{sideBOption}</ParticipantKeyword>
      {ownerData &&
      ownerData.id === OWNER_ID &&
      ownerData.role === 'participant' &&
      ownerSide === 'right' ? (
        <PlayerCard player={ownerData} isOwner />
      ) : nonOwnerParticipants.length > 0 && ownerSide !== 'right' ? (
        <PlayerCard player={nonOwnerParticipants[0]} />
      ) : (
        <CommonCard
          onClick={() => setPendingMoveSlot({ area: 'participant', index: 1 })}
        >
          <EmptySlotText>플레이어 대기중</EmptySlotText>
        </CommonCard>
      )}
    </CenteredDiv>
  );

  // ─── 관전자 그리드 렌더링 ─────────────────────
  const renderSpectatorGrid = () => {
    const cells = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      let occupant: PlayerData | null = null;
      if (
        ownerData &&
        ownerData.role === 'spectator' &&
        ownerSpectatorSlot === i
      ) {
        occupant = ownerData;
      } else if (i < nonOwnerSpectators.length) {
        occupant = nonOwnerSpectators[i];
      }

      cells.push(
        <SpectatorSlotContainer
          key={`spectator-slot-${i}`}
          $occupied={!!occupant}
          onClick={
            occupant
              ? undefined
              : () => setPendingMoveSlot({ area: 'spectator', index: i })
          }
        >
          {occupant ? (
            occupant.id === OWNER_ID ? (
              <PlayerCard player={occupant} isOwner isSpectator />
            ) : (
              <PlayerCard player={occupant} isSpectator />
            )
          ) : (
            <EmptyBox />
          )}
        </SpectatorSlotContainer>
      );
    }
    return cells;
  };

  // ─── 채팅 버블 ─────────────────────
  const ChatBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
    const isOwnerMsg = Number(msg.userId) === OWNER_ID;
    const isNotice = msg.message.startsWith('[공지]');
    return (
      <ChatBubbleContainer isOwnerMsg={isOwnerMsg} isNotice={isNotice}>
        <ChatBubbleText isNotice={isNotice}>
          {isNotice
            ? msg.message
            : `[${msg.side}] 유저${msg.userId}: ${msg.message}`}
        </ChatBubbleText>
      </ChatBubbleContainer>
    );
  };

  interface ModalComponentProps {
    title: string;
  }

  const ModalComponent = ({
    title,
    children,
  }: PropsWithChildren<ModalComponentProps>) => (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        {children}
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <Container>
      {/* Header */}
      <Header>
        <ExitButton onClick={handleExit}>
          <FaSignOutAlt style={{ marginRight: '0.3rem' }} />
          나가기
        </ExitButton>
        <Title>{subject}</Title>
      </Header>

      <TopSection>
        <ParticipantContainer>{renderLeftSlot()}</ParticipantContainer>
        <ChatSection>
          <ChatMessages ref={chatContainerRef}>
            {chatMessages
              .filter((m): m is ChatMessage => m !== null)
              .map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
          </ChatMessages>
          <ChatForm onSubmit={handleChatSubmit}>
            <FaCommentDots
              style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}
            />
            <ChatInput
              type='text'
              placeholder='메시지 입력...'
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
          </ChatForm>
        </ChatSection>
        <ParticipantContainer>{renderRightSlot()}</ParticipantContainer>
      </TopSection>

      <SpectatorsSection>
        <SpectatorsHeader>
          <LeftButtonGroup>
            <SubjectButton onClick={handleRandomSubject}>
              <FaRandom style={{ marginRight: '0.3rem' }} />
              랜덤 주제생성
            </SubjectButton>
            <SubjectButton onClick={handleDirectSubject}>
              <FaEdit style={{ marginRight: '0.3rem' }} />
              직접 주제 생성
            </SubjectButton>
          </LeftButtonGroup>

          <RightButtonGroup>
            <ToggleButton
              onClick={() => setIsSpectatorsCollapsed((prev) => !prev)}
            >
              {isSpectatorsCollapsed ? '관전자 보기' : '관전자 숨김'}
            </ToggleButton>
            {ownerData && ownerData.id === OWNER_ID ? (
              <StartButton onClick={handleStartGame}>시작</StartButton>
            ) : (
              <StartButton onClick={handleReadyToggle}>준비</StartButton>
            )}
          </RightButtonGroup>
        </SpectatorsHeader>

        {!isSpectatorsCollapsed && (
          <SpectatorsGrid>{renderSpectatorGrid()}</SpectatorsGrid>
        )}
      </SpectatorsSection>

      {pendingMoveSlot !== null && (
        <ModalComponent title='이동 확인'>
          <ModalText>해당 슬롯으로 이동하시겠습니까?</ModalText>
          <ModalButtons>
            <ModalSubmitButton onClick={handleConfirmMove}>
              네
            </ModalSubmitButton>
            <ModalCancelButton onClick={handleCancelMove}>
              아니요
            </ModalCancelButton>
          </ModalButtons>
        </ModalComponent>
      )}

      {modalVisible && (
        <ModalComponent title='직접 주제 생성하기'>
          <ModalInput
            type='text'
            placeholder='첫번째 키워드'
            value={keywordOne}
            onChange={(e) => setKeywordOne(e.target.value)}
          />
          <ModalInput
            type='text'
            placeholder='두번째 키워드'
            value={keywordTwo}
            onChange={(e) => setKeywordTwo(e.target.value)}
          />
          <ModalButtons>
            <ModalSubmitButton onClick={handleModalSubmit}>
              생성
            </ModalSubmitButton>
            <ModalCancelButton onClick={() => setModalVisible(false)}>
              취소
            </ModalCancelButton>
          </ModalButtons>
        </ModalComponent>
      )}

      {startModalVisible && (
        <ModalComponent title='게임 시작 확인'>
          <ModalText>
            모든 플레이어가 준비되었습니다.
            <br />
            게임을 시작하시겠습니까?
          </ModalText>
          <ModalButtons>
            <ModalSubmitButton
              onClick={() => {
                setStartModalVisible(false);
                alert('게임 시작!');
              }}
            >
              네
            </ModalSubmitButton>
            <ModalCancelButton onClick={() => setStartModalVisible(false)}>
              아니요
            </ModalCancelButton>
          </ModalButtons>
        </ModalComponent>
      )}

      {warningModalVisible && (
        <ModalComponent title='경고'>
          <ModalText>
            참가자 2명이 모두 있고 준비 완료된 상태여야 게임을 시작할 수
            있습니다.
          </ModalText>
          <ModalButtons>
            <ModalSubmitButton onClick={() => setWarningModalVisible(false)}>
              확인
            </ModalSubmitButton>
          </ModalButtons>
        </ModalComponent>
      )}

      {kickModalVisible && selectedPlayer && (
        <ModalComponent title='플레이어 강퇴 확인'>
          <ModalText>
            {selectedPlayer.nickname} 플레이어를 강퇴하시겠습니까?
          </ModalText>
          <ModalButtons>
            <ModalSubmitButton onClick={handleKickPlayer}>네</ModalSubmitButton>
            <ModalCancelButton
              onClick={() => {
                setKickModalVisible(false);
                setSelectedPlayer(null);
              }}
            >
              아니요
            </ModalCancelButton>
          </ModalButtons>
        </ModalComponent>
      )}
    </Container>
  );
};

export default BattleDetail;

/* ==========================
   Styled Components 정의
========================== */

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  border: 5px solid #000;
  border-radius: 8px;
  background-color: #3aa7f0;
  font-family: 'Malgun Gothic', 'Arial', sans-serif;
  overflow: hidden;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2e8bc0;
  color: #fff;
  padding: 0.6rem 1rem;
  border-bottom: 2px solid #000;
`;

const Title = styled.div`
  flex: 1;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 1px 1px #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 1rem;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

const ParticipantContainer = styled.div`
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SideLabel = styled.div`
  font-weight: bold;
  font-size: 1rem;
  color: #000;
  margin-bottom: 0.5rem;
`;

const CenteredDiv = styled.div`
  text-align: center;
`;

const ParticipantKeyword = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  background-color: #fff;
`;

const ChatSection = styled.div`
  flex: 2 1 600px;
  display: flex;
  flex-direction: column;
  border: 2px solid #000;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: inset 0 1px 0 #cee3f8;
`;

const ChatMessages = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  background-color: #ddd;
  border-radius: 6px 6px 0 0;
`;

const ChatForm = styled.form`
  display: flex;
  align-items: center;
  border-top: 1px solid #000;
  padding: 0.5rem;
  background-color: #fff;
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 0.3rem;
  outline: none;
`;

const SpectatorsSection = styled.div`
  border-top: 2px solid #000;
  padding: 1rem;
  background-color: #cce6f4;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpectatorsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.5rem;
`;

const LeftButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RightButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ToggleButton = styled.button`
  background-color: #0057a8;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #004080;
  }
`;

const StartButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const SpectatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  width: calc(4 * ${BOX_SIZE} + 3 * 10px);
  margin-top: 1rem;
`;

const SpectatorSlotContainer = styled.div<{ $occupied: boolean }>`
  width: ${BOX_SIZE};
  height: ${BOX_SIZE};
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$occupied ? 'default' : 'pointer')};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: ${(props) => (props.$occupied ? 'none' : 'scale(1.03)')};
  }
`;

const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
`;

const CommonCard = styled.div`
  width: ${BOX_SIZE};
  height: ${BOX_SIZE};
  background-color: #fff;
  position: relative;
  border: 2px solid #000;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StyledPlayerCard = styled(CommonCard)<{ $bgColor: string }>`
  background-color: ${(props) => props.$bgColor};
`;

const PlayerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  border-radius: 4px;
`;

const Nickname = styled.div`
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-bottom-right-radius: 6px;
  z-index: 2;
`;

const TierIcon = styled.img`
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 32px;
  height: 32px;
  z-index: 3;
  border: 2px solid #000;
  border-radius: 6px;
`;

const RankArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid #000;
`;

const OwnerBadge = styled.div`
  background-color: #4caf50;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  width: 100%;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const ReadyBadge = styled.div`
  background-color: #ff9800;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  width: 100%;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const SpectatorImage = styled.img`
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ChatBubbleContainer = styled.div<{
  isOwnerMsg: boolean;
  isNotice: boolean;
}>`
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 16px;
  margin: 4px 0;
  background-color: ${(props) =>
    props.isNotice ? '#ffe6e6' : props.isOwnerMsg ? '#dcf8c6' : '#fff'};
  align-self: ${(props) => (props.isOwnerMsg ? 'flex-end' : 'flex-start')};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  word-break: break-word;
`;

const ChatBubbleText = styled.p<{ isNotice: boolean }>`
  font-size: 0.9rem;
  color: ${(props) => (props.isNotice ? 'red' : '#000')};
  margin: 0;
`;

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
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

const ModalTitle = styled.h3`
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #000;
  font-size: 1.1rem;
  color: #333;
`;

const ModalText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.4;
  text-align: center;
`;

const ModalInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const EmptySlotText = styled.div`
  color: #aaa;
  text-align: center;
  line-height: ${BOX_SIZE};
  font-size: 0.9rem;
`;

const ExitButton = styled.button`
  background-color: #fff;
  color: #333;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const SubjectButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ModalSubmitButton = styled.button`
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

const ModalCancelButton = styled.button`
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
