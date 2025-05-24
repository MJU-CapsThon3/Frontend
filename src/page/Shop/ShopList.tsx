// app/src/page/Shop/ShopList.tsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaUserAlt,
  FaChessKnight,
  FaChessRook,
  FaSmileBeam,
  FaBomb,
  FaBorderStyle,
} from 'react-icons/fa';
// Modal 컴포넌트를 분리된 파일에서 import (경로는 프로젝트 구조에 맞게 수정)
import Modal from '../../components/Modal';

/* ------------------- 타입 정의 ------------------- */
type CategoryType = '전체' | '팀 아이콘' | '효과음' | '테두리';

interface ShopItem {
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
    name: '스타 팀 아이콘',
    price: 9900,
    icon: <FaUserAlt size={32} color='#888888' />,
    category: '팀 아이콘',
  },
  {
    id: 2,
    name: '전사 팀 아이콘',
    price: 11000,
    icon: <FaChessKnight size={32} color='#888888' />,
    category: '팀 아이콘',
  },
  {
    id: 3,
    name: '마법사 팀 아이콘',
    price: 12000,
    icon: <FaChessRook size={32} color='#888888' />,
    category: '팀 아이콘',
  },
  {
    id: 4,
    name: '우렁찬 효과',
    price: 1500,
    icon: <FaBomb size={32} color='#666' />,
    category: '효과음',
  },
  {
    id: 5,
    name: '환한 효과',
    price: 1800,
    icon: <FaSmileBeam size={32} color='#0066ff' />,
    category: '효과음',
  },
  {
    id: 6,
    name: '빛나는 테두리',
    price: 2000,
    icon: <FaBorderStyle size={32} color='#ffff66' />,
    category: '테두리',
  },
  {
    id: 7,
    name: '네온 테두리',
    price: 2500,
    icon: <FaBorderStyle size={32} color='#ff33cc' />,
    category: '테두리',
  },
  {
    id: 8,
    name: '달콤 효과음',
    price: 1300,
    icon: <FaBomb size={32} color='#ffcc00' />,
    category: '효과음',
  },
  {
    id: 9,
    name: '레트로 팀 아이콘',
    price: 10500,
    icon: <FaUserAlt size={32} color='#888888' />,
    category: '팀 아이콘',
  },
  {
    id: 10,
    name: '파워 효과음',
    price: 1600,
    icon: <FaSmileBeam size={32} color='#cc3333' />,
    category: '효과음',
  },
  {
    id: 11,
    name: '메탈 테두리',
    price: 2200,
    icon: <FaBorderStyle size={32} color='#999999' />,
    category: '테두리',
  },
  {
    id: 12,
    name: '글로우 팀 아이콘',
    price: 11500,
    icon: <FaChessKnight size={32} color='#888888' />,
    category: '팀 아이콘',
  },
  {
    id: 13,
    name: '실버 팀 아이콘',
    price: 9500,
    icon: <FaUserAlt size={32} color='#C0C0C0' />,
    category: '팀 아이콘',
  },
  {
    id: 14,
    name: '럭셔리 테두리',
    price: 3000,
    icon: <FaBorderStyle size={32} color='#FFD700' />,
    category: '테두리',
  },
  {
    id: 15,
    name: '모던 효과',
    price: 1700,
    icon: <FaSmileBeam size={32} color='#00CC99' />,
    category: '효과음',
  },
];

