// src/page/Battle/BattleList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  FaSkullCrossbones,
  FaUserFriends,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';

type RoomStatus = 'WAITING' | 'PLAYING' | 'FULL';

type RoomData = {
  id: number;
  name: string;
  status: RoomStatus;
  current: number;
  max: number;
  hasReturningUser?: boolean;
};

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

// 상태 배지 색 결정 함수
const getStatusBadgeColor = (status: RoomStatus): string => {
  switch (status) {
    case 'WAITING':
      return '#30d158';
    case 'PLAYING':
      return '#ff3b30';
    case 'FULL':
      return '#ffcc00';
    default:
      return '#999';
  }
};

const StatusBadge = styled.span<{ status: RoomStatus }>`
  display: inline-block;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  padding: 5px 40px;
  min-width: 100px;
  border-radius: 4px;
  background-color: ${({ status }) => getStatusBadgeColor(status)};
  text-shadow: 1px 1px #555;
`;

const HeaderButton = styled.button<{ primary?: boolean }>`
  background-color: ${({ primary }) => (primary ? '#0050b3' : '#ffa700')};
  border: 2px solid #d68d00;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 0 #ad7400;
  animation: floatUpDown 2s ease-in-out infinite;

  @keyframes floatUpDown {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`;

const Container = styled.div`
  width: 800px;
  background: linear-gradient(to bottom, #3aa7f0, #63c8ff);
  border: 2px solid #48b0ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
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

const Main = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const RoomCard = styled.div`
  display: flex;
  background: #a0e7ff;
  border-radius: 8px;
  overflow: hidden;
  height: 100px;
  animation: ${popIn} 0.4s forwards;
  transition: transform 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 3px solid #0095f4;
`;

// react-icons를 styled-components로 감쌀 때 "as any"로 캐스팅하여 오류를 피함
const FlagIcon = styled(FaSkullCrossbones as any)`
  color: #333;
  font-size: 28px;
`;

const RoomIconSection = styled.div`
  width: 100px;
  margin: 10px;
  border-radius: 8px;
  background: #ffd972;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 2px solid rgba(0, 0, 0, 0.2);
`;

const RoomInfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0.5rem;
  justify-content: space-around;
`;

const RoomTitle = styled.div`
  font-weight: bold;
  color: #004a66;
  text-shadow: 1px 1px #fff;
  font-size: 1rem;
  text-align: left;
  background-color: #a4b4e6;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const RoomId = styled.span`
  color: #ffcc00;
  text-shadow: 1px 1px #555;
  background-color: skyblue;
  padding: 5px;
  border-radius: 4px;
`;

const RoomStatusAndPlayers = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StatusBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const PlayerInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerCount = styled.span`
  font-size: 0.8rem;
  color: #333;
  background-color: #b4d7fa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const UserIcon = styled(FaUserFriends as any)`
  font-size: 1.2rem;
  color: #444;
  cursor: pointer;
  background-color: #b4d7fa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Pagination = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
  user-select: none;
`;

const PaginationButton = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ffd972;
  border: 2px solid #ffcc00;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 0 #ffc107;
  transition: transform 0.2s;
`;

const PageIndicator = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 1px 1px #333;
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
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: #59adff;
  border: 2px solid #48b0ff;
  border-radius: 8px;
  width: 350px;
  display: flex;
  flex-direction: column;
`;

const ModalHeaderBar = styled.div`
  background-color: #006edd;
  color: #fff;
  padding: 0.4rem;
  font-size: 1rem;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalHeaderTitle = styled.div`
  margin-left: 0.5rem;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const ModalCloseIcon = styled(FaTimes as any)`
  font-size: 1.2rem;
  color: #fff;
`;

const ModalBodyContainer = styled.div`
  background-color: #b4d7fa;
  padding: 0.6rem;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalTimer = styled.div`
  color: #fffe77;
  font-weight: bold;
  font-size: 0.9rem;
`;

const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.3rem;
`;

const ModalTableHeadCell = styled.th`
  background-color: #006edd;
  color: #fff;
  font-weight: bold;
  text-align: center;
  padding: 0.4rem;
  border: 1px solid #48b0ff;
  font-size: 0.85rem;
`;

const ModalTableCell = styled.td`
  text-align: center;
  padding: 0.4rem;
  font-size: 0.85rem;
  border-bottom: 1px solid #cccccc;
