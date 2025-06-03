// src/pages/Battle/BattleList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RoomCard, { RoomData } from '../../components/Battle/RoomCard';
import Pagination from '../../components/Battle/Pagination';
import RoomModal from '../../components/Battle/RoomModal';
import CreateRoomModal from '../../components/Battle/CreateRoomModal';
import { BattleRoomApi } from '../../api/battle/battleRoomApi';

// 한 페이지에 표시할 방 개수
const ROOMS_PER_PAGE = 10;

/**
 * 실제 API에서 내려주는 JSON 형식에 맞춘 로컬 타입
 *  - API 응답 예시:
 *    {
 *      "roomId": "1",
 *      "roomName": "",
 *      "status": "ENDED",
 *      "spectatorCount": 3
 *    }
 */
interface RawRoomSummary {
  roomId: string;
  roomName: string;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED' | 'ENDED';
  spectatorCount: number;
}

const BattleList: React.FC = () => {
  const navigate = useNavigate();

  // 해당 페이지의 방 목록 (RawRoomSummary[])
  const [roomsThisPage, setRoomsThisPage] = useState<RawRoomSummary[]>([]);
  const [page, setPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 다음/이전 버튼 활성 여부
  const hasPrev = page > 1;
  const hasNext = roomsThisPage.length === ROOMS_PER_PAGE;

  // 페이지가 바뀔 때마다 해당 페이지 데이터(API) 호출
  useEffect(() => {
    (async () => {
      try {
        // 서버 API에 페이지 쿼리 파라미터 전달
        const roomsFromApi: any[] = await BattleRoomApi.getAllRooms(page);
        setRoomsThisPage(roomsFromApi as RawRoomSummary[]);
      } catch (error) {
        console.error('[BattleList] 전체 방 조회 오류:', error);
      }
    })();
  }, [page]);

  // RawRoomSummary → RoomData 매핑 (roomId: string → 숫자로 변환, roomName 사용)
  const roomsToDisplay: RoomData[] = roomsThisPage.map((r) => ({
    id: Number(r.roomId),
    name: r.roomName || `[방 ${r.roomId}]`, // 빈 문자열일 경우 ID로 대체
    status: r.status as RoomData['status'],
    current: r.spectatorCount, // 현재 관전자 수
    max: 8, // 최대 인원 고정
    hasReturningUser: false,
  }));

  // 페이지 내 빈 자리가 있을 때 빈 칸 채우기
  if (roomsToDisplay.length < ROOMS_PER_PAGE) {
    const empties = Array(ROOMS_PER_PAGE - roomsToDisplay.length).fill({
      id: 0,
      name: '',
      status: '' as RoomData['status'],
      current: 0,
      max: 8,
      hasReturningUser: false,
    });
    roomsToDisplay.push(...empties);
  }

  const prev = () => {
    if (hasPrev) {
      setPage((p) => p - 1);
    }
  };
  const next = () => {
    if (hasNext) {
      setPage((p) => p + 1);
    }
  };

  /**
   * 카드 클릭 시:
   * - roomId가 0이 아니면(빈 슬롯이 아니면) 관전자 모드로 API 호출 후 방으로 이동
   */
  const handleCardClick = async (roomId: number) => {
    if (roomId === 0) return;

    try {
      await BattleRoomApi.joinRoom(roomId);
      navigate(`/battle/${roomId}`);
    } catch (error) {
      console.error(`[BattleList] 방 ${roomId} 참가 오류:`, error);
    }
  };

  /** 유저 아이콘 클릭 시 모달 열기 */
  const handleUserIconClick = (e: React.MouseEvent, room: RoomData) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  /**
   * 방 만들기 버튼 클릭 시 모달 열기 → 방 생성 API 호출 후 바로 방 참가(join) → 방 상세페이지로 이동
   */
  const handleCreateRoom = async (name: string) => {
    try {
      // 1) 방 생성
      const result = await BattleRoomApi.createRoom({ roomName: name });

      // 2) 생성된 roomId로 즉시 참가
      await BattleRoomApi.joinRoom(result.roomId);

      // 3) 모달 닫고 상세 페이지로 이동
      setShowCreateModal(false);
      navigate(`/battle/${result.roomId}`);
    } catch (error) {
      console.error('[BattleList] 방 생성 오류:', error);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderButton $primary onClick={() => setShowCreateModal(true)}>
            방 만들기
          </HeaderButton>
        </HeaderLeft>
        <HeaderRight>
          <HeaderButton>대기방 입장</HeaderButton>
        </HeaderRight>
      </Header>

      <Main>
        {roomsToDisplay.map((room) => (
          <RoomCard
            key={room.id !== 0 ? room.id : Math.random()}
            room={room}
            onCardClick={handleCardClick}
            onUserIconClick={handleUserIconClick}
          />
        ))}
      </Main>

      <Pagination
        page={page}
        totalPages={hasNext ? page + 1 : page}
        onPrev={prev}
        onNext={next}
      />

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {showRoomModal && selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setShowRoomModal(false)}
        />
      )}
    </Container>
  );
};

export default BattleList;

// ─────────────────────────────────────────────────────────────────
// Styled Components 정의
// ─────────────────────────────────────────────────────────────────

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
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Malgun Gothic', 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const HeaderButton = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  min-width: 100px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ $primary }) => ($primary ? '#0050b3' : '#ffa700')};
  border: 2px solid #000;
`;

const Main = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;
