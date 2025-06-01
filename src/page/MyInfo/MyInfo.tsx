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
    icon: <img src={BronzeIcon} alt='브론즈' width={32} height={32} />,
  },
  silver: {
    label: '실버',
    icon: <img src={SilverIcon} alt='실버' width={32} height={32} />,
  },
  gold: {
    label: '골드',
    icon: <img src={GoldIcon} alt='골드' width={32} height={32} />,
  },
  platinum: {
    label: '플래티넘',
    icon: <img src={PlatinumIcon} alt='플래티넘' width={32} height={32} />,
  },
  diamond: {
    label: '다이아',
    icon: <img src={DiamondIcon} alt='다이아' width={32} height={32} />,
  },
  master: {
    label: '마스터',
    icon: <img src={MasterIcon} alt='마스터' width={32} height={32} />,
  },
  grandmaster: {
    label: '그랜드마스터',
    icon: (
      <img src={GrandMasterIcon} alt='그랜드마스터' width={32} height={32} />
    ),
  },
  challenger: {
    label: '챌린저',
    icon: <img src={ChallengerIcon} alt='챌린저' width={32} height={32} />,
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
      icon: <FaUserAlt size={24} color='#888888' />,
      category: '팀 아이콘',
    },
    {
      id: 2,
      name: '클래식 팀 아이콘',
      price: 8500,
      icon: <FaUserAlt size={24} color='#aaa' />,
      category: '팀 아이콘',
    },
    {
      id: 3,
      name: '모던 팀 아이콘',
      price: 9200,
      icon: <FaUserAlt size={24} color='#bbb' />,
      category: '팀 아이콘',
    },
    {
      id: 6,
      name: '빛나는 테두리',
      price: 2000,
      icon: <FaBorderStyle size={24} color='#ffff66' />,
      category: '테두리',
    },
    {
      id: 7,
      name: '네온 테두리',
      price: 2500,
      icon: <FaBorderStyle size={24} color='#ff33cc' />,
      category: '테두리',
    },
    {
      id: 8,
      name: '메탈 테두리',
      price: 2200,
      icon: <FaBorderStyle size={24} color='#999999' />,
      category: '테두리',
    },
    {
      id: 9,
      name: '클래식 테두리',
      price: 2200,
      icon: <FaBorderStyle size={24} color='#555' />,
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
    if (!myBox.appliedBorder) return '2px solid #0095f4';
    if (myBox.appliedBorder.name.includes('네온')) return '3px dashed #ff33cc';
    if (myBox.appliedBorder.name.includes('메탈')) return '3px solid #999';
    if (myBox.appliedBorder.name.includes('빛나는')) return '3px solid yellow';
    return '2px solid #0095f4';
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
    <Container>
      <LeftColumn>
        {/* 내 정보 */}
        <CardSection>
          <SectionHeader>내 정보</SectionHeader>
          <InfoRow>
            <InfoLabel>닉네임:</InfoLabel>
            <InfoValue>{userInfo.username}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>이메일:</InfoLabel>
            <InfoValue>{userInfo.email}</InfoValue>
          </InfoRow>
        </CardSection>

        {/* 내 랭킹 */}
        <CardSection>
          <SectionHeader>내 랭킹</SectionHeader>
          <TierCard>
            <TierIcon>{userTier.icon}</TierIcon>
            <TierDetail>
              <TierName>{userTier.label}</TierName>
              <TierRank>랭킹 {userInfo.rank}등</TierRank>
            </TierDetail>
          </TierCard>
        </CardSection>

        {/* 비밀번호 변경 */}
        <CardSection>
          <SectionHeader>비밀번호 변경</SectionHeader>
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
        </CardSection>
      </LeftColumn>

      <RightColumn>
        {/* 내 냥포인트 영역 */}
        <CardSection>
          <SectionHeader style={{ marginBottom: '0.3rem' }}>
            내 포인트
          </SectionHeader>
          <PointsDisplay>
            <PointsIcon>
              <FaCoins size={18} />
            </PointsIcon>
            <PointsValue>1000냥</PointsValue>
          </PointsDisplay>
        </CardSection>

        {/* 내 박스 미리보기 및 내 아이템 */}
        <CardSection>
          <SectionHeader>내 박스 미리보기</SectionHeader>

          {/* Preview Box */}
          <PreviewRow>
            <BattleBox customBorder={getBoxBorderStyle()}>
              <Nickname>{myBox.nickname}</Nickname>
              {myBox.appliedTeamIcon ? (
                <AvatarContainer>{myBox.appliedTeamIcon.icon}</AvatarContainer>
              ) : myBox.avatarUrl ? (
                <Avatar src={myBox.avatarUrl} alt='avatar' />
              ) : (
                <DefaultAvatar>
                  <FaUserAlt size={24} color='#888' />
                </DefaultAvatar>
              )}
            </BattleBox>
          </PreviewRow>

          {/* Reset Button */}
          <PreviewRow>
            <PreviewButton onClick={handleResetPreview}>원래대로</PreviewButton>
          </PreviewRow>

          {/* My Items Grid */}
          <PreviewRow>
            <MyItemsGrid>
              {myItems.map((item) => (
                <MyItemCard
                  key={item.id}
                  onClick={() => handlePreviewItem(item)}
                >
                  <MyItemIcon>{item.icon}</MyItemIcon>
                  <MyItemName>{item.name}</MyItemName>
                </MyItemCard>
              ))}
            </MyItemsGrid>
          </PreviewRow>
        </CardSection>
      </RightColumn>
    </Container>
  );
};

