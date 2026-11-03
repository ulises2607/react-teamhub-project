import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exploreServers, joinServer } from "../redux/serverSlice";
import { Link, useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/profileSlice";
export default function ExploreServers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { servers, isLoading, errors } = useSelector((state) => state.servers);
  const profile = useSelector((state) => state.profile.data);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState(null);
  useEffect(() => { if (!profile) dispatch(fetchProfile()); }, [profile, dispatch]);
  useEffect(() => {
    let request;
    const timer = setTimeout(() => { request = dispatch(exploreServers({ search: search.trim() })); }, 300);
    return () => { clearTimeout(timer); request?.abort(); };
  }, [search, dispatch]);
  const join = async (id) => {
    if (joining) return;
    setJoining(id);
    const result = await dispatch(joinServer(id));
    setJoining(null);
    if (joinServer.fulfilled.match(result)) navigate("/main");
  };
  return <main className="explore-page"><header><Link to="/main" className="brand">◈ TeamHub</Link><Link to="/main" className="back-link">← Volver al equipo</Link></header>
    <section className="explore-heading"><span className="eyebrow">ENCUENTRA TU LUGAR</span><h1>Buenas conversaciones.<br />Nuevas conexiones.</h1><p>Descubre espacios para aprender, crear y compartir.</p><label className="sr-only" htmlFor="server-search">Buscar servidores</label><input id="server-search" type="search" placeholder="Buscar una comunidad…" value={search} onChange={(event) => setSearch(event.target.value)} /></section>
    {isLoading && <p role="status">Buscando servidores…</p>}{errors && <p role="alert" className="form-error">{errors}</p>}
    <ul className="server-grid">{servers.map((server) => {
      const member = profile && (server.owner === profile.user__id || server.members?.includes(profile.user__id));
      return <li className="server-card" key={server.id}><div className="server-card-banner" aria-hidden="true">{server.name.slice(0, 2).toUpperCase()}</div><div className="server-card-body"><h2>{server.name}</h2><p>{server.description || "Un espacio para conectar con tu equipo."}</p><span className="member-count">{server.members?.length || 0} miembros</span><button className="primary-button" disabled={!!joining || !profile} onClick={() => member ? navigate("/main") : join(server.id)}>{member ? "Ir al equipo →" : joining === server.id ? "Uniéndote…" : "Unirse al servidor →"}</button></div></li>;
    })}</ul>
    {!isLoading && !servers.length && <p className="empty-search">No encontramos servidores. Prueba con otro nombre.</p>}
  </main>;
}