/* ------------------- 애니메이션 ------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

/* ------------------- 구매 모달 스타일 (추가) ------------------- */
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

  // 구매 모달 관련 상태
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [selectedPurchaseItem, setSelectedPurchaseItem] =
    useState<ShopItem | null>(null);
  // 구매 완료(모달) 상태: 모든 아이템에 대해 사용
  const [purchaseSuccessItem, setPurchaseSuccessItem] =
    useState<ShopItem | null>(null);

  const handleCategoryClick = (cat: CategoryType) => {
    setSelectedCategory(cat);
  };

  // 실제 구매 로직 (중복 구매 방지 포함)
  const handleBuyItemConfirm = (item: ShopItem) => {
    setMyItems((prev) =>
      prev.find((x) => x.id === item.id) ? prev : [...prev, item]
    );
  };

  // 구매 버튼 클릭 시 구매 확인 모달 열기
  const handleBuyItem = (item: ShopItem) => {
    setSelectedPurchaseItem(item);
    setPurchaseModalVisible(true);
  };

  // 모달 내 '구매' 버튼 클릭 처리
  const confirmPurchase = () => {
    if (selectedPurchaseItem) {
      handleBuyItemConfirm(selectedPurchaseItem);
      setPurchaseSuccessItem(selectedPurchaseItem);
    }
    setSelectedPurchaseItem(null);
    setPurchaseModalVisible(false);
  };

  // 모달 내 '취소' 버튼 클릭 처리
  const cancelPurchase = () => {
    setSelectedPurchaseItem(null);
    setPurchaseModalVisible(false);
  };

  // 미리보기 버튼: 팀 아이콘과 테두리만 미리보기 지원
  const handlePreviewItem = (item: ShopItem) => {
    if (item.category === '팀 아이콘') {
      setMyBox((prev) => ({ ...prev, appliedTeamIcon: item }));
    } else if (item.category === '테두리') {
      setMyBox((prev) => ({ ...prev, appliedBorder: item }));
    } else {
      alert('효과음 아이템은 미리보기가 지원되지 않습니다.');
    }
  };

  // 원래대로(초기화) 버튼
  const handleResetPreview = () => {
    setMyBox({
      nickname: '내 닉네임',
      isReady: false,
      appliedTeamIcon: null,
      appliedBorder: null,
      avatarUrl: '',
    });
  };

  // 필터 처리: "전체" 선택 시 전체, 그 외에는 최대 8개만 표시
  const filteredItems =
    selectedCategory === '전체'
      ? dummyShopItems
      : dummyShopItems
          .filter((item) => item.category === selectedCategory)
          .slice(0, 8);

  const getBoxBorderStyle = () => {
    if (!myBox.appliedBorder) return '2px solid #999';
    if (myBox.appliedBorder.name.includes('네온')) return '4px dashed #ff33cc';
    if (myBox.appliedBorder.name.includes('메탈')) return '4px solid #999';
    if (myBox.appliedBorder.name.includes('빛나는')) return '4px solid yellow';
    return '4px solid #ffa000';
  };

  return (
    <PageContainer>
      <ShopSection>
        <SectionTitle>상점</SectionTitle>
        <CategoryContainer>
          {(['전체', '팀 아이콘', '효과음', '테두리'] as CategoryType[]).map(
            (cat) => (
              <CategoryButton
                key={cat}
                active={selectedCategory === cat}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </CategoryButton>
            )
          )}
        </CategoryContainer>
        <ShopItemsContainer>
          <ItemGrid>
            {filteredItems.map((item) => (
              <ItemCard key={item.id}>
                <ItemRow>
                  <IconWrapper>
                    <>{item.icon}</>
                  </IconWrapper>
                  <ItemText>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>가격: {item.price}냥</ItemPrice>
                  </ItemText>
                </ItemRow>
                <ButtonRow>
                  <PreviewButton onClick={() => handlePreviewItem(item)}>
                    미리보기
                  </PreviewButton>
                  <BuyButton onClick={() => handleBuyItem(item)}>
                    구매
                  </BuyButton>
                </ButtonRow>
              </ItemCard>
            ))}
          </ItemGrid>
        </ShopItemsContainer>
      </ShopSection>

      <PreviewSection>
        <SectionTitle>내 박스 미리보기</SectionTitle>
        <BattleBox customBorder={getBoxBorderStyle()}>
          <Nickname>{myBox.nickname}</Nickname>
          {myBox.appliedTeamIcon ? (
            <AvatarContainer>
              <>{myBox.appliedTeamIcon.icon}</>
            </AvatarContainer>
          ) : myBox.avatarUrl ? (
            <Avatar src={myBox.avatarUrl} alt='avatar' />
          ) : (
            <DefaultAvatar>
              <FaUserAlt size={32} color='#888' />
            </DefaultAvatar>
          )}
        </BattleBox>
        <ActionButton onClick={handleResetPreview}>원래대로</ActionButton>
        <MyItemsSection>
          <SectionTitle>내 아이템</SectionTitle>
          <MyItemsGrid>
            {myItems.map((item) => (
              <MyItemCard key={item.id} onClick={() => handlePreviewItem(item)}>
                <MyItemIcon>
                  <>{item.icon}</>
                </MyItemIcon>
                <MyItemName>{item.name}</MyItemName>
              </MyItemCard>
            ))}
          </MyItemsGrid>
        </MyItemsSection>
      </PreviewSection>

      {/* 구매 확인 모달 */}
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

      {/* 구매 완료 모달 */}
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
  background: #cde7ff;
  border: 2px solid #48b0ff;
  border-radius: 10px;
`;

const ShopSection = styled.div`
  flex: 2;
  background: #f0f8ff;
  border: 2px solid #99cfff;
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
  background-color: ${(p) => (p.active ? '#fff' : '#d8ebff')};
  border: 1px solid #99cfff;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: ${(p) => (p.active ? 'bold' : 'normal')};
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
  background-color: #d8ebff;
  border: 1px solid #99cfff;
  border-radius: 4px;
  padding: 0.5rem;
`;

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

const PreviewSection = styled.div`
  flex: 1;
  background: #fffdd0;
  border: 2px solid #ffe45c;
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
  border: 2px solid #ffa000;
  border-radius: 6px;
  padding: 0.3rem;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.3s,
    background-color 0.3s;
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
