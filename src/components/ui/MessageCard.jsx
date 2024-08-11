import React from "react";

const MessageCard = ({
  username,
  userImage,
  content,
  time = null,
  deleteMessage,
}) => {
  return (
    <div className="border-b border-gray-600 py-3 flex items-start mb-4 text-sm">
      <img
        src={
          userImage
            ? userImage
            : "https://cdn.discordapp.com/embed/avatars/3.png"
        }
        alt="User avatar"
        className="cursor-pointer w-10 h-10 rounded-3xl mr-3"
      />
      <div className="flex-1 overflow-hidden">
        <div>
          <span className="font-bold text-red-300 cursor-pointer hover:underline">
            {username ? username : "Sin data"}
          </span>
          <span className="font-bold text-gray-400 text-xs ml-2">{time}</span>

          <button
            onClick={deleteMessage}
            className="px-4 py-2 text-sm text-red-700 hover:bg-gray-900 hover:text-white"
          >
            Eliminar
          </button>
        </div>
        <p className="text-white leading-normal">
          {content ? content : "Sin data"}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
