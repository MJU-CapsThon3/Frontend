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
  FaUserFriends,
  FaUserTie,
  FaBaby,
  FaSmile,
  FaLaugh,
  FaSurprise,
  FaGhost,
  FaDragon,
  FaCrow,
  FaCat,
  FaBorderStyle,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// ───── API import ──────────────────────────────
import {
  BattleRoomApi,
  RoomDetailFull,
  GenerateAITopicsResponse,
  SetTopicsRequest,
} from '../../api/battle/battleRoomApi';

import BattleChatApi, {
  ChatMessage as RestChatMessage,
  GetChatMessagesResponse,
  PostChatMessageRequest,
  GetChatMessageEmotionResponse,
} from '../../api/chat/chatApi';

import VoteApi, { CreateVoteRequest } from '../../api/vote/voteApi'; // 투표 API

// ───── 아이콘 임포트 ──────────────────────────────
// 티어 아이콘
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';
// 샵 팀 아이콘 예시 (17개)
import TeamIcon1 from '../../assets/ShopIcon/TeamIcon1.svg';
import TeamIcon2 from '../../assets/ShopIcon/TeamIcon2.svg';
import TeamIcon3 from '../../assets/ShopIcon/TeamIcon3.svg';
import TeamIcon4 from '../../assets/ShopIcon/TeamIcon4.svg';
import TeamIcon5 from '../../assets/ShopIcon/TeamIcon5.svg';
import TeamIcon6 from '../../assets/ShopIcon/TeamIcon6.svg';
import TeamIcon7 from '../../assets/ShopIcon/TeamIcon7.svg';
import TeamIcon8 from '../../assets/ShopIcon/TeamIcon8.svg';
import TeamIcon9 from '../../assets/ShopIcon/TeamIcon9.svg';
import TeamIcon10 from '../../assets/ShopIcon/TeamIcon10.svg';
import TeamIcon11 from '../../assets/ShopIcon/TeamIcon11.svg';
import TeamIcon12 from '../../assets/ShopIcon/TeamIcon12.svg';
import TeamIcon13 from '../../assets/ShopIcon/TeamIcon13.svg';
import TeamIcon14 from '../../assets/ShopIcon/TeamIcon14.svg';
import TeamIcon15 from '../../assets/ShopIcon/TeamIcon15.svg';
import TeamIcon16 from '../../assets/ShopIcon/TeamIcon16.svg';
import TeamIcon17 from '../../assets/ShopIcon/TeamIcon17.svg';

// ───── 분리된 컴포넌트 import ───────────────────
import DirectSubjectModal from '../../components/BattleDetail/DirectSubjectModal';
import VoteModal from '../../components/BattleDetail/VoteModal';
import ResultModal from '../../components/BattleDetail/ResultModal';

// ─── 경고 모달 컴포넌트 ─────────────────────────
// 감정 분석 경고용 모달 (기존)
const WarningModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  msgPreview: string;
}> = ({ visible, onClose, msgPreview }) => {
  if (!visible) return null;
  return (
    <WarningOverlay>
      <WarningContent>
        <WarningTitle>감정 분석 경고</WarningTitle>
        <WarningBody>
          다음 메시지에서 부정적인 감정 또는 위험 가능성이 감지되었습니다:
        </WarningBody>
        <WarningMessagePreview>{msgPreview}</WarningMessagePreview>
        <WarningButton onClick={onClose}>확인</WarningButton>
      </WarningContent>
    </WarningOverlay>
  );
};

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
  avatarUrl?: string; // API로 실제 URL이 올 경우 사용 가능하나 우선 랜덤 아이콘 매핑
  isReady?: boolean;
  team?: 'blue' | 'red';
  role: Role;
  tier: Tier;
};

// REST로 조회해서 받아오는 메시지 타입
export type ChatMessage = RestChatMessage & {
  nickname?: string;
};

