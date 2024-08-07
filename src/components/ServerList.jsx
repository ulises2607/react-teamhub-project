import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getServers } from '../store/serverSlice';

const ServerList = ({ onSelectServer }) => {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers.servers);
  const isLoading = useSelector((state) => state.servers.isLoading);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  if (isLoading) {
    return <div>Cargando servidores...</div>;
  }

  return (
    <div className="p-4 bg-gray-700 h-full">
      <h2 className="text-white text-lg mb-4">Servers</h2>
      <ul>
        {servers.map((server) => (
          <li
            key={server.id}
            className="mb-2 text-white cursor-pointer"
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
