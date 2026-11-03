import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ServerList from "./ServerList";
import ChannelList from "./ChannelList";
import Chat from "./Chat";
import Profile from "./Profile";
import ServerForm from "./ui/ServerForm";
import { createServer, getServers } from "../redux/serverSlice";
import { fetchProfile } from "../redux/profileSlice";

export default function MainPage() {
  const dispatch = useDispatch();
  const [server, setServer] = useState(null);
  const [channel, setChannel] = useState(null);
  const [showServerForm, setShowServerForm] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  useEffect(() => {
    const servers = dispatch(getServers());
    const profile = dispatch(fetchProfile());
    return () => { servers.abort(); profile.abort(); };
  }, [dispatch]);
  return <main className="workspace">
    <header className="workspace-header">
      <button className="mobile-menu" onClick={() => setNavigationOpen(!navigationOpen)} aria-expanded={navigationOpen} aria-controls="workspace-navigation">{navigationOpen ? "Cerrar menú" : "Abrir menú"}</button>
      <Link to="/main" className="brand">◈ <span>TeamHub</span></Link>
      <span className="workspace-caption">Tu equipo. Un solo lugar.</span>
    </header>
    {navigationOpen && <button className="nav-scrim" aria-label="Cerrar navegación" onClick={() => setNavigationOpen(false)} />}
    <div id="workspace-navigation" className={`workspace-navigation ${navigationOpen ? "is-open" : ""}`}>
      <nav className="server-rail" aria-label="Servidores">
        <ServerList currentServer={server?.id} onSelectServer={(id, name) => { setServer({ id, name }); setChannel(null); }} />
        <div className="rail-actions"><button title="Crear servidor" aria-label="Crear servidor" onClick={() => setShowServerForm(true)}>+</button><Link to="/explore-servers" title="Explorar servidores" aria-label="Explorar servidores">⌕</Link></div>
      </nav>
      <aside className="channel-sidebar" aria-label="Canales">
        {server ? <ChannelList key={server.id} currentServer={server.id} serverName={server.name} currentChannel={channel?.id}
          onSelectChannel={(id, name) => { setChannel({ id, name }); setNavigationOpen(false); }}
          onDeleteChannel={(id) => { if (channel?.id === id) setChannel(null); }} /> : <div className="sidebar-welcome"><span className="eyebrow">TU ESPACIO</span><h2>Bienvenido a TeamHub</h2><p>Elige un servidor o crea uno para reunir a tu equipo.</p><button onClick={() => setShowServerForm(true)} className="primary-button">Crear servidor</button></div>}
        <Profile />
      </aside>
    </div>
    <section className="conversation-pane">
      {channel ? <Chat key={channel.id} currentChannel={channel.id} channelName={channel.name} /> : <div className="workspace-empty"><div className="empty-symbol" aria-hidden="true">#</div><span className="eyebrow">EL COMIENZO DE ALGO BUENO</span><h1>Hagamos espacio para tus ideas.</h1><p>{server ? `Elige un canal de ${server.name} para empezar a conversar.` : "Cada equipo tiene algo que compartir. Encuentra el tuyo o crea un nuevo espacio."}</p><button className="primary-button mobile-menu" onClick={() => setNavigationOpen(true)}>Ver servidores y canales</button><Link className="back-link" to="/explore-servers">Explorar comunidades →</Link><div className="empty-features"><span>◈ Conecta con tu equipo</span><span># Organiza por temas</span><span>↗ Comparte tus ideas</span></div></div>}
    </section>
    {showServerForm && <ServerForm onClose={() => setShowServerForm(false)} onSubmit={(data) => dispatch(createServer(data)).unwrap()} />}
  </main>;
}
