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

import {
  BattleRoomApi,
  RoomDetailFull,
  ChangeRoleRequest,
  GenerateAITopicsResponse,
} from '../../api/battle/battleRoomApi';

// ───── 아이콘 임포트 ──────────────────────────────
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';

// ───── 타입 정의 ──────────────────────────────
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

// ───── 상수 정의 ──────────────────────────────
const OWNER_ID = 1; // 예시용: 현재 로그인된 사용자 ID
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

  // ─── 상태 정의 ───────────────────────────────────
  const [ownerSide, setOwnerSide] = useState<'left' | 'right'>('left');
  const [ownerSpectatorSlot, setOwnerSpectatorSlot] = useState<number | null>(
    null
  );
  const [pendingMoveSlot, setPendingMoveSlot] = useState<TargetSlot | null>(
    null
  );
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]); // ChatMessage 대신 any 사용
  const [subject, setSubject] = useState<string>('사자 vs 코끼리');
  const [isBattleStarted, setIsBattleStarted] = useState(false);

  const splitInitial = subject.split(/vs/i).map((s) => s.trim());
  const [sideAOption, setSideAOption] = useState<string>(
    splitInitial.length === 2 ? splitInitial[0] : ''
  );
  const [sideBOption, setSideBOption] = useState<string>(
    splitInitial.length === 2 ? splitInitial[1] : ''
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [kickModalVisible, setKickModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [isSpectatorsCollapsed, setIsSpectatorsCollapsed] = useState(false);

  // roomId가 없으면 렌더링 중단
  if (!roomId) {
    return <div>유효하지 않은 방 ID입니다.</div>;
  }

  // 현재 소유자 정보
  const ownerData = players.find((p) => p.id === OWNER_ID);
  const nonOwnerParticipants = players.filter(
    (p) => p.role === 'participant' && p.id !== OWNER_ID
  );
  const nonOwnerSpectators = players.filter(
    (p) => p.role === 'spectator' && p.id !== OWNER_ID
  );

  // ─── A/B/P 팀 정보 API 호출 ─────────────────────
  const fetchRoomDetail = async () => {
    try {
      const data: RoomDetailFull = await BattleRoomApi.getRoomDetailFull(
        parseInt(roomId, 10)
      );

      // API에서 받아온 participantA, participantB, spectators를 PlayerData로 변환
      const fetchedPlayers: PlayerData[] = [];

      // A팀 (팀 색상 blue)
      data.participantA.forEach((u) => {
        fetchedPlayers.push({
          id: Number(u.userId),
          nickname: `유저${u.userId}`,
          avatarUrl: '',
          isReady: true,
          team: 'blue',
          role: 'participant',
          tier: 'silver',
        });
        if (Number(u.userId) === OWNER_ID) {
          setOwnerSide('left');
          setOwnerSpectatorSlot(null);
        }
      });

      // B팀 (팀 색상 red)
      data.participantB.forEach((u) => {
        fetchedPlayers.push({
          id: Number(u.userId),
          nickname: `유저${u.userId}`,
          avatarUrl: '',
          isReady: true,
          team: 'red',
          role: 'participant',
          tier: 'silver',
        });
        if (Number(u.userId) === OWNER_ID) {
          setOwnerSide('right');
          setOwnerSpectatorSlot(null);
        }
      });

      // 관전자
      data.spectators.forEach((u, idx) => {
        fetchedPlayers.push({
          id: Number(u.userId),
          nickname: `유저${u.userId}`,
          avatarUrl: '',
          role: 'spectator',
          tier: 'silver',
        });
        if (Number(u.userId) === OWNER_ID) {
          setOwnerSpectatorSlot(idx);
        }
      });

      setPlayers(fetchedPlayers);
    } catch (err) {
      console.error('배틀방 상세 조회 오류:', err);
    }
  };

  useEffect(() => {
    fetchRoomDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // ─── 채팅 내역 불러오기 ─────────────────────
  // Chat 기능은 유지하되, ChatApi는 제거했으므로 빈 배열 유지
  useEffect(() => {
    setChatMessages([]); // 초기화만 해둠
  }, [roomId]);

  // ─── 채팅 전송 ─────────────────────────────
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    // 채팅 API 호출 대신 console.log 처리
    console.log('채팅 전송:', chatInput.trim());
    setChatMessages((prev) => [
      ...prev,
      {
        side: ownerSide === 'left' ? 'A' : 'B',
        userId: OWNER_ID.toString(),
        message: chatInput.trim(),
      },
    ]);
    setChatInput('');
  };

  // ─── 채팅 스크롤 자동 최하단 유지 ─────────────────────
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ─── “방 나가기” 버튼에 leaveRoom API 연결 ─────────────────────
  const handleExit = async () => {
    try {
      await BattleRoomApi.leaveRoom(parseInt(roomId, 10));
      navigate(-1);
    } catch (err) {
      console.error('방 떠나기 오류:', err);
      alert('방 나가는 중 오류가 발생했습니다.');
    }
  };

  // ─── “시작/종료” 버튼 클릭 시 배틀 시작 or 종료 API 호출 ─────────────────────
  const handleToggleBattle = async () => {
    if (!isBattleStarted) {
      // 배틀 시작
      try {
        await BattleRoomApi.startBattle(parseInt(roomId, 10));
        setIsBattleStarted(true);
        alert('배틀이 시작되었습니다!');
      } catch (err) {
        console.error('배틀 시작 오류:', err);
        alert('배틀 시작 중 오류가 발생했습니다.');
      }
    } else {
      // 배틀 종료
      try {
        await BattleRoomApi.endBattle(parseInt(roomId, 10));
        setIsBattleStarted(false);
        alert('배틀이 종료되었습니다!');
      } catch (err) {
        console.error('배틀 종료 오류:', err);
        alert('배틀 종료 중 오류가 발생했습니다.');
      }
    }
  };

  const handleKickPlayer = () => {
    if (selectedPlayer) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedPlayer.id));
      setKickModalVisible(false);
      setSelectedPlayer(null);
    }
  };

  // ─── 역할 변경 “예” 눌렀을 때 API 호출 및 상태 업데이트 ─────────────────────
  const handleConfirmMove = async () => {
    if (!pendingMoveSlot || !ownerData) return;

    const { area, index } = pendingMoveSlot;
    let newRoleValue: ChangeRoleRequest['role'];
    if (area === 'spectator') {
      newRoleValue = 'P';
    } else {
      newRoleValue = index === 0 ? 'A' : 'B';
    }

    try {
      await BattleRoomApi.changeRole(parseInt(roomId, 10), {
        role: newRoleValue,
      });

      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id !== OWNER_ID) return p;
          if (area === 'spectator') {
            return {
              ...p,
              role: 'spectator',
              team: undefined,
              isReady: undefined,
            };
          } else {
            return {
              ...p,
              role: 'participant',
              team: index === 0 ? 'blue' : 'red',
              isReady: true,
            };
          }
        })
      );

      if (area === 'spectator') {
        setOwnerSpectatorSlot(index);
        setOwnerSide('left');
      } else {
        setOwnerSpectatorSlot(null);
        setOwnerSide(index === 0 ? 'left' : 'right');
      }
    } catch (err) {
      console.error('역할 변경 오류:', err);
      alert('역할 변경 중 오류가 발생했습니다.');
    } finally {
      setPendingMoveSlot(null);
    }
  };

  const handleCancelMove = () => {
    setPendingMoveSlot(null);
  };

  // ─── 랜덤 토론 주제 생성 (AI 주제 생성 API 호출) ─────────────────────
  const handleRandomSubject = async () => {
    try {
      const res: GenerateAITopicsResponse['result'] =
        await BattleRoomApi.generateAITopics(parseInt(roomId, 10));
      if (res) {
        setSubject(`${res.topicA} vs ${res.topicB}`);
        setSideAOption(res.topicA);
        setSideBOption(res.topicB);
      }
    } catch (err) {
      console.error('랜덤 토론 주제 생성 오류:', err);
      // API 실패 시 예시 키워드 풀로 대체
      const keywordPool = [
        '기린',
        '코끼리',
        '호랑이',
        '사자',
        '펭귄',
        '코알라',
        '토끼',
        '거북이',
      ];
      const shuffled = [...keywordPool].sort(() => 0.5 - Math.random());
      setSubject(`${shuffled[0]} vs ${shuffled[1]}`);
      setSideAOption(shuffled[0]);
      setSideBOption(shuffled[1]);
    }
  };

  // ─── 직접 주제 생성 ─────────────────────
  const handleDirectSubject = () => {
    setSubjectInput('');
    setModalVisible(true);
  };

  const handleModalSubmit = () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) {
      alert('주제를 입력해주세요. 예시: 사자 vs 코끼리');
      return;
    }
    const parts = trimmed.split(/vs/i);
    if (parts.length !== 2) {
      alert('“주제A vs 주제B” 형식으로 입력해주세요.');
      return;
    }
    const a = parts[0].trim();
    const b = parts[1].trim();
    if (!a || !b) {
      alert('“vs” 양쪽에 반드시 텍스트가 있어야 합니다.');
      return;
    }
    setSubject(`${a} vs ${b}`);
    setSideAOption(a);
    setSideBOption(b);
    setModalVisible(false);
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
          ) : player.isReady ? (
            <ReadyBadge>준비완료</ReadyBadge>
          ) : null}
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
          onClick={() => {
            setPendingMoveSlot({ area: 'participant', index: 0 });
          }}
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
      ) : nonOwnerParticipants.length > 1 && ownerSide !== 'right' ? (
        <PlayerCard player={nonOwnerParticipants[1]} />
      ) : (
        <CommonCard
          onClick={() => {
            setPendingMoveSlot({ area: 'participant', index: 1 });
          }}
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
          onClick={() => {
            if (!occupant) {
              setPendingMoveSlot({ area: 'spectator', index: i });
            }
          }}
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
  const ChatBubble: React.FC<{ msg: any }> = ({ msg }) => {
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
            {chatMessages.map((msg, idx) => (
              <ChatBubble key={idx} msg={msg} />
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
            <StartButton onClick={handleToggleBattle}>
              {isBattleStarted ? '종료' : '시작'}
            </StartButton>
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
        <ModalComponent title='주제 입력 (예: 사자 vs 코끼리)'>
          <ModalInput
            type='text'
            placeholder='주제를 입력하세요. 예: 사자 vs 코끼리'
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
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
