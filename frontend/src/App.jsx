import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { logout } from "./redux/auth/authSlice";
import MainPage from "./components/MainPage";
import LoginForm from "./components/pages/Authentication/LoginForm";
import EditProfile from "./components/EditProfile";
import ExploreServers from "./components/ExploreServers";
import HomePage from "./components/pages/home/HomePage";

function ProtectedRoutes() {
  const token = useSelector((state) => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const expire = () => dispatch(logout());
    window.addEventListener("teamhub:session-expired", expire);
    const syncSession = (event) => {
      if (event.key === "tokennn") expire();
    };
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("teamhub:session-expired", expire);
      window.removeEventListener("storage", syncSession);
    };
  }, [dispatch]);
  return <>{import.meta.env.MODE === "demo" && <div className="demo-banner">Demo local · datos de ejemplo · usuario: demo / contraseña: teamhub</div>}<Routes>
    <Route path="/home" element={<HomePage />} />
    <Route path="/login" element={<LoginForm />} />
    <Route element={<ProtectedRoutes />}>
      <Route path="/main" element={<MainPage />} />
      <Route path="/profile" element={<EditProfile />} />
      <Route path="/explore-servers" element={<ExploreServers />} />
    </Route>
    <Route path="*" element={<Navigate to="/main" replace />} />
  </Routes></>;
}
