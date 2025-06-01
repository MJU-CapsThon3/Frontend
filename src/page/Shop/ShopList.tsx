import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaUserAlt,
  FaBorderStyle,
  FaUserFriends,
  FaUserTie,
  FaBaby,
  FaSmile,
  FaLaugh,
  FaSurprise,
  FaGhost,
  FaDragon,
  FaCrow,
  FaCat,
} from 'react-icons/fa';
import Modal from '../../components/Modal';
import ShopItemCard from '../../components/Shop/ShopItemCard';
import TeamIcon1 from '../../assets/ShopIcon/TeamIcon1.svg';
import TeamIcon2 from '../../assets/ShopIcon/TeamIcon2.svg';
import TeamIcon3 from '../../assets/ShopIcon/TeamIcon3.svg';
import TeamIcon4 from '../../assets/ShopIcon/TeamIcon4.svg';
import TeamIcon5 from '../../assets/ShopIcon/TeamIcon5.svg';
import TeamIcon6 from '../../assets/ShopIcon/TeamIcon6.svg';
import TeamIcon7 from '../../assets/ShopIcon/TeamIcon7.svg';
import TeamIcon8 from '../../assets/ShopIcon/TeamIcon8.svg';
import TeamIcon9 from '../../assets/ShopIcon/TeamIcon9.svg';
import TeamIcon10 from '../../assets/ShopIcon/TeamIcon10.svg';
import TeamIcon11 from '../../assets/ShopIcon/TeamIcon11.svg';
import TeamIcon12 from '../../assets/ShopIcon/TeamIcon12.svg';
import TeamIcon13 from '../../assets/ShopIcon/TeamIcon13.svg';
import TeamIcon14 from '../../assets/ShopIcon/TeamIcon14.svg';
import TeamIcon15 from '../../assets/ShopIcon/TeamIcon15.svg';
import TeamIcon16 from '../../assets/ShopIcon/TeamIcon16.svg';
import TeamIcon17 from '../../assets/ShopIcon/TeamIcon17.svg';

import { ShopApi } from '../../api/shop/shop';
import type {
  ShopItem as APIShopItem,
  MyItem as APIMyItem,
} from '../../api/shop/shop';

export type CategoryType = '전체' | '팀 아이콘' | '테두리';

export interface ShopItem {
  id: number;
  name: string;
  price: number;
  icon: React.ReactNode;
  category: CategoryType;
}

interface MyBoxState {
  nickname: string;
  isReady: boolean;
  appliedTeamIcon: ShopItem | null;
  appliedBorder: ShopItem | null;
  avatarUrl?: string;
}

