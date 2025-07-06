import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
} from "../redux/channelSlice";
import Profile from "./Profile";
import { IoMdAdd } from "react-icons/io";

const ChannelList = ({ currentServer, onSelectChannel, serverName }) => {
  const dispatch = useDispatch();
  const channelsState = useSelector((state) => state.channels);
  const [visibleMenuId, setVisibleMenuId] = useState(null);

  useEffect(() => {
    if (currentServer) {
      dispatch(getChannels(currentServer));
    }
  }, [dispatch, currentServer]);

  const filteredChannels = channelsState.channels.filter(
    (channel) => channel.server === currentServer
  );

  const handleCreateChannel = () => {
    const channelName = prompt("Introduce el nombre del nuevo canal:");
    if (channelName) {
      dispatch(createChannel({ server: currentServer, name: channelName }));
    }
  };

  const handleUpdateChannel = (id) => {
    const newName = prompt("Introduce el nuevo nombre del canal:");
    if (newName) {
      dispatch(updateChannel({ id, name: newName }));
    }
  };

  const toggleMenu = (id) => {
    setVisibleMenuId(visibleMenuId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full z-0">
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-bold">{serverName}</h2>
        <button
          onClick={handleCreateChannel}
          className="bg-transparent  text-white hover:text-green-700 font-bold py-1 px-3 rounded"
        >
          <IoMdAdd />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-800">
        {channelsState.isLoading && (
          <p className="text-white p-4">Cargando...</p>
        )}
        {channelsState.errors && (
          <p className="text-red-500 p-4">{channelsState.errors}</p>
        )}
        {filteredChannels.length > 0 ? (
          <ul className="list-none p-4">
            {filteredChannels.map((channel) => (
              <li
                key={channel.id}
                className="flex items-center justify-between mb-2 bg-tr rounded"
              >
                <button
                  onClick={() => onSelectChannel(channel.id, channel.name)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white"
                >
                  #{channel.name}
                </button>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(channel.id)}
                    className="px-2 text-gray-400  hover:text-green-700 focus:outline-none"
                  >
                    •••
                  </button>
                  {visibleMenuId === channel.id && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <li>
                        <button
                          onClick={() => handleUpdateChannel(channel.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Modificar nombre
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => dispatch(deleteChannel(channel.id))}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-200"
                        >
                          Eliminar
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <span className="text-white">
              No hay canales disponibles. Crea uno!
            </span>
          </div>
        )}
      </div>

      <div className="px-6 py-3 max-h-[75px] bg-gray-800 border-t border-gray-600 flex items-center">
        <Profile />
      </div>
    </div>
  );
};

export default ChannelList;
