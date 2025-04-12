import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
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

// 상태 표시 배지 스타일
const getStatusBadgeStyle = (status: RoomStatus): CSSProperties => {
  let bgColor = '#999';
  if (status === 'WAITING') bgColor = '#30d158';
  if (status === 'PLAYING') bgColor = '#ff3b30';
  if (status === 'FULL') bgColor = '#ffcc00';

  return {
    display: 'inline-block',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '1.0rem',
    padding: '5px 40px',
    minWidth: '100px',
    borderRadius: '4px',
    backgroundColor: bgColor,
    textShadow: '1px 1px #555',
  };
};

// 커스텀 버튼
type ButtonProps = {
  primary?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};
const CustomButton: React.FC<ButtonProps> = ({
  primary,
  children,
  onClick,
}) => {
  const style = {
    ...headerButtonStyle,
    backgroundColor: primary ? '#0050b3' : headerButtonStyle.backgroundColor,
  };
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
};

const BattleList: React.FC = () => {
  // 라우팅용 훅
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

  // 페이지별 방 목록 세팅
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

  // 방 클릭 시 모달 표시(혹은 상세 페이지로 이동)
  // 여기서는 '유저 아이콘'을 클릭하면 모달, '방 카드' 전체를 클릭하면 상세 페이지 이동하도록 예시
  const handleClickUserIcon = (room: RoomData) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  // **방 카드 클릭 시** -> 배틀 상세 페이지로 이동
  const handleRoomCardClick = (roomId: number) => {
    // React Router를 활용
    navigate(`/battle/${roomId}`);
  };

  // 10개 미만이면 '빈 방' 카드로 채우기
  const paddedRooms: RoomData[] = [...rooms];
  while (paddedRooms.length < 10) {
    paddedRooms.push({
      id: 9999 + paddedRooms.length,
      name: '빈 방',
      status: 'WAITING',
      current: 0,
      max: 8,
    });
  }

  // 모달 타이머 표시 포맷
  const formatTime = (sec: number): string => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <CustomButton>방만들기</CustomButton>
          <CustomButton>대기방입장</CustomButton>
        </div>
        <div style={headerRightStyle}>
          <CustomButton>모든방보기</CustomButton>
          <CustomButton>혼자놀기</CustomButton>
        </div>
      </header>

      <main style={mainStyle}>
        {paddedRooms.map((room) => (
          <div
            key={room.id}
            style={{
              ...roomCardStyle,
              ...getRoomCardBorderStyle(room.status),
            }}
            // 카드 클릭 -> 배틀 상세 페이지 이동
            onClick={() => handleRoomCardClick(room.id)}
          >
            <div style={roomIconSectionStyle}>
              <FaSkullCrossbones style={flagIconStyle} />
            </div>
            <div style={roomInfoSectionStyle}>
              <div style={roomTitleStyle}>
                <span style={roomIdStyle}>
                  [PC {String(room.id).padStart(3, '0')}]
                </span>
                &nbsp;{room.name}
              </div>
              <div style={roomStatusAndPlayersStyle}>
                <div style={statusBadgeContainerStyle}>
                  <span style={getStatusBadgeStyle(room.status)}>
                    {room.status}
                  </span>
                </div>
                <div style={playerInfoContainerStyle}>
                  <span style={playerCountStyle}>
                    {room.current}/{room.max}
                  </span>
                  <FaUserFriends
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트 버블링 방지
                      handleClickUserIcon(room);
                    }}
                    style={userIconStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={paginationStyle}>
          <div style={paginationButtonWrapperStyle} onClick={handlePrevPage}>
            <FaChevronLeft style={paginationIconStyle} />
          </div>
          <span style={pageIndicatorStyle}>
            {page} / {totalPages}
          </span>
          <div style={paginationButtonWrapperStyle} onClick={handleNextPage}>
            <FaChevronRight style={paginationIconStyle} />
          </div>
        </div>
      </main>

      {/* 방에 대한 정보 확인 모달 */}
      {showModal && selectedRoom && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderBarStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={modalHeaderTitleStyle}>
                  {selectedRoom.name} 정보
                </div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {/* 타이머 */}
                <div style={modalTimerStyle}>{formatTime(modalSeconds)}</div>
                {/* 닫기 버튼 */}
                <button
                  style={modalCloseIconButtonStyle}
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes style={modalCloseIconStyle} />
                </button>
              </div>
            </div>

            <div style={modalBodyContainerStyle}>
              <p>방 ID: {selectedRoom.id}</p>
              <p>
                현재 인원: {selectedRoom.current} / {selectedRoom.max}
              </p>
              <p>상태: {selectedRoom.status}</p>
              <p>
                복귀유저 있음? {selectedRoom.hasReturningUser ? 'YES' : 'NO'}
              </p>

              <table style={modalTableStyle}>
                <thead>
                  <tr>
                    <th style={modalTableHeadCellStyle}>아이디</th>
                    <th style={modalTableHeadCellStyle}>랭킹</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={modalTableCellStyle}>야</td>
                    <td style={modalTableCellStyle}>Master</td>
                  </tr>
                  <tr>
                    <td style={modalTableCellStyle}>소</td>
                    <td style={modalTableCellStyle}>Diamond</td>
                  </tr>
                  <tr>
                    <td style={modalTableCellStyle}>폐</td>
                    <td style={modalTableCellStyle}>Gold</td>
                  </tr>
                  <tr>
                    <td style={modalTableCellStyle}>박</td>
                    <td style={modalTableCellStyle}>Bronze</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleList;

/* ---------------- 스타일들 ---------------- */

// 컨테이너
const containerStyle: CSSProperties = {
  width: '800px',

  background: 'linear-gradient(to bottom, #3aa7f0, #63c8ff)',
  border: '2px solid #48b0ff',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
  padding: '0.5rem',
};

// 헤더
const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
};
const headerLeftStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};
const headerRightStyle: CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};
const headerButtonStyle: CSSProperties = {
  backgroundColor: '#ffa700',
  border: '2px solid #d68d00',
  borderRadius: '6px',
  padding: '0.4rem 1rem',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 2px 0 #ad7400',
  animation: 'floatUpDown 2s ease-in-out infinite',
};

// 메인
const mainStyle: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.5rem',
};

