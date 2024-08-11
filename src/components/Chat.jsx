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
    <div className="flex flex-col h-screen bg-gray-700">
      {/* Top Bar */}
      <div className="border-b border-gray-600 px-6 py-2 flex items-center shadow-xl">
        <h3 className="text-white text-xl font-bold">
          <span className="text-gray-400">#</span> {channelName}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
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

      {/* Message Input */}
      <div className="pb-6 px-4 flex-none">
        <form
          onSubmit={handleSendMessage}
          className="flex rounded-lg overflow-hidden bg-gray-800 border-t border-gray-600"
        >
          <button
            type="submit"
            className="text-3xl text-gray-500 border-r-4 border-gray-600 bg-gray-600 p-2 flex items-center"
          >
            <svg
              className="h-6 w-6 block bg-gray-500 hover:bg-green-700  cursor-pointer rounded-xl"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"
                fill="#FFFFFF"
              />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-4 py-2 bg-gray-600 border-none  text-white placeholder-gray-400 focus:outline-none
             focus:bg-gray-500"
            placeholder="Escribe un mensaje..."
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
