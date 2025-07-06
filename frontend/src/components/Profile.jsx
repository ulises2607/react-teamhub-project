import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth/authSlice";
import { clearServers } from "../redux/serverSlice";
import { clearMessages } from "../redux/messageSlice";
import { clearChannels } from "../redux/channelSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: profile,
    isLoading,
    error,
  } = useSelector((state) => state.profile);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMessages());
    dispatch(clearChannels());
    dispatch(clearServers());
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return <div>Cargando perfil...</div>;
  }

  if (error) {
    return <div>Error al cargar perfil: {error}</div>;
  }

  return profile ? (
    <div className="relative my-4">
      <button onClick={toggleMenu} className="flex items-center">
        <img
          className="w-10 h-10 rounded-full"
          src={profile.profile_image || "https://cdn.discordapp.com/embed/avatars/1.png"}
          alt="User"
        />
        <span className="ml-2 text-white text-sm">
          {profile.first_name && profile.last_name
            ? `${profile.first_name} ${profile.last_name}`
            : "Usuario"}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mb-2 w-48 bg-white border rounded shadow-lg bottom-full">
          <button
            onClick={handleEditProfile}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Editar perfil
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  ) : null;
};

export default Profile;
