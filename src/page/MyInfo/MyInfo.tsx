// src/pages/MyInfo/MyInfo.tsx
import React, { useState, useMemo, useCallback, FormEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUserAlt, FaBorderStyle, FaCoins } from 'react-icons/fa';

// svg 아이콘 임포트 (파일 경로는 프로젝트 구조에 맞게 수정)
import BronzeIcon from '../../assets/Bronze.svg';
import SilverIcon from '../../assets/Silver.svg';
import GoldIcon from '../../assets/Gold.svg';
import PlatinumIcon from '../../assets/Platinum.svg';
import DiamondIcon from '../../assets/Diamond.svg';
import MasterIcon from '../../assets/Master.svg';
import GrandMasterIcon from '../../assets/GrandMaster.svg';
import ChallengerIcon from '../../assets/Challenger.svg';

//
// 타입 정의 (icon 타입을 React.ReactElement로 수정)
//
type ShopItem = {
  id: number;
  name: string;
  price: number;
  icon: React.ReactElement;
  category: '전체' | '팀 아이콘' | '효과음' | '테두리';
};

interface MyBoxState {
  nickname: string;
  isReady: boolean;
  appliedTeamIcon: ShopItem | null;
  appliedBorder: ShopItem | null;
  avatarUrl?: string;
}

const MAX_PLAYERS = 40;
const getTierByRank = (
  rank: number,
  totalPlayers: number = MAX_PLAYERS
): string => {
  const thresholds = {
    challenger: Math.ceil(totalPlayers * 0.01),
    grandmaster: Math.ceil(totalPlayers * 0.04),
    master: Math.ceil(totalPlayers * 0.1),
    diamond: Math.ceil(totalPlayers * 0.2),
    platinum: Math.ceil(totalPlayers * 0.35),
    gold: Math.ceil(totalPlayers * 0.55),
    silver: Math.ceil(totalPlayers * 0.8),
    bronze: totalPlayers,
  };

  if (rank <= thresholds.challenger) return 'challenger';
  if (rank <= thresholds.grandmaster) return 'grandmaster';
  if (rank <= thresholds.master) return 'master';
  if (rank <= thresholds.diamond) return 'diamond';
  if (rank <= thresholds.platinum) return 'platinum';
  if (rank <= thresholds.gold) return 'gold';
  if (rank <= thresholds.silver) return 'silver';
  return 'bronze';
};

const tierMapping: {
  [key: string]: { label: string; icon: React.ReactElement };
} = {
  bronze: {
    label: '브론즈',
    icon: <img src={BronzeIcon} alt='브론즈' width={40} height={40} />,
  },
  silver: {
    label: '실버',
    icon: <img src={SilverIcon} alt='실버' width={40} height={40} />,
  },
  gold: {
    label: '골드',
    icon: <img src={GoldIcon} alt='골드' width={40} height={40} />,
  },
  platinum: {
    label: '플래티넘',
    icon: <img src={PlatinumIcon} alt='플래티넘' width={40} height={40} />,
  },
  diamond: {
    label: '다이아',
    icon: <img src={DiamondIcon} alt='다이아' width={40} height={40} />,
  },
  master: {
    label: '마스터',
    icon: <img src={MasterIcon} alt='마스터' width={40} height={40} />,
  },
  grandmaster: {
    label: '그랜드마스터',
    icon: (
      <img src={GrandMasterIcon} alt='그랜드마스터' width={40} height={40} />
    ),
  },
  challenger: {
    label: '챌린저',
    icon: <img src={ChallengerIcon} alt='챌린저' width={40} height={40} />,
  },
};

