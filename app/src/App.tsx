// app/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './page/Layout';
import Login from './page/auth/Login';
import Signup from './page/auth/Signup';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Login />} />
          <Route path='signup' element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
