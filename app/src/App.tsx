// app/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './page/Layout';
import Login from './page/auth/Login';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
