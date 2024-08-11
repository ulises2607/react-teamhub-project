import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServers, servers } from "../redux/serverSlice";

const ServerList = ({ onSelectServer }) => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.servers.isLoading);
  const profile = useSelector((state) => state.profile.data);
  const serversData = useSelector(servers);

  console.log("Lo que trae serverData: ", serversData);

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

  return (
    <div className="p-4 bg-[#1e1f22] h-full">
      <h2 className="text-white text-sm mb-4">My Servers</h2>
      <ul>
        {filteredServers && filteredServers.length > 0 ? (
          filteredServers.map((server) => (
            <li
              key={server.id}
              className="mb-2 text-white cursor-pointer"
              onClick={() => onSelectServer(server.id, server.name)}
            >
              <div className="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden">
                <img src={server.icon} alt="server-icon" className="" />
              </div>
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
