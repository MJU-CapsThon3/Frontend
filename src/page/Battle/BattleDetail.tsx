import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// ───── API import ──────────────────────────────
import BattleChatApi, { ChatMessage } from '../../api/chat/chatApi';
import AiApi from '../../api/Ai/AiApi';
import { BattleRoomApi, RoomDetailFull } from '../../api/battle/battleRoomApi';

// ───── 컴포넌트 import ──────────────────────────
import PlayerCard from '../../components/BattleDetail/PlayerCard';
import ChatSection from '../../components/BattleDetail/ChatSection';
import SpectatorGrid from '../../components/BattleDetail/SpectatorGrid';
import MoveConfirmModal from '../../components/BattleDetail/MoveConfirmModal';
import SubjectModal from '../../components/BattleDetail/SubjectModal';
import {
  StartModal,
  WarningModal,
  KickModal,
} from '../../components/BattleDetail/StartWarningModals';

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
export const tierIcons: { [key in Tier]: string } = {
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [subject, setSubject] = useState<string>('사자 vs 코끼리');

  const splitInitial = subject.split(/vs/i).map((s) => s.trim());
  const [sideAOption, setSideAOption] = useState<string>(
    splitInitial.length === 2 ? splitInitial[0] : ''
  );
  const [sideBOption, setSideBOption] = useState<string>(
    splitInitial.length === 2 ? splitInitial[1] : ''
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [subjectInput, setSubjectInput] = useState<string>('');
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
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

  const canStartGame =
    ownerData &&
    ownerData.role === 'participant' &&
    ownerData.isReady &&
    nonOwnerParticipants.length >= 1 &&
    nonOwnerParticipants[0].isReady;

  // ─── A/B/P 팀 정보 API 호출 ─────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data: RoomDetailFull =
          await BattleRoomApi.getRoomDetailFull(roomId);

        const fetchedPlayers: PlayerData[] = [];

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
          }
        });

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
          }
        });

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
    })();
  }, [roomId]);

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
      prev.map((p) =>
        p.id === OWNER_ID ? { ...p, isReady: !p.isReady, team: p.team } : p
      )
    );
  };

  const handleKickPlayer = () => {
    if (selectedPlayer) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedPlayer.id));
      setKickModalVisible(false);
      setSelectedPlayer(null);
    }
  };

  const handleConfirmMove = async () => {
    if (!pendingMoveSlot || !ownerData) return;
    const { area, index } = pendingMoveSlot;

    // 역할 변경 API 호출
    try {
      // area가 spectator면 관전자로, participant면 참여자로 변경
      const newRole = area === 'spectator' ? 'P' : 'A';
      await BattleRoomApi.changeRole(roomId, { role: newRole });
    } catch (err) {
      console.error('역할 변경 API 호출 오류:', err);
    }

    // 클라이언트 로컬 상태 반영
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

  // ─── 랜덤 토론 주제 생성 ─────────────────────
  const handleRandomSubject = async () => {
    try {
      const res = await AiApi.generateTopic();
      const { topic, option_a, option_b } = (res as any).result;
      setSubject(topic);
      setSideAOption(option_a);
      setSideBOption(option_b);
    } catch (err) {
      console.error('랜덤 토론 주제 생성 오류:', err);
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
      ) : nonOwnerParticipants.length > 1 && ownerSide !== 'right' ? (
        <PlayerCard player={nonOwnerParticipants[1]} />
      ) : (
        <CommonCard
          onClick={() => setPendingMoveSlot({ area: 'participant', index: 1 })}
        >
          <EmptySlotText>플레이어 대기중</EmptySlotText>
        </CommonCard>
      )}
    </CenteredDiv>
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

        <ChatSection
          chatContainerRef={chatContainerRef}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSubmit={handleChatSubmit}
        />

        <ParticipantContainer>{renderRightSlot()}</ParticipantContainer>
      </TopSection>

      <SpectatorsSection>
        <SpectatorsHeader>
          <LeftButtonGroup>
            <SubjectButton onClick={handleRandomSubject}>
              랜덤 주제생성
            </SubjectButton>
            <SubjectButton onClick={handleDirectSubject}>
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
          <SpectatorGrid
            players={players}
            ownerId={OWNER_ID}
            ownerSide={ownerSide}
            ownerSpectatorSlot={ownerSpectatorSlot}
            nonOwnerSpectators={nonOwnerSpectators}
            setPendingMoveSlot={setPendingMoveSlot}
            BOX_SIZE={BOX_SIZE}
            TOTAL_SLOTS={TOTAL_SLOTS}
          />
        )}
      </SpectatorsSection>

      {pendingMoveSlot !== null && (
        <MoveConfirmModal
          onConfirm={handleConfirmMove}
          onCancel={handleCancelMove}
        />
      )}

      {modalVisible && (
        <SubjectModal
          subjectInput={subjectInput}
          setSubjectInput={setSubjectInput}
          onSubmit={handleModalSubmit}
          onClose={() => setModalVisible(false)}
        />
      )}

      {startModalVisible && (
        <StartModal onClose={() => setStartModalVisible(false)} />
      )}

      {warningModalVisible && (
        <WarningModal onClose={() => setWarningModalVisible(false)} />
      )}

      {kickModalVisible && selectedPlayer && (
        <KickModal
          player={selectedPlayer}
          onKick={handleKickPlayer}
          onCancel={() => {
            setKickModalVisible(false);
            setSelectedPlayer(null);
          }}
        />
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
