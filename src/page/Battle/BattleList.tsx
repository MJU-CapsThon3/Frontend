import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RoomCard, { RoomData } from '../../components/Battle/RoomCard';
import Pagination from '../../components/Battle/Pagination';
import RoomModal from '../../components/Battle/RoomModal';
import CreateRoomModal from '../../components/Battle/CreateRoomModal';
import { BattleRoomApi } from '../../api/battle/battleRoomApi';

const ROOMS_PER_PAGE = 10;

const Container = styled.div`
  width: 800px;
  background: linear-gradient(to bottom, #3aa7f0, #63c8ff);
  border: 2px solid #48b0ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
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
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ $primary }) => ($primary ? '#0050b3' : '#ffa700')};
`;

const Main = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

/**
 * RoomSummary 타입 재정의 (API에서 실제로 `id`라는 키로 들어온다고 가정)
 * 필요하다면 이 인터페이스를 BattleRoomApi.getAllRooms()에서 사용하는 타입에 맞춰서 조정해야 합니다.
 */
interface RoomSummary {
  id: string; // 서버에서 "id"라는 이름으로 넘어왔다면 string 형태로
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
  topicA: string;
  topicB: string;
}

const BattleList: React.FC = () => {
  const navigate = useNavigate();

  // API에서 받아온 전체 방 목록 (RoomSummary[])
  const [allRooms, setAllRooms] = useState<RoomSummary[]>([]);
  const [page, setPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 페이지 수 계산
  const totalPages = Math.ceil(allRooms.length / ROOMS_PER_PAGE);

  // 컴포넌트 마운트 시 API 호출하여 방 목록 받아오기
  useEffect(() => {
    (async () => {
      try {
        // 기존 BattleRoomApi.getAllRooms()를 그대로 사용하되, 반환 타입이 RoomSummary[]와 호환되도록 맞춥니다.
        const roomsFromApi: any[] = await BattleRoomApi.getAllRooms();
        // API 결과 예시: [{ id: "1", status: "PLAYING", topicA: "치킨", topicB: "피자" }, ...]
        setAllRooms(roomsFromApi);
      } catch (error) {
        console.error('[BattleList] 전체 방 조회 오류:', error);
      }
    })();
  }, []);

  // 현재 페이지에 표시할 방 데이터만 슬라이스
  const startIndex = (page - 1) * ROOMS_PER_PAGE;
  const pageSlice = allRooms.slice(startIndex, startIndex + ROOMS_PER_PAGE);

  // RoomSummary → RoomData 매핑 (id := 방 번호)
  const roomsToDisplay: RoomData[] = pageSlice.map((r) => ({
    id: Number(r.id), // 서버에서 문자열로 넘어오는 경우 Number()로 숫자 변환
    name: `${r.topicA} vs ${r.topicB}`,
    status: r.status,
    current: 0, // 참여자 수 정보가 없으므로 임시 0
    max: 8, // 최대 8명으로 가정
    hasReturningUser: false, // 추가 정보 없으면 false
  }));

  // 페이지 내 빈 자리가 있을 때 빈 칸 채우기
  if (roomsToDisplay.length < ROOMS_PER_PAGE) {
    const empties = Array(ROOMS_PER_PAGE - roomsToDisplay.length).fill({
      id: 0,
      name: '빈 방',
      status: 'WAITING' as const,
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

  /** 카드 클릭 시 방 상세 페이지로 이동 */
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

  /** 방 만들기 버튼 클릭 시 모달 열기 */
  const handleCreateRoom = (name: string) => {
    console.log('새 방 생성:', name);
    // 실제 생성 로직: BattleRoomApi.createRoom({ topics: [...] }) 후 allRooms 갱신
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
