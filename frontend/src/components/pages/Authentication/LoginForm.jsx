import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { login } from "../../../redux/auth/authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { token, isLoading, error } = useSelector((state) => state.auth);
  if (token) return <Navigate to="/main" replace />;
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username").trim();
    if (username && !isLoading) dispatch(login({ username, password: data.get("password") }));
  };
  return <main className="auth-page">
    <section className="auth-intro">
      <Link to="/home" className="brand">◈ TeamHub</Link>
      <span className="eyebrow">TU EQUIPO, MÁS CERCA</span>
      <h1>Las grandes ideas empiezan con una conversación.</h1>
      <p>Reúne a tu equipo, organiza tus proyectos y comparte lo que viene.</p>
      <div className="intro-channels" aria-hidden="true"><span># ideas</span><span># diseño</span><span># próximos-pasos</span></div>
    </section>
    <section className="auth-panel">
      <form onSubmit={submit} className="auth-card">
        <span className="eyebrow">BIENVENIDO DE NUEVO</span>
        <h2>Tu equipo te espera.</h2><p>Inicia sesión para continuar la conversación.</p>
        <label htmlFor="username">Usuario</label>
        <input id="username" name="username" autoComplete="username" required autoFocus disabled={isLoading} placeholder="Tu nombre de usuario" />
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required disabled={isLoading} placeholder="Tu contraseña" />
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="primary-button" disabled={isLoading}>{isLoading ? "Iniciando sesión…" : "Entrar a TeamHub →"}</button>
        <p className="auth-note">Usa tu cuenta de la API de Academia Developers.</p>
      </form>
    </section>
  </main>;
}