`;

const BattleList: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState<RoomData[]>(
    allRooms.slice(0, ROOMS_PER_PAGE)
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [modalSeconds, setModalSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showModal) {
      setModalSeconds(0);
      interval = setInterval(() => {
        setModalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [showModal]);

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      const startIdx = (newPage - 1) * ROOMS_PER_PAGE;
      setRooms(allRooms.slice(startIdx, startIdx + ROOMS_PER_PAGE));
      setPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      const startIdx = (newPage - 1) * ROOMS_PER_PAGE;
      setRooms(allRooms.slice(startIdx, startIdx + ROOMS_PER_PAGE));
      setPage(newPage);
    }
  };

  const handleClickUserIcon = (room: RoomData) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleRoomCardClick = (roomId: number) => {
    navigate(`/battle/${roomId}`);
  };

  // 10개 미만이면 '빈 방' 카드로 채우기
  const paddedRooms: RoomData[] = [...rooms];
  while (paddedRooms.length < ROOMS_PER_PAGE) {
    paddedRooms.push({
      id: 9999 + paddedRooms.length,
      name: '빈 방',
      status: 'WAITING',
      current: 0,
      max: 8,
    });
  }

  const formatTime = (sec: number): string => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderButton>방만들기</HeaderButton>
          <HeaderButton>대기방입장</HeaderButton>
        </HeaderLeft>
        <HeaderRight>
          <HeaderButton>모든방보기</HeaderButton>
          <HeaderButton>혼자놀기</HeaderButton>
        </HeaderRight>
      </Header>
      <Main>
        {paddedRooms.map((room) => (
          <RoomCard key={room.id} onClick={() => handleRoomCardClick(room.id)}>
            <RoomIconSection>
              <FlagIcon />
            </RoomIconSection>
            <RoomInfoSection>
              <RoomTitle>
                <RoomId>[PC {String(room.id).padStart(3, '0')}]</RoomId>
                &nbsp;{room.name}
              </RoomTitle>
              <RoomStatusAndPlayers>
                <StatusBadgeContainer>
                  <StatusBadge status={room.status}>{room.status}</StatusBadge>
                </StatusBadgeContainer>
                <PlayerInfoContainer>
                  <PlayerCount>
                    {room.current}/{room.max}
                  </PlayerCount>
                  <UserIcon
                    onClick={(
                      e: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => {
                      e.stopPropagation();
                      handleClickUserIcon(room);
                    }}
                  />
                </PlayerInfoContainer>
              </RoomStatusAndPlayers>
            </RoomInfoSection>
          </RoomCard>
        ))}
        <Pagination>
          <PaginationButton onClick={handlePrevPage}>
            <FaChevronLeft style={{ fontSize: '1.5rem', color: '#444' }} />
          </PaginationButton>
          <PageIndicator>
            {page} / {totalPages}
          </PageIndicator>
          <PaginationButton onClick={handleNextPage}>
            <FaChevronRight style={{ fontSize: '1.5rem', color: '#444' }} />
          </PaginationButton>
        </Pagination>
      </Main>
      {showModal && selectedRoom && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeaderBar>
              <ModalHeaderTitle>{selectedRoom.name} 정보</ModalHeaderTitle>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ModalTimer>{formatTime(modalSeconds)}</ModalTimer>
                <ModalCloseButton onClick={() => setShowModal(false)}>
                  <ModalCloseIcon />
                </ModalCloseButton>
              </div>
            </ModalHeaderBar>
            <ModalBodyContainer>
              <p>방 ID: {selectedRoom.id}</p>
              <p>
                현재 인원: {selectedRoom.current} / {selectedRoom.max}
              </p>
              <p>상태: {selectedRoom.status}</p>
              <p>
                복귀유저 있음? {selectedRoom.hasReturningUser ? 'YES' : 'NO'}
              </p>
              <ModalTable>
                <thead>
                  <tr>
                    <ModalTableHeadCell>아이디</ModalTableHeadCell>
                    <ModalTableHeadCell>랭킹</ModalTableHeadCell>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <ModalTableCell>야</ModalTableCell>
                    <ModalTableCell>Master</ModalTableCell>
                  </tr>
                  <tr>
                    <ModalTableCell>소</ModalTableCell>
                    <ModalTableCell>Diamond</ModalTableCell>
                  </tr>
                  <tr>
                    <ModalTableCell>폐</ModalTableCell>
                    <ModalTableCell>Gold</ModalTableCell>
                  </tr>
                  <tr>
                    <ModalTableCell>박</ModalTableCell>
                    <ModalTableCell>Bronze</ModalTableCell>
                  </tr>
                </tbody>
              </ModalTable>
            </ModalBodyContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default BattleList;
