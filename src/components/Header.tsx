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
import { getUserInfo } from '../api/user/userApi'; // 추가

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem('accessToken')
  );

  // 포인트 상태
  const [points, setPoints] = useState<number | null>(null);
  const [loadingPoint, setLoadingPoint] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, [location]);

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

  // 로그인 상태 변경 시 사용자 정보(포인트) 조회
  useEffect(() => {
    const fetchPoint = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setPoints(null);
        return;
      }
      setLoadingPoint(true);
      try {
        const res = await getUserInfo();
        if (res.isSuccess && res.result) {
          setPoints(res.result.point);
        } else {
          // 실패 응답 처리: 토큰 오류 등인 경우 로그아웃 처리
          console.warn('유저 정보 조회 실패:', res.message);
          if (res.code === 401 || res.code === 'TOKEN_FORMAT_INCORRECT') {
            localStorage.removeItem('accessToken');
            setIsLoggedIn(false);
            navigate('/login');
          }
          setPoints(null);
        }
      } catch (err: any) {
        console.error('유저 정보 조회 중 오류:', err);
        // 네트워크/권한 오류 시 로그아웃 처리
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          localStorage.removeItem('accessToken');
          setIsLoggedIn(false);
          navigate('/login');
        }
        setPoints(null);
      } finally {
        setLoadingPoint(false);
      }
    };

    if (isLoggedIn) {
      fetchPoint();
    } else {
      setPoints(null);
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setPoints(null);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };
  const handleSignUp = () => {
    navigate('/sign-up');
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
              <span>
                {loadingPoint ? '...' : `${points?.toLocaleString() ?? 0}냥`}
              </span>
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
