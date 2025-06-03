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
 *      "id": "1",
 *      "status": "ENDED",
 *      "topicA": "블리츠",
 *      "topicB": "브라움"
 *    }
 */
interface RawRoomSummary {
  id: string;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED' | 'ENDED';
  topicA: string;
  topicB: string;
}

const BattleList: React.FC = () => {
  const navigate = useNavigate();

  // API에서 받아온 전체 방 목록 (RawRoomSummary[])
  const [allRooms, setAllRooms] = useState<RawRoomSummary[]>([]);
  const [page, setPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(allRooms.length / ROOMS_PER_PAGE);

  // 컴포넌트 마운트 시 API 호출하여 방 목록 받아오기
  useEffect(() => {
    (async () => {
      try {
        // getAllRooms()가 반환하는 타입(RoomSummary[])과 실제 응답 키(id)는 다르므로
        // raw 타입을 any로 받아온 뒤, id 필드를 사용하도록 캐스팅할 것입니다.
        const roomsFromApi: any[] = await BattleRoomApi.getAllRooms();
        // roomsFromApi 배열의 각 원소가 { id: string, status, topicA, topicB } 형태인지 확인
        setAllRooms(roomsFromApi as RawRoomSummary[]);
      } catch (error) {
        console.error('[BattleList] 전체 방 조회 오류:', error);
      }
    })();
  }, []);

  // 현재 페이지에 표시할 방 데이터만 잘라냄
  const startIndex = (page - 1) * ROOMS_PER_PAGE;
  const pageSlice = allRooms.slice(startIndex, startIndex + ROOMS_PER_PAGE);

  // RawRoomSummary → RoomData 매핑 (id: string → 숫자로 변환)
  const roomsToDisplay: RoomData[] = pageSlice.map((r) => ({
    id: Number(r.id),
    name: `${r.topicA} vs ${r.topicB}`,
    status: r.status as RoomData['status'], // RoomData.status 는 RoomStatus, 문자열 매핑
    current: 0,
    max: 8,
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
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };
  const next = () => {
    if (page < totalPages) {
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

  /** 방 만들기 버튼 클릭 시 모달 열기 */
  const handleCreateRoom = (name: string) => {
    console.log('새 방 생성:', name);
    // 실제 생성 로직: BattleRoomApi.createRoom({ roomName: name }) 후 allRooms 갱신
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
        totalPages={totalPages}
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
