// Tabla con las fichas de los pacientes (vista de Recepción). Recibe la lista y la función onEditar.
export default function TablaFichas({ fichas, onEditar }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle table-hover mb-0">
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Dueño / Contacto</th>
            <th>Condiciones Previas</th>
            <th>Motivo / Diagnóstico</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mensaje cuando no hay fichas */}
          {fichas.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">No hay fichas de pacientes registradas.</td>
            </tr>
          )}
          {/* Una fila por cada ficha */}
          {fichas.map((f) => (
            <tr key={f.id}>
              <td><span className="badge bg-light text-dark border">{f.id}</span></td>
              <td>
                <div className="fw-bold text-dark">{f.mascota}</div>
                <small className="text-muted">{f.especie} - {f.raza} | {f.edad} | {f.peso}</small>
              </td>
              <td>
                <div className="fw-semibold text-dark">{f.dueno}</div>
                <small className="text-muted">{f.telefono} · {f.correo}</small>
              </td>
              <td><div className="small text-truncate" style={{ maxWidth: '220px' }} title={f.condiciones}>{f.condiciones || 'Sin antecedentes'}</div></td>
              <td><div className="small text-truncate" style={{ maxWidth: '220px' }} title={f.problema}>{f.problema}</div></td>
              <td className="text-center">
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => onEditar(f)}>
                  <i className="bi bi-pencil-fill me-1"></i>Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
