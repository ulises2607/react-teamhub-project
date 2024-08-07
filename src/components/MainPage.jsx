import React, { useState } from 'react';
import ServerList from './ServerList';
import ChannelList from './ChannelList';
import Chat from './Chat';
import Profile from './Profile';
import { useDispatch } from 'react-redux';
import { createChannel } from '../store/channelSlice';

const MainPage = () => {
  const [currentServer, setCurrentServer] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const dispatch = useDispatch();

  const handleSelectServer = (serverId) => {
    setCurrentServer(serverId);
    setCurrentChannel(null); // Reset current channel when a new server is selected
  };

  const handleSelectChannel = (channelId) => {
    setCurrentChannel(channelId);
  };

  const handleCreateChannel = () => {
    const channelName = prompt("Enter new channel name:");
    if (channelName) {
      dispatch(createChannel({ serverId: currentServer, name: channelName }));
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-shrink-0 bg-gray-800">
        <Profile />
      </div>
      <div className="flex flex-grow">
        <div className="w-1/5 bg-gray-700">
          <ServerList onSelectServer={handleSelectServer} />
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
              <span className="text-white">Select a server to see channels</span>
            </div>
          )}
        </div>
        <div className="flex-grow bg-gray-600">
          {currentChannel ? (
            <Chat currentChannel={currentChannel} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-white">Select a channel to start chatting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
