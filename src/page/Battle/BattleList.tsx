// src/pages/Battle/BattleList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RoomCard, { RoomData } from '../../components/Battle/RoomCard';
import Pagination from '../../components/Battle/Pagination';
import RoomModal from '../../components/Battle/RoomModal';
import CreateRoomModal from '../../components/Battle/CreateRoomModal';
import { BattleRoomApi } from '../../api/battle/battleRoomApi'; // 경로 확인

const ROOMS_PER_PAGE = 10;

/**
 * RoomSummary 타입
 */
interface RoomSummary {
  roomId: number; // 서버에서 숫자로 내려온다고 가정
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
  topicA: string;
  topicB: string;
}

const BattleList: React.FC = () => {
  const navigate = useNavigate();

  // 전체 방 목록
  const [allRooms, setAllRooms] = useState<RoomSummary[]>([]);
  const [page, setPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // 생성 중 로딩 상태

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(allRooms.length / ROOMS_PER_PAGE);

  // 방 목록 가져오기
  const fetchRooms = async () => {
    try {
      const roomsFromApi: RoomSummary[] = await BattleRoomApi.getAllRooms();
      setAllRooms(roomsFromApi);
    } catch (error) {
      console.error('[BattleList] 전체 방 조회 오류:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 현재 페이지에 표시할 방들
  const startIndex = (page - 1) * ROOMS_PER_PAGE;
  const pageSlice = allRooms.slice(startIndex, startIndex + ROOMS_PER_PAGE);

  // RoomSummary → RoomData 매핑
  const roomsToDisplay: RoomData[] = pageSlice.map((r) => ({
    id: r.roomId,
    name: `${r.topicA} vs ${r.topicB}`,
    status: r.status,
    current: 0, // 참가자 수는 별도 API 없으므로 임시로 0
    max: 8,
    hasReturningUser: false,
  }));

  // 빈 슬롯 채우기
  if (roomsToDisplay.length < ROOMS_PER_PAGE) {
    const empties = Array(ROOMS_PER_PAGE - roomsToDisplay.length).fill({
      id: 0,
      name: '',
      status: '' as any,
      current: 0,
      max: 8,
      hasReturningUser: false,
    });
    roomsToDisplay.push(...empties);
  }

  const prev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const next = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  /** 카드 클릭 시 상세 페이지로 이동 */
  const handleCardClick = (roomId: number) => {
    if (roomId !== 0) {
      navigate(`/battle/${roomId}`);
    }
  };

  /** 유저 아이콘 클릭 시 모달 열기 */
  const handleUserIconClick = (e: React.MouseEvent, room: RoomData) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  /** 방 만들기 버튼 클릭 시 생성 API 호출 */
  const handleCreateRoom = async (roomName: string) => {
    try {
      setIsCreating(true);
      // API 명세에 맞춰 payload 설정
      const newRoom = await BattleRoomApi.createRoom({ roomName });
      // 생성된 방을 로그로 확인 (optional)
      console.log('생성된 방 정보:', newRoom);

      // 생성 성공 후 모달 닫고 목록 갱신
      setShowCreateModal(false);
      await fetchRooms();
    } catch (error) {
      console.error('[BattleList] 방 생성 실패:', error);
      alert('방 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderButton
            $primary
            onClick={() => setShowCreateModal(true)}
            disabled={isCreating}
          >
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
            key={room.id || Math.random()}
            room={room}
            onCardClick={handleCardClick}
            onUserIconClick={handleUserIconClick}
          />
        ))}
      </Main>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
      />

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
          isLoading={isCreating}
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
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Main = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;
