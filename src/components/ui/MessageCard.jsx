import React from "react";

const MessageCard = ({
  username,
  userImage,
  content,
  time = null,
  deleteMessage,
}) => {
  const formatDate = (dateString) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleTimeString([], options);
  };

  return (
    <div className="flex items-start border-b border-gray-600 py-3">
      <img
        src={
          userImage
            ? userImage
            : "https://cdn.discordapp.com/embed/avatars/3.png"
        }
        alt="User avatar"
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex gap-2 items-center">
            {username || "Sin data"}
            {time && (
              <span className="text-gray-400 text-xs">{formatDate(time)}</span>
            )}
          </span>

          <button
            onClick={deleteMessage}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Eliminar
          </button>
        </div>
        <p className="text-white text-sm mt-1">{content || "Sin data"}</p>
      </div>
    </div>
  );
};

export default MessageCard;
