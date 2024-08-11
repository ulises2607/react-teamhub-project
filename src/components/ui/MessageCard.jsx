import React from "react";

const MessageCard = ({ username, userImage, content, time = null }) => {
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
        </div>
        <p className="text-white leading-normal">
          {content ? content : "Sin data"}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