const OWNER_ID = 1; // 예시: 현재 로그인된 사용자 ID. 실제로는 auth context 등에서 받아올 것.
const TOTAL_SLOTS = 8;
const BOX_SIZE = '150px';
const POLL_INTERVAL = 2000; // 2초마다 방 상태 폴링
const INITIAL_TIMER = 180; // 3분 = 180초
const CHAT_POLL_INTERVAL = 2000; // 2초마다 채팅 내역 폴링
const VOTE_TIMEOUT = 10000; // 10초 후 자동 투표 (ms)

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

const BattleDetail: React.FC = () => {
  const [adminId, setAdminId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ─── 상태 정의 ───────────────────────────────────
  const [ownerSpectatorSlot, setOwnerSpectatorSlot] = useState<number | null>(
    null
  );
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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
  const prevIsBattleStarted = useRef<boolean>(false);

  // ─── 리매치 가능 여부 ─────────────────────
  const [rematchAvailable, setRematchAvailable] = useState(false);

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

  // ─── 감정 경고 모달 상태 ─────────────────────
  const [warningModalVisible, setWarningModalVisible] =
    useState<boolean>(false);
  const [warningMsgPreview, setWarningMsgPreview] = useState<string>('');

  // 투표 타이머(10초) 및 결과 폴링 핸들러
  const voteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultPollingRef = useRef<NodeJS.Timeout | null>(null);

  // 이미 감정분석 호출을 마친 메시지 ID 추적용
  const processedEmotion = useRef<Set<string>>(new Set());

  // ─── 유저별 랜덤 샵 아이콘 매핑 ─────────────────
  const [avatarMap, setAvatarMap] = useState<Record<number, React.ReactNode>>(
    {}
  );
  const availableAvatarIcons: React.ReactNode[] = [
    <img
      key='team1'
      src={TeamIcon1}
      alt='TeamIcon1'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team2'
      src={TeamIcon2}
      alt='TeamIcon2'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team3'
      src={TeamIcon3}
      alt='TeamIcon3'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team4'
      src={TeamIcon4}
      alt='TeamIcon4'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team5'
      src={TeamIcon5}
      alt='TeamIcon5'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team6'
      src={TeamIcon6}
      alt='TeamIcon6'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team7'
      src={TeamIcon7}
      alt='TeamIcon7'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team8'
      src={TeamIcon8}
      alt='TeamIcon8'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team9'
      src={TeamIcon9}
      alt='TeamIcon9'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team10'
      src={TeamIcon10}
      alt='TeamIcon10'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team11'
      src={TeamIcon11}
      alt='TeamIcon11'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team12'
      src={TeamIcon12}
      alt='TeamIcon12'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team13'
      src={TeamIcon13}
      alt='TeamIcon13'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team14'
      src={TeamIcon14}
      alt='TeamIcon14'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team15'
      src={TeamIcon15}
      alt='TeamIcon15'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team16'
      src={TeamIcon16}
      alt='TeamIcon16'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
    <img
      key='team17'
      src={TeamIcon17}
      alt='TeamIcon17'
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />,
  ];

  const ensureAvatarForId = (id: number) => {
    setAvatarMap((prev) => {
      if (prev[id]) {
        return prev;
      }
      const idx = Math.floor(Math.random() * availableAvatarIcons.length);
      return {
        ...prev,
        [id]: availableAvatarIcons[idx],
      };
    });
  };

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
      setAdminId(Number(data.adminId));
      setIsBattleStarted(data.status === 'PLAYING');
      setSpectatorCount((data as any).spectators.length);

      // FINISHED 상태면 리매치 가능
      setRematchAvailable(
        data.status === 'FINISHED' || data.status === 'ENDED'
      );

      if (data.question) {
        setSubject(data.question);
        setSideAOption(data.topicA);
        setSideBOption(data.topicB);
      }

      const fetchedPlayers: PlayerData[] = [];

      const mapTier = (apiTier: string | undefined): Tier => {
        if (!apiTier) return 'bronze';
        const lower = apiTier.toLowerCase();
        if (lower.includes('bronze')) return 'bronze';
        if (lower.includes('silver')) return 'silver';
        if (lower.includes('gold')) return 'gold';
        if (lower.includes('platinum')) return 'platinum';
        if (lower.includes('diamond')) return 'diamond';
        if (lower.includes('master')) {
          if (lower.includes('grand')) return 'grandmaster';
          return 'master';
        }
        if (lower.includes('grandmaster')) return 'grandmaster';
        if (lower.includes('challenger')) return 'challenger';
        return 'bronze';
      };

      (data as any).participantA.forEach((u: any) => {
        const idNum = Number(u.userId);
        const nickname =
          u.nickname && String(u.nickname).trim()
            ? String(u.nickname)
            : `유저${u.userId}`;
        const tier = mapTier(u.tier);
        fetchedPlayers.push({
          id: idNum,
          nickname,
          avatarUrl: '',
          isReady: true,
          team: 'blue',
          role: 'participant',
          tier,
        });
        if (idNum === OWNER_ID) {
          setOwnerSpectatorSlot(null);
        }
      });
      (data as any).participantB.forEach((u: any) => {
        const idNum = Number(u.userId);
        const nickname =
          u.nickname && String(u.nickname).trim()
            ? String(u.nickname)
            : `유저${u.userId}`;
        const tier = mapTier(u.tier);
        fetchedPlayers.push({
          id: idNum,
          nickname,
          avatarUrl: '',
          isReady: true,
          team: 'red',
          role: 'participant',
          tier,
        });
        if (idNum === OWNER_ID) {
          setOwnerSpectatorSlot(null);
        }
      });
      (data as any).spectators.forEach((u: any, idx: number) => {
        const idNum = Number(u.userId);
        const nickname =
          u.nickname && String(u.nickname).trim()
            ? String(u.nickname)
            : `유저${u.userId}`;
        const tier = mapTier(u.tier);
        fetchedPlayers.push({
          id: idNum,
          nickname,
          avatarUrl: '',
          role: 'spectator',
          tier,
        });
        if (idNum === OWNER_ID) {
          setOwnerSpectatorSlot(idx);
        }
      });

      setPlayers(fetchedPlayers);

      fetchedPlayers.forEach((p) => {
        ensureAvatarForId(p.id);
      });
    } catch (err) {
      console.error('배틀방 상세 조회 오류:', err);
    }
  }, [roomId]);

  // ─── 과거 채팅 내역(REST) 한 번 조회 & 폴링 시작 ─────────────────────
  useEffect(() => {
    let pollingHandle: NodeJS.Timeout;

    const fetchChatMessages = async () => {
      try {
        const res: GetChatMessagesResponse =
          await BattleChatApi.getChatMessages(roomId);

        const combined: ChatMessage[] = [
          ...res.result.sideA,
          ...res.result.sideB,
        ].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        const combinedWithNickname = combined.map((msg) => {
          if ((msg as any).nickname) {
            return msg;
          }
          const found = players.find((p) => p.id === msg.userId);
          if (found) {
            return {
              ...msg,
              nickname: found.nickname,
            };
          }
          return msg;
        });

        setChatMessages(combinedWithNickname);

        combinedWithNickname.forEach(async (msg) => {
          if (!processedEmotion.current.has(msg.id)) {
            processedEmotion.current.add(msg.id);
            try {
              const emoRes: GetChatMessageEmotionResponse =
                await BattleChatApi.getChatMessageEmotion(roomId, msg.id);
              if (emoRes.isSuccess) {
                const { emotion, warning, probabilities } = emoRes.result;
                setChatMessages((prev) =>
                  prev.map((m) =>
                    m.id === msg.id
                      ? {
                          ...m,
                          emotion,
                          warning,
                          probabilities,
                        }
                      : m
                  )
                );
                if (warning) {
                  const p = players.find((p) => p.id === emoRes.result.userId);
                  const nameForPreview = p
                    ? p.nickname
                    : msg.nickname
                      ? msg.nickname
                      : `유저${emoRes.result.userId}`;
                  const preview = `[${emoRes.result.side}] ${nameForPreview}: ${msg.message}`;
                  setWarningMsgPreview(preview);
                  setWarningModalVisible(true);
                }
              }
            } catch (e) {
              console.error('감정분석 조회 실패:', e);
            }
          }
        });
      } catch (e) {
        console.error('과거 채팅 조회 실패:', e);
      }
    };

    fetchChatMessages();
    pollingHandle = setInterval(fetchChatMessages, CHAT_POLL_INTERVAL);

    return () => {
      clearInterval(pollingHandle);
    };
  }, [roomId, players]);

  // ─── 기존 방 상태/타이머 폴링 ─────────────────────
  useEffect(() => {
    fetchRoomDetail();
    const interval = setInterval(fetchRoomDetail, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRoomDetail]);

  // ─── 투표 모달이 열릴 때: 10초 카운트다운 + 결과 폴링 시작 ─────────────────────
  useEffect(() => {
    if (voteModalVisible) {
      voteTimeoutRef.current = setTimeout(() => {
        if (!hasVoted) {
          console.log('자동 투표 처리: A팀으로 투표 처리합니다.');
          handleVote('A');
        }
      }, VOTE_TIMEOUT);

      const pollResult = async () => {
        try {
          const result = await BattleRoomApi.getBattleResult(
            parseInt(roomId, 10)
          );
          if (result && result.voteCount !== undefined) {
            setBattleResult(result);
            setVoteModalVisible(false);
            setResultModalVisible(true);
          }
        } catch (e) {
          console.error('결과 조회 중 오류:', e);
        }
      };

      pollResult();
      resultPollingRef.current = setInterval(pollResult, 2000);
    }

    return () => {
      if (voteTimeoutRef.current) {
        clearTimeout(voteTimeoutRef.current);
        voteTimeoutRef.current = null;
      }
      if (resultPollingRef.current) {
        clearInterval(resultPollingRef.current);
        resultPollingRef.current = null;
      }
    };
  }, [voteModalVisible, hasVoted, roomId]);

  // ─── 배틀이 끝났을 때 투표 모달 열기 + 결과 폴링 ─────────────────────
  useEffect(() => {
    if (prevIsBattleStarted.current && !isBattleStarted) {
      setBattleResult(null);
      setVoteModalVisible(true);
      setHasVoted(false);
      pollResultForModal();
    }
    prevIsBattleStarted.current = isBattleStarted;
  }, [isBattleStarted]);

  // ─── 결과 모달이 열릴 때 폴링 (Spinner → 결과) ─────────────────────
  const pollResultForModal = () => {
    if (resultPollingRef.current) {
      clearInterval(resultPollingRef.current);
      resultPollingRef.current = null;
    }
    const poll = async () => {
      try {
        const result = await BattleRoomApi.getBattleResult(
          parseInt(roomId!, 10)
        );
        if (result && result.voteCount !== undefined) {
          setBattleResult(result);
          if (resultPollingRef.current) {
            clearInterval(resultPollingRef.current);
            resultPollingRef.current = null;
          }
        }
      } catch (e) {
        console.error('결과 조회 중 오류:', e);
      }
    };
    poll();
    resultPollingRef.current = setInterval(poll, 2000);
  };

  // ─── 채팅 스크롤 자동 최하단 유지 ─────────────────────
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ─── 채팅 전송 ─────────────────────────────
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const side = ownerData?.team === 'blue' ? 'A' : 'B';
    const payload: PostChatMessageRequest = {
      side,
      message: chatInput.trim(),
    };
    try {
      await BattleChatApi.postChatMessage(roomId, payload);
    } catch (err) {
      console.error('채팅 저장 실패:', err);
    }
    try {
      const res: GetChatMessagesResponse =
        await BattleChatApi.getChatMessages(roomId);
      const combined: ChatMessage[] = [
        ...res.result.sideA,
        ...res.result.sideB,
      ].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const combinedWithNickname = combined.map((msg) => {
        if ((msg as any).nickname) {
          return msg;
        }
        const found = players.find((p) => p.id === msg.userId);
        if (found) {
          return {
            ...msg,
            nickname: found.nickname,
          };
        }
        return msg;
      });

      setChatMessages(combinedWithNickname);

      // 전송 후 새로운 메시지에 대해 감정분석 호출
      combinedWithNickname.forEach(async (msg) => {
        if (!processedEmotion.current.has(msg.id)) {
          processedEmotion.current.add(msg.id);
          try {
            const emoRes: GetChatMessageEmotionResponse =
              await BattleChatApi.getChatMessageEmotion(roomId, msg.id);
            if (emoRes.isSuccess) {
              const { emotion, warning, probabilities } = emoRes.result;
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === msg.id
                    ? {
                        ...m,
                        emotion,
                        warning,
                        probabilities,
                      }
                    : m
                )
              );
              if (warning) {
                const p = players.find((p) => p.id === emoRes.result.userId);
                const nameForPreview = p
                  ? p.nickname
                  : msg.nickname
                    ? msg.nickname
                    : `유저${emoRes.result.userId}`;
                const preview = `[${emoRes.result.side}] ${nameForPreview}: ${msg.message}`;
                setWarningMsgPreview(preview);
                setWarningModalVisible(true);
              }
            }
          } catch (e) {
            console.error('감정분석 조회 실패:', e);
          }
        }
      });
    } catch (e) {
      console.error('채팅 전송 후 조회 실패:', e);
    }
    setChatInput('');
  };

  // ─── 투표 처리 (A 또는 B) ─────────────────────
  const handleVote = async (choice: 'A' | 'B') => {
    if (hasVoted) return;
    setHasVoted(true);
    try {
      const payload: CreateVoteRequest = { vote: choice };
      await VoteApi.createVote(roomId, payload);
      setVoteModalVisible(false);
      setResultModalVisible(true);
      setBattleResult(null);
      pollResultForModal();
    } catch (err: any) {
      console.error('투표 중 오류:', err);
      alert('투표 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setVoteModalVisible(false);
    }
  };

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
    if (isBattleStarted) {
      setTimer(INITIAL_TIMER);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimer(0);
            setVoteModalVisible(true);
            setHasVoted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimer(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBattleStarted]);

  // ─── “시작/종료/리매치” 버튼 클릭 핸들러:
  // 이제 비관리자는 버튼이 disabled 되어 클릭되지 않으므로, 단순히 handleToggleBattle만 호출
  const handleStartButtonClick = () => {
    handleToggleBattle();
  };

  // ─── 최종 결과 조회 함수 (단발) ─────────────────────
  const fetchBattleResult = async () => {
    try {
      const result = await BattleRoomApi.getBattleResult(parseInt(roomId, 10));
      setBattleResult(result);
      setResultModalVisible(true);
    } catch (err) {
      console.error('최종 결과 조회 오류:', err);
    }
  };

  // ─── 투표 모달 취소 시 ─────────────────────
  const handleVoteCancel = () => {
    setVoteModalVisible(false);
    setBattleResult(null);
    setResultModalVisible(true);
    pollResultForModal();
  };

  // ─── 플레이어 강퇴 ─────────────────────
  const handleKickPlayer = () => {
    if (selectedPlayer) {
      setPlayers((prev) => prev.filter((p) => p.id !== selectedPlayer.id));
      setKickModalVisible(false);
      setSelectedPlayer(null);
    }
  };

  // ─── A/B 역할 변경 핸들러 ─────────────────────
  const handleChangeToA = async () => {
    try {
      await BattleRoomApi.changeToRoleA(parseInt(roomId, 10));
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === OWNER_ID
            ? {
                ...p,
                role: 'participant',
                team: 'blue',
                isReady: true,
              }
            : p
        )
      );
      setOwnerSpectatorSlot(null);
      fetchRoomDetail();
    } catch (err) {
      console.error('A 역할 변경 오류:', err);
      alert('A 역할 변경 중 오류가 발생했습니다.');
    }
  };

  const handleChangeToB = async () => {
    try {
      await BattleRoomApi.changeToRoleB(parseInt(roomId, 10));
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === OWNER_ID
            ? {
                ...p,
                role: 'participant',
                team: 'red',
                isReady: true,
              }
            : p
        )
      );
      setOwnerSpectatorSlot(null);
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
      setSubject('랜덤 주제 생성 실패');
      setSideAOption('');
      setSideBOption('');
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
    const isAdmin = adminId !== null && player.id === adminId;
    const bgColor =
      player.team === 'blue'
        ? '#33bfff'
        : player.team === 'red'
          ? '#ff6b6b'
          : '#fff';

    const avatarNode = avatarMap[player.id];

    return (
      <StyledPlayerCard $bgColor={bgColor}>
        <Nickname>
          {player.nickname} {isOwner && '(나)'}
        </Nickname>
        <TierIcon src={tierIcons[player.tier]} alt={player.tier} />
        {avatarNode ? (
          isSpectator ? (
            <SpectatorAvatarContainer>{avatarNode}</SpectatorAvatarContainer>
          ) : (
            <PlayerAvatarContainer>{avatarNode}</PlayerAvatarContainer>
          )
        ) : player.avatarUrl && player.avatarUrl.trim() !== '' ? (
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
        <RankArea>{isAdmin ? <OwnerBadge>방 장</OwnerBadge> : null}</RankArea>
      </StyledPlayerCard>
    );
  };

  // ─── 왼쪽 슬롯(A팀) ─────────────────────
  const renderLeftSlot = () => (
    <CenteredDiv>
      <ParticipantKeyword>{sideAOption}</ParticipantKeyword>
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
  const ChatBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
    const isNotice = msg.message.startsWith('[공지]');
    const displayName =
      msg.nickname ??
      players.find((p) => p.id === msg.userId)?.nickname ??
      `유저${msg.userId}`;
    return (
      <ChatBubbleContainer
        side={msg.side}
        isNotice={isNotice}
        $warning={msg.warning}
      >
        <ChatBubbleText isNotice={isNotice}>
          {isNotice
            ? msg.message
            : `[${msg.side}] ${displayName}: ${msg.message}`}
          <EmotionTag>{msg.emotion}</EmotionTag>
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

  // ─── 배틀 시작/종료 로직 함수 ─────────────────────
  const handleToggleBattle = async () => {
    if (isBattleStarted) {
      // PLAYING → 종료
      try {
        await BattleRoomApi.endBattle(parseInt(roomId, 10));
        setShowEndOverlay(true);
        setTimeout(() => setShowEndOverlay(false), 3000);
        setIsBattleStarted(false);
        setRematchAvailable(true);
      } catch (err) {
        console.error('배틀 종료 오류:', err);
        alert('배틀 종료 중 오류가 발생했습니다.');
      }
    } else {
      if (rematchAvailable) {
        // 리매치 요청 (방장이면 버튼 활성화 상태에서만 클릭)
        try {
          const res = await BattleRoomApi.rematchRoom(parseInt(roomId, 10));
          if (res && res.roomId) {
            navigate(`/battle/${res.roomId}`);
          } else {
            throw new Error('리매치 응답이 올바르지 않습니다.');
          }
        } catch (err) {
          console.error('리매치 요청 오류:', err);
          alert('리매치 생성 중 오류가 발생했습니다.');
        }
      } else {
        // 아직 시작 전 → 시작
        try {
          await BattleRoomApi.startBattle(parseInt(roomId, 10));
          setShowStartOverlay(true);
          setTimeout(() => setShowStartOverlay(false), 3000);
          setIsBattleStarted(true);
        } catch (err) {
          console.error('배틀 시작 오류:', err);
          alert('배틀 시작 중 오류가 발생했습니다.');
        }
      }
    }
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
              onChange={(e) => setChatInput(e.currentTarget.value)}
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
            {/* disabled 제거: 모두가 버튼 클릭 가능 */}
            <StartButton onClick={handleStartButtonClick}>
              {isBattleStarted ? '종료' : rematchAvailable ? '리매치' : '시작'}
            </StartButton>
          </RightButtonGroup>
        </SpectatorsHeader>

        {isBattleStarted && timer > 0 && (
          <TimerDisplay>{formatTime(timer)}</TimerDisplay>
        )}

        {!isSpectatorsCollapsed && (
          <SpectatorsGrid>{renderSpectatorGrid()}</SpectatorsGrid>
        )}
      </SpectatorsSection>

      {/* ─── 직접 주제 입력 모달 ───────────────────────────── */}
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

      {/* ─── 투표 모달 ───────────────────────────── */}
      <VoteModal
        visible={voteModalVisible}
        onVoteA={() => handleVote('A')}
        onVoteB={() => handleVote('B')}
        onCancel={handleVoteCancel}
      />

      {/* ─── 최종 결과 모달 ───────────────────────────── */}
      <ResultModal
        visible={resultModalVisible}
        data={battleResult}
        onClose={() => {
          setResultModalVisible(false);
          if (resultPollingRef.current) {
            clearInterval(resultPollingRef.current);
            resultPollingRef.current = null;
          }
        }}
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

      {/* ─── 감정분석 경고 모달 ───────────────────────────── */}
      <WarningModal
        visible={warningModalVisible}
        msgPreview={warningMsgPreview}
        onClose={() => setWarningModalVisible(false)}
      />

      {/* Note: AdminWarningModal 및 관련 state, 호출부는 제거되어 있습니다 */}
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
  &:disabled {
    background-color: #ccc;
    border-color: #999;
    cursor: not-allowed;
    transform: none;
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
  cursor: default;
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
  cursor: default;
`;

const PlayerAvatarContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  & > img,
  & > svg {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
  }
`;
const SpectatorAvatarContainer = styled(PlayerAvatarContainer)`
  & > img,
  & > svg {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
  }
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

const SpectatorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

interface ChatBubbleContainerProps {
  side: 'A' | 'B';
  isNotice: boolean;
  $warning: boolean;
}

const ChatBubbleContainer = styled.div<ChatBubbleContainerProps>`
  max-width: 70%;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 16px;
  background-color: ${({ side, isNotice }) =>
    isNotice ? '#ffe6e6' : side === 'A' ? '#fff' : '#dcf8c6'};
  align-self: ${({ side }) => (side === 'A' ? 'flex-start' : 'flex-end')};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  border: ${({ $warning }) => ($warning ? '2px solid red' : 'none')};
`;

const ChatBubbleText = styled.p<{ isNotice: boolean }>`
  font-size: 0.9rem;
  color: ${({ isNotice }) => (isNotice ? 'red' : '#000')};
  margin: 0;
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

const EmotionTag = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #555;
`;

// ─── 경고 모달 styled (감정분석용) ─────────────────────────
const WarningOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;
const WarningContent = styled.div`
  background-color: #fff;
  border: 2px solid #d32f2f;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 400px;
  text-align: center;
`;
const WarningTitle = styled.h2`
  margin: 0;
  margin-bottom: 0.5rem;
  color: #d32f2f;
`;
const WarningBody = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;
const WarningMessagePreview = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: #fce4ec;
  border: 1px solid #f8bbd0;
  border-radius: 4px;
  font-size: 0.85rem;
  word-break: break-word;
`;
const WarningButton = styled.button`
  margin-top: 0.5rem;
  background-color: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #b71c1c;
  }
`;
