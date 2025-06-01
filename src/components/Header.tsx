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

  // 토큰 존재 여부로 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    // 라우트가 바뀔 때마다 토큰 상태 재확인
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  // 다른 탭에서 로그아웃/로그인 시에도 반영
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        setIsLoggedIn(!!e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // SPA 내에서 홈으로 이동
  };

  const handleLogin = () => {
    navigate('/login'); // SPA 내에서 로그인 페이지로 이동
  };
  const handleSignUp = () => {
    navigate('/sign-up'); // SPA 내에서 회원가입 페이지로 이동
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <LogoSection>
          <LogoIcon>
            <FaCat />
          </LogoIcon>
          <LogoText>이거냥저거냥</LogoText>
        </LogoSection>
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

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.95);

  z-index: 1000;
  border-bottom: 2px solid #ffffff; /* 검은색 테두리 */
`;

const HeaderWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.5rem 2rem;
  display: flex;
  align-items: center;
`;

const LogoSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div`
  font-size: 2rem;
  color: #ff9900;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff9900;
  min-width: 130px;
`;

const Nav = styled.nav`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  min-width: 450px;
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

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: #fff;
`;

const Actions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
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
`;

const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  color: #fff;
  border: 1px solid #ff9900;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  display: flex;
  align-items: center;
  min-width: 120px;
  &:hover {
    opacity: 0.9;
  }
`;
