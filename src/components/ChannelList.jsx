import React from 'react';

const channels = ['General', 'Random', 'Development'];

const ChannelList = () => {
  return (
    <div className="w-1/4 bg-gray-700 text-white">
      <ul>
        {channels.map((channel, index) => (
          <li key={index} className="p-4 hover:bg-gray-600 cursor-pointer">
            {channel}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
