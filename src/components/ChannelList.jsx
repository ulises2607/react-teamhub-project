import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChannels, createChannel, updateChannel, deleteChannel } from '../redux/channelSlice';

const ChannelList = ({ currentServer, onSelectChannel }) => {
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
    const channelName = prompt('Introduce el nombre del nuevo canal:');
    if (channelName) {
      dispatch(createChannel({ server: currentServer, name: channelName }));
    }
  };

  const handleUpdateChannel = (id) => {
    const newName = prompt('Introduce el nuevo nombre del canal:');
    if (newName) {
      dispatch(updateChannel({ id, name: newName }));
    }
  };

  const toggleMenu = (id) => {
    if (visibleMenuId === id) {
      setVisibleMenuId(null);
    } else {
      setVisibleMenuId(id);
    }
  };

  return (
    <div className="p-4">
      {channelsState.isLoading && <p>Cargando...</p>}
      {channelsState.errors && <p className="text-red-500">{channelsState.errors}</p>}
      <ul className="list-none pl-0">
        {filteredChannels.length > 0 ? (
          <>
            {filteredChannels.map((channel) => (
              <li key={channel.id} className="mb-2 flex justify-between items-center">
                <button
                  onClick={() => onSelectChannel(channel.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-900 hover:text-white"
                >
                  {channel.name}
                </button>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(channel.id)}
                    className="px-2 text-gray-500 hover:text-white focus:outline-none"
                  >
                    •••
                  </button>
                  {visibleMenuId === channel.id && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <li>
                        <button 
                          onClick={() => handleUpdateChannel(channel.id)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-900 hover:text-white"
                        >
                          Modificar nombre
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => dispatch(deleteChannel(channel.id))}
                          className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-900 hover:text-white"
                        >
                          Eliminar
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ))}
            <button
              onClick={handleCreateChannel}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            >
              Añadir Canal
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-white">No hay canales disponibles. Crea uno!</span>
            <button
              onClick={handleCreateChannel}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            >
              Crear Canal
            </button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default ChannelList;
