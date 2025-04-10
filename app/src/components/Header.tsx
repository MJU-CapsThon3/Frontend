import React from 'react';
import styled from 'styled-components';
import {
  FaFistRaised,
  FaPoll,
  FaStore,
  FaUser,
  FaCat,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';

const Header: React.FC = () => {
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
          <NavItem href='#'>
            <IconWrapper>
              <FaPoll />
            </IconWrapper>
            투표
          </NavItem>
          <NavItem href='#'>
            <IconWrapper>
              <FaStore />
            </IconWrapper>
            상점
          </NavItem>
          <NavItem href='#'>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            내정보
          </NavItem>
        </Nav>
        <Actions>
          <ActionButton onClick={() => (window.location.href = '/login')}>
            <ButtonIcon>
              <FaSignInAlt />
            </ButtonIcon>
            로그인
          </ActionButton>
          <ActionButton
            primary
            onClick={() => (window.location.href = '/sign-up')}
          >
            <ButtonIcon>
              <FaUserPlus />
            </ButtonIcon>
            회원가입
          </ActionButton>
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
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
  color: #1c87c9;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c87c9;
  min-width: 130px;
`;

const Nav = styled.nav`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  min-width: 350px;
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #1c87c9;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const Actions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  background: ${(props) => (props.primary ? '#1c87c9' : 'transparent')};
  color: ${(props) => (props.primary ? '#fff' : '#1c87c9')};
  border: 1px solid #1c87c9;
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
