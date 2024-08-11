import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages, sendMessage } from "../redux/messageSlice";
import MessageCard from "./ui/MessageCard";

const Chat = ({ currentChannel }) => {
  const dispatch = useDispatch();
  const messagesState = useSelector((state) => state.messages);
  const allProfiles = useSelector((state) => state.profile.allProfiles);
  const [newMessage, setNewMessage] = useState("");
  const [filtrado, setFiltrado] = useState(null);

  console.log("La estructura de los mensajes: ", messagesState);

  // const messageFormater = (allProfiles) => {
  //   allProfiles.results.map((user) => user.user__id === 214);
  //   console.log(
  //     "El filtrado: ",
  //     allProfiles.results.map((user) => user.user__id === 214)
  //   );
  // };

  useEffect(() => {
    if (currentChannel) {
      dispatch(getMessages(currentChannel));
      // if (allProfiles) {
      //   messageFormater(allProfiles);
      // }
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto bg-gray-600">
        {messagesState.isLoading ? (
          <p className="text-white">Cargando...</p>
        ) : messagesState.errors ? (
          <p className="text-red-500">{messagesState.errors}</p>
        ) : (
          <div>
            {messagesState.messages.map((message) => (
              // <div key={message.id} className="mb-2 p-2 bg-gray-800 rounded">
              //   <p className="text-white">{message.content}</p>
              // </div>
              <MessageCard
                key={message.id}
                username={message.authorProfile.first_name}
                userImage={message.authorProfile.bio}
                content={message.content}
                time={message.created_at}
              />
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
