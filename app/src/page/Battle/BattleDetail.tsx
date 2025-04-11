import React, { useState, CSSProperties } from 'react';
import {
  FaCommentDots,
  FaUserAlt,
  FaChessKnight,
  FaChessRook,
  FaSignOutAlt,
  FaRandom,
  FaEdit,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// 티어 아이콘 임포트
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';

// 플레이어 타입 정의
type PlayerData = {
  id: number;
  nickname: string;
  avatarUrl?: string;
  isReady?: boolean;
  team?: 'owl' | 'bird';
};

// 예시 플레이어 데이터 (8명, 2행×4열)
const dummyPlayers: PlayerData[] = [
  { id: 1, nickname: '승민이의세상', avatarUrl: '', isReady: true },
  { id: 2, nickname: '수민이의세상', avatarUrl: '', isReady: true },
  { id: 3, nickname: '플레이어3', avatarUrl: '', isReady: false },
  { id: 4, nickname: '플레이어4', avatarUrl: '', isReady: false },
  { id: 5, nickname: '플레이어5', avatarUrl: '', isReady: true },
  { id: 6, nickname: '플레이어6', avatarUrl: '', isReady: false },
  { id: 7, nickname: '플레이어7', avatarUrl: '', isReady: false },
  { id: 8, nickname: '플레이어8', avatarUrl: '', isReady: false },
];

// 키워드 풀: 랜덤 주제 생성에 사용할 키워드 목록
const keywordPool: string[] = [
  '올빼미',
  '얼리버드',
  '호랑이',
  '사자',
  '펭귄',
  '코알라',
  '토끼',
  '거북이',
];

// 순위에 따른 티어 결정 함수
const getTierByRank = (
  rank: number,
  totalPlayers: number = dummyPlayers.length
): string => {
  const thresholds = {
    challenger: Math.ceil(totalPlayers * 0.01),
    grandmaster: Math.ceil(totalPlayers * 0.04),
    master: Math.ceil(totalPlayers * 0.1),
    diamond: Math.ceil(totalPlayers * 0.2),
    gold: Math.ceil(totalPlayers * 0.35),
    platinum: Math.ceil(totalPlayers * 0.55),
    silver: Math.ceil(totalPlayers * 0.8),
    bronze: totalPlayers,
  };
  if (rank <= thresholds.challenger) return '챌린저';
  else if (rank <= thresholds.grandmaster) return '그랜드마스터';
  else if (rank <= thresholds.master) return '마스터';
  else if (rank <= thresholds.diamond) return '다이아몬드';
  else if (rank <= thresholds.gold) return '골드';
  else if (rank <= thresholds.platinum) return '플래티넘';
  else if (rank <= thresholds.silver) return '실버';
  else return '브론즈';
};

// 티어별 아이콘 매핑 객체
const tierIconMapping: { [key: string]: string } = {
  챌린저: ChallengerIcon,
  그랜드마스터: GrandMasterIcon,
  마스터: MasterIcon,
  다이아몬드: DiamondIcon,
  골드: GoldIcon,
  플래티넘: PlatinumIcon,
  실버: SilverIcon,
  브론즈: BronzeIcon,
};

const BattleDetail: React.FC = () => {
  const navigate = useNavigate();
  const OWNER_ID = 1; // 방장은 id===1

  const [players, setPlayers] = useState<PlayerData[]>(dummyPlayers);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([
    '[공지] 환영합니다',
  ]);
  // 초기 주제는 기본값으로 설정
  const [subject, setSubject] = useState<string>('올빼미 vs 얼리버드');
  const [teamNames, setTeamNames] = useState<{
    teamOne: string;
    teamTwo: string;
  }>({
    teamOne: '올빼미',
    teamTwo: '얼리버드',
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [keywordOne, setKeywordOne] = useState<string>('');
  const [keywordTwo, setKeywordTwo] = useState<string>('');

  // 추가 모달 상태들
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [kickModalVisible, setKickModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);

  // 모든 플레이어 준비 상태 확인
  const allPlayersReady = players.every(
    (p) => p.id === OWNER_ID || (p.team && p.isReady)
  );

  // 랜덤 키워드 생성 함수 (두 키워드를 무작위로 선택)
  const getRandomKeywords = (): [string, string] => {
    const shuffled = [...keywordPool].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  };

  // 랜덤 주제 생성: 두 키워드를 랜덤 생성하여 주제 및 팀 이름 업데이트, 전체 주제는 채팅창에 표시
  const handleRandomSubject = () => {
    const [firstKeyword, secondKeyword] = getRandomKeywords();
    const newSubject = `${firstKeyword} vs ${secondKeyword}`;
    setSubject(newSubject);
    setTeamNames({ teamOne: firstKeyword, teamTwo: secondKeyword });
    // 바뀐 타이틀 전체 텍스트를 채팅창에 추가
    setChatMessages((prev) => [...prev, `[타이틀 변경] ${newSubject}`]);
  };

  // 직접 주제 생성 모달 열기
  const handleDirectSubject = () => {
    setModalVisible(true);
    setKeywordOne('');
    setKeywordTwo('');
  };

  // 모달 제출: 입력한 두 키워드로 주제 생성 및 채팅창에 전체 주제 표시
  const handleModalSubmit = () => {
    if (!keywordOne.trim() || !keywordTwo.trim()) {
      alert('두 개의 키워드를 모두 입력해주세요.');
      return;
    }
    const newSubject = `${keywordOne.trim()} vs ${keywordTwo.trim()}`;
    setSubject(newSubject);
    setTeamNames({ teamOne: keywordOne.trim(), teamTwo: keywordTwo.trim() });
    setModalVisible(false);
    // 전체 주제 텍스트를 채팅창에 추가
    setChatMessages((prev) => [...prev, `[타이틀 변경] ${newSubject}`]);
  };

  const handleToggleReady = () => {
    setPlayers((prev) =>
      prev.map((p) => (p.id !== OWNER_ID ? { ...p, isReady: !p.isReady } : p))
    );
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, `유저${OWNER_ID}: ${chatInput}`]);
    setChatInput('');
  };

  const handleOwlClick = () => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === OWNER_ID ? { ...p, team: 'owl' } : p))
    );
  };

  const handleEarlyClick = () => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === OWNER_ID ? { ...p, team: 'bird' } : p))
    );
  };

  const handleStartGame = () => {
    if (allPlayersReady) {
      setStartModalVisible(true);
    } else {
      setWarningModalVisible(true);
    }
  };

  const handleKickPlayer = () => {
    if (selectedPlayer) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedPlayer.id));
      setKickModalVisible(false);
      setSelectedPlayer(null);
    }
  };

  const isOwner = (id: number) => id === OWNER_ID;
  const getPlayerSlotBgColor = (player: PlayerData): string => {
    if (player.team === 'owl') return '#33bfff';
    if (player.team === 'bird') return '#ff6b6b';
    return '#fff';
  };

  // 현재 방장 팀 상태
  const ownerTeam = players.find((p) => p.id === OWNER_ID)?.team;

  // 플레이어 순위 및 티어 정보 (더미 데이터)
  const playerRankings = players.map((player, index) => ({
    id: player.id,
    nickname: player.nickname,
    rank: index + 1,
    score: 1000 - index * 50,
    tier: getTierByRank(index + 1, players.length),
  }));

  return (
    <div style={containerStyle}>
      {/* 버튼 애니메이션 및 스크롤 스타일 */}
      <style>{`
        .animated-button { transition: all 0.3s ease; }
        .animated-button:hover { transform: scale(1.05); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .chatMessages::-webkit-scrollbar { width: 8px; }
        .chatMessages::-webkit-scrollbar-track { background: #f1f1f1; }
        .chatMessages::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        .chatMessages::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>

      {/* 헤더 영역 */}
      <header style={headerStyle}>
        <button
          className='animated-button'
          style={exitButtonStyle}
          // onClick={handleExit}
        >
          <FaSignOutAlt style={{ marginRight: '0.3rem' }} />
          나가기
        </button>
        <div style={titleStyle}>{subject}</div>
        <div style={subjectButtonsContainerStyle}>
          <button
            className='animated-button'
            style={subjectButtonStyle}
            onClick={handleRandomSubject}
          >
            <FaRandom style={{ marginRight: '0.3rem' }} />
            랜덤 주제생성기
          </button>
          <button
            className='animated-button'
            style={subjectButtonStyle}
            onClick={handleDirectSubject}
          >
            <FaEdit style={{ marginRight: '0.3rem' }} />
            직접 주제 생성하기
          </button>
        </div>
      </header>

      {/* 메인 레이아웃 */}
      <div style={mainContentStyle}>
        <div style={leftSideStyle}>
          {/* 플레이어 그리드 */}
          <div style={playersGridStyle}>
            {players.map((player) => (
              <div
                key={player.id}
                style={{
                  ...playerSlotStyle,
                  backgroundColor: getPlayerSlotBgColor(player),
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (isOwner(player.id)) return;
                  if (players.find((p) => p.id === OWNER_ID)) {
                    setSelectedPlayer(player);
                    setKickModalVisible(true);
                  }
                }}
              >
                {player.team && (
                  <div style={teamIconContainerStyle}>
                    {player.team === 'owl' ? (
                      <FaChessKnight
                        style={{ fontSize: '1.5rem', color: '#33bfff' }}
                      />
                    ) : (
                      <FaChessRook
                        style={{ fontSize: '1.5rem', color: '#ff6b6b' }}
                      />
                    )}
                  </div>
                )}
                <div style={nicknameStyle}>{player.nickname}</div>
                {player.avatarUrl && player.avatarUrl.trim() !== '' ? (
                  <img
                    src={player.avatarUrl}
                    alt='user'
                    style={playerImageStyle}
                  />
                ) : (
                  <div style={defaultAvatarStyle}>
                    <FaUserAlt style={{ fontSize: '3rem', color: '#888' }} />
                  </div>
                )}
                <div style={rankAreaStyle}>
                  {isOwner(player.id) ? (
                    <div style={ownerBadgeStyle}>방 장</div>
                  ) : player.isReady ? (
                    <div style={readyBadgeStyle}>준 비</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* 채팅 영역 */}
          <div style={chatBoxStyle}>
            <div className='chatMessages' style={chatMessagesStyle}>
              {chatMessages.map((msg, idx) => (
                <p key={idx} style={{ margin: '0.3rem 0' }}>
                  {msg}
                </p>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} style={chatFormStyle}>
              <FaCommentDots
                style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}
              />
              <input
                style={chatInputStyle}
                type='text'
                placeholder='메시지 입력...'
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* 오른쪽 영역: 컨트롤 패널 */}
        <div style={rightSideStyle}>
          <div style={rankingContainerStyle}>
            {playerRankings.map((p) => (
              <div key={p.id} style={rankingItemStyle}>
                <img
                  src={tierIconMapping[p.tier]}
                  alt={p.tier}
                  style={{ width: '32px', height: '32px' }}
                />
                <span style={rankingNicknameStyle}>{p.nickname}</span>
                <span style={rankingScoreStyle}>{p.score} 점</span>
              </div>
            ))}
          </div>

          {/* 팀 선택 및 시작 버튼 영역 */}
          {isOwner(OWNER_ID) ? (
            <div style={buttonsBottomContainerStyle}>
              <div style={teamSelectionRowStyle}>
                <div style={questionStyle}>팀</div>
                <div style={teamButtonsColumnStyle}>
                  <button
                    className='animated-button'
                    onClick={handleOwlClick}
                    style={{
                      ...teamButtonStyle,
                      backgroundColor: ownerTeam === 'owl' ? '#33bfff' : '#eee',
                      color: ownerTeam === 'owl' ? '#fff' : '#333',
                    }}
                  >
                    {teamNames.teamOne}
                  </button>
                  <button
                    className='animated-button'
                    onClick={handleEarlyClick}
                    style={{
                      ...teamButtonStyle,
                      backgroundColor:
                        ownerTeam === 'bird' ? '#ff6b6b' : '#eee',
                      color: ownerTeam === 'bird' ? '#fff' : '#333',
                    }}
                  >
                    {teamNames.teamTwo}
                  </button>
                </div>
              </div>
              <div style={buttonsFlexRowStyle}>
                <button
                  className='animated-button'
                  style={startButtonStyle}
                  onClick={handleStartGame}
                >
                  시작
                </button>
              </div>
            </div>
          ) : (
            <div style={buttonsBottomContainerStyle}>
              <div style={teamSelectionRowStyle}>
                <div style={questionStyle}>뭐가 더 효율이 좋나요?</div>
                <div style={teamButtonsColumnStyle}>
                  <button
                    className='animated-button'
                    onClick={handleOwlClick}
                    style={{
                      ...teamButtonStyle,
                      backgroundColor: ownerTeam === 'owl' ? '#33bfff' : '#eee',
                      color: ownerTeam === 'owl' ? '#fff' : '#333',
                    }}
                  >
                    {teamNames.teamOne}
                  </button>
                  <button
                    className='animated-button'
                    onClick={handleEarlyClick}
                    style={{
                      ...teamButtonStyle,
                      backgroundColor:
                        ownerTeam === 'bird' ? '#ff6b6b' : '#eee',
                      color: ownerTeam === 'bird' ? '#fff' : '#333',
                    }}
                  >
                    {teamNames.teamTwo}
                  </button>
                </div>
              </div>
              <div style={buttonsFlexRowStyle}>
                <button
                  className='animated-button'
                  style={readyButtonStyle}
                  onClick={handleToggleReady}
                >
                  준비
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모달 영역 */}
      {modalVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '1rem' }}>직접 주제 생성하기</h3>
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
              <button
                className='animated-button'
                onClick={handleModalSubmit}
                style={modalSubmitButtonStyle}
              >
                생성
              </button>
              <button
                className='animated-button'
                onClick={() => setModalVisible(false)}
                style={modalCancelButtonStyle}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시작 컨펌 모달 */}
      {startModalVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '1rem' }}>게임 시작 확인</h3>
            <p>
              모든 플레이어의 팀 선택과 준비가 완료되었습니다.
              <br />
              게임을 시작하시겠습니까?
            </p>
            <div style={modalButtonsStyle}>
              <button
                className='animated-button'
                onClick={() => {
                  setStartModalVisible(false);
                  alert('게임 시작!');
                }}
                style={modalSubmitButtonStyle}
              >
                네
              </button>
              <button
                className='animated-button'
                onClick={() => setStartModalVisible(false)}
                style={modalCancelButtonStyle}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 경고 모달 */}
      {warningModalVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '1rem' }}>경고</h3>
            <p>
              모든 플레이어가 팀 선택 및 준비완료 상태가 아닙니다.
              <br />
              모든 플레이어가 준비된 후에 게임을 시작할 수 있습니다.
            </p>
            <div style={modalButtonsStyle}>
              <button
                className='animated-button'
                onClick={() => setWarningModalVisible(false)}
                style={modalSubmitButtonStyle}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 플레이어 강퇴 모달 */}
      {kickModalVisible && selectedPlayer && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '1rem' }}>플레이어 강퇴 확인</h3>
            <p>{selectedPlayer.nickname} 플레이어를 강퇴하시겠습니까?</p>
            <div style={modalButtonsStyle}>
              <button
                className='animated-button'
                onClick={handleKickPlayer}
                style={modalSubmitButtonStyle}
              >
                네
              </button>
              <button
                className='animated-button'
                onClick={() => {
                  setKickModalVisible(false);
                  setSelectedPlayer(null);
                }}
                style={modalCancelButtonStyle}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleDetail;

/* 스타일 정의 */

const containerStyle: CSSProperties = {
  width: '1000px',
  margin: '0 auto',
  border: '2px solid #48b0ff',
  borderRadius: '10px',
  backgroundColor: '#cde7ff',
  fontFamily: 'sans-serif',
  overflow: 'hidden',
  position: 'relative',
  animation: 'fadeIn 0.5s ease-in-out',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#3b83c0',
  color: '#fff',
  padding: '0.5rem 1rem',
};

const exitButtonStyle: CSSProperties = {
  backgroundColor: '#fff',
  color: '#333',
  border: '2px solid #ccc',
  borderRadius: '4px',
  padding: '0.3rem 0.8rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 0 #aaa',
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

const subjectButtonsContainerStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

const subjectButtonStyle: CSSProperties = {
  backgroundColor: '#f06292',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 0 #c7436f',
};

const mainContentStyle: CSSProperties = {
  display: 'flex',
  flex: 1,
  gap: '0.5rem',
  padding: '0.5rem',
};

const leftSideStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  flex: 2,
};

const playersGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'repeat(2, 150px)',
  gap: '0.5rem',
  flex: '0 0 auto',
};

const playerSlotStyle: CSSProperties = {
  position: 'relative',
  border: '1px solid #ddd',
  borderRadius: '6px',
  backgroundColor: '#fff',
  overflow: 'hidden',
  animation: 'popIn 0.3s forwards',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const nicknameStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.8rem',
  padding: '0.3rem 0.6rem',
  borderBottomRightRadius: '6px',
  zIndex: 2,
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

const rankAreaStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  textAlign: 'center',
  height: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
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

const chatBoxStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #ddd',
  borderRadius: '6px',
  backgroundColor: '#fff',
  animation: 'popIn 0.4s forwards',
};

const chatMessagesStyle: CSSProperties = {
  height: '200px',
  overflowY: 'scroll',
  padding: '0.5rem',
  fontSize: '0.85rem',
  textAlign: 'left',
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

const rightSideStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  position: 'relative',
};

const buttonsBottomContainerStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '0.5rem',
  boxSizing: 'border-box',
};

const teamSelectionRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const teamButtonsColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
};

const questionStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: '#333',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
  padding: '0.3rem 0.5rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  minWidth: '40px',
  minHeight: '60px',
};

const teamButtonStyle: CSSProperties = {
  backgroundColor: '#eee',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  width: '100%',
  padding: '0.4rem 0',
  // 텍스트가 영역 넘어가면 "..." 처리
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const readyButtonStyle: CSSProperties = {
  backgroundColor: '#ff9800',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 0 #c77700',
  width: '100%',
};

const startButtonStyle: CSSProperties = {
  backgroundColor: '#4caf50',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 0 #388e3c',
  width: '100%',
};

const buttonsFlexRowStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
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
};

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

const modalSubmitButtonStyle: CSSProperties = {
  backgroundColor: '#4caf50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  width: '100%',
};

const modalCancelButtonStyle: CSSProperties = {
  backgroundColor: '#f06292',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  width: '100%',
};

const rankingContainerStyle: CSSProperties = {
  marginBottom: '1rem',
  padding: '0.5rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '6px',
};

const rankingItemStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.3rem 0.5rem',
  marginBottom: '0.3rem',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const rankingNicknameStyle: CSSProperties = {
  flex: 1,
  textAlign: 'center',
};

const rankingScoreStyle: CSSProperties = {
  fontStyle: 'italic',
  color: '#666',
};

const teamIconContainerStyle: CSSProperties = {
  position: 'absolute',
  bottom: '30px',
  right: '4px',
  zIndex: 10,
};
