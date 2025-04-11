import React from 'react';
import { Outlet } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Background from '../components/Background';
import Header from '../components/Header';

const GlobalStyle = createGlobalStyle`
  .star {
    fill: white;
    opacity: 0.8;
    animation: twinkle 3s infinite alternate;
  }
  
  @keyframes twinkle {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }
  
  .planet {
    stroke: none;
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
    animation: float 6s infinite alternate ease-in-out;
  }
  
  @keyframes float {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(5px, 5px);
    }
  }
`;

const Layout: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Background />
        <Header />
        <Main>
          <Outlet />
        </Main>
      </Container>
    </>
  );
};

export default Layout;

const Container = styled.div`
  position: relative;
`;

const Main = styled.main`
  margin-top: 70px;
  margin-bottom: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
