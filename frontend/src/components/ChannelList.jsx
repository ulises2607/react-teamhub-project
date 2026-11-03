import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getChannels, createChannel, updateChannel, deleteChannel } from "../redux/channelSlice";
export default function ChannelList({ currentServer, currentChannel, onSelectChannel, onDeleteChannel, serverName }) {
  const dispatch = useDispatch();
  const { channels, isLoading, errors } = useSelector((state) => state.channels);
  const profile = useSelector((state) => state.profile.data);
  const server = useSelector((state) => state.servers.servers.find((item) => item.id === currentServer));
  const canManage = server?.owner === profile?.user__id;
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [menu, setMenu] = useState(null);
  const [formError, setFormError] = useState(null);
  useEffect(() => { const request = dispatch(getChannels(currentServer)); return () => request.abort(); }, [dispatch, currentServer]);
  const openForm = (channel) => { setEditing(channel || { id: null }); setName(channel?.name || ""); setFormError(null); setMenu(null); };
  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim() || isLoading) return;
    const action = editing.id ? updateChannel({ id: editing.id, name: name.trim() }) : createChannel({ server: currentServer, name: name.trim() });
    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") setEditing(null);
    else setFormError(result.payload || "No se pudo guardar el canal.");
  };
  const remove = async (channel) => {
    if (!window.confirm(`¿Eliminar el canal #${channel.name}?`)) return;
    const result = await dispatch(deleteChannel(channel.id));
    if (deleteChannel.fulfilled.match(result)) onDeleteChannel(channel.id);
    setMenu(null);
  };
  const filtered = channels.filter((channel) => String(channel.server) === String(currentServer));
  return <div className="channel-list"><div className="sidebar-title"><span className="eyebrow">ESPACIO DE TRABAJO</span><h2>{serverName}</h2></div>
    <div className="channel-heading"><span>CANALES DE TEXTO</span>{canManage && <button onClick={() => openForm(null)} aria-label="Crear canal" title="Crear canal">+</button>}</div>
    {editing && <form className="channel-form" onSubmit={submit}><label htmlFor="channel-name">{editing.id ? "Renombrar canal" : "Nuevo canal"}</label><input id="channel-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} autoFocus disabled={isLoading} /><div className="form-actions"><button type="button" onClick={() => setEditing(null)} disabled={isLoading}>Cancelar</button><button disabled={isLoading || !name.trim()}>{isLoading ? "Guardando…" : "Guardar"}</button></div>{formError && <p role="alert" className="form-error">{formError}</p>}</form>}
    {isLoading && <p className="sidebar-status" role="status">Cargando canales…</p>}
    {errors && !editing && <div className="sidebar-status" role="alert"><p>{errors}</p><button onClick={() => dispatch(getChannels(currentServer))}>Reintentar</button></div>}
    <ul>{filtered.map((channel) => <li key={channel.id} className={currentChannel === channel.id ? "active" : ""}><button className="channel-select" aria-current={currentChannel === channel.id ? "page" : undefined} onClick={() => onSelectChannel(channel.id, channel.name)}><span aria-hidden="true">#</span><span>{channel.name}</span></button>{canManage && <div className="channel-options"><button aria-label={`Opciones de ${channel.name}`} aria-expanded={menu === channel.id} onClick={() => setMenu(menu === channel.id ? null : channel.id)}>⋯</button>{menu === channel.id && <div className="channel-menu"><button onClick={() => openForm(channel)}>Renombrar</button><button disabled={isLoading} onClick={() => remove(channel)}>Eliminar canal</button></div>}</div>}</li>)}</ul>
    {!isLoading && !errors && !filtered.length && <p className="sidebar-status">No hay canales todavía.{canManage && " Crea el primero para empezar."}</p>}
  </div>;
}
ChannelList.propTypes = {
  currentServer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentChannel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), serverName: PropTypes.string.isRequired,
  onSelectChannel: PropTypes.func.isRequired, onDeleteChannel: PropTypes.func.isRequired,
};
