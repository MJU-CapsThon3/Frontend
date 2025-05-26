// src/page/Shop/ShopList.tsx
import React, { useState } from 'react';
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

/* ------------------- 타입 정의 ------------------- */
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

/* ------------------- 더미 아이템 데이터 ------------------- */
const dummyShopItems: ShopItem[] = [
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

  // ─── 새로운 캐릭터 아바타 10개 ───
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

  // ─── 테두리 기존 9개 ───
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
    icon: <FaBorderStyle size={64} color='url(#grad)' />,
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

  // ─── 추가 테두리 10개 ───
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

/* ------------------- 애니메이션 ------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

/* ------------------- 구매 모달 버튼 스타일 ------------------- */
const modalButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.5rem',
};

/* ------------------- 상점 메인 컴포넌트 ------------------- */
const ShopWithPreview: React.FC = () => {
  const [myBox, setMyBox] = useState<MyBoxState>({
    nickname: '내 닉네임',
    isReady: false,
    appliedTeamIcon: null,
    appliedBorder: null,
    avatarUrl: '',
  });
  const [myItems, setMyItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>('전체');
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [selectedPurchaseItem, setSelectedPurchaseItem] =
    useState<ShopItem | null>(null);
  const [purchaseSuccessItem, setPurchaseSuccessItem] =
    useState<ShopItem | null>(null);

  const handleCategoryClick = (cat: CategoryType) => setSelectedCategory(cat);
  const handleBuyItemConfirm = (item: ShopItem) =>
    setMyItems((prev) =>
      prev.find((x) => x.id === item.id) ? prev : [...prev, item]
    );
  const handleBuyItem = (item: ShopItem) => {
    setSelectedPurchaseItem(item);
    setPurchaseModalVisible(true);
  };
  const confirmPurchase = () => {
    if (selectedPurchaseItem) handleBuyItemConfirm(selectedPurchaseItem);
    setPurchaseSuccessItem(selectedPurchaseItem);
    setSelectedPurchaseItem(null);
    setPurchaseModalVisible(false);
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

  const filteredItems =
    selectedCategory === '전체'
      ? dummyShopItems
      : dummyShopItems.filter((item) => item.category === selectedCategory);

  const getBoxBorderStyle = () => {
    if (!myBox.appliedBorder) return '2px solid #999';
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
    return '2px solid #999';
  };

  return (
    <PageContainer>
      <ShopSection>
        <SectionTitle>상점</SectionTitle>
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
              <ShopItemCard
                key={item.id}
                item={item}
                onPreview={handlePreviewItem}
                onBuy={handleBuyItem}
              />
            ))}
          </ItemGrid>
        </ShopItemsContainer>
      </ShopSection>

      <PreviewSection>
        <SectionTitle>내 박스 미리보기</SectionTitle>
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
        <ActionButton onClick={handleResetPreview}>원래대로</ActionButton>
        <MyItemsSection>
          <SectionTitle>내 아이템</SectionTitle>
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
          <p>
            <strong>{selectedPurchaseItem.name}</strong> 아이템을{' '}
            <strong>{selectedPurchaseItem.price}원</strong>에 구매하시겠습니까?
          </p>
          <div style={modalButtonsStyle}>
            <ModalSubmitButton onClick={confirmPurchase}>
              구매
            </ModalSubmitButton>
            <ModalCancelButton onClick={cancelPurchase}>취소</ModalCancelButton>
          </div>
        </Modal>
      )}
      {purchaseSuccessItem && (
        <Modal title='구매 완료'>
          <p>
            <strong>{purchaseSuccessItem.name}</strong> 아이템을{' '}
            <strong>{purchaseSuccessItem.price}원</strong>에 구매했습니다!
          </p>
          <div style={modalButtonsStyle}>
            <ModalCancelButton onClick={() => setPurchaseSuccessItem(null)}>
              닫기
            </ModalCancelButton>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ShopWithPreview;

/* ------------------- Styled Components ------------------- */

const PageContainer = styled.div`
  width: 1000px;
  margin: 20px auto 2rem;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border: 2px solid #ff9900;
  border-radius: 10px;
`;

const ShopSection = styled.div`
  flex: 2;
  background: #fff;
  border: 2px solid #ff9900;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem 0;
  text-align: center;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
`;

const CategoryContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CategoryButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 0.3rem;
  background-color: ${({ active }) => (active ? '#fff' : '#d8ebff')};
  border: 1px solid #ff9900;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: pointer;
  &:hover {
    background-color: #fff;
  }
`;

const ShopItemsContainer = styled.div`
  flex: 1;
  max-height: 500px;
  overflow-y: auto;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background-color: #fff;
  border: 1px solid #ff9900;
  border-radius: 4px;
  padding: 0.5rem;
`;

const PreviewSection = styled.div`
  flex: 1;
  background: #fff;
  border: 2px solid #ff9900;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BattleBox = styled.div<{ customBorder?: string }>`
  position: relative;
  width: 180px;
  height: 150px;
  margin: 0 auto;
  border: ${({ customBorder }) => customBorder || '2px solid #999'};
  border-radius: 6px;
  overflow: hidden;
  background-color: #ccc;
`;

const Nickname = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;

  & > img,
  & > svg {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
  }
`;
const ActionButton = styled.button`
  background-color: #eee;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const MyItemsSection = styled.div`
  padding-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f7f7f7;
  height: 270px;
  overflow-y: auto;
`;

const MyItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
`;

const MyItemCard = styled.div`
  width: 80px;
  height: 80px;
  background-color: #fff;
  border: 2px solid #ff9900;
  border-radius: 6px;
  padding: 0.3rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-out;
  &:hover {
    transform: scale(1.05);
    background-color: #fffae6;
  }
`;

const MyItemIcon = styled.div`
  font-size: 20px;
  margin-bottom: 0.3rem;
`;

const MyItemName = styled.span`
  font-size: 0.8rem;
  color: #333;
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
`;
