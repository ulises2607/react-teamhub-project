import React, { useState } from 'react';
import ServerList from './ServerList';
import ChannelList from './ChannelList';
import Chat from './Chat';
import Profile from './Profile';

const MainPage = () => {
  const [currentServer, setCurrentServer] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  const handleServerSelect = (serverId) => {
    setCurrentServer(serverId);
    setCurrentChannel(null); // Reset current channel when server changes
  };

  const handleChannelSelect = (channelId) => {
    setCurrentChannel(channelId);
  };

  return (
    <div className="flex h-screen">
      <ServerList onSelectServer={handleServerSelect} />
      <ChannelList currentServer={currentServer} onSelectChannel={handleChannelSelect} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex justify-end bg-gray-200">
          <Profile />
        </div>
        {currentChannel ? <Chat currentChannel={currentChannel} /> : <div className="flex-1 flex items-center justify-center">Select a channel</div>}
      </div>
    </div>
  );
};

export default MainPage;
