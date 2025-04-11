import React, { useState } from 'react';

/**
 * 아래 BattleRoomUI 컴포넌트는
 * 이미지에 나온 게임 로비(배틀방)와 비슷한 UI 구성을 가지도록 설계했습니다.
 */
const BattleRoomUI = () => {
  // 플레이어 목록 (임시 예시 데이터)
  const [players, setPlayers] = useState([
    { id: 1, nickname: '홍길동', costume: '경찰', status: '대기' },
    { id: 2, nickname: '짱구', costume: '해적', status: '대기' },
    { id: 3, nickname: '철수', costume: '왕관', status: '준비' },
    { id: 4, nickname: '유리', costume: '해적', status: '준비' },
    { id: 5, nickname: '맹구', costume: '곰돌이', status: '대기' },
    { id: 6, nickname: '김AI', costume: '로봇', status: '대기' },
  ]);

  const handleReadyToggle = (playerId) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, status: p.status === '준비' ? '대기' : '준비' }
          : p
      )
    );
  };

  return (
    <div style={outerContainer}>
      {/* 상단 영역 */}
      <div style={topSectionStyle}>
        <div style={titleStyle}>게임 모드 / 맵 / 채널 정보</div>
        <div style={lucyBoxStyle}>
          <img
            style={lucyImgStyle}
            src='https://via.placeholder.com/50x50'
            alt='루시 캐릭터'
          />
          <span style={lucyHelpText}>도와드릴께!</span>
        </div>
      </div>

      {/* 중앙 메인 영역 */}
      <div style={middleContainer}>
        {/* 왼쪽 섹션: 플레이어 목록, 아바타 카드 */}
        <div style={leftSection}>
          <div style={tabMenuStyle}>
            <div style={{ ...tabButton, backgroundColor: '#3268be' }}>파전</div>
            <div style={{ ...tabButton, backgroundColor: '#e77b85' }}>타코</div>
            <div style={tabButton}>비어있음</div>
            <div style={tabButton}>비어있음</div>
          </div>

          <div style={playerListContainer}>
            {players.map((player) => (
              <div key={player.id} style={playerSlotStyle}>
                <img
                  src='https://via.placeholder.com/48x48'
                  alt='캐릭터 아이콘'
                  style={playerIcon}
                />
                <div style={playerInfo}>
                  <span style={{ fontWeight: 'bold' }}>{player.nickname}</span>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    {player.costume}
                  </span>
                </div>
                <button
                  style={{
                    ...playerStatusBtn,
                    backgroundColor:
                      player.status === '준비' ? '#f7c73e' : '#ddd',
                  }}
                  onClick={() => handleReadyToggle(player.id)}
                >
                  {player.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 중앙 섹션: 좌/우 팀 선택 버튼, 모드 선택 */}
        <div style={centerSection}>
          <div style={teamModeBox}>
            <div style={teamSelectBox}>
              <button style={teamSelectBtn}>A</button>
              <button style={teamSelectBtn}>B</button>
            </div>
            <div style={modeInfoBox}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                모드 선택
              </p>
              <select style={modeSelectStyle}>
                <option>개인전</option>
                <option>팀전</option>
                <option>아이템전</option>
              </select>
            </div>
          </div>

          <div style={mapInfoBox}>
            <span style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              맵 선택
            </span>
            <div style={{ margin: '0.5rem 0' }}>
              <img
                src='https://via.placeholder.com/120x120'
                alt='맵 미리보기'
                style={mapPreviewImg}
              />
            </div>
            <select style={mapSelectStyle}>
              <option>기본맵 01</option>
              <option>기본맵 02</option>
              <option>배틀맵</option>
            </select>
          </div>
        </div>

        {/* 오른쪽 섹션: 아이템/스킨 리스트 or 채팅 패널 등 */}
        <div style={rightSection}>
          <div style={rightTopBox}>
            <span style={{ fontWeight: 'bold' }}>스킨 / 아이템</span>
          </div>
          <div style={rightItemSlots}>
            <div style={itemSlotStyle}>
              <img src='https://via.placeholder.com/40' alt='아이템1' />
            </div>
            <div style={itemSlotStyle}>
              <img src='https://via.placeholder.com/40' alt='아이템2' />
            </div>
            <div style={itemSlotStyle}>
              <img src='https://via.placeholder.com/40' alt='아이템3' />
            </div>
            <div style={itemSlotStyle}>
              <img src='https://via.placeholder.com/40' alt='아이템4' />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 영역 */}
      <div style={bottomContainer}>
        <div style={chatBox}>
          <div style={chatMessages}>
            <div style={chatBubble}>[SYSTEM] 게임에 입장하셨습니다.</div>
            <div style={chatBubble}>짱구: 안녕하세요!</div>
            <div style={chatBubble}>철수: 반갑습니다.</div>
            <div style={chatBubble}>유리: 시~작~하죠!</div>
          </div>
          <div style={chatInputContainer}>
            <input
              type='text'
              placeholder='메시지를 입력하세요.'
              style={chatInput}
            />
            <button style={chatSendBtn}>전송</button>
          </div>
        </div>

        <div style={readyBtnContainer}>
          <button style={mainReadyButton}>준비</button>
        </div>
      </div>
    </div>
  );
};

export default BattleRoomUI;

/* ================== 인라인 스타일 ================== */

// 최상위 컨테이너
const outerContainer: React.CSSProperties = {
  width: '1040px',
  height: '720px',
  margin: '2rem auto',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#b1d3fe',
  borderRadius: '12px',
  border: '2px solid #4a90e2',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

// 상단 영역
const topSectionStyle: React.CSSProperties = {
  height: '60px',
  backgroundColor: '#4a90e2',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  justifyContent: 'space-between',
};

const titleStyle: React.CSSProperties = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.2rem',
};

const lucyBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const lucyImgStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  marginRight: '8px',
  borderRadius: '50%',
};

