// src/components/Chat.jsx
import React, { useState, useEffect } from 'react';

const Chat = ({ currentChannel }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Recuperar mensajes de la API para el canal actual
    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://sandbox.academiadevelopers.com/channels/${currentChannel}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentChannel]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Enviar el nuevo mensaje a la API
    try {
      const response = await fetch(`https://sandbox.academiadevelopers.com/channels/${currentChannel}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages([...messages, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className="p-2 my-2 bg-white rounded shadow">
            <p className="font-bold">{message.username}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-md"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
