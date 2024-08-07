import React, { useState, useEffect } from 'react';

const ChannelList = ({ currentServer, onSelectChannel }) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!currentServer) return;

      try {
        const response = await fetch(`https://sandbox.academiadevelopers.com/servers/${currentServer}/channels`);
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    fetchChannels();
  }, [currentServer]);

  return (
    <div className="w-1/4 bg-gray-700 text-white">
      <ul>
        {channels.map((channel) => (
          <li
            key={channel.id}
            className="p-4 hover:bg-gray-600 cursor-pointer"
            onClick={() => onSelectChannel(channel.id)}
          >
            {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
