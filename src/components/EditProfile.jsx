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
    // Aquí puedes manejar la carga de la imagen si es necesario
    dispatch(updateProfile({ profileData: formData }));
    navigate("/main"); // Redirige a la MainPage después de guardar los cambios
  };

  const handleCancel = () => {
    navigate("/main"); // Redirige a la MainPage al cancelar
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Fecha de Nacimiento:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Foto de Perfil:</label>
          <input
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Estado:</label>
          <select
            name="profile_state"
            value={formData.profile_state}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Activo">Ausente</option>
            <option value="Inactivo">De vacaciones</option>
            <option value="Inactivo">En una reunión</option>
            <option value="Inactivo">Ocupado</option>
            <option value="Inactivo">En línea</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
