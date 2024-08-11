import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, getMessages, sendMessage } from "../redux/messageSlice";
import MessageCard from "./ui/MessageCard";

const Chat = ({ currentChannel, channelName }) => {
  const dispatch = useDispatch();
  const messagesState = useSelector((state) => state.messages);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (currentChannel) {
      dispatch(getMessages(currentChannel));
    }
  }, [currentChannel, dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentChannel) {
      const messageData = {
        channel: currentChannel,
        content: newMessage,
      };
      dispatch(sendMessage(messageData));
      setNewMessage("");
    }
  };

  const handleDeleteMessage = (id) => {
    dispatch(deleteMessage(id));
  };

  return (
    <div className="w-full flexflex-col h-screen bg-[#313338]">
      <div className="flex gap-2 items-center p-3">
        <span className="text-[#424753] text-2xl">#</span>
        <p className="text-white">{channelName}</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto max-h-[70dvh]">
        {messagesState.isLoading ? (
          <p className="text-white">Cargando...</p>
        ) : messagesState.errors ? (
          <p className="text-red-500">{messagesState.errors}</p>
        ) : (
          <div>
            {messagesState.messages.length > 0 ? (
              messagesState.messages.map((message) => (
                <MessageCard
                  key={message.id}
                  username={message.authorProfile?.first_name}
                  userImage={message.authorProfile?.bio}
                  content={message.content}
                  time={message.created_at}
                  deleteMessage={() => handleDeleteMessage(message.id)}
                />
              ))
            ) : (
              <p className="text-white">No hay mensajes en este canal.</p>
            )}
          </div>
        )}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-800 fixed bottom-0 left-0  w-full border-t border-gray-600 flex items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-600 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
