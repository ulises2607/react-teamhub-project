import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';

function App() {
  return (
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/main" />} />
    </Routes>
  );
}

export default App;
