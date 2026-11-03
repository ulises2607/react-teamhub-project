import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/auth/authSlice";
import { fetchProfile } from "../redux/profileSlice";
export default function Profile() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile, isLoading, error } = useSelector((state) => state.profile);
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || profile?.username || "Mi cuenta";
  return <div className="profile-area"><button className="profile-trigger" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}><span className="profile-avatar" aria-hidden="true">{name[0].toUpperCase()}</span><span><strong>{name}</strong><small>{isLoading ? "Cargando perfil…" : "Mi espacio de trabajo"}</small></span><span aria-hidden="true">⌃</span></button>
    {error && <p role="alert" className="form-error">{error}<button onClick={() => dispatch(fetchProfile())}>Reintentar</button></p>}
    {isOpen && <div className="profile-menu"><Link to="/profile">Editar perfil</Link><button onClick={() => dispatch(logout())}>Cerrar sesión</button></div>}
  </div>;
}
