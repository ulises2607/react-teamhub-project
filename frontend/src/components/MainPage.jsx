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
import { MdOutlineExplore } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const MainPage = () => {
  const [currentServer, setCurrentServer] = useState(null);
  const [serverName, setServerName] = useState("");
  const [channelName, setChannelName] = useState("");
  const [currentChannel, setCurrentChannel] = useState(null);
  const [showServerForm, setShowServerForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleExploreServers = () => {
    navigate("/explore-servers");
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow">
        <div className="w-[100px] bg-gray-900 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <ServerList onSelectServer={handleSelectServer} />
          </div>
          <div className="p-2 flex flex-col items-center">
            <button
              onClick={handleCreateServer}
              className="bg-gray-700 h-10 w-10 flex items-center justify-center rounded-3xl mb-1 overflow-hidden transition-all duration-1000 hover:bg-green-700 hover:rounded-xl"
            >
              <FaPlus className="text-green-700 bg-transparent-700 rounded-full w-6 h-6 hover:text-white transition-all duration-1000" />
            </button>
            <button
              onClick={handleExploreServers}
              className="h-10 w-10 mt-4 p-1 bg-gray-700 text-white mx-4 rounded-3xl flex items-center justify-center transition-all duration-1000 hover:bg-green-700 hover:rounded-xl"
            >
              <MdOutlineExplore className="text-green-700 bg-transparent w-6 h-6 transition-all duration-1000  hover:text-white" />
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
