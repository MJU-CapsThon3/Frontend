// src/pages/Battle/BattleDetail.tsx

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
} from 'react';
import styled from 'styled-components';
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
  GenerateAITopicsResponse,
  SetTopicsRequest,
} from '../../api/battle/battleRoomApi';
import VoteApi, { CreateVoteRequest } from '../../api/vote/voteApi'; // 투표 API

// ───── 아이콘 임포트 ──────────────────────────────
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';

// ───── 분리된 컴포넌트 import ───────────────────
import DirectSubjectModal from '../../components/BattleDetail/DirectSubjectModal';
import VoteModal from '../../components/BattleDetail/VoteModal';
import ResultModal from '../../components/BattleDetail/ResultModal';

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
const OWNER_ID = 1; // 현재 로그인된 사용자 ID (예시)
const TOTAL_SLOTS = 8;
const BOX_SIZE = '150px';
const POLL_INTERVAL = 2000; // 2초마다 폴링
const INITIAL_TIMER = 180; // 3분 = 180초

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

// ───── BattleDetail 컴포넌트 ──────────────────────────────
const BattleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ─── 상태 정의 ───────────────────────────────────
  const [ownerSpectatorSlot, setOwnerSpectatorSlot] = useState<number | null>(
    null
  );
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [sideAOption, setSideAOption] = useState<string>('');
  const [sideBOption, setSideBOption] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [subjectAInput, setSubjectAInput] = useState<string>('');
  const [subjectBInput, setSubjectBInput] = useState<string>('');
  const [kickModalVisible, setKickModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [isSpectatorsCollapsed, setIsSpectatorsCollapsed] = useState(false);

  // ─── 방 상태 (시작 여부) ─────────────────────
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  // 이전 isBattleStarted 값을 기억하기 위한 ref
  const prevIsBattleStarted = useRef<boolean>(false);

  // ─── 타이머 (남은 초) 상태 ─────────────────────
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── 관전자 수 ─────────────────────
  const [spectatorCount, setSpectatorCount] = useState<number>(0);

  // ─── 게임 시작/종료 오버레이 상태 ─────────────────────
  const [showStartOverlay, setShowStartOverlay] = useState(false);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  // ─── 투표 모달 관련 상태 ─────────────────────
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // ─── 최종 결과 모달 관련 상태 ─────────────────────
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    voteCount: { A: number; B: number };
    voteWinner: 'A' | 'B' | 'DRAW';
    aiWinner: 'A' | 'B' | 'DRAW';
    judgementReason: string;
    aiAnalysis: string;
    pointsAwarded: number;
  } | null>(null);

  if (!roomId) {
    return <div>유효하지 않은 방 ID입니다.</div>;
  }

  // 현재 OWNER 정보
  const ownerData = players.find((p) => p.id === OWNER_ID);
  const nonOwnerParticipants = players.filter(
    (p) => p.role === 'participant' && p.id !== OWNER_ID
  );
  const nonOwnerSpectators = players.filter(
    (p) => p.role === 'spectator' && p.id !== OWNER_ID
  );

  // ─── A/B/P 팀 정보 API 호출 ─────────────────────
  const fetchRoomDetail = useCallback(async () => {
    try {
      const data: RoomDetailFull = await BattleRoomApi.getRoomDetailFull(
        parseInt(roomId, 10)
      );

      // 서버에서 받은 status 값을 통해 isBattleStarted 업데이트
      setIsBattleStarted(data.status === 'PLAYING');

      // 관전자 수 갱신
      setSpectatorCount(data.spectators.length);

      if (data.question) {
        setSubject(data.question);
        setSideAOption(data.topicA);
        setSideBOption(data.topicB);
      }

      const fetchedPlayers: PlayerData[] = [];

      // A팀 참가자
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
          setOwnerSpectatorSlot(null);
        }
      });

      // B팀 참가자
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
  }, [roomId]);

  // ─── 초기 조회 및 폴링 ─────────────────────
  useEffect(() => {
    fetchRoomDetail();
    const interval = setInterval(fetchRoomDetail, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRoomDetail]);

  // ─── 이전 isBattleStarted 값 비교하여, true → false 전환 시 투표 모달 오픈 ─────────────────────
  useEffect(() => {
    // 처음 마운트될 때는 prevIsBattleStarted.current가 false이므로 무시
    if (prevIsBattleStarted.current && !isBattleStarted) {
      // 서버에서 상태가 PLAYING → FINISHED(또는 WAITING)로 바뀌면 모든 사용자에게 투표 모달 열기
      setVoteModalVisible(true);
    }
    prevIsBattleStarted.current = isBattleStarted;
  }, [isBattleStarted]);

  // ─── 채팅 내역 초기화 ─────────────────────
  useEffect(() => {
    setChatMessages([]);
  }, [roomId]);

  // ─── 채팅 전송 ─────────────────────────────
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        side: ownerData?.team === 'blue' ? 'A' : 'B',
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

  // ─── “방 나가기” 버튼 ─────────────────────
  const handleExit = async () => {
    try {
      await BattleRoomApi.leaveRoom(parseInt(roomId, 10));
      navigate(-1);
    } catch (err) {
      console.error('방 떠나기 오류:', err);
      alert('방 나가는 중 오류가 발생했습니다.');
    }
  };

  // ─── 타이머 시작/종료 로직 ─────────────────────
  useEffect(() => {
    // 게임이 시작될 때만 타이머를 초기화하고 카운트다운 시작
    if (isBattleStarted) {
      setTimer(INITIAL_TIMER);
      // 기존 타이머가 있으면 삭제
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // 타이머가 0이 되면 종료
            clearInterval(timerRef.current!);
            setTimer(0);
            // 타이머 종료 시점에 모든 사용자에게 투표 모달 열기
            setVoteModalVisible(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // 게임이 종료되거나 대기 상태가 되면 타이머 정지
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimer(0);
    }
    // cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBattleStarted]);

  // ─── “시작/종료” 버튼 클릭 ─────────────────────
  const handleToggleBattle = async () => {
    if (!isBattleStarted) {
      // 배틀 시작
      try {
        await BattleRoomApi.startBattle(parseInt(roomId, 10));
        // 로컬 오버레이만 표시, 서버 상태는 폴링으로 반영됨
        setShowStartOverlay(true);
        setTimeout(() => setShowStartOverlay(false), 3000);
      } catch (err) {
        console.error('배틀 시작 오류:', err);
        alert('배틀 시작 중 오류가 발생했습니다.');
      }
    } else {
      // 배틀 종료
      try {
        await BattleRoomApi.endBattle(parseInt(roomId, 10));
        setShowEndOverlay(true);
        setTimeout(() => {
          setShowEndOverlay(false);
          // 서버 상태 변화 감지(useEffect)로 모든 사용자에게 투표 모달이 뜨게 함
        }, 3000);
      } catch (err) {
        console.error('배틀 종료 오류:', err);
        alert('배틀 종료 중 오류가 발생했습니다.');
      }
    }
  };

  // ─── 최종 결과 조회 함수 ─────────────────────
  const fetchBattleResult = async () => {
    try {
      const result = await BattleRoomApi.getBattleResult(parseInt(roomId, 10));
      setBattleResult(result);
      setResultModalVisible(true);
    } catch (err) {
      console.error('최종 결과 조회 오류:', err);
    }
  };

  // ─── 투표 모달에서 “A팀” / “B팀” 클릭 시 호출 ─────────────────────
  const handleVote = async (choice: 'A' | 'B') => {
    if (hasVoted) return;
    try {
      const payload: CreateVoteRequest = { vote: choice };
      await VoteApi.createVote(roomId, payload);
      setHasVoted(true);
      setVoteModalVisible(false);
      // 투표 후 바로 결과 조회 및 모달 표시
      fetchBattleResult();
    } catch (err: any) {
      console.error(err.message);
      alert('투표 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setVoteModalVisible(false);
      // 오류가 났어도 결과 확인 시도
      fetchBattleResult();
    }
  };

  // ─── 투표 모달 취소 시 ─────────────────────
  const handleVoteCancel = () => {
    setVoteModalVisible(false);
    fetchBattleResult();
  };

  // ─── 플레이어 강퇴 ─────────────────────
  const handleKickPlayer = () => {
    if (selectedPlayer) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedPlayer.id));
      setKickModalVisible(false);
      setSelectedPlayer(null);
    }
  };

  // ─── A/B 역할 변경 핸들러 (로컬 상태 업데이트 + 즉시 서버 재조회) ─────────────────────
  const handleChangeToA = async () => {
    try {
      await BattleRoomApi.changeToRoleA(parseInt(roomId, 10));

      // 로컬 상태에 바로 반영
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === OWNER_ID
            ? { ...p, role: 'participant', team: 'blue', isReady: true }
            : p
        )
      );
      setOwnerSpectatorSlot(null);

      // 즉시 서버에서 최신 방 정보 다시 가져오기
      fetchRoomDetail();
    } catch (err) {
      console.error('A 역할 변경 오류:', err);
      alert('A 역할 변경 중 오류가 발생했습니다.');
    }
  };

  const handleChangeToB = async () => {
    try {
      await BattleRoomApi.changeToRoleB(parseInt(roomId, 10));

      // 로컬 상태에 바로 반영
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === OWNER_ID
            ? { ...p, role: 'participant', team: 'red', isReady: true }
            : p
        )
      );
      setOwnerSpectatorSlot(null);

      // 즉시 서버에서 최신 방 정보 다시 가져오기
      fetchRoomDetail();
    } catch (err) {
      console.error('B 역할 변경 오류:', err);
      alert('B 역할 변경 중 오류가 발생했습니다.');
    }
  };

  // ─── 랜덤 주제 생성 ─────────────────────
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
      const shuffled = [...keywordPool].sort(() => Math.random() - 0.5);
      setSubject(`${shuffled[0]} vs ${shuffled[1]}`);
      setSideAOption(shuffled[0]);
      setSideBOption(shuffled[1]);
    }
  };

  // ─── 직접 주제 생성 모달 오픈 ─────────────────────
  const handleDirectSubjectOpen = () => {
    setSubjectAInput('');
    setSubjectBInput('');
    setModalVisible(true);
  };

  // ─── 직접 주제 입력 제출 ─────────────────────
  const handleModalSubmit = async () => {
    const a = subjectAInput.trim();
    const b = subjectBInput.trim();
    if (!a || !b) {
      alert('주제 A와 주제 B를 모두 입력해주세요.');
      return;
    }
    const payload: SetTopicsRequest = {
      question: `${a} vs ${b}`,
      topicA: a,
      topicB: b,
    };
    try {
      const res = await BattleRoomApi.setTopics(parseInt(roomId, 10), payload);
      if (res) {
        setSubject(`${res.topicA} vs ${res.topicB}`);
        setSideAOption(res.topicA);
        setSideBOption(res.topicB);
      }
    } catch (err) {
      console.error('직접 주제 설정 오류:', err);
      setSubject(`${a} vs ${b}`);
      setSideAOption(a);
      setSideBOption(b);
      alert('주제 설정에 실패했습니다. 입력한 내용을 화면에 반영합니다.');
    } finally {
      setModalVisible(false);
    }
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

  // ─── 왼쪽 슬롯(A팀) ─────────────────────
  const renderLeftSlot = () => (
    <CenteredDiv>
      <ParticipantKeyword>{sideAOption}</ParticipantKeyword>
      {/* 클릭 시 A 역할로 변경 */}
      <CommonCard onClick={handleChangeToA}>
        {ownerData &&
        ownerData.role === 'participant' &&
        ownerData.team === 'blue' ? (
          <PlayerCard player={ownerData} isOwner />
        ) : nonOwnerParticipants.find((p) => p.team === 'blue') ? (
          <PlayerCard
            player={
              nonOwnerParticipants.find((p) => p.team === 'blue') as PlayerData
            }
          />
        ) : (
          <EmptySlotText>참가자 없음</EmptySlotText>
        )}
      </CommonCard>
    </CenteredDiv>
  );

  // ─── 오른쪽 슬롯(B팀) ─────────────────────
  const renderRightSlot = () => (
    <CenteredDiv>
      <ParticipantKeyword>{sideBOption}</ParticipantKeyword>
      {/* 클릭 시 B 역할로 변경 */}
      <CommonCard onClick={handleChangeToB}>
        {ownerData &&
        ownerData.role === 'participant' &&
        ownerData.team === 'red' ? (
          <PlayerCard player={ownerData} isOwner />
        ) : nonOwnerParticipants.find((p) => p.team === 'red') ? (
          <PlayerCard
            player={
              nonOwnerParticipants.find((p) => p.team === 'red') as PlayerData
            }
          />
        ) : (
          <EmptySlotText>참가자 없음</EmptySlotText>
        )}
      </CommonCard>
    </CenteredDiv>
  );

  // ─── 관전자 그리드 ─────────────────────
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

  // ─── 남은 시간 표시(분:초) ─────────────────────
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
            <SubjectButton onClick={handleDirectSubjectOpen}>
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

        {/* 타이머 표시 */}
        {isBattleStarted && timer > 0 && (
          <TimerDisplay>{formatTime(timer)}</TimerDisplay>
        )}

        {!isSpectatorsCollapsed && (
          <SpectatorsGrid>{renderSpectatorGrid()}</SpectatorsGrid>
        )}
      </SpectatorsSection>

      {/* ─── 분리된 직접 주제 입력 모달 ───────────────────────────── */}
      <DirectSubjectModal
        visible={modalVisible}
        subjectAInput={subjectAInput}
        subjectBInput={subjectBInput}
        onChangeA={(e: ChangeEvent<HTMLInputElement>) =>
          setSubjectAInput(e.currentTarget.value)
        }
        onChangeB={(e: ChangeEvent<HTMLInputElement>) =>
          setSubjectBInput(e.currentTarget.value)
        }
        onSubmit={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
      />

      {/* ─── 분리된 투표 모달 (모든 사용자에게 노출) ───────────────────────────── */}
      <VoteModal
        visible={voteModalVisible && !hasVoted}
        onVoteA={() => handleVote('A')}
        onVoteB={() => handleVote('B')}
        onCancel={handleVoteCancel}
      />

      {/* ─── 분리된 최종 결과 모달 (모든 사용자에게 노출) ───────────────────────────── */}
      <ResultModal
        visible={resultModalVisible && battleResult !== null}
        data={battleResult}
        onClose={() => setResultModalVisible(false)}
      />

      {/* ─── 게임 시작 오버레이 ───────────────────────────── */}
      {showStartOverlay && (
        <OverlayCenter>
          <OverlayText>게임 시작</OverlayText>
        </OverlayCenter>
      )}

      {/* ─── 게임 종료 오버레이 ───────────────────────────── */}
      {showEndOverlay && (
        <OverlayCenter>
          <OverlayText>게임 종료</OverlayText>
        </OverlayCenter>
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
  position: relative;
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
  cursor: default; /* 클릭 방지 */
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
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
  background-color: ${({ $bgColor }) => $bgColor};
  cursor: default; /* 내부 클릭 방지 */
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
  background-color: ${({ isOwnerMsg, isNotice }) =>
    isNotice ? '#ffe6e6' : isOwnerMsg ? '#dcf8c6' : '#fff'};
  align-self: ${({ isOwnerMsg }) => (isOwnerMsg ? 'flex-end' : 'flex-start')};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  word-break: break-word;
`;

const ChatBubbleText = styled.p<{ isNotice: boolean }>`
  font-size: 0.9rem;
  color: ${({ isNotice }) => (isNotice ? 'red' : '#000')};
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

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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

const OverlayCenter = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2000;
`;

const OverlayText = styled.span`
  color: #fff;
  font-size: 5rem;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const TimerDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  z-index: 500;
`;
