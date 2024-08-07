import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChannels } from '../redux/channelSlice';

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Channels</h2>
      {channelsState.isLoading && <p>Loading...</p>}
      {channelsState.errors && <p className="text-red-500">{channelsState.errors}</p>}
      <ul className="list-none pl-0">
        {channelsState.channels.map((channel) => (
          <li key={channel.id} className="mb-2">
            <button
              onClick={() => onSelectChannel(channel.id)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-900 hover:text-white"
            >
              {channel.name}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={onCreateChannel}
        className="mt-4 p-2 bg-blue-500 rounded text-white"
      >
        Create Channel
      </button>
    </div>
  );
};

export default ChannelList;
