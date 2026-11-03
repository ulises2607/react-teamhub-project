import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, getMessages, sendMessage } from "../redux/messageSlice";
import MessageCard from "./ui/MessageCard";

const Chat = ({ currentChannel, channelName }) => {
  const dispatch = useDispatch();
  const { messages, isLoading, isSending, deletingIds, errors, channelId } = useSelector((state) => state.messages);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const request = dispatch(getMessages(currentChannel));
    return () => request.abort();
  }, [currentChannel, dispatch]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || isSending || isLoading) return;
    const result = await dispatch(sendMessage({ channel: currentChannel, content: newMessage.trim() }));
    if (sendMessage.fulfilled.match(result)) setNewMessage("");
  };

  return (
    <section aria-label={`Chat de ${channelName}`} className="flex flex-col h-screen min-w-0 bg-gray-700 text-white">
      <header className="border-b border-gray-600 px-6 py-4 shadow-sm">
        <h3 className="text-xl font-bold"><span className="text-gray-400">#</span> {channelName}</h3>
        <p className="text-sm text-gray-300 mt-1">Un espacio para compartir ideas con tu equipo.</p>
      </header>
      <div className="flex-1 min-h-0 px-4 sm:px-6 py-4 overflow-y-auto" aria-busy={isLoading}>
        {isLoading ? <p role="status" className="text-gray-300">Cargando mensajes...</p> : (
          <div role="log" aria-label="Mensajes del canal" aria-live="polite">
            {channelId === currentChannel && messages.length > 0 ? messages.map((message) => (
              <MessageCard key={message.id} username={message.authorProfile?.first_name}
                userImage={message.authorProfile?.bio} content={message.content} time={message.created_at}
                isDeleting={deletingIds.includes(message.id)} deleteMessage={() => dispatch(deleteMessage(message.id))} />
            )) : <div className="py-16 text-center"><h4 className="text-xl font-semibold">Bienvenido a #{channelName}</h4><p className="mt-2 text-gray-300">La conversación empieza con vos. Envía el primer mensaje.</p></div>}
          </div>
        )}
      </div>
      {errors && <div role="alert" className="mx-4 mb-3 p-3 rounded-lg bg-red-950 text-red-100"><p>{errors}</p><button type="button" onClick={() => dispatch(getMessages(currentChannel))} className="underline mt-2">Volver a cargar mensajes</button></div>}
      <form onSubmit={handleSendMessage} className="p-4 pt-0">
        <label htmlFor="chat-message" className="sr-only">Mensaje para #{channelName}</label>
        <div className="flex gap-2 rounded-xl bg-gray-800 p-2 border border-gray-600 focus-within:border-indigo-400">
          <input id="chat-message" type="text" value={newMessage} disabled={isSending}
            onChange={(event) => setNewMessage(event.target.value)} autoComplete="off"
            className="min-w-0 flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            placeholder={`Mensaje para #${channelName}`} />
          <button type="submit" disabled={!newMessage.trim() || isSending || isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed">
            {isSending ? "Enviando..." : "Enviar"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">Presiona Enter para enviar.</p>
      </form>
    </section>
  );
};
export default Chat;
