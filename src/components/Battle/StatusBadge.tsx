import React from 'react';
import styled from 'styled-components';

export type RoomStatus = 'WAITING' | 'PLAYING' | 'FULL';

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

const Badge = styled.span<{ status: RoomStatus }>`
  display: inline-block;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  padding: 5px 40px;
  min-width: 100px;
  border-radius: 4px;
  background-color: ${({ status }) => getStatusBadgeColor(status)};
  text-shadow: 1px 1px #555;
  border: 2px solid #000;
  border-radius: 4px;
`;

interface Props {
  status: RoomStatus;
  children?: React.ReactNode;
}

const StatusBadge: React.FC<Props> = ({ status, children }) => (
  <Badge status={status}>{children ?? status}</Badge>
);

export default StatusBadge;
