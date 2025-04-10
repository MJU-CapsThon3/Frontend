import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './page/Layout';
import Login from './page/auth/Login';
import Signup from './page/auth/Signup';
import FindId from './page/auth/FindId';
import FindPassword from './page/auth/FindPassword';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Navigate to='/login' replace />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='find-id' element={<FindId />} />
          <Route path='find-password' element={<FindPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
