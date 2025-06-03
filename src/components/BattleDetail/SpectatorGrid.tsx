import React from 'react';
import styled from 'styled-components';
import type { PlayerData } from '../../page/Battle/BattleDetail';
import PlayerCard from './PlayerCard';

interface Props {
  players: PlayerData[];
  ownerId: number;
  ownerSide: 'left' | 'right';
  ownerSpectatorSlot: number | null;
  nonOwnerSpectators: PlayerData[];
  setPendingMoveSlot: React.Dispatch<
    React.SetStateAction<{
      area: 'participant' | 'spectator';
      index: number;
    } | null>
  >;
  BOX_SIZE: string;
  TOTAL_SLOTS: number;
}

const SpectatorGrid: React.FC<Props> = ({
  players,
  ownerId,
  ownerSide,
  ownerSpectatorSlot,
  nonOwnerSpectators,
  setPendingMoveSlot,
  BOX_SIZE,
  TOTAL_SLOTS,
}) => {
  const cells = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    let occupant: PlayerData | null = null;
    if (ownerId && ownerSpectatorSlot === i) {
      occupant =
        players.find((p) => p.id === ownerId && p.role === 'spectator') || null;
    } else if (i < nonOwnerSpectators.length) {
      occupant = nonOwnerSpectators[i];
    }

    cells.push(
      <SpectatorSlotContainer
        key={`spectator-slot-${i}`}
        $occupied={!!occupant}
        $size={BOX_SIZE}
        onClick={
          occupant
            ? undefined
            : () => setPendingMoveSlot({ area: 'spectator', index: i })
        }
      >
        {occupant ? (
          occupant.id === ownerId ? (
            <PlayerCard player={occupant} isOwner isSpectator />
          ) : (
            <PlayerCard player={occupant} isSpectator />
          )
        ) : (
          <EmptyBox size={BOX_SIZE} />
        )}
      </SpectatorSlotContainer>
    );
  }
  return (
    <GridContainer $columns={4} $rows={2}>
      {cells}
    </GridContainer>
  );
};

export default SpectatorGrid;

const GridContainer = styled.div<{ $columns: number; $rows: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.$rows}, 1fr);
  gap: 10px;
`;

const SpectatorSlotContainer = styled.div<{
  $occupied: boolean;
  $size: string;
}>`
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$occupied ? 'default' : 'pointer')};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: ${(props) => (props.$occupied ? 'none' : 'scale(1.03)')};
  }
`;

const EmptyBox = styled.div<{ size: string }>`
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 4px;
`;