export default MyInfo;

// ========== Styled Components ==========

// 상단 컨테이너
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
  overflow-y: auto;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightColumn = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const CardSection = styled.section`
  background: #dcdcdc;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.h2`
  margin: 0 0 1rem 0;
  text-align: center;
  color: #004a66;
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 1.5px solid #004a66;
  padding-bottom: 0.2rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.4rem;
`;

const InfoLabel = styled.div`
  width: 80px;
  font-weight: bold;
  color: #004a66;
  font-size: 0.9rem;
`;

const InfoValue = styled.div`
  flex: 1;
  color: #333;
  text-align: left;
  font-size: 0.9rem;
`;

const TierCard = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border: 2px solid #000000;
  border-radius: 6px;
  background-color: #f0f8ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TierIcon = styled.div`
  margin-right: 0.6rem;
`;

const TierDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const TierName = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #004a66;
`;

const TierRank = styled.span`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 0.2rem;
  font-weight: bold;
  color: #004a66;
  font-size: 0.9rem;
  text-align: left;
`;

const FormInput = styled.input`
  padding: 0.4rem;
  font-size: 0.9rem;
  border: 1.5px solid #999;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #004a66;
  }
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  background: #004a66;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #002f4c;
  }
  border: 2px solid #000;
  border-radius: 6px;
`;

const ErrorText = styled.span`
  color: #f44336;
  font-size: 0.8rem;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const PointsDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
  font-weight: bold;
  color: #004a66;
`;

const PointsIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
`;

const PointsValue = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #004a66;
`;

const PreviewRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const BattleBox = styled.div<{ customBorder?: string }>`
  position: relative;
  width: 140px;
  height: 120px;
  border-radius: 4px;
  border: 2px solid #000000;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nickname = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 0.7rem;
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
`;

const PreviewButton = styled.button`
  background-color: #004a66;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #63c8ff;
    color: #004a66;
  }

  border: 2px solid #000;
  border-radius: 6px;
`;

const MyItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  width: 300px;
  max-height: 210px;
  overflow-y: auto;
  border: 2px solid #000000;
  border-radius: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const MyItemCard = styled.div`
  background-color: #fff;
  border: 2px solid #000000;
  border-radius: 4px;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  font-size: 0.8rem;
  text-align: center;
  cursor: pointer;
  animation: ${fadeIn} 0.3s ease-out;
  transition:
    transform 0.2s,
    background-color 0.2s;

  &:hover {
    transform: translateY(-2px);
    background-color: #f0f8ff;
  }
`;

const MyItemIcon = styled.div`
  font-size: 20px;
  margin-bottom: 0.2rem;
`;

const MyItemName = styled.span`
  font-size: 0.8rem;
  color: #004a66;
  font-weight: 500;
  text-align: center;
`;