const MyInfo: React.FC = () => {
  const userInfo = {
    username: '홍길동',
    email: 'qwer1234@naver.com',
    rank: 5,
    totalPlayers: 40,
  };

  const userTierKey = useMemo(
    () => getTierByRank(userInfo.rank, userInfo.totalPlayers),
    [userInfo.rank, userInfo.totalPlayers]
  );
  const userTier = tierMapping[userTierKey];

  const [myBox, setMyBox] = useState<MyBoxState>({
    nickname: '내 닉네임',
    isReady: false,
    appliedTeamIcon: null,
    appliedBorder: null,
    avatarUrl: '',
  });

  const [myItems] = useState<ShopItem[]>([
    {
      id: 1,
      name: '스타 팀 아이콘',
      price: 9900,
      icon: <FaUserAlt size={32} color='#888888' />,
      category: '팀 아이콘',
    },
    {
      id: 2,
      name: '클래식 팀 아이콘',
      price: 8500,
      icon: <FaUserAlt size={32} color='#aaa' />,
      category: '팀 아이콘',
    },
    {
      id: 3,
      name: '모던 팀 아이콘',
      price: 9200,
      icon: <FaUserAlt size={32} color='#bbb' />,
      category: '팀 아이콘',
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
      name: '메탈 테두리',
      price: 2200,
      icon: <FaBorderStyle size={32} color='#999999' />,
      category: '테두리',
    },
    {
      id: 9,
      name: '메탈 테두리',
      price: 2200,
      icon: <FaBorderStyle size={32} color='#999999' />,
      category: '테두리',
    },
  ]);

  const handlePreviewItem = (item: ShopItem) => {
    if (item.category === '팀 아이콘') {
      setMyBox((prev) => ({ ...prev, appliedTeamIcon: item }));
    } else if (item.category === '테두리') {
      setMyBox((prev) => ({ ...prev, appliedBorder: item }));
    } else {
      alert('효과음 아이템은 미리보기가 지원되지 않습니다.');
    }
  };

  const handleResetPreview = () => {
    setMyBox({
      nickname: '내 닉네임',
      isReady: false,
      appliedTeamIcon: null,
      appliedBorder: null,
      avatarUrl: '',
    });
  };

  const getBoxBorderStyle = () => {
    if (!myBox.appliedBorder) return '2px solid #999';
    if (myBox.appliedBorder.name.includes('네온')) return '4px dashed #ff33cc';
    if (myBox.appliedBorder.name.includes('메탈')) return '4px solid #999';
    if (myBox.appliedBorder.name.includes('빛나는')) return '4px solid yellow';
    return '4px solid #ffa000';
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const handlePasswordChange = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setPwError('새 비밀번호와 확인이 일치하지 않습니다.');
        return;
      }
      setPwError('');
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    [newPassword, confirmPassword]
  );

  return (
    <PageContainer>
      <LeftColumn>
        {/* 내 정보 */}
        <Section>
          <SectionTitle>내 정보</SectionTitle>
          <InfoRow>
            <InfoLabel>닉네임:</InfoLabel>
            <InfoValue>{userInfo.username}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>이메일:</InfoLabel>
            <InfoValue>{userInfo.email}</InfoValue>
          </InfoRow>
        </Section>

        {/* 내 랭킹 */}
        <Section>
          <SectionTitle>내 랭킹</SectionTitle>
          <TierCard>
            <TierIcon>
              <>{userTier.icon}</>
            </TierIcon>
            <TierDetail>
              <TierName>{userTier.label}</TierName>
              <TierRank>랭킹 {userInfo.rank}등</TierRank>
            </TierDetail>
          </TierCard>
        </Section>

        {/* 비밀번호 변경 */}
        <Section>
          <SectionTitle>비밀번호 변경</SectionTitle>
          <Form onSubmit={handlePasswordChange}>
            <FormRow>
              <FormLabel>현재 비밀번호</FormLabel>
              <FormInput
                type='password'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder='현재 비밀번호 입력'
                required
              />
            </FormRow>
            <FormRow>
              <FormLabel>새 비밀번호</FormLabel>
              <FormInput
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='새 비밀번호 입력'
                required
              />
            </FormRow>
            <FormRow>
              <FormLabel>새 비밀번호 확인</FormLabel>
              <FormInput
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='새 비밀번호 확인'
                required
              />
            </FormRow>
            {pwError && <ErrorText>{pwError}</ErrorText>}
            <SubmitButton type='submit'>비밀번호 변경</SubmitButton>
          </Form>
        </Section>
      </LeftColumn>

      <RightColumn>
        {/* 내 냥포인트 영역: "내포인트" 제목과 포인트 값 */}
        <PointsSection>
          <PointsTitle>내포인트</PointsTitle>
          <PointsDisplay>
            <PointsIcon>
              <FaCoins size={18} />
            </PointsIcon>
            <PointsValue>1000냥</PointsValue>
          </PointsDisplay>
        </PointsSection>

        {/* 내 박스 미리보기 및 내 아이템 */}
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
          <SectionTitle>내 아이템</SectionTitle>
          <MyItemsGridVertical>
            {myItems.map((item) => (
              <MyItemCard key={item.id} onClick={() => handlePreviewItem(item)}>
                <MyItemIcon>
                  <>{item.icon}</>
                </MyItemIcon>
                <MyItemName>{item.name}</MyItemName>
              </MyItemCard>
            ))}
          </MyItemsGridVertical>
        </PreviewSection>
      </RightColumn>
    </PageContainer>
  );
};

export default MyInfo;

//
// Styled Components
//

const PageContainer = styled.div`
  display: flex;
  margin: 20px auto 2rem;
  padding: 1rem;
  gap: 1rem;
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div`
  width: 430px;
  height: 850px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 내 냥포인트 섹션
const PointsSection = styled.section`
  background: #fff;
  padding: 0.8rem;
  border: 2px solid #99cfff;
  border-radius: 8px;
  text-align: center;
`;

const PointsTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #1c87c9;
  font-weight: bold;
`;

const PointsDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
  font-weight: bold;
  color: #1c87c9;
  margin-top: 0.5rem;
`;

const PointsIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1.2rem;
`;

const PointsValue = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #1c87c9;
`;

const Section = styled.section`
  background: #fff;
  padding: 1rem;
  border: 2px solid #99cfff;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: #333;
  border-bottom: 2px solid #1c87c9;
  padding-bottom: 0.3rem;
  text-align: center;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.div`
  width: 100px;
  font-weight: bold;
  color: #555;
`;

const InfoValue = styled.div`
  flex: 1;
  color: #333;
  text-align: left;
`;

const TierCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TierIcon = styled.div`
  margin-right: 1rem;
`;

const TierDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const TierName = styled.span`
  font-size: 1.4rem;
  font-weight: bold;
`;

const TierRank = styled.span`
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: #333;
  text-align: left;
`;

const FormInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #1c87c9;
  }
`;

const SubmitButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1.1rem;
  font-weight: bold;
  background: #1c87c9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #1664a2;
  }
`;

const ErrorText = styled.span`
  color: #f44336;
  font-size: 0.9rem;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const PreviewSection = styled.div`
  background: #fffdd0;
  border: 2px solid #ffe45c;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 800px;
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

const MyItemsGridVertical = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  max-height: 230px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const MyItemCard = styled.div`
  width: 100px;
  height: 100px;
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
  font-size: 24px;
  margin-bottom: 0.3rem;
`;

const MyItemName = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;
