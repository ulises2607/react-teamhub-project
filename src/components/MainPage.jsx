import React from 'react';
import ServerList from './ServerList';
import ChannelList from './ChannelList';
import Chat from './Chat';
import Profile from './Profile';

const MainPage = () => {
  return (
    <div className="flex h-screen">
      <ServerList />
      <ChannelList />
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex justify-end bg-gray-200">
          <Profile />
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default MainPage;
