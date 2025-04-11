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

/* 애니메이션: 마우스 오버 시 살짝 떠오르는 효과 */
const floatUpDown = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

/* -------- 타입 정의 -------- */
type CategoryType = '전체' | '팀 아이콘' | '효과음' | '테두리';

interface ShopItem {
  id: number;
  name: string;
  price: number;
  icon: React.ReactNode;
  category: CategoryType;
}

type TeamType = 'blue' | 'red' | null;

interface MyBoxState {
  nickname: string;
  isReady: boolean;
  appliedTeamIcon: ShopItem | null;
  appliedBorder: ShopItem | null;
  avatarUrl?: string;
}

/* -------- 더미 아이템 데이터 -------- */
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
];

/* -------- 상점 메인 컴포넌트 -------- */
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

  const handleCategoryClick = (cat: CategoryType) => {
    setSelectedCategory(cat);
  };

  const handleBuyItem = (item: ShopItem) => {
    alert(`'${item.name}' 아이템을 구매했습니다!`);
    setMyItems((prev) =>
      prev.find((x) => x.id === item.id) ? prev : [...prev, item]
    );
  };

  const handleApplyItem = (item: ShopItem) => {
    if (item.category === '팀 아이콘') {
      setMyBox((prev) => ({ ...prev, appliedTeamIcon: item }));
    } else if (item.category === '테두리') {
      setMyBox((prev) => ({ ...prev, appliedBorder: item }));
    } else {
      alert('효과음 아이템은 아직 기능이 없습니다.');
    }
  };

  const handleSelectTeam = (team: TeamType) => {
    if (!myBox.appliedTeamIcon) return;
    const updatedTeamIcon: ShopItem = {
      ...myBox.appliedTeamIcon,
      icon: React.cloneElement(
        myBox.appliedTeamIcon.icon as React.ReactElement,
        { color: team === 'red' ? '#ff0000' : '#0000ff' }
      ),
    };
    setMyBox((prev) => ({ ...prev, appliedTeamIcon: updatedTeamIcon }));
  };

  const toggleReady = () => {
    setMyBox((prev) => ({ ...prev, isReady: !prev.isReady }));
  };

  const filteredItems = dummyShopItems
    .filter((item) =>
      selectedCategory === '전체' ? true : item.category === selectedCategory
    )
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
        <ItemGrid>
          {filteredItems.map((item) => (
            <ItemCard key={item.id}>
              <ItemRow>
                <IconWrapper>{item.icon}</IconWrapper>
                <ItemText>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>가격: {item.price}원</ItemPrice>
                </ItemText>
              </ItemRow>
              <BuyButton onClick={() => handleBuyItem(item)}>구매</BuyButton>
            </ItemCard>
          ))}
        </ItemGrid>
      </ShopSection>

      <PreviewSection>
        <SectionTitle>내 박스 미리보기</SectionTitle>
        <BattleBox customBorder={getBoxBorderStyle()}>
          {myBox.appliedTeamIcon && (
            <AppliedIcon>{myBox.appliedTeamIcon.icon}</AppliedIcon>
          )}
          <Nickname>{myBox.nickname}</Nickname>
          {myBox.avatarUrl ? (
            <Avatar src={myBox.avatarUrl} alt='avatar' />
          ) : (
            <DefaultAvatar>
              <FaUserAlt size={48} color='#888' />
            </DefaultAvatar>
          )}
          <ReadyIndicator>
            {myBox.isReady ? (
              <ReadyBadge>준 비</ReadyBadge>
            ) : (
              <NotReadyBadge>대 기</NotReadyBadge>
            )}
          </ReadyIndicator>
        </BattleBox>
        <ButtonGroup>
          <ActionButton onClick={() => handleSelectTeam('red')}>
            빨간팀
          </ActionButton>
          <ActionButton onClick={() => handleSelectTeam('blue')}>
            파란팀
          </ActionButton>
          <ActionButton onClick={toggleReady}>
            {myBox.isReady ? '준비 해제' : '준비'}
          </ActionButton>
        </ButtonGroup>

        <MyItemsSection>
          <SectionTitle>내 아이템</SectionTitle>
          <MyItemsGrid>
            {myItems.map((item) => (
              <MyItemCard key={item.id} onClick={() => handleApplyItem(item)}>
                <MyItemIcon>{item.icon}</MyItemIcon>
                <MyItemName>{item.name}</MyItemName>
              </MyItemCard>
            ))}
          </MyItemsGrid>
        </MyItemsSection>
      </PreviewSection>
    </PageContainer>
  );
};

export default ShopWithPreview;

/* -------- Styled Components -------- */

/* 공통 컨테이너 */
const PageContainer = styled.div`
  width: 1000px;
  margin: 2rem auto;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #cde7ff;
  border: 2px solid #48b0ff;
  border-radius: 10px;
`;

/* 상점 영역 */
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

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  flex: 1;
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
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    animation: ${floatUpDown} 0.8s ease-in-out;
  }
`;

const ItemRow = styled.div`
  display: flex;
  gap: 0.5rem;
  height: 100%;
  align-items: center;
`;

const IconWrapper = styled.div`
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: aliceblue;
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
  color: #ff66ff;
  margin-bottom: 0.2rem;
`;

const ItemPrice = styled.span`
  font-size: 0.8rem;
  color: #ddd;
`;

const BuyButton = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  align-self: center;
  background-color: #4460ff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

/* 미리보기 영역 */
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

const AppliedIcon = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 5;
  font-size: 28px;
  color: #888888;
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

const ReadyIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReadyBadge = styled.div`
  background-color: #ff9800;
  color: #fff;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const NotReadyBadge = styled.div`
  background-color: #bbb;
  color: #fff;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
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

/* 내 아이템 영역 */
const MyItemsSection = styled.div`
  padding-top: 0.5rem;
  border-top: 1px solid #ccc;
`;

const MyItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1px;
  /* 3행 고정 높이, 넘으면 세로 스크롤 */
  max-height: calc(3 * 100px + 2 * 0.5rem);
  overflow-y: auto;
  padding: 0.5rem 0;
`;

const MyItemCard = styled.div`
  width: 85px;
  height: 85px;
  background-color: #fff;
  border: 2px solid #ffa000;
  border-radius: 6px;
  padding: 0.3rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:hover {
    transform: scale(1.05);
  }
`;

const MyItemIcon = styled.div`
  font-size: 28px;
`;

const MyItemName = styled.span`
  font-size: 0.8rem;
  color: #333;
`;
