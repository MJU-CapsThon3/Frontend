import React, { useState, useEffect, CSSProperties } from 'react';
import {
  FaSkullCrossbones,
  FaUserFriends,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
  FaTimes, // 닫기 아이콘
} from 'react-icons/fa';

/** ─────────────────────────────
 *  1) 타입 및 더미 데이터
 * ───────────────────────────── */
type RoomStatus = 'WAITING' | 'PLAYING' | 'FULL';

type RoomData = {
  id: number;
  name: string;
  status: RoomStatus;
  current: number;
  max: number;
  hasReturningUser?: boolean; // 복귀유저(2복귀)
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

/** ─────────────────────────────
 *  2) getStatusBadgeStyle 함수 (기존)
 * ───────────────────────────── */
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

/** ─────────────────────────────
 *  3) 커스텀 버튼 컴포넌트 (기존)
 * ───────────────────────────── */
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

/** ─────────────────────────────
 *  4) 메인 컴포넌트
 * ───────────────────────────── */
const BattleList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState<RoomData[]>(
    allRooms.slice(0, ROOMS_PER_PAGE)
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  // 모달 타이머 (초 단위)
  const [modalSeconds, setModalSeconds] = useState(0);

  // 모달이 열릴 때 타이머 시작
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showModal) {
      setModalSeconds(0); // 모달 열릴 때 타이머 리셋
      interval = setInterval(() => {
        setModalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [showModal]);

  // ───────── [방 10개 고정 로직] ─────────
  const paddedRooms: RoomData[] = [...rooms];
  while (paddedRooms.length < 10) {
    paddedRooms.push({
      id: 9999 + paddedRooms.length, // 임시 유니크 ID
      name: '빈 방',
      status: 'WAITING',
      current: 0,
      max: 8,
    });
  }

  const handleClickUserIcon = (room: RoomData) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  // 페이지네이션
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

  // 타이머 형식 변환: 초를 mm:ss 형식으로 변환
  const formatTime = (sec: number): string => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div style={containerStyle}>
      {/* 헤더 */}
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

      {/* 방 목록 */}
      <main style={mainStyle}>
        {paddedRooms.map((room) => (
          <div
            key={room.id}
            style={{
              ...roomCardStyle,
              ...getRoomCardBorderStyle(room.status),
            }}
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
                    onClick={() => handleClickUserIcon(room)}
                    style={userIconStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 페이지네이션 */}
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

      {/* 모달 */}
      {showModal && selectedRoom && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            {/* 모달 헤더: 제목, 타이머(왼쪽은 제목, 오른쪽은 타이머와 닫기버튼을 row로 배치) */}
            <div style={modalHeaderBarStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={modalHeaderTitleStyle}>방정보</div>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div style={modalTimerStyle}>{formatTime(modalSeconds)}</div>
                <button
                  style={modalCloseIconButtonStyle}
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes style={modalCloseIconStyle} />
                </button>
              </div>
            </div>

            {/* 모달 본문: 테이블 영역 */}
            <div style={modalBodyContainerStyle}>
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

/** ─────────────────────────────
 *  스타일 정의 + 애니메이션
 * ─────────────────────────────
 * @keyframes popIn, floatUpDown 는 전역 CSS에 추가 필요
 */

const containerStyle: CSSProperties = {
  width: '1000px',
  margin: '0 auto',
  padding: '1rem',
  background: 'linear-gradient(to bottom, #3aa7f0, #63c8ff)',
  border: '2px solid #48b0ff',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '1rem',
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

const mainStyle: CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.5rem',
};

const roomCardStyle: CSSProperties = {
  display: 'flex',
  background: '#a0e7ff',
  borderRadius: '8px',
  overflow: 'hidden',
  height: '100px',
  animation: 'popIn 0.4s forwards',
  transition: 'transform 0.3s',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // 그림자 추가
  ':hover': {
    transform: 'scale(1.02)',
  } as any,
};

function getRoomCardBorderStyle(status: RoomStatus): CSSProperties {
  let borderColor = '#0095f4';
  return {
    border: `3px solid ${borderColor}`,
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
  backgroundColor: '#8da9fc',
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
  ':hover': {
    transform: 'scale(1.1)',
  } as any,
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

// ───────── 모달 관련 스타일 (수정) ─────────
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

// 모달 헤더 내부 우측의 타이머 (이제 row로 정렬)
const modalHeaderRightStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

// 모달 타이머 (절대 위치 대신 display로 row에 포함)
const modalTimerStyle: CSSProperties = {
  color: '#fffe77',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};

// 모달 테이블 스타일
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
