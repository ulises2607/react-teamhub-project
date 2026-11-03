import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getServers } from "../redux/serverSlice";
export default function ServerList({ currentServer, onSelectServer }) {
  const dispatch = useDispatch();
  const { servers, isLoading, errors } = useSelector((state) => state.servers);
  const { data: profile, error: profileError } = useSelector((state) => state.profile);
  const ownServers = servers.filter((server) => server.members?.includes(profile?.user__id) || server.owner === profile?.user__id);
  return <div className="server-list"><div className="rail-logo" aria-hidden="true">◈</div>
    {isLoading && <span className="rail-status" role="status">Cargando…</span>}
    {(errors || profileError) && <button title={errors || profileError} onClick={() => dispatch(getServers())} aria-label="Reintentar cargar servidores">↻</button>}
    <ul>{ownServers.map((server) => <li key={server.id}><button onClick={() => onSelectServer(server.id, server.name)} aria-label={server.name} title={server.name} aria-pressed={currentServer === server.id} className={`server-icon ${currentServer === server.id ? "active" : ""}`}>{server.icon ? <img src={server.icon} alt="" /> : server.name.slice(0, 2).toUpperCase()}</button></li>)}</ul>
    {!isLoading && !errors && profile && !ownServers.length && <p className="rail-status">Aún no tienes servidores</p>}
  </div>;
}
ServerList.propTypes = { currentServer: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), onSelectServer: PropTypes.func.isRequired };
