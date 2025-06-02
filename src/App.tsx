// src/App.tsx

import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Layout from './page/Layout';
import Login from './page/auth/Login';
import Signup from './page/auth/Signup';
import FindId from './page/auth/FindId';
import FindPassword from './page/auth/FindPassword';
import BattleList from './page/Battle/BattleList';
import BattleDetail from './page/Battle/BattleDetail';
import RankingList from './page/Ranking/RankingList';
import QuestList from './page/Quest/QuestList';
import ShopList from './page/Shop/ShopList';
import MyInfo from './page/MyInfo/MyInfo';
import Home from './page/home';

import './App.css';

// 인증이 필요한 경로를 감싸는 컴포넌트
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리디렉트
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* 인증 불필요 페이지 */}
          <Route index element={<Navigate to='/login' replace />} />
          <Route path='login' element={<Login />} />
          <Route path='sign-up' element={<Signup />} />
          <Route path='find-id' element={<FindId />} />
          <Route path='find-password' element={<FindPassword />} />
          <Route path='home' element={<Home />} />

          {/* 인증 필요 페이지 */}
          <Route
            path='battle-list'
            element={
              <RequireAuth>
                <BattleList />
              </RequireAuth>
            }
          />
          <Route
            path='battle/:roomId'
            element={
              <RequireAuth>
                <BattleDetail />
              </RequireAuth>
            }
          />
          <Route
            path='ranking-list'
            element={
              <RequireAuth>
                <RankingList />
              </RequireAuth>
            }
          />
          <Route
            path='quest-list'
            element={
              <RequireAuth>
                <QuestList />
              </RequireAuth>
            }
          />
          <Route
            path='shop-list'
            element={
              <RequireAuth>
                <ShopList />
              </RequireAuth>
            }
          />
          <Route
            path='myinfo'
            element={
              <RequireAuth>
                <MyInfo />
              </RequireAuth>
            }
          />

          {/* 그 외 경로는 로그인으로 리디렉트 */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
