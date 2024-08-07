import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, sendMessage } from '../store/messageSlice';

const Chat = ({ currentChannel }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const isLoading = useSelector((state) => state.messages.isLoading);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (currentChannel) {
      dispatch(getMessages(currentChannel));
    }
  }, [dispatch, currentChannel]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      dispatch(sendMessage({ channelId: currentChannel, text: newMessage }));
      setNewMessage('');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col flex-grow bg-gray-600 text-white">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <strong>{message.user}</strong>: {message.text}
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 p-2 bg-blue-500 rounded text-white"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
