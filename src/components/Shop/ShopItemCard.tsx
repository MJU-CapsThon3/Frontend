// src/components/Shop/ShopItemCard.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ShopItem } from '../../page/Shop/ShopList';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

interface Props {
  item: ShopItem;
  onPreview: (item: ShopItem) => void;
  onBuy: (item: ShopItem) => void;
}

const ShopItemCard: React.FC<Props> = ({ item, onPreview, onBuy }) => (
  <ItemCard>
    <ItemRow>
      <IconWrapper>{item.icon}</IconWrapper>
      <ItemText>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>가격: {item.price}냥</ItemPrice>
      </ItemText>
    </ItemRow>
    <ButtonRow>
      <PreviewButton onClick={() => onPreview(item)}>미리보기</PreviewButton>
      <BuyButton onClick={() => onBuy(item)}>구매</BuyButton>
    </ButtonRow>
  </ItemCard>
);

export default ShopItemCard;

/* Styled Components */

const ItemCard = styled.div`
  background-color: #2d397e;
  border: 2px solid #1d2a68;
  border-radius: 6px;
  padding: 0.5rem;
  color: #eef;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  animation: ${fadeIn} 0.5s ease-out;
  &:hover {
    transform: scale(1.03);
    box-shadow: 0 5px 12px rgba(255, 255, 255, 0.3);
  }
`;

const ItemRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconWrapper = styled.div`
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eef;
  padding: 10px;
  border-radius: 8px;
`;

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffccff;
  margin-bottom: 0.2rem;
`;

const ItemPrice = styled.span`
  font-size: 0.8rem;
  color: #ddd;
`;

const ButtonRow = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const PreviewButton = styled.button`
  flex: 1;
  background-color: #5599ff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const BuyButton = styled.button`
  flex: 1;
  background-color: #4460ff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;
