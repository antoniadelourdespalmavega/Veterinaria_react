// Tarjeta con los datos de una mascota del cliente. Recibe la ficha y la función onVerReceta.
export default function TarjetaMascota({ mascota, onVerReceta }) {
  // Icono distinto si es perro (can...) o si es otro animal
  const icono = mascota.especie.toLowerCase().includes('can') ? 'bi-shield-shaded text-primary' : 'bi-flower1 text-info';

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2 bg-light text-dark fs-4">
              <i className={`bi ${icono}`}></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">{mascota.mascota}</h5>
              <small className="text-muted">{mascota.especie} • {mascota.raza}</small>
            </div>
          </div>
          {/* Etiqueta verde si ya le dieron el alta, amarilla si sigue en tratamiento */}
          {mascota.estado === 'Finalizado' ? (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Alta Médica</span>
          ) : (
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">En Tratamiento</span>
          )}
        </div>
        <div className="row g-2 mb-3 small">
          <div className="col-6"><span className="text-muted">Edad:</span> <strong>{mascota.edad}</strong></div>
          <div className="col-6"><span className="text-muted">Peso:</span> <strong>{mascota.peso}</strong></div>
          <div className="col-12 text-truncate"><span className="text-muted">Condiciones:</span> {mascota.condiciones || 'Ninguna'}</div>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill mt-auto fw-semibold w-100" onClick={() => onVerReceta(mascota)}>
          <i className="bi bi-prescription2 me-1"></i> Ver Indicaciones Médicas
        </button>
      </div>
    </div>
  );
}
