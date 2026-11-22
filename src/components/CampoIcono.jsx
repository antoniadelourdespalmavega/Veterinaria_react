// Campo de formulario con un icono a la izquierda. Lo hice componente porque
// lo uso en el login y en el registro y así no repito el mismo HTML.
// Recibe: id, label, icono, error (pinta el borde rojo) y ayuda (texto chiquito abajo).
// Todo lo demás (type, value, onChange...) se lo paso directo al input.
export default function CampoIcono({ id, label, icono, error, ayuda, ...inputProps }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold small">{label}</label>
      <div className="input-group">
        {/* El icono va dentro de un recuadro pegado al input */}
        <span className="input-group-text bg-light border-end-0">
          <i className={`bi ${icono} text-muted`}></i>
        </span>
        <input
          id={id}
          name={id}
          className="form-control bg-light border-start-0 ps-0"
          style={error ? { borderColor: 'red' } : undefined}
          {...inputProps}
        />
      </div>
      {/* El texto de ayuda solo se muestra si me lo pasaron */}
      {ayuda && <div className="form-text text-muted small" style={{ fontSize: '0.75rem' }}>{ayuda}</div>}
    </div>
  );
}