// 방 카드
const roomCardStyle: CSSProperties = {
  display: 'flex',
  background: '#a0e7ff',
  borderRadius: '8px',
  overflow: 'hidden',
  height: '100px',
  animation: 'popIn 0.4s forwards',
  transition: 'transform 0.3s',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
};

function getRoomCardBorderStyle(_: RoomStatus): CSSProperties {
  return {
    border: '3px solid #0095f4',
  };
}

const roomIconSectionStyle: CSSProperties = {
  width: '100px',
  margin: '10px',
  borderRadius: '8px',
  background: '#ffd972',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRight: '2px solid rgba(0,0,0,0.2)',
};
const flagIconStyle: CSSProperties = {
  color: '#333',
  fontSize: '28px',
};
const roomInfoSectionStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '0.3rem 0.5rem',
  justifyContent: 'space-around',
};
const roomTitleStyle: CSSProperties = {
  fontWeight: 'bold',
  color: '#004a66',
  textShadow: '1px 1px #fff',
  fontSize: '1.0rem',
  textAlign: 'left',
  backgroundColor: '#a4b4e6',
  padding: '5px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};
const roomIdStyle: CSSProperties = {
  color: '#ffcc00',
  textShadow: '1px 1px #555',
  backgroundColor: 'skyblue',
  padding: '5px',
  borderRadius: '4px',
};
const roomStatusAndPlayersStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};
const statusBadgeContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};
const playerInfoContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};
const playerCountStyle: CSSProperties = {
  fontSize: '0.8rem',
  color: '#333',
  backgroundColor: '#b4d7fa',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};
const userIconStyle: CSSProperties = {
  fontSize: '1.2rem',
  color: '#444',
  cursor: 'pointer',
  backgroundColor: '#b4d7fa',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};

// 페이지네이션
const paginationStyle: CSSProperties = {
  gridColumn: '1 / span 2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '0.5rem',
  gap: '1rem',
  userSelect: 'none',
};
const paginationButtonWrapperStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  backgroundColor: '#ffd972',
  border: '2px solid #ffcc00',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 0 #ffc107',
  transition: 'transform 0.2s',
};
const pageIndicatorStyle: CSSProperties = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  textShadow: '1px 1px #333',
};
const paginationIconStyle: CSSProperties = {
  fontSize: '1.5rem',
  color: '#444',
};

// 모달
const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};
const modalContentStyle: CSSProperties = {
  backgroundColor: '#59adff',
  border: '2px solid #48b0ff',
  borderRadius: '8px',
  width: '350px',
  display: 'flex',
  flexDirection: 'column',
};
const modalHeaderBarStyle: CSSProperties = {
  backgroundColor: '#006edd',
  color: '#fff',
  padding: '0.4rem',
  fontSize: '1rem',
  borderTopLeftRadius: '6px',
  borderTopRightRadius: '6px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const modalHeaderTitleStyle: CSSProperties = {
  marginLeft: '0.5rem',
};
const modalCloseIconButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  marginRight: '0.5rem',
};
const modalCloseIconStyle: CSSProperties = {
  fontSize: '1.2rem',
  color: '#fff',
};
const modalBodyContainerStyle: CSSProperties = {
  backgroundColor: '#b4d7fa',
  padding: '0.6rem',
  borderBottomLeftRadius: '6px',
  borderBottomRightRadius: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};
const modalTimerStyle: CSSProperties = {
  color: '#fffe77',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};
const modalTableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '0.3rem',
};
const modalTableHeadCellStyle: CSSProperties = {
  backgroundColor: '#006edd',
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '0.4rem',
  border: '1px solid #48b0ff',
  fontSize: '0.85rem',
};
const modalTableCellStyle: CSSProperties = {
  textAlign: 'center',
  padding: '0.4rem',
  fontSize: '0.85rem',
  borderBottom: '1px solid #cccccc',
};
