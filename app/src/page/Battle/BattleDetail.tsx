import React, { useState, CSSProperties, useEffect, useRef } from 'react';
import styled from 'styled-components';
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
type PlayerData = {
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
const TOTAL_SLOTS = 8; // 관전자 영역 총 8칸
const BOX_SIZE = '150px'; // 참가자/관전자 박스 동일 크기

// 이동할 대상 슬롯 타입
type TargetSlot = { area: 'participant' | 'spectator'; index: number };

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

// ───── 추가로 누락된 스타일 객체들 ──────────────────────────────
const tierIconStyle: CSSProperties = {
  position: 'absolute',
  top: '0.3rem',
  right: '0.3rem',
  width: '40px',
  height: '40px',
  zIndex: 3,
};

const emptySlotTextStyle: CSSProperties = {
  color: '#aaa',
  textAlign: 'center',
  lineHeight: BOX_SIZE,
};

// ───── styled-components ──────────────────────────────

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

// ───── BattleDetail 컴포넌트 ──────────────────────────────
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
      <CommonCard style={{ backgroundColor: bgColor }}>
        <div style={nicknameStyle}>
          {player.nickname} {isOwner && '(나)'}
        </div>
        <img
          src={tierIcons[player.tier]}
          alt={player.tier}
          style={tierIconStyle}
        />
        {player.avatarUrl && player.avatarUrl.trim() !== '' ? (
          <img
            src={player.avatarUrl}
            alt='avatar'
            style={isSpectator ? spectatorImageStyle : playerImageStyle}
          />
        ) : (
          <div style={defaultAvatarStyle}>
            <FaUserAlt
              style={{ fontSize: isSpectator ? '2rem' : '3rem', color: '#888' }}
            />
          </div>
        )}
        <div style={rankAreaStyle}>
          {isOwner && <div style={ownerBadgeStyle}>방 장</div>}
          {!isOwner && player.isReady && (
            <div style={readyBadgeStyle}>준 비</div>
          )}
        </div>
      </CommonCard>
    );
  };

  const renderLeftSlot = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={participantKeywordStyle}>{leftKeyword}</div>
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
            <div style={emptySlotTextStyle}>플레이어 대기중</div>
          </CommonCard>
        )}
      </div>
    );
  };

  const renderRightSlot = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={participantKeywordStyle}>{rightKeyword}</div>
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
            <div style={emptySlotTextStyle}>플레이어 대기중</div>
          </CommonCard>
        )}
      </div>
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
        <div
          key={`spectator-slot-${i}`}
          style={{
            ...spectatorSlotStyle,
            cursor: occupant ? 'default' : 'pointer',
          }}
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
            <div style={emptyBoxStyle} />
          )}
        </div>
      );
    }
    return cells;
  };

  const ChatBubble: React.FC<{ msg: string }> = ({ msg }) => {
    const isOwnerMsg = msg.startsWith(`유저${OWNER_ID}:`);
    const isNotice = msg.startsWith('[공지]');
    const bubbleStyle: CSSProperties = {
      maxWidth: '70%',
      padding: '8px 12px',
      borderRadius: '16px',
      margin: '4px 0',
      backgroundColor: isNotice ? '#ffe6e6' : isOwnerMsg ? '#dcf8c6' : '#fff',
      alignSelf: isOwnerMsg ? 'flex-end' : 'flex-start',
      boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
      wordBreak: 'break-word',
    };
    const textStyle: CSSProperties = {
      fontSize: '0.9rem',
      color: isNotice ? 'red' : '#000',
      margin: 0,
    };
    return (
      <div style={bubbleStyle}>
        <p style={textStyle}>{msg}</p>
      </div>
    );
  };

  const Modal: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <ExitButton onClick={handleExit}>
          <FaSignOutAlt style={{ marginRight: '0.3rem' }} />
          나가기
        </ExitButton>
        <div style={titleStyle}>{subject}</div>
        <div style={headerButtonsStyle}>
          <SubjectButton onClick={handleRandomSubject}>
            <FaRandom style={{ marginRight: '0.3rem' }} />
            랜덤 주제생성기
          </SubjectButton>
          <SubjectButton onClick={handleDirectSubject}>
            <FaEdit style={{ marginRight: '0.3rem' }} />
            직접 주제 생성하기
          </SubjectButton>
        </div>
        {ownerData && ownerData.id === OWNER_ID ? (
          <StartButton onClick={handleStartGame}>시작</StartButton>
        ) : (
          <StartButton onClick={handleReadyToggle}>준비</StartButton>
        )}
      </header>

      <div style={topSectionStyle}>
        <div style={participantContainerStyle}>{renderLeftSlot()}</div>
        <div style={chatSectionStyle}>
          <div
            ref={chatContainerRef}
            style={{
              ...chatMessagesStyle,
              display: 'flex',
              flexDirection: 'column',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
            }}
          >
            {chatMessages.map((msg, idx) => (
              <ChatBubble key={idx} msg={msg} />
            ))}
          </div>
          <form onSubmit={handleChatSubmit} style={chatFormStyle}>
            <FaCommentDots
              style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}
            />
            <input
              type='text'
              placeholder='메시지 입력...'
              style={chatInputStyle}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
          </form>
        </div>
        <div style={participantContainerStyle}>{renderRightSlot()}</div>
      </div>

      <div style={spectatorsSectionStyle}>
        <div style={spectatorsGridStyle}>{renderSpectatorGrid()}</div>
      </div>

      {pendingMoveSlot !== null && (
        <Modal title='이동 확인'>
          <p>해당 슬롯으로 이동하시겠습니까?</p>
          <div style={modalButtonsStyle}>
            <ModalSubmitButton onClick={handleConfirmMove}>
              네
            </ModalSubmitButton>
            <ModalCancelButton onClick={handleCancelMove}>
              아니요
            </ModalCancelButton>
          </div>
        </Modal>
      )}

      {modalVisible && (
        <Modal title='직접 주제 생성하기'>
          <input
            type='text'
            placeholder='첫번째 키워드'
            value={keywordOne}
            onChange={(e) => setKeywordOne(e.target.value)}
            style={modalInputStyle}
          />
          <input
            type='text'
            placeholder='두번째 키워드'
            value={keywordTwo}
            onChange={(e) => setKeywordTwo(e.target.value)}
            style={modalInputStyle}
          />
          <div style={modalButtonsStyle}>
            <ModalSubmitButton onClick={handleModalSubmit}>
              생성
            </ModalSubmitButton>
            <ModalCancelButton onClick={() => setModalVisible(false)}>
              취소
            </ModalCancelButton>
          </div>
        </Modal>
      )}

      {startModalVisible && (
        <Modal title='게임 시작 확인'>
          <p>
            모든 플레이어가 준비되었습니다.
            <br />
            게임을 시작하시겠습니까?
          </p>
          <div style={modalButtonsStyle}>
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
          </div>
        </Modal>
      )}

      {warningModalVisible && (
        <Modal title='경고'>
          <p>
            참가자 2명이 모두 있고 준비 완료된 상태여야 게임을 시작할 수
            있습니다.
          </p>
          <div style={modalButtonsStyle}>
            <ModalSubmitButton onClick={() => setWarningModalVisible(false)}>
              확인
            </ModalSubmitButton>
          </div>
        </Modal>
      )}

      {kickModalVisible && selectedPlayer && (
        <Modal title='플레이어 강퇴 확인'>
          <p>{selectedPlayer.nickname} 플레이어를 강퇴하시겠습니까?</p>
          <div style={modalButtonsStyle}>
            <ModalSubmitButton onClick={handleKickPlayer}>네</ModalSubmitButton>
            <ModalCancelButton
              onClick={() => {
                setKickModalVisible(false);
                setSelectedPlayer(null);
              }}
            >
              아니요
            </ModalCancelButton>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BattleDetail;

// ───── 기본 인라인 스타일 ──────────────────────────────

const fadeInAnimation = 'fadeIn 0.5s ease-in-out forwards';

const containerStyle: CSSProperties = {
  width: '1000px',
  margin: '0 auto',
  border: '2px solid #48b0ff',
  borderRadius: '10px',
  backgroundColor: '#cde7ff',
  fontFamily: 'sans-serif',
  overflow: 'hidden',
  position: 'relative',
  animation: fadeInAnimation,
};

const fadeInKeyframes = `
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;
document.head.insertAdjacentHTML(
  'beforeend',
  `<style>${fadeInKeyframes}</style>`
);

const headerStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#3b83c0',
  color: '#fff',
  padding: '0.5rem 1rem',
};

const titleStyle: CSSProperties = {
  flex: 1,
  fontSize: '1.3rem',
  fontWeight: 'bold',
  textShadow: '1px 1px #333',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  margin: '0 1rem',
};

const headerButtonsStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
};

const topSectionStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  gap: '1rem',
};

const participantContainerStyle: CSSProperties = {
  flex: '1 1 200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const participantKeywordStyle: CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
};

const chatSectionStyle: CSSProperties = {
  flex: '2 1 400px',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #ddd',
  borderRadius: '6px',
  backgroundColor: '#fff',
};

const chatMessagesStyle: CSSProperties = {
  height: '200px',
  overflowY: 'scroll',
  padding: '0.5rem',
  fontSize: '0.85rem',
};

const chatFormStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  borderTop: '1px solid #ddd',
  padding: '0.5rem',
};

const chatInputStyle: CSSProperties = {
  flex: 1,
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '0.3rem',
  outline: 'none',
};

const spectatorsSectionStyle: CSSProperties = {
  borderTop: '2px solid #48b0ff',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const spectatorsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '10px',
  width: 'calc(4 * 150px + 3 * 10px)',
};

const spectatorSlotStyle: CSSProperties = {
  width: BOX_SIZE,
  height: BOX_SIZE,
  border: '1px solid #ddd',
  borderRadius: '6px',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const emptyBoxStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#fff',
};

const playerImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const defaultAvatarStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#eee',
};

const nicknameStyle: CSSProperties = {
  position: 'absolute',
  top: '0.3rem',
  left: '0.3rem',
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.8rem',
  padding: '0.3rem 0.6rem',
  borderBottomRightRadius: '6px',
  zIndex: 2,
};

const rankAreaStyle: CSSProperties = {
  position: 'absolute',
  bottom: '0.3rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  textAlign: 'center',
  height: '20px',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const ownerBadgeStyle: CSSProperties = {
  backgroundColor: '#4caf50',
  color: '#fff',
  padding: '2px 6px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  width: '100%',
};

const readyBadgeStyle: CSSProperties = {
  backgroundColor: '#ff9800',
  color: '#fff',
  padding: '2px 6px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  width: '100%',
};

const spectatorImageStyle: CSSProperties = {
  width: '100%',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: CSSProperties = {
  width: '400px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  animation: 'scaleUp 0.3s ease-in-out',
};

const scaleUpKeyframes = `
@keyframes scaleUp {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
`;
document.head.insertAdjacentHTML(
  'beforeend',
  `<style>${scaleUpKeyframes}</style>`
);

const modalInputStyle: CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
};

const modalButtonsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.5rem',
};
