import React from 'react';
import styled from 'styled-components';
import { FaUserAlt } from 'react-icons/fa';
import type { PlayerData } from '../../page/Battle/BattleDetail';
import { tierIcons } from '../../page/Battle/BattleDetail';

interface Props {
  player: PlayerData;
  isOwner?: boolean;
  isSpectator?: boolean;
}

const PlayerCard: React.FC<Props> = ({
  player,
  isOwner = false,
  isSpectator = false,
}) => {
  const bgColor =
    player.team === 'blue'
      ? '#33bfff'
      : player.team === 'red'
        ? '#ff6b6b'
        : '#fff';

  return (
    <StyledPlayerCard $bgColor={bgColor}>
      <Nickname>
        {player.nickname} {isOwner && '(나)'}
      </Nickname>
      <TierIcon src={tierIcons[player.tier]} alt={player.tier} />
      {player.avatarUrl && player.avatarUrl.trim() !== '' ? (
        isSpectator ? (
          <SpectatorImage src={player.avatarUrl} alt='avatar' />
        ) : (
          <PlayerImage src={player.avatarUrl} alt='avatar' />
        )
      ) : (
        <DefaultAvatar>
          <FaUserAlt style={{ fontSize: '2rem', color: '#888' }} />
        </DefaultAvatar>
      )}
      <RankArea>
        {isOwner ? (
          <OwnerBadge>방 장</OwnerBadge>
        ) : player.isReady ? (
          <ReadyBadge>준 비</ReadyBadge>
        ) : null}
      </RankArea>
    </StyledPlayerCard>
  );
};

export default PlayerCard;

const StyledPlayerCard = styled.div<{ $bgColor: string }>`
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.$bgColor};
  position: relative;
  border: 2px solid #000;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
`;

const PlayerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  border-radius: 4px;
`;

const Nickname = styled.div`
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-bottom-right-radius: 6px;
  z-index: 2;
`;

const TierIcon = styled.img`
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 32px;
  height: 32px;
  z-index: 3;
  border: 2px solid #000;
  border-radius: 6px;
`;

const RankArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid #000;
`;

const OwnerBadge = styled.div`
  background-color: #4caf50;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  width: 100%;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const ReadyBadge = styled.div`
  background-color: #ff9800;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  width: 100%;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const SpectatorImage = styled.img`
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;
