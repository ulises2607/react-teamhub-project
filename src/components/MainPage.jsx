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

const MainPage = () => {
  const [currentServer, setCurrentServer] = useState(null);
  const [serverName, setServerName] = useState("");
  const [channelName, setChannelName] = useState("");
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showServerForm, setShowServerForm] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServers());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleSelectServer = (serverId, serName) => {
    setCurrentServer(serverId);
    setCurrentChannel(null);
    setServerName(serName);
  };

  const handleSelectChannel = (channelId, channName) => {
    setCurrentChannel(channelId);
    setChannelName(channName);
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
      <div className="flex flex-grow">
        <div className="w-[100px] bg-gray-900 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <ServerList onSelectServer={handleSelectServer} />
          </div>
          <div className="p-2">
            <button
              onClick={handleCreateServer}
              className="bg-white opacity-25 h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden"
            >
              <svg
                className="fill-current h-10 w-10 block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-1/5 bg-gray-800">
          {currentServer ? (
            <ChannelList
              currentServer={currentServer}
              onSelectChannel={handleSelectChannel}
              onCreateChannel={handleCreateChannel}
              serverName={serverName}
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
            <Chat currentChannel={currentChannel} channelName={channelName} />
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
