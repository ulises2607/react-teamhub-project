import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginForm from "./components/pages/Authentication/LoginForm";
import EditProfile from "./components/EditProfile";
import ExploreServers from "./components/ExploreServers";
import HomePage from "./components/pages/home/HomePage";
function App() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/profile" element={<EditProfile />} />
      <Route path="/explore-servers" element={<ExploreServers />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
