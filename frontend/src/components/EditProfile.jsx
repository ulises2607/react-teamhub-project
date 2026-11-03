import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../redux/profileSlice";
import { Link, useNavigate } from "react-router-dom";

const fields = [
  ["username", "Usuario", "text"], ["first_name", "Nombre", "text"],
  ["last_name", "Apellido", "text"], ["email", "Correo electrónico", "email"],
  ["dob", "Fecha de nacimiento", "date"],
];
function ProfileForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useSelector((state) => state.profile);
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(([name]) => [name, profile[name] || ""])));
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(profile.profile_state || "En línea");
  const submit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    const data = new FormData();
    Object.entries(form).forEach(([name, value]) => data.append(name, value));
    data.append("profile_state", status);
    if (image) data.append("profile_image", image);
    const result = await dispatch(updateProfile({ profileData: data }));
    if (updateProfile.fulfilled.match(result)) navigate("/main");
  };
  return <form onSubmit={submit} className="settings-card">
    <Link to="/main" className="back-link">← Volver al equipo</Link>
    <h1>Tu perfil</h1><p>Así te ve tu equipo en TeamHub.</p>
    <fieldset disabled={isLoading}>
      {fields.map(([name, label, type]) => <div key={name} className="form-field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} required={name === "username"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} /></div>)}
      <label htmlFor="profile-image">Foto de perfil</label><input id="profile-image" type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} />
      <label htmlFor="profile-state">Estado</label><select id="profile-state" value={status} onChange={(event) => setStatus(event.target.value)}>{["Activo", "Inactivo", "En línea", "Ocupado", "De vacaciones", "En una reunión"].map((value) => <option key={value}>{value}</option>)}</select>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="primary-button">{isLoading ? "Guardando…" : "Guardar cambios"}</button>
    </fieldset>
  </form>;
}
export default function EditProfile() {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.profile);
  useEffect(() => { const request = dispatch(fetchProfile()); return () => request.abort(); }, [dispatch]);
  return <main className="settings-page">{data ? <ProfileForm key={data.user__id} /> : <div className="settings-card"><p role={error ? "alert" : "status"}>{error || (isLoading ? "Cargando perfil…" : "Perfil no disponible.")}</p><button onClick={() => dispatch(fetchProfile())}>Reintentar</button><Link to="/main">Volver</Link></div>}</main>;
}
