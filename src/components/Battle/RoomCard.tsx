// src/components/Battle/RoomCard.tsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSkullCrossbones, FaUserFriends } from 'react-icons/fa';
import StatusBadge, { RoomStatus } from './StatusBadge';

export interface RoomData {
  id: number;
  name: string;
  status: RoomStatus;
  current: number;
  max: number;
  hasReturningUser?: boolean;
}

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

const Card = styled.div`
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
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconSection = styled.div`
  width: 100px;
  margin: 10px;
  background: #ffd972;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 2px solid rgba(0, 0, 0, 0.2);
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0.5rem;
  justify-content: space-around;
`;

const Title = styled.div`
  font-weight: bold;
  color: #004a66;
  text-shadow: 1px 1px #fff;
  font-size: 1rem;
  background-color: #a4b4e6;
  padding: 5px;
  border-radius: 4px;
`;

const Id = styled.span`
  color: #ffcc00;
  text-shadow: 1px 1px #555;
  background-color: skyblue;
  padding: 5px;
  border-radius: 4px;
  margin-right: 4px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerCount = styled.span`
  font-size: 0.8rem;
  background-color: #b4d7fa;
  padding: 6px 8px;
  border-radius: 8px;
`;

const UserIconWrapper = styled.div`
  display: flex;
`;

const UserIcon = styled(FaUserFriends as any)`
  font-size: 1.2rem;
  cursor: pointer;
`;

interface Props {
  room: RoomData;
  onCardClick: (roomId: number) => void;
  onUserIconClick: (e: React.MouseEvent, room: RoomData) => void;
}

const RoomCard: React.FC<Props> = ({ room, onCardClick, onUserIconClick }) => (
  <Card onClick={() => onCardClick(room.id)}>
    <IconSection>
      <FaSkullCrossbones size={28} color='#333' />
    </IconSection>
    <InfoSection>
      <div>
        <Title>
          <Id>[PC {String(room.id).padStart(3, '0')}]</Id>
          {room.name}
        </Title>
      </div>
      <Footer>
        <StatusBadge status={room.status} />
        <PlayerInfo>
          <PlayerCount>
            {room.current}/{room.max}
          </PlayerCount>
          <UserIconWrapper onClick={(e) => onUserIconClick(e, room)}>
            <UserIcon color='#444' />
          </UserIconWrapper>
        </PlayerInfo>
      </Footer>
    </InfoSection>
  </Card>
);

export default RoomCard;
