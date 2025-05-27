// src/page/Battle/BattleList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RoomCard, { RoomData } from '../../components/Battle/RoomCard';
import Pagination from '../../components/Battle/Pagination';
import RoomModal from '../../components/Battle/RoomModal';
import CreateRoomModal from '../../components/Battle/CreateRoomModal';

const allRooms: RoomData[] = [
  { id: 1, name: '초보자 환영!', status: 'WAITING', current: 1, max: 8 },
  { id: 2, name: '빨리 오세요~', status: 'WAITING', current: 3, max: 8 },
  {
    id: 3,
    name: '복귀유저와 함께!',
    status: 'WAITING',
    current: 5,
    max: 8,
    hasReturningUser: true,
  },
  { id: 4, name: '매너 필수', status: 'PLAYING', current: 2, max: 8 },
  { id: 5, name: '테스트 A', status: 'FULL', current: 8, max: 8 },
  {
    id: 6,
    name: '복귀유저 주의',
    status: 'PLAYING',
    current: 5,
    max: 8,
    hasReturningUser: true,
  },
  { id: 7, name: '레벨업중', status: 'WAITING', current: 2, max: 8 },
  { id: 8, name: '맥북 유저', status: 'WAITING', current: 1, max: 8 },
  {
    id: 9,
    name: '복귀 유저 환영',
    status: 'WAITING',
    current: 6,
    max: 8,
    hasReturningUser: true,
  },
  { id: 10, name: '즐겁게 게임', status: 'FULL', current: 8, max: 8 },
  { id: 11, name: '테스트 B', status: 'PLAYING', current: 4, max: 8 },
  { id: 12, name: '마지막 방', status: 'WAITING', current: 3, max: 8 },
];

const ROOMS_PER_PAGE = 10;
const totalPages = Math.ceil(allRooms.length / ROOMS_PER_PAGE);

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

const BattleList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const start = (page - 1) * ROOMS_PER_PAGE;
  const slice = allRooms.slice(start, start + ROOMS_PER_PAGE);
  const rooms =
    slice.length < ROOMS_PER_PAGE
      ? [
          ...slice,
          ...Array(ROOMS_PER_PAGE - slice.length).fill({
            id: 0,
            name: '빈 방',
            status: 'WAITING',
            current: 0,
            max: 8,
          }),
        ]
      : slice;

  const prev = () => page > 1 && setPage((p) => p - 1);
  const next = () => page < totalPages && setPage((p) => p + 1);

  const handleUserIconClick = (e: React.MouseEvent, room: RoomData) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleCreateRoom = (name: string) => {
    console.log('새 방 생성:', name);
    // 실제 생성 로직 추가 (API 호출 등)
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderButton $primary onClick={() => setShowCreateModal(true)}>
            방만들기
          </HeaderButton>
        </HeaderLeft>
        <HeaderRight>
          <HeaderButton>대기방입장</HeaderButton>
        </HeaderRight>
      </Header>

      <Main>
        {rooms.map((room) => (
          <RoomCard
            key={room.id || Math.random()}
            room={room}
            onCardClick={(id) => navigate(`/battle/${id}`)}
            onUserIconClick={handleUserIconClick}
          />
        ))}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={prev}
          onNext={next}
        />
      </Main>

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
