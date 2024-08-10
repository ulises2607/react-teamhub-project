import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginForm from "./components/pages/Authentication/LoginForm";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/profile" element={<EditProfile />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