const dummyShopItems: ShopItem[] = [
  // 팀 아이콘 17개
  {
    id: 1,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon1} alt='TeamIcon1' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 2,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon2} alt='TeamIcon2' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 3,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon3} alt='TeamIcon3' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 4,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon4} alt='TeamIcon4' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 5,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon5} alt='TeamIcon5' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 6,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon6} alt='TeamIcon6' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 7,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon7} alt='TeamIcon7' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 8,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon8} alt='TeamIcon8' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 9,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon9} alt='TeamIcon9' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 10,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon10} alt='TeamIcon10' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 11,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon11} alt='TeamIcon11' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 12,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon12} alt='TeamIcon12' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 13,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon13} alt='TeamIcon13' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 14,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon14} alt='TeamIcon14' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 15,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon15} alt='TeamIcon15' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 16,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon16} alt='TeamIcon16' width={64} height={64} />,
    category: '팀 아이콘',
  },
  {
    id: 17,
    name: '커스텀 팀 아이콘',
    price: 11500,
    icon: <img src={TeamIcon17} alt='TeamIcon17' width={64} height={64} />,
    category: '팀 아이콘',
  },
  // 캐릭터 아바타 10개
  {
    id: 101,
    name: '친구들 아바타',
    price: 12500,
    icon: <FaUserFriends size={64} color='#6c5ce7' />,
    category: '팀 아이콘',
  },
  {
    id: 102,
    name: '정장맨 아바타',
    price: 13000,
    icon: <FaUserTie size={64} color='#2d3436' />,
    category: '팀 아이콘',
  },
  {
    id: 103,
    name: '아기 아바타',
    price: 9000,
    icon: <FaBaby size={64} color='#fdcb6e' />,
    category: '팀 아이콘',
  },
  {
    id: 104,
    name: '웃는얼굴 아바타',
    price: 9500,
    icon: <FaSmile size={64} color='#00b894' />,
    category: '팀 아이콘',
  },
  {
    id: 105,
    name: '웃음 아바타',
    price: 10000,
    icon: <FaLaugh size={64} color='#0984e3' />,
    category: '팀 아이콘',
  },
  {
    id: 106,
    name: '놀람 아바타',
    price: 9800,
    icon: <FaSurprise size={64} color='#d63031' />,
    category: '팀 아이콘',
  },
  {
    id: 107,
    name: '유령 아바타',
    price: 11000,
    icon: <FaGhost size={64} color='#b2bec3' />,
    category: '팀 아이콘',
  },
  {
    id: 108,
    name: '드래곤 아바타',
    price: 14000,
    icon: <FaDragon size={64} color='#e17055' />,
    category: '팀 아이콘',
  },
  {
    id: 109,
    name: '까마귀 아바타',
    price: 10500,
    icon: <FaCrow size={64} color='#2d3436' />,
    category: '팀 아이콘',
  },
  {
    id: 110,
    name: '고양이 아바타',
    price: 11500,
    icon: <FaCat size={64} color='#fd79a8' />,
    category: '팀 아이콘',
  },
  // 테두리 10개
  {
    id: 10,
    name: '기본 실선 테두리',
    price: 1800,
    icon: <FaBorderStyle size={64} color='#999' />,
    category: '테두리',
  },
  {
    id: 11,
    name: '대시드 네온 테두리',
    price: 2500,
    icon: <FaBorderStyle size={64} color='#ff33cc' />,
    category: '테두리',
  },
  {
    id: 12,
    name: '메탈 실선 테두리',
    price: 2200,
    icon: <FaBorderStyle size={64} color='#999999' />,
    category: '테두리',
  },
  {
    id: 13,
    name: '더블 라인 테두리',
    price: 2800,
    icon: <FaBorderStyle size={64} color='#34495e' />,
    category: '테두리',
  },
  {
    id: 14,
    name: '빛나는 옐로우 테두리',
    price: 2000,
    icon: <FaBorderStyle size={64} color='#ffff66' />,
    category: '테두리',
  },
  {
    id: 15,
    name: '그라데이션 테두리',
    price: 3000,
    icon: <FaBorderStyle size={64} color='#999' />,
    category: '테두리',
  },
  {
    id: 16,
    name: '도트 점선 테두리',
    price: 2400,
    icon: <FaBorderStyle size={64} color='#3498db' />,
    category: '테두리',
  },
  {
    id: 17,
    name: '라이트닝 메탈 테두리',
    price: 2600,
    icon: <FaBorderStyle size={64} color='#e74c3c' />,
    category: '테두리',
  },
  {
    id: 18,
    name: '그린 숲 테두리',
    price: 2300,
    icon: <FaBorderStyle size={64} color='#27ae60' />,
    category: '테두리',
  },
  {
    id: 201,
    name: '펄스 테두리',
    price: 6400,
    icon: <FaBorderStyle size={64} color='#e74c3c' />,
    category: '테두리',
  },
  {
    id: 202,
    name: '로테이트 테두리',
    price: 3300,
    icon: <FaBorderStyle size={64} color='#0984e3' />,
    category: '테두리',
  },
  {
    id: 203,
    name: '글로우 테두리',
    price: 3400,
    icon: <FaBorderStyle size={64} color='#00b894' />,
    category: '테두리',
  },
  {
    id: 204,
    name: '섀도우 테두리',
    price: 3500,
    icon: <FaBorderStyle size={64} color='#6c5ce7' />,
    category: '테두리',
  },
  {
    id: 205,
    name: '스케일 테두리',
    price: 3600,
    icon: <FaBorderStyle size={64} color='#fdcb6e' />,
    category: '테두리',
  },
  {
    id: 206,
    name: '스윙 테두리',
    price: 3700,
    icon: <FaBorderStyle size={64} color='#d63031' />,
    category: '테두리',
  },
  {
    id: 207,
    name: '플래시 테두리',
    price: 3800,
    icon: <FaBorderStyle size={64} color='#b2bec3' />,
    category: '테두리',
  },
  {
    id: 208,
    name: '위브 테두리',
    price: 3900,
    icon: <FaBorderStyle size={64} color='#e17055' />,
    category: '테두리',
  },
  {
    id: 209,
    name: '하이라이트 테두리',
    price: 4000,
    icon: <FaBorderStyle size={64} color='#fd79a8' />,
    category: '테두리',
  },
  {
    id: 210,
    name: '네온 테두리',
    price: 4100,
    icon: <FaBorderStyle size={64} color='#00cec9' />,
    category: '테두리',
  },
];

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

