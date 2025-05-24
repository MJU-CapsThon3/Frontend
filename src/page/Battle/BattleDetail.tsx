import React, { useState, useEffect, useRef, PropsWithChildren } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaCommentDots,
  FaUserAlt,
  FaSignOutAlt,
  FaRandom,
  FaEdit,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [ownerSide, setOwnerSide] = useState<'left' | 'right'>('left');
  const [ownerSpectatorSlot, setOwnerSpectatorSlot] = useState<number | null>(
    null
  );
  const [pendingMoveSlot, setPendingMoveSlot] = useState<TargetSlot | null>(
    null
  );
  const [players, setPlayers] = useState<PlayerData[]>(initialPlayers);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([
    '[공지] 환영합니다',
  ]);
  const [subject, setSubject] = useState<string>('사자 vs 코끼리');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [keywordOne, setKeywordOne] = useState<string>('');
  const [keywordTwo, setKeywordTwo] = useState<string>('');
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [kickModalVisible, setKickModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);

  const [leftKeyword, rightKeyword] = subject.split(' vs ');

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

  const getRandomKeywords = (): [string, string] => {
    const shuffled = [...keywordPool].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  };

  const handleRandomSubject = () => {
    const [first, second] = getRandomKeywords();
    const newSubject = `${first} vs ${second}`;
    setSubject(newSubject);
    setChatMessages((prev) => [...prev, `[타이틀 변경] ${newSubject}`]);
  };

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
    const newSubject = `${keywordOne.trim()} vs ${keywordTwo.trim()}`;
    setSubject(newSubject);
    setModalVisible(false);
    setChatMessages((prev) => [...prev, `[타이틀 변경] ${newSubject}`]);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, `유저${OWNER_ID}: ${chatInput}`]);
    setChatInput('');
  };

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
    } else if (area === 'participant') {
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
      <StyledPlayerCard bgColor={bgColor}>
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

  const renderLeftSlot = () => {
    return (
      <CenteredDiv>
        <ParticipantKeyword>{leftKeyword}</ParticipantKeyword>
        {ownerData &&
        ownerData.id === OWNER_ID &&
        ownerData.role === 'participant' &&
        ownerSide === 'left' ? (
          <PlayerCard player={ownerData} isOwner />
        ) : (
          <CommonCard
            onClick={() =>
              setPendingMoveSlot({ area: 'participant', index: 0 })
            }
          >
            <EmptySlotText>플레이어 대기중</EmptySlotText>
          </CommonCard>
        )}
      </CenteredDiv>
    );
  };

  const renderRightSlot = () => {
    return (
      <CenteredDiv>
        <ParticipantKeyword>{rightKeyword}</ParticipantKeyword>
        {ownerData &&
        ownerData.id === OWNER_ID &&
        ownerData.role === 'participant' &&
        ownerSide === 'right' ? (
          <PlayerCard player={ownerData} isOwner />
        ) : nonOwnerParticipants[0] ? (
          <PlayerCard player={nonOwnerParticipants[0]} />
        ) : (
          <CommonCard
            onClick={() =>
              setPendingMoveSlot({ area: 'participant', index: 1 })
            }
          >
            <EmptySlotText>플레이어 대기중</EmptySlotText>
          </CommonCard>
        )}
      </CenteredDiv>
    );
  };

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
          occupied={!!occupant}
          onClick={
            !occupant
              ? () => setPendingMoveSlot({ area: 'spectator', index: i })
              : undefined
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

  const ChatBubble: React.FC<{ msg: string }> = ({ msg }) => {
    const isOwnerMsg = msg.startsWith(`유저${OWNER_ID}:`);
    const isNotice = msg.startsWith('[공지]');
    return (
      <ChatBubbleContainer isOwnerMsg={isOwnerMsg} isNotice={isNotice}>
        <ChatBubbleText isNotice={isNotice}>{msg}</ChatBubbleText>
      </ChatBubbleContainer>
    );
  };

  interface ModalComponentProps {
    title: string;
  }

  const ModalComponent = ({
    title,
    children,
  }: PropsWithChildren<ModalComponentProps>) => {
    return (
      <ModalOverlay>
        <ModalContent>
          <h3 style={{ marginBottom: '0.3rem' }}>{title}</h3>
          <>{children}</>
        </ModalContent>
      </ModalOverlay>
    );
  };

  return (
    <Container>
      <Header>
        <ExitButton onClick={handleExit}>
          <FaSignOutAlt style={{ marginRight: '0.3rem' }} />
          나가기
        </ExitButton>
        <Title>{subject}</Title>
        <HeaderButtons>
          <SubjectButton onClick={handleRandomSubject}>
            <FaRandom style={{ marginRight: '0.3rem' }} />
            랜덤 주제생성기
          </SubjectButton>
          <SubjectButton onClick={handleDirectSubject}>
            <FaEdit style={{ marginRight: '0.3rem' }} />
            직접 주제 생성하기
          </SubjectButton>
        </HeaderButtons>
        {ownerData && ownerData.id === OWNER_ID ? (
          <StartButton onClick={handleStartGame}>시작</StartButton>
        ) : (
          <StartButton onClick={handleReadyToggle}>준비</StartButton>
        )}
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
        <SpectatorsGrid>{renderSpectatorGrid()}</SpectatorsGrid>
      </SpectatorsSection>

      {pendingMoveSlot !== null && (
        <ModalComponent title='이동 확인'>
          <p>해당 슬롯으로 이동하시겠습니까?</p>
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
          <p>
            모든 플레이어가 준비되었습니다.
            <br />
            게임을 시작하시겠습니까?
          </p>
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
          <p>
            참가자 2명이 모두 있고 준비 완료된 상태여야 게임을 시작할 수
            있습니다.
          </p>
          <ModalButtons>
            <ModalSubmitButton onClick={() => setWarningModalVisible(false)}>
              확인
            </ModalSubmitButton>
          </ModalButtons>
        </ModalComponent>
      )}

      {kickModalVisible && selectedPlayer && (
        <ModalComponent title='플레이어 강퇴 확인'>
          <p>{selectedPlayer.nickname} 플레이어를 강퇴하시겠습니까?</p>
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

// ───── styled-components 정의 ──────────────────────────────

// Container (기본 박스)
const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  border: 2px solid #48b0ff;
  border-radius: 10px;
  background-color: #cde7ff;
  font-family: sans-serif;
  overflow: hidden;
  position: relative;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
`;

// Header 영역
const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3b83c0;
  color: #fff;
  padding: 0.5rem 1rem;
`;

// Header 내부 타이틀
const Title = styled.div`
  flex: 1;
  font-size: 1.3rem;
  font-weight: bold;
  text-shadow: 1px 1px #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 1rem;
`;

// Header 버튼 컨테이너
const HeaderButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

// Top 섹션
const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

// 참가자 컨테이너
const ParticipantContainer = styled.div`
  flex: 1 1 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 중앙 정렬 div (예, 플레이어 슬롯)
const CenteredDiv = styled.div`
  text-align: center;
`;

// 참가자 키워드 (왼쪽/오른쪽)
const ParticipantKeyword = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

// 채팅 영역
const ChatSection = styled.div`
  flex: 2 1 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
`;

// 채팅 메시지 컨테이너
const ChatMessages = styled.div`
  height: 400px;
  overflow-y: scroll;
  padding: 0.5rem;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  border-radius: 10px;
`;

// 채팅 폼
const ChatForm = styled.form`
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  padding: 0.5rem;
`;

// 채팅 인풋
const ChatInput = styled.input`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.3rem;
  outline: none;
`;

// 관전자 영역
const SpectatorsSection = styled.div`
  border-top: 2px solid #48b0ff;
  padding: 1rem;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 관전자 그리드 (8칸 배치)
const SpectatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  width: calc(4 * ${BOX_SIZE} + 3 * 10px);
`;

// 관전자 슬롯 (동적으로 커서 변경)
const SpectatorSlotContainer = styled.div<{ occupied: boolean }>`
  width: ${BOX_SIZE};
  height: ${BOX_SIZE};
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.occupied ? 'default' : 'pointer')};
`;

// 빈 박스 (관전자 슬롯 내)
const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

// CommonCard (참가자/관전자 카드 - 기존 styled-components)
const CommonCard = styled.div`
  width: ${BOX_SIZE};
  height: ${BOX_SIZE};
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  position: relative;
  padding: 0.5rem;
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

// StyledPlayerCard (동적 배경색 적용)
const StyledPlayerCard = styled(CommonCard)<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
`;

// 플레이어 이미지 (일반 참가자)
const PlayerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 기본 아바타 (이미지 없을 경우)
const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
`;

// 닉네임 영역
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

// 티어 아이콘
const TierIcon = styled.img`
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 40px;
  height: 40px;
  z-index: 3;
`;

// 순위 영역 (카드 하단)
const RankArea = styled.div`
  position: absolute;
  bottom: 0.3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  text-align: center;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 방장 뱃지
const OwnerBadge = styled.div`
  background-color: #4caf50;
  color: #fff;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  width: 100%;
`;

// 준비 뱃지
const ReadyBadge = styled.div`
  background-color: #ff9800;
  color: #fff;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  width: 100%;
`;

// 관전자용 아바타 이미지
const SpectatorImage = styled.img`
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

// 채팅 버블 컨테이너
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

// 채팅 버블 텍스트
const ChatBubbleText = styled.p<{ isNotice: boolean }>`
  font-size: 0.9rem;
  color: ${(props) => (props.isNotice ? 'red' : '#000')};
  margin: 0;
`;

// 모달 오버레이
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

// 모달 콘텐츠
const ModalContent = styled.div`
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${scaleUp} 0.3s ease-in-out;
`;

// 모달 인풋
const ModalInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

// 모달 버튼 컨테이너
const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

// 플레이어가 없는 슬롯의 텍스트
const EmptySlotText = styled.div`
  color: #aaa;
  text-align: center;
  line-height: ${BOX_SIZE};
`;

// ───── 기존 버튼 styled-components ──────────────────────────────

const ExitButton = styled.button`
  background-color: #fff;
  color: #333;
  border: 2px solid #ccc;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 0 #aaa;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SubjectButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 0 #c7436f;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StartButton = styled.button`
  position: absolute;
  top: 3.5rem;
  right: 0.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  background-color: #f06292;
  color: #fff;
  border: none;
  font-weight: bold;
  box-shadow: 0 3px 0 #c7436f;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ModalSubmitButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ModalCancelButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;
