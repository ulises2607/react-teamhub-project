import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServers } from "../redux/serverSlice";

const ServerList = ({ onSelectServer }) => {
  const dispatch = useDispatch();
  const servers = useSelector((state) => state.servers.servers);
  const isLoading = useSelector((state) => state.servers.isLoading);
  const profile = useSelector((state) => state.profile.data);

  console.log("Servers: ", servers);

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  if (isLoading) {
    return <div>Cargando servidores...</div>;
  }

  console.log("Profile id en el componente: ", profile.user__id);

  const filteredServers = servers?.filter(
    (server) =>
      server.members.includes(profile.user__id) ||
      server.owner == profile.user__id
  );

  console.log("Los servidores filtrados en el componente: ", filteredServers);

  return (
    <div className="p-4 bg-gray-700 h-full">
      <h2 className="text-white text-lg mb-4">Servers</h2>
      <ul>
        {filteredServers
          ? filteredServers.map((server) => (
              <li
                key={server.id}
                className="mb-2 text-white cursor-pointer"
                onClick={() => onSelectServer(server.id)}
              >
                {server.name}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default ServerList;