const ShopWithPreview: React.FC = () => {
  const [myBox, setMyBox] = useState<MyBoxState>({
    nickname: '내 닉네임',
    isReady: false,
    appliedTeamIcon: null,
    appliedBorder: null,
    avatarUrl: '',
  });
  const [items, setItems] = useState<ShopItem[]>([]);
  const [myItems, setMyItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>('전체');
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [selectedPurchaseItem, setSelectedPurchaseItem] =
    useState<ShopItem | null>(null);
  const [purchaseSuccessItem, setPurchaseSuccessItem] =
    useState<ShopItem | null>(null);

  useEffect(() => {
    ShopApi.getItems()
      .then((apiItems: APIShopItem[]) => {
        const mapped = apiItems.map((apiItem) => {
          const dummy = dummyShopItems.find((d) => d.id === apiItem.id);
          return {
            id: apiItem.id,
            name: apiItem.name,
            price: apiItem.cost,
            icon: dummy?.icon ?? <FaUserAlt size={64} color='#888' />,
            category: dummy?.category ?? '전체',
          } as ShopItem;
        });
        setItems(mapped);
      })
      .catch((err) => {
        console.error('[ShopList] 상점 아이템 조회 실패:', err);
      });

    ShopApi.getMyItems()
      .then((apiMyItems: APIMyItem[]) => {
        const mappedMy = apiMyItems.map((apiItem) => {
          const dummy = dummyShopItems.find((d) => d.id === apiItem.id);
          return {
            id: apiItem.id,
            name: apiItem.name,
            price: apiItem.cost,
            icon: dummy?.icon ?? <FaUserAlt size={64} color='#888' />,
            category: dummy?.category ?? '전체',
          } as ShopItem;
        });
        setMyItems(mappedMy);
      })
      .catch((err) => {
        console.error('[ShopList] 내 아이템 조회 실패:', err);
      });
  }, []);

  const filteredItems =
    selectedCategory === '전체'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleCategoryClick = (cat: CategoryType) => setSelectedCategory(cat);

  const handleBuyItem = (item: ShopItem) => {
    setSelectedPurchaseItem(item);
    setPurchaseModalVisible(true);
  };

  const confirmPurchase = () => {
    if (!selectedPurchaseItem) return;
    ShopApi.buyItem({ itemId: selectedPurchaseItem.id })
      .then(() => {
        setPurchaseSuccessItem(selectedPurchaseItem);
        setMyItems((prev) => {
          if (prev.find((x) => x.id === selectedPurchaseItem.id)) return prev;
          return [...prev, selectedPurchaseItem];
        });
      })
      .catch((err) => {
        console.error('[ShopList] 아이템 구매 실패:', err);
      })
      .finally(() => {
        setSelectedPurchaseItem(null);
        setPurchaseModalVisible(false);
      });
  };

  const cancelPurchase = () => {
    setSelectedPurchaseItem(null);
    setPurchaseModalVisible(false);
  };

  const handlePreviewItem = (item: ShopItem) => {
    if (item.category === '팀 아이콘') {
      setMyBox((prev) => ({ ...prev, appliedTeamIcon: item }));
    } else if (item.category === '테두리') {
      setMyBox((prev) => ({ ...prev, appliedBorder: item }));
    }
  };

  const handleResetPreview = () =>
    setMyBox({
      nickname: '내 닉네임',
      isReady: false,
      appliedTeamIcon: null,
      appliedBorder: null,
      avatarUrl: '',
    });

  const getBoxBorderStyle = () => {
    if (!myBox.appliedBorder) return '2px solid #000';
    const n = myBox.appliedBorder.name;
    if (n.includes('대시드')) return '4px dashed #ff33cc';
    if (n.includes('더블')) return '4px double #34495e';
    if (n.includes('메탈')) return '4px solid #999';
    if (n.includes('빛나는')) return '4px solid yellow';
    if (n.includes('도트')) return '4px dotted #3498db';
    if (n.includes('라이트닝')) return '4px solid #e74c3c';
    if (n.includes('그린')) return '4px solid #27ae60';
    if (n.includes('펄스')) return '4px solid #e74c3c';
    if (n.includes('로테이트')) return '4px solid #0984e3';
    if (n.includes('글로우')) return '4px solid #00b894';
    if (n.includes('섀도우')) return '4px solid #6c5ce7';
    if (n.includes('스케일')) return '4px solid #fdcb6e';
    if (n.includes('스윙')) return '4px solid #d63031';
    if (n.includes('플래시')) return '4px solid #b2bec3';
    if (n.includes('위브')) return '4px solid #e17055';
    if (n.includes('하이라이트')) return '4px solid #fd79a8';
    if (n.includes('네온')) return '4px solid #00cec9';
    return '2px solid #000';
  };

  return (
    <Container>
      <ShopSection>
        <SectionHeader>상점</SectionHeader>
        <CategoryContainer>
          {(['전체', '팀 아이콘', '테두리'] as CategoryType[]).map((cat) => (
            <CategoryButton
              key={cat}
              active={selectedCategory === cat}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </CategoryButton>
          ))}
        </CategoryContainer>
        <ShopItemsContainer>
          <ItemGrid>
            {filteredItems.map((item) => (
              <ItemCardWrapper key={item.id}>
                <ShopItemCard
                  item={item}
                  onPreview={() => handlePreviewItem(item)}
                  onBuy={() => handleBuyItem(item)}
                />
              </ItemCardWrapper>
            ))}
          </ItemGrid>
        </ShopItemsContainer>
      </ShopSection>

      <PreviewSection>
        <SectionHeader>내 박스 미리보기</SectionHeader>
        <BattleBox customBorder={getBoxBorderStyle()}>
          <Nickname>{myBox.nickname}</Nickname>
          {myBox.appliedTeamIcon ? (
            <AvatarContainer>{myBox.appliedTeamIcon.icon}</AvatarContainer>
          ) : myBox.avatarUrl ? (
            <Avatar src={myBox.avatarUrl} alt='avatar' />
          ) : (
            <DefaultAvatar>
              <FaUserAlt size={64} color='#888' />
            </DefaultAvatar>
          )}
        </BattleBox>
        <PreviewButton onClick={handleResetPreview}>원래대로</PreviewButton>
        <MyItemsSection>
          <SectionHeader>내 아이템</SectionHeader>
          <MyItemsGrid>
            {myItems.map((item) => (
              <MyItemCard key={item.id} onClick={() => handlePreviewItem(item)}>
                <MyItemIcon>{item.icon}</MyItemIcon>
                <MyItemName>{item.name}</MyItemName>
              </MyItemCard>
            ))}
          </MyItemsGrid>
        </MyItemsSection>
      </PreviewSection>

      {purchaseModalVisible && selectedPurchaseItem && (
        <Modal title='구매 확인'>
          <ModalBody>
            <strong>{selectedPurchaseItem.name}</strong> 아이템을{' '}
            <strong>{selectedPurchaseItem.price}원</strong>에 구매하시겠습니까?
          </ModalBody>
          <ModalFooter>
            <ModalCancelButton onClick={cancelPurchase}>취소</ModalCancelButton>
            <ModalSubmitButton onClick={confirmPurchase}>
              구매
            </ModalSubmitButton>
          </ModalFooter>
        </Modal>
      )}
      {purchaseSuccessItem && (
        <Modal title='구매 완료'>
          <ModalBody>
            <strong>{purchaseSuccessItem.name}</strong> 아이템을{' '}
            <strong>{purchaseSuccessItem.price}원</strong>에 구매했습니다!
          </ModalBody>
          <ModalFooter>
            <ModalCancelButton onClick={() => setPurchaseSuccessItem(null)}>
              닫기
            </ModalCancelButton>
          </ModalFooter>
        </Modal>
      )}
    </Container>
  );
};

export default ShopWithPreview;

/* ========================
   Styled Components
======================== */

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 650px;
  background: linear-gradient(to bottom, #3aa7f0, #63c8ff);
  border: 5px solid #000;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
`;

const SectionHeader = styled.h2`
  margin: 0;
  text-align: center;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 1px 1px #000;
`;

const ShopSection = styled.div`
  flex: 2;
  background: #a0e7ff;
  border: 3px solid #000;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const CategoryContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

const CategoryButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  background-color: ${({ active }) => (active ? '#48b0ff' : '#d8ebff')};
  border: 2px solid #000;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: #004a66;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #48b0ff;
    color: #fff;
  }
`;

const ShopItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ItemCardWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease-out;
`;

const PreviewSection = styled.div`
  flex: 1;
  background: #a0e7ff;
  border: 3px solid #000;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BattleBox = styled.div<{ customBorder?: string }>`
  position: relative;
  width: 140px;
  height: 120px;
  margin: 0 auto;
  border: ${({ customBorder }) => customBorder || '2px solid #000'};
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Nickname = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-bottom-right-radius: 6px;
  z-index: 2;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  & > img,
  & > svg {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
  }
`;

const PreviewButton = styled.button`
  background-color: #48b0ff;
  color: #fff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #63c8ff;
  }
`;

const MyItemsSection = styled.div`
  flex: 1;
  background: #d0f0ff;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.5rem;
  overflow-y: auto;
`;

const MyItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  padding: 0.5rem;
`;

const MyItemCard = styled.div`
  background-color: #fff;
  border: 3px solid #000;
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  animation: ${fadeIn} 0.4s ease-out;
  transition:
    transform 0.2s,
    background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-3px);
    background-color: #f0f8ff;
  }
`;

const MyItemIcon = styled.div`
  font-size: 28px;
  margin-bottom: 0.3rem;
`;

const MyItemName = styled.span`
  font-size: 0.8rem;
  color: #004a66;
  font-weight: 500;
`;

const ModalSubmitButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
  border: 2px solid #000;
  border-radius: 4px;
`;

const ModalCancelButton = styled.button`
  background-color: #f06292;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
  border: 2px solid #000;
  border-radius: 4px;
`;

const ModalBody = styled.div`
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 0.5rem;
`;
