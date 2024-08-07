import React, { useState } from 'react';
import ServerList from './ServerList';
import ChannelList from './ChannelList';
import Chat from './Chat';
import Profile from './Profile';
import { useDispatch } from 'react-redux';
import { createChannel } from '../redux/channelSlice';
import { createServer } from '../redux/serverSlice';

const ServerForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      onSubmit(formData);
    } else {
      alert("Nombre de servidor obligatorio.");
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Icono</label>
          <input
            type="file"
            name="icon"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Servidor
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

const MainPage = () => {
  const [currentServer, setCurrentServer] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showServerForm, setShowServerForm] = useState(false);

  const dispatch = useDispatch();

  const handleSelectServer = (serverId) => {
    setCurrentServer(serverId);
    setCurrentChannel(null);
  };

  const handleSelectChannel = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleCreateChannel = () => {
    const channelName = prompt("Nombre del nuevo canal:");
    if (channelName) {
      dispatch(createChannel({ serverId: currentServer, name: channelName }));
    }
  };

  const handleCreateServer = () => {
    setShowServerForm(true);
  };

  const handleServerFormSubmit = (serverData) => {
    dispatch(createServer(serverData));
    setShowServerForm(false);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-shrink-0 bg-gray-800">
        <Profile />
      </div>
      <div className="flex flex-grow">
        <div className="w-1/5 bg-gray-700 flex flex-col">
          <ServerList onSelectServer={handleSelectServer} />
          <button
            onClick={handleCreateServer}
            className="mt-4 p-2 bg-blue-500 rounded text-white mx-4"
          >
            Crear Servidor
          </button>
        </div>
        <div className="w-1/5 bg-gray-800">
          {currentServer ? (
            <ChannelList
              currentServer={currentServer}
              onSelectChannel={handleSelectChannel}
              onCreateChannel={handleCreateChannel}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-white">Selecciona un servidor para ver sus canales</span>
            </div>
          )}
        </div>
        <div className="flex-grow bg-gray-600 relative">
          {showServerForm && (
            <ServerForm onSubmit={handleServerFormSubmit} onClose={() => setShowServerForm(false)} />
          )}
          {currentChannel ? (
            <Chat currentChannel={currentChannel} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-white">
                Selecciona un canal para comenzar a chatear
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
