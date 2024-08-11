import React from "react";

const MessageCard = () => {
  return (
    <div className="border-b border-gray-600 py-3 flex items-start mb-4 text-sm">
      <img
        src="https://cdn.discordapp.com/embed/avatars/3.png"
        alt="User avatar"
        className="cursor-pointer w-10 h-10 rounded-3xl mr-3"
      />
      <div className="flex-1 overflow-hidden">
        <div>
          <span className="font-bold text-red-300 cursor-pointer hover:underline">
            User
          </span>
          <span className="font-bold text-gray-400 text-xs ml-2">10:20</span>
        </div>
        <p className="text-white leading-normal">Discord is awesome!</p>
      </div>
    </div>
  );
};

export default MessageCard;
