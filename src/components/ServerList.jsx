import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServers } from "../redux/serverSlice";

const ServerList = ({ onSelectServer }) => {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers.servers);
  const isLoading = useSelector((state) => state.servers.isLoading);
  const profile = useSelector((state) => state.profile.data);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  if (isLoading) {
    return <div>Cargando servidores...</div>;
  }

  if (!profile) {
    return <div>No se pudo cargar el perfil</div>;
  }

  const filteredServers = servers?.filter(
    (server) =>
      server.members.includes(profile.user__id) ||
      server.owner === profile.user__id
  );

  return (
    <div className="p-4 bg-gray-700 h-full">
      <h2 className="text-white text-lg mb-4">Servidores</h2>
      <ul>
        {filteredServers && filteredServers.length > 0 ? (
          filteredServers.map((server) => (
            <li
              key={server.id}
              className="mb-2 text-white cursor-pointer"
              onClick={() => onSelectServer(server.id)}
            >
              {server.name}
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
