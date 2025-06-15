import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RoomCard, { RoomData } from '../../components/Battle/RoomCard';
import Pagination from '../../components/Battle/Pagination';
import RoomModal from '../../components/Battle/RoomModal';
import CreateRoomModal from '../../components/Battle/CreateRoomModal';
import { BattleRoomApi } from '../../api/battle/battleRoomApi';

const ROOMS_PER_PAGE = 10;

interface RawRoomSummary {
  roomId: string;
  roomName: string;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED' | 'ENDED';
  spectatorCount: number;
}

const BattleList: React.FC = () => {
  const navigate = useNavigate();

  const [roomsThisPage, setRoomsThisPage] = useState<RawRoomSummary[]>([]);
  const [page, setPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const hasPrev = page > 1;
  const hasNext = roomsThisPage.length === ROOMS_PER_PAGE;

  // ✅ 실시간 방 목록 polling
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchRooms = async () => {
      try {
        const roomsFromApi: any[] = await BattleRoomApi.getAllRooms(page);
        setRoomsThisPage(roomsFromApi as RawRoomSummary[]);
      } catch (error) {
        console.error('[BattleList] 전체 방 조회 오류:', error);
      }
    };

    fetchRooms(); // 첫 로딩
    intervalId = setInterval(fetchRooms, 2000); // 2초마다 반복

    return () => clearInterval(intervalId); // 언마운트 시 정리
  }, [page]);

  const roomsToDisplay: RoomData[] = roomsThisPage.map((r) => ({
    id: Number(r.roomId),
    name: r.roomName || `[방 ${r.roomId}]`,
    status: r.status as RoomData['status'],
    current: r.spectatorCount,
    max: 8,
    hasReturningUser: false,
  }));

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
    if (hasPrev) setPage((p) => p - 1);
  };

  const next = () => {
    if (hasNext) setPage((p) => p + 1);
  };

  const handleCardClick = async (roomId: number) => {
    if (roomId === 0) return;
    try {
      await BattleRoomApi.joinRoom(roomId);
      navigate(`/battle/${roomId}`);
    } catch (error) {
      console.error(`[BattleList] 방 ${roomId} 참가 오류:`, error);
    }
  };

  const handleUserIconClick = (e: React.MouseEvent, room: RoomData) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleCreateRoom = async (name: string) => {
    try {
      const result = await BattleRoomApi.createRoom({ roomName: name });
      await BattleRoomApi.joinRoom(result.roomId);
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
