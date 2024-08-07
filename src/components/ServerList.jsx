import React, { useState, useEffect } from 'react';

const URL_BASE = import.meta.env.VITE_API_URL

const ServerList = ({ onSelectServer }) => {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('https://api/');
        const data = await response.json();
        setServers(data);
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    fetchServers();
  }, []);

  return (
    <div className="w-1/4 bg-gray-800 text-white">
      <ul>
        {servers.map((server) => (
          <li
            key={server.id}
            className="p-4 hover:bg-gray-600 cursor-pointer"
            onClick={() => onSelectServer(server.id)}
          >
            {server.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerList;
