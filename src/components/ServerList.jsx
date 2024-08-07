import React from 'react';

const servers = ['Server 1', 'Server 2', 'Server 3'];

const ServerList = () => {
  return (
    <div className="w-1/5 bg-gray-800 text-white">
      <ul>
        {servers.map((server, index) => (
          <li key={index} className="p-4 hover:bg-gray-700 cursor-pointer">
            {server}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerList;
