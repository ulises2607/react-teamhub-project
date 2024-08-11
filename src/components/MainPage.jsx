import React, { useEffect, useState } from "react";
import ServerList from "./ServerList";
import ChannelList from "./ChannelList";
import Chat from "./Chat";
import Profile from "./Profile";
import { useDispatch } from "react-redux";
import { createChannel } from "../redux/channelSlice";
import { createServer, getServers } from "../redux/serverSlice";
import ServerForm from "./ui/ServerForm";
import { fetchProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [currentServer, setCurrentServer] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showServerForm, setShowServerForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getServers());
    dispatch(fetchProfile());
  }, [dispatch]);

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

  const handleExploreServers = () => {
    navigate('/explore-servers');
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow">
        <div className="w-1/5 bg-gray-700 flex flex-col justify-between">
          <div>
            <ServerList onSelectServer={handleSelectServer} />
            <button
              onClick={handleCreateServer}
              className="mt-4 p-2 bg-blue-500 rounded text-white mx-4"
            >
              Crear Servidor
            </button>
            <button
              onClick={handleExploreServers}
              className="mt-4 p-2 bg-green-500 rounded text-white mx-4"
            >
              Explorar Servidores
            </button>
          </div>
          <div className="p-4">
            <Profile />
          </div>
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
              <span className="text-white">
                Selecciona un servidor para ver sus canales
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow bg-gray-600 relative">
          {showServerForm && (
            <ServerForm
              onSubmit={handleServerFormSubmit}
              onClose={() => setShowServerForm(false)}
            />
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
