import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function ServerForm({ onClose, onSubmit }) {
  const dialog = useRef(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    return () => { previous?.focus(); };
  }, []);
  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    if (!data.get("name").trim()) { setError("Escribe un nombre para el servidor."); return; }
    setSaving(true); setError(null);
    try {
      const file = data.get("icon");
      await onSubmit({ name: data.get("name").trim(), description: data.get("description").trim(), icon: file?.size ? file : null });
      onClose();
    } catch (failure) { setError(typeof failure === "string" ? failure : "No se pudo crear el servidor."); }
    finally { setSaving(false); }
  };
  return <dialog ref={dialog} className="team-dialog" aria-labelledby="server-title" onCancel={(event) => { if (saving) event.preventDefault(); else onClose(); }}>
    <form onSubmit={submit}><h2 id="server-title">Un lugar para tu equipo</h2><p>Crea un servidor y empieza a organizar tus conversaciones.</p>
      <fieldset disabled={saving}>
        <label htmlFor="server-name">Nombre del servidor</label><input id="server-name" name="name" required maxLength={100} autoFocus placeholder="Por ejemplo, Equipo de producto" />
        <label htmlFor="server-description">Descripción</label><textarea id="server-description" name="description" rows={3} />
        <label htmlFor="server-icon">Icono (opcional)</label><input id="server-icon" name="icon" type="file" accept="image/*" />
        {error && <p role="alert" className="form-error">{error}</p>}
        <div className="form-actions"><button type="button" onClick={onClose}>Cancelar</button><button className="primary-button">{saving ? "Creando…" : "Crear servidor"}</button></div>
      </fieldset>
    </form>
  </dialog>;
}
ServerForm.propTypes = { onClose: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired };
