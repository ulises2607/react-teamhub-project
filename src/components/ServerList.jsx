import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServers, servers } from "../redux/serverSlice";

const ServerList = ({ onSelectServer }) => {
  const dispatch = useDispatch();
  const [hoveredServer, setHoveredServer] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const isLoading = useSelector((state) => state.servers.isLoading);
  const profile = useSelector((state) => state.profile.data);
  const serversData = useSelector(servers);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  if (isLoading) {
    return <div>Cargando servidores...</div>;
  }

  if (!profile) {
    return <div>No se pudo cargar el perfil</div>;
  }

  const filteredServers = serversData?.servers.filter(
    (server) =>
      server.members.includes(profile.user__id) ||
      server.owner === profile.user__id
  );

  const handleSelectServer = (serverId, serverName) => {
    setSelectedServer(serverId);
    onSelectServer(serverId, serverName);
  };

  return (
    <div className="p-4 bg-gray-900 h-full relative">
      <h2 className="text-white text-sm mb-4">My Servers</h2>
      <ul>
        {filteredServers && filteredServers.length > 0 ? (
          filteredServers.map((server) => (
            <li
              key={server.id}
              className={`mb-2 text-white cursor-pointer relative flex items-center ${
                selectedServer === server.id ? "selected" : ""
              }`}
              onClick={() => handleSelectServer(server.id, server.name)}
              onMouseEnter={() => setHoveredServer(server.id)}
              onMouseLeave={() => setHoveredServer(null)}
            >
              {/* Barrita blanca a la izquierda */}
              <div
                className={`absolute rounded left-0 h-full w-1 bg-transparent transition-all duration-300 ${
                  selectedServer === server.id
                    ? "scale-y-50 bg-white"
                    : "scale-y-0"
                } origin-[4px] `}
              ></div>
              <div className="bg-white h-12 w-12 ml-4 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden hover:rounded-lg transition-all duration-300">
                <img src={server.icon} alt="server-icon" />
              </div>
              {hoveredServer === server.id && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-md z-50 shadow-lg">
                  {server.name}
                </div>
              )}
            </li>
          ))
        ) : (
          <div className="text-white">No tienes servidores disponibles</div>
        )}
      </ul>
    </div>
  );
};

export default ServerList;
