import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, fetchProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth/authSlice";
import { clearMessages } from "../redux/messageSlice";
import { clearChannels } from "../redux/channelSlice";
import { clearServers } from "../redux/serverSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const profile = useSelector((state) => state.profile.data);
  const token = useSelector((state) => state.auth.token);

  console.log("Perfil cargado en base a tokken: ", profile);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile(token));
      console.log("El token en servercomp: ", token);
    }
  }, [dispatch, token]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión");
    dispatch(logout());
    dispatch(clearProfile());
    dispatch(clearMessages());
    dispatch(clearChannels());
    dispatch(clearServers());
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  if (!profile) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="relative mt-4">
      <button onClick={toggleMenu} className="flex items-center">
        <img
          className="w-10 h-10 rounded-full"
          src={profile.profile_image || "/user.png"}
          alt="User"
        />
        <span className="ml-2 text-white">
          {profile.first_name + " " + profile.last_name}
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
  );
};

export default Profile;
