import PropTypes from "prop-types";
import { useState } from "react";

const MessageCard = ({ username, userImage, content, time, deleteMessage, isDeleting, canDelete }) => {
  const [failedImage, setFailedImage] = useState(false);
  const date = time ? new Date(time) : null;
  const validDate = date && !Number.isNaN(date.getTime());
  const name = username || "Usuario";
  return (
    <article className="flex items-start gap-3 border-b border-gray-600 py-4">
      {userImage && !failedImage ? <img src={userImage} onError={() => setFailedImage(true)} alt="" className="w-10 h-10 rounded-full object-cover" /> :
        <div aria-hidden="true" className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">{name[0].toUpperCase()}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex flex-wrap items-baseline gap-2"><span className="font-semibold text-white">{name}</span>
            {validDate && <time dateTime={date.toISOString()} title={date.toLocaleString()} className="text-gray-400 text-xs">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>}
          </div>
          {canDelete && <button type="button" onClick={deleteMessage} disabled={isDeleting} aria-label={`Eliminar mensaje de ${name}`}
            className="text-red-300 hover:text-red-200 text-xs disabled:opacity-50">{isDeleting ? "Eliminando..." : "Eliminar"}</button>}
        </div>
        <p className="text-gray-100 text-sm mt-1 whitespace-pre-wrap break-words">{content}</p>
      </div>
    </article>
  );
};
MessageCard.propTypes = { username: PropTypes.string, userImage: PropTypes.string, content: PropTypes.string, time: PropTypes.string, deleteMessage: PropTypes.func.isRequired, isDeleting: PropTypes.bool, canDelete: PropTypes.bool };
export default MessageCard;
