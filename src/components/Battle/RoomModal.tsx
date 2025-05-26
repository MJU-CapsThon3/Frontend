import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { RoomData } from './RoomCard';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background: #59adff;
  border: 2px solid #48b0ff;
  border-radius: 8px;
  width: 350px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #006edd;
  color: #fff;
  padding: 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Body = styled.div`
  background: #b4d7fa;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Timer = styled.div`
  color: #fffe77;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #006edd;
  color: #fff;
  padding: 0.4rem;
  border: 1px solid #48b0ff;
`;

const Td = styled.td`
  text-align: center;
  padding: 0.4rem;
  border-bottom: 1px solid #ccc;
`;

interface Props {
  room: RoomData;
  onClose: () => void;
}

const RoomModal: React.FC<Props> = ({ room, onClose }) => {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    setSec(0);
    const iv = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [room]);

  const fmt = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>{room.name} 정보</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Timer>{fmt(sec)}</Timer>
            <FaTimes style={{ cursor: 'pointer' }} onClick={onClose} />
          </div>
        </Header>
        <Body>
          <p>방 ID: {room.id}</p>
          <p>
            현재 인원: {room.current} / {room.max}
          </p>
          <p>상태: {room.status}</p>
          <p>복귀유저 있음? {room.hasReturningUser ? 'YES' : 'NO'}</p>
          <Table>
            <thead>
              <tr>
                <Th>아이디</Th>
                <Th>랭킹</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>야</Td>
                <Td>Master</Td>
              </tr>
              <tr>
                <Td>소</Td>
                <Td>Diamond</Td>
              </tr>
              <tr>
                <Td>폐</Td>
                <Td>Gold</Td>
              </tr>
              <tr>
                <Td>박</Td>
                <Td>Bronze</Td>
              </tr>
            </tbody>
          </Table>
        </Body>
      </Content>
    </Overlay>
  );
};

export default RoomModal;
