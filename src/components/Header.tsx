// src/components/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaFistRaised,
  FaTrophy,
  FaStore,
  FaUser,
  FaCat,
  FaSignInAlt,
  FaUserPlus,
  FaTasks,
  FaCoins,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Axios 인터셉터에서 'accessToken' 키로 저장하고 있으므로, 여기서도 'accessToken'으로 체크
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem('accessToken')
  );

  useEffect(() => {
    // 라우트가 바뀔 때마다 (로그인 완료 후 리다이렉트 시) 상태 재확인
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, [location]);

  // 다른 탭에서 accessToken이 바뀔 때에도 반영
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        setIsLoggedIn(!!e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/'); // SPA 내에서 홈으로 이동
  };

  const handleLogin = () => {
    navigate('/login'); // SPA 내에서 로그인 페이지로 이동
  };
  const handleSignUp = () => {
    navigate('/sign-up'); // SPA 내에서 회원가입 페이지로 이동
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        {/* LogoSection: 클릭 시 /home 이동 */}
        <LogoSection onClick={handleLogoClick}>
          <LogoIcon>
            <FaCat />
          </LogoIcon>
          <LogoText>이거냥저거냥</LogoText>
        </LogoSection>

        {/* Nav: 항상 중앙 정렬 */}
        <Nav>
          <NavItem href='/battle-list'>
            <IconWrapper>
              <FaFistRaised />
            </IconWrapper>
            배틀
          </NavItem>
          <NavItem href='/ranking-list'>
            <IconWrapper>
              <FaTrophy />
            </IconWrapper>
            랭킹
          </NavItem>
          <NavItem href='/quest-list'>
            <IconWrapper>
              <FaTasks />
            </IconWrapper>
            퀘스트
          </NavItem>
          <NavItem href='/shop-list'>
            <IconWrapper>
              <FaStore />
            </IconWrapper>
            상점
          </NavItem>
          <NavItem href='/myinfo'>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            내정보
          </NavItem>
        </Nav>

        {/* Actions: 오른쪽 정렬 */}
        <Actions>
          {isLoggedIn && (
            <PointsDisplay>
              <PointsIcon>
                <FaCoins />
              </PointsIcon>
              <span>1000냥</span>
            </PointsDisplay>
          )}
          {isLoggedIn ? (
            <ActionButton onClick={handleLogout}>
              <ButtonIcon>
                <FaSignOutAlt />
              </ButtonIcon>
              로그아웃
            </ActionButton>
          ) : (
            <>
              <ActionButton onClick={handleLogin}>
                <ButtonIcon>
                  <FaSignInAlt />
                </ButtonIcon>
                로그인
              </ActionButton>
              <ActionButton $primary onClick={handleSignUp}>
                <ButtonIcon>
                  <FaUserPlus />
                </ButtonIcon>
                회원가입
              </ActionButton>
            </>
          )}
        </Actions>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;

/* ==========================
   Styled Components 정의
========================== */

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  border-bottom: 2px solid #ff9900;
`;

const HeaderWrapper = styled.div`
  min-width: 1000px; /* 적절한 최대 너비 지정 */
  margin: 0 auto;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* LogoSection: 왼쪽 정렬, 클릭 가능 */
const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 2px solid #ff9900;
  border-radius: 8px;
  gap: 1rem;
  padding: 0 10px;

  cursor: pointer;

  &:hover {
    background-color: rgba(255, 153, 0, 0.1);
  }
`;

const LogoIcon = styled.div`
  font-size: 2rem;
  color: #fff;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
`;

/* Nav: 중앙 정렬 */
const Nav = styled.nav`
  flex: 1; /* LogoSection과 Actions 사이에서 남은 공간 차지 */
  display: flex;
  justify-content: center; /* 항상 중앙 정렬 */
  align-items: center;
  gap: 2rem;
  min-width: 400px;
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff9900;
  }
`;

/* 아이콘(IconWrapper) 자체 색상을 상속받도록 수정 */
const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: inherit; /* 부모(NavItem)의 color를 그대로 상속 */
`;

/* Actions: 오른쪽 정렬 */
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
`;

const PointsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
  font-weight: bold;
  color: #ff9900;
  min-width: 80px;
`;

const PointsIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1.2rem;
  color: inherit;
`;

const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: inherit;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  color: #fff;
  border: 2px solid #ff9900;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: ${({ $primary }) =>
    $primary ? 'rgba(255, 153, 0, 0.2)' : 'transparent'};
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  display: flex;
  align-items: center;
  min-width: 120px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;
