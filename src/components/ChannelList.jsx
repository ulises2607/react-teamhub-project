import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChannels } from '../redux/channelSlice';

const ChannelList = ({ currentServer, onSelectChannel, onCreateChannel }) => {
  const dispatch = useDispatch();
  const channelsState = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(getChannels());
  }, [dispatch]);

  const filteredChannels = channelsState.channels.filter(
    (channel) => channel.server === currentServer
  );

  return (
    <div className="p-4">
      {channelsState.isLoading && <p>Cargando...</p>}
      {channelsState.errors && (
        <p className="text-red-500">{channelsState.errors}</p>
      )}
      <ul className="list-none pl-0">
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel) => (
            <li key={channel.id} className="mb-2">
              <button
                onClick={() => onSelectChannel(channel.id)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-900 hover:text-white"
              >
                {channel.name}
              </button>
            </li>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-white">No hay canales disponibles. Crea uno!</span>
            <button
              onClick={onCreateChannel}
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