const lucyHelpText: React.CSSProperties = {
  color: '#fff',
  fontWeight: 'bold',
};

// 중앙 메인 영역
const middleContainer: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  padding: '8px',
  gap: '8px',
};

// 왼쪽(플레이어 목록) 섹션
const leftSection: React.CSSProperties = {
  width: '270px',
  backgroundColor: '#ecf6ff',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px',
};

// 탭 메뉴
const tabMenuStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4px',
  marginBottom: '6px',
};

const tabButton: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
  padding: '6px',
  color: '#fff',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const playerListContainer: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '6px',
  flex: 1,
  overflowY: 'auto',
};

const playerSlotStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #aad',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px',
  fontSize: '0.85rem',
};

const playerIcon: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '4px',
  marginBottom: '4px',
};

const playerInfo: React.CSSProperties = {
  textAlign: 'center',
};

const playerStatusBtn: React.CSSProperties = {
  marginTop: '4px',
  padding: '2px 6px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.7rem',
  fontWeight: 'bold',
};

// 중앙 섹션(팀 선택, 모드, 맵)
const centerSection: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#d8ebff',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '8px',
};

// 팀 선택/모드 박스
const teamModeBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const teamSelectBox: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
};

const teamSelectBtn: React.CSSProperties = {
  width: '48px',
  height: '48px',
  backgroundColor: '#fff',
  border: '2px solid #333',
  borderRadius: '8px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const modeInfoBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const modeSelectStyle: React.CSSProperties = {
  width: '100px',
  fontSize: '0.9rem',
  marginTop: '4px',
};

// 맵 선택 박스
const mapInfoBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const mapPreviewImg: React.CSSProperties = {
  border: '1px solid #333',
  borderRadius: '4px',
};

const mapSelectStyle: React.CSSProperties = {
  width: '120px',
  fontSize: '0.9rem',
};

// 오른쪽 섹션(스킨/아이템 등)
const rightSection: React.CSSProperties = {
  width: '180px',
  backgroundColor: '#ecf6ff',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px',
  gap: '8px',
};

const rightTopBox: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#78a9f7',
  color: '#fff',
  borderRadius: '4px',
  padding: '4px',
};

const rightItemSlots: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '6px',
  flex: 1,
};

const itemSlotStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid #aad',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// 하단 영역
const bottomContainer: React.CSSProperties = {
  height: '160px',
  backgroundColor: '#d8ebff',
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
  display: 'flex',
  padding: '8px',
  gap: '8px',
};

// 채팅 영역
const chatBox: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#ecf6ff',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
};

const chatMessages: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '6px',
  fontSize: '0.85rem',
};

const chatBubble: React.CSSProperties = {
  marginBottom: '4px',
  backgroundColor: '#fff',
  border: '1px solid #aad',
  borderRadius: '6px',
  padding: '4px 6px',
  width: 'fit-content',
};

const chatInputContainer: React.CSSProperties = {
  display: 'flex',
  borderTop: '1px solid #ccc',
  padding: '6px',
  gap: '4px',
};

const chatInput: React.CSSProperties = {
  flex: 1,
  borderRadius: '4px',
  border: '1px solid #ccc',
  padding: '4px 8px',
  fontSize: '0.85rem',
};

const chatSendBtn: React.CSSProperties = {
  backgroundColor: '#78a9f7',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  padding: '4px 12px',
  fontSize: '0.85rem',
};

// 준비 버튼 영역
const readyBtnContainer: React.CSSProperties = {
  width: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const mainReadyButton: React.CSSProperties = {
  backgroundColor: '#ffd43b',
  border: '2px solid #db9b0e',
  borderRadius: '8px',
  color: '#333',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0.6rem 1.4rem',
  boxShadow: '0 2px 0 #b58e06',
};
