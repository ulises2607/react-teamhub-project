import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChannels } from '../store/channelSlice';

const ChannelList = ({ currentServer, onSelectChannel, onCreateChannel }) => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const isLoading = useSelector((state) => state.channels.isLoading);

  useEffect(() => {
    if (currentServer) {
      dispatch(getChannels(currentServer));
    }
  }, [dispatch, currentServer]);

  if (isLoading) {
    return <div>Cargando canales...</div>;
  }

  return (
    <div className="p-4 bg-gray-700 h-full">
      <h2 className="text-white text-lg mb-4">Canales</h2>
      {channels.length === 0 ? (
        <div className="text-white mb-4">No hay canales disponibles</div>
      ) : (
        <ul>
          {channels.map((channel) => (
            <li
              key={channel.id}
              className="mb-2 text-white cursor-pointer"
              onClick={() => onSelectChannel(channel.id)}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={onCreateChannel}
        className="mt-4 p-2 bg-blue-500 rounded text-white"
      >
        Crear canal
      </button>
    </div>
  );
};

export default ChannelList;
