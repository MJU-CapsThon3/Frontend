// src/pages/Battle/BattleDetail.tsx

import React, { useState, useEffect, useRef, PropsWithChildren } from 'react';
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
  ChangeRoleRequest,
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
  const [isBattleStarted, setIsBattleStarted] = useState(false);

  // ─── 게임 시작/종료 오버레이 상태 ─────────────────────
  const [showStartOverlay, setShowStartOverlay] = useState(false);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  // ─── 투표 모달 관련 상태 ─────────────────────
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [hasVoted, setHasVoted] = useState(false); // 이미 투표했는지 확인

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
  const fetchRoomDetail = async () => {
    try {
      const data: RoomDetailFull = await BattleRoomApi.getRoomDetailFull(
        parseInt(roomId, 10)
      );

      if (data.question) {
        setSubject(data.question);
        setSideAOption(data.topicA);
        setSideBOption(data.topicB);
      }

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
          setOwnerSpectatorSlot(null);
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
          setOwnerSpectatorSlot(null);
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
  };

  useEffect(() => {
    fetchRoomDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

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

  // ─── “시작/종료” 버튼 클릭 ─────────────────────
  const handleToggleBattle = async () => {
    if (!isBattleStarted) {
      // 배틀 시작
      try {
        await BattleRoomApi.startBattle(parseInt(roomId, 10));
        setIsBattleStarted(true);

        // 시작 오버레이 보여주기 (3초 후 자동 사라짐)
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
        setIsBattleStarted(false);

        // 종료 오버레이 보여주기 (3초 후 자동 사라짐 뒤 투표/결과 로직)
        setShowEndOverlay(true);
        setTimeout(() => {
          setShowEndOverlay(false);

          // 종료 아이콘이 사라진 시점에, 관전자 투표 또는 바로 결과 조회
          if (ownerData && ownerData.role === 'spectator' && !hasVoted) {
            setVoteModalVisible(true);
          } else {
            fetchBattleResult();
          }
        }, 3000);

        alert('배틀이 종료되었습니다! 관전자 분들은 투표해주세요.');
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
      // 오류 시 모달 없이 넘어가도 무방
    }
  };

  // ─── 투표 모달에서 “A팀” / “B팀” 클릭 시 호출 ─────────────────────
  const handleVote = async (choice: 'A' | 'B') => {
    if (!ownerData || hasVoted) return;

    try {
      const payload: CreateVoteRequest = { vote: choice };
      await VoteApi.createVote(roomId, payload);
      setHasVoted(true);
      setVoteModalVisible(false);
      alert(`투표 완료! ${choice}팀을 선택하셨습니다.`);
      fetchBattleResult();
    } catch (err: any) {
      console.error(err.message);
      alert('투표 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setVoteModalVisible(false);
      fetchBattleResult();
    }
  };

  // ─── 투표 모달 취소 / 자동 닫힘 로직 ─────────────────────
  const handleVoteCancel = () => {
    setVoteModalVisible(false);
    fetchBattleResult();
  };
  useEffect(() => {
    // 투표 모달이 켜지면 20초 후에 자동으로 닫고 결과 모달 띄우기
    if (voteModalVisible) {
      const timer = setTimeout(() => {
        if (!hasVoted) {
          setVoteModalVisible(false);
          fetchBattleResult();
        }
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [voteModalVisible, hasVoted]);

  // ─── 플레이어 강퇴 ─────────────────────
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
    let newRoleValue: ChangeRoleRequest['role'] =
      area === 'spectator' ? 'P' : index === 0 ? 'A' : 'B';

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
  const handleDirectSubject = () => {
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

  // ─── 오른쪽 슬롯(B팀) ─────────────────────
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

      {/* ─── 역할 이동 확인 모달 ───────────────────────────── */}
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

      {/* ─── 직접 주제 입력 모달 ───────────────────────────── */}
      {modalVisible && (
        <ModalComponent title='주제 입력 (주제 A / 주제 B)'>
          <ColumnContainer>
            <ModalInput
              type='text'
              placeholder='주제 A 입력...'
              value={subjectAInput}
              onChange={(e) => setSubjectAInput(e.currentTarget.value)}
            />
            <ModalInput
              type='text'
              placeholder='주제 B 입력...'
              value={subjectBInput}
              onChange={(e) => setSubjectBInput(e.currentTarget.value)}
            />
          </ColumnContainer>
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

      {/* ─── 강퇴 확인 모달 ───────────────────────────── */}
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

      {/* ─── 투표 모달 (배틀 종료 후, 관전자용) ───────────────────────────── */}
      {voteModalVisible &&
        !hasVoted &&
        ownerData &&
        ownerData.role === 'spectator' && (
          <ModalComponent title='승리팀을 투표해주세요'>
            <ModalText>누가 이긴 것 같으신가요?</ModalText>
            <VoteButtonGroup>
              <VoteButton onClick={() => handleVote('A')}>A팀 투표</VoteButton>
              <VoteButton onClick={() => handleVote('B')}>B팀 투표</VoteButton>
            </VoteButtonGroup>
            <ModalCancelButton onClick={handleVoteCancel}>
              나중에 투표
            </ModalCancelButton>
          </ModalComponent>
        )}

      {/* ─── 최종 결과 모달 ───────────────────────────── */}
      {resultModalVisible && battleResult && (
        <ModalComponent title='토론 최종 결과 및 포인트'>
          <ResultContainer>
            <ResultRow>
              <ResultLabel>투표 집계</ResultLabel>
              <ResultValue>
                A: {battleResult.voteCount.A}표&nbsp;&nbsp;B:{' '}
                {battleResult.voteCount.B}표
              </ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>투표 승자</ResultLabel>
              <ResultValue>{battleResult.voteWinner}</ResultValue>
            </ResultRow>
            <ResultRow>
              <ResultLabel>AI 분석 승자</ResultLabel>
              <ResultValue>{battleResult.aiWinner}</ResultValue>
            </ResultRow>
            <SectionDivider />
            <SectionTitle>판정 이유</SectionTitle>
            <SectionText>{battleResult.judgementReason}</SectionText>
            <SectionDivider />
            <SectionTitle>AI 상세 분석</SectionTitle>
            <SectionText style={{ whiteSpace: 'pre-wrap' }}>
              {battleResult.aiAnalysis}
            </SectionText>
            <SectionDivider />
            <ResultRow>
              <ResultLabel>획득 포인트</ResultLabel>
              <ResultValue>
                {battleResult.pointsAwarded.toLocaleString()} P
              </ResultValue>
            </ResultRow>
          </ResultContainer>
          <ModalButtons style={{ marginTop: '1rem', justifyContent: 'center' }}>
            <ModalSubmitButton onClick={() => setResultModalVisible(false)}>
              확인
            </ModalSubmitButton>
          </ModalButtons>
        </ModalComponent>
      )}

      {/* ─── 게임 시작 오버레이 (아이콘 제거) ───────────────────────────── */}
      {showStartOverlay && (
        <OverlayCenter>
          <OverlayText>게임 시작</OverlayText>
        </OverlayCenter>
      )}

      {/* ─── 게임 종료 오버레이 (아이콘 제거) ───────────────────────────── */}
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

/** 헤더 */
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
  cursor: ${({ $occupied }) => ($occupied ? 'default' : 'pointer')};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: ${({ $occupied }) => ($occupied ? 'none' : 'scale(1.03)')};
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
  background-color: ${({ $bgColor }) => $bgColor};
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

/** 모달 오버레이(공통) ───────────────────────────── */
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

/** 모달 콘텐츠(흰 배경 박스) */
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

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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

/** “네” 버튼 */
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

/** “아니요” 버튼 */
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

const VoteButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
`;

const VoteButton = styled.button`
  background-color: #2196f3;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

/** 최종 결과 모달 내부 컨테이너 */
const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 70vh;
  overflow-y: auto;
`;

/** 결과 항목 가로 배치 */
const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/** 결과 레이블 */
const ResultLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

/** 결과 값 */
const ResultValue = styled.span`
  color: #000;
`;

/** 구분선 */
const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
`;

/** 소제목 */
const SectionTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

/** 본문 텍스트 */
const SectionText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 0;
`;

/** 게임 시작/종료 오버레이 중앙 박스 */
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

/** 오버레이 텍스트 (흰색) */
const OverlayText = styled.span`
  color: #fff;
  font-size: 5rem;
  font-weight: bold;
  margin-top: 0.5rem;
`;
