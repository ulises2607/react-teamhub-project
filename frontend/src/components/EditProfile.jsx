import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile.data);
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    username: profile?.username || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    dob: profile?.dob || "",
    profile_image: profile?.profile_image || "",
    profile_state: profile?.profile_state || "En línea",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ profileData: formData }));
    navigate("/main");
  };

  const handleCancel = () => {
    navigate("/main");
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-[#2f3136] text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400">Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Nombre:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Fecha de Nacimiento:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Foto de Perfil:</label>
          <input
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Estado:</label>
          <select
            name="profile_state"
            value={formData.profile_state}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#36393f] text-white border border-[#4f545c] rounded-md focus:outline-none focus:border-[#7289da]"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En línea">En línea</option>
            <option value="Ocupado">Ocupado</option>
            <option value="De vacaciones">De vacaciones</option>
            <option value="En una reunión">En una reunión</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-[#5865f2] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4752c4] transition-colors duration-300"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-[#8e9297] text-white font-bold py-2 px-4 rounded-md hover:bg-[#6d6f71] transition-colors duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
