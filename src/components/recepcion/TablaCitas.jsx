import { BadgeCita } from '../paneles/Badges';

// Tabla de citas. Los botones de cada fila cambian según el estado de la cita:
// - Pendiente: Confirmar o Rechazar
// - Confirmada: Reagendar o Anular
// - Completada o Anulada: no hay acciones, solo una etiqueta.
// Recibe las citas y las funciones onConfirmar, onReagendar y onAnular.
export default function TablaCitas({ citas, onConfirmar, onReagendar, onAnular }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle table-hover mb-0">
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th>Fecha / Hora</th>
            <th>Paciente (Mascota)</th>
            <th>Dueño / Contacto</th>
            <th>Veterinario Asignado</th>
            <th>Motivo Consulta</th>
            <th>Estado Cita</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mensaje cuando no hay citas que mostrar */}
          {citas.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">No se registran citas agendadas con este criterio.</td>
            </tr>
          )}
          {/* Una fila por cada cita */}
          {citas.map((c) => (
            <tr key={c.idCita}>
              <td>
                <div className="fw-bold text-dark">{c.fecha}</div>
                <small className="text-muted"><i className="bi bi-clock me-1"></i>{c.hora}</small>
                {/* Si la cita fue reagendada muestro desde cuándo */}
                {c.fechaAnterior && (
                  <div className="small text-warning-emphasis">
                    <i className="bi bi-arrow-repeat me-1"></i>Reagendada (antes: {c.fechaAnterior})
                  </div>
                )}
              </td>
              <td>
                <div className="fw-bold text-dark">{c.mascota}</div>
                <small className="text-muted">{c.especie} - {c.raza}</small>
              </td>
              <td>
                <div className="fw-semibold text-dark">{c.dueno}</div>
                <small className="text-muted">{c.telefono}</small>
              </td>
              <td><span className="badge bg-light text-dark border">{c.doctor}</span></td>
              <td><div className="small text-truncate" style={{ maxWidth: '200px' }} title={c.motivo}>{c.motivo}</div></td>
              <td><BadgeCita estado={c.estado} /></td>
              <td className="text-center text-nowrap">
                {/* Botones para una solicitud pendiente */}
                {c.estado === 'Pendiente' && (
                  <>
                    <button className="btn btn-success btn-sm rounded-pill px-3 fw-semibold me-1 shadow-sm" onClick={() => onConfirmar(c)}>
                      <i className="bi bi-check-circle-fill me-1"></i>Confirmar
                    </button>
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => onAnular(c)}>
                      <i className="bi bi-x-circle-fill me-1"></i>Rechazar
                    </button>
                  </>
                )}
                {/* Botones para una cita confirmada */}
                {c.estado === 'Confirmada' && (
                  <>
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold me-1 shadow-sm" onClick={() => onReagendar(c)}>
                      <i className="bi bi-calendar2-range-fill me-1"></i>Reagendar
                    </button>
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => onAnular(c)}>
                      <i className="bi bi-x-circle-fill me-1"></i>Anular
                    </button>
                  </>
                )}
                {/* Si ya está completada o anulada, solo muestro una etiqueta */}
                {c.estado !== 'Pendiente' && c.estado !== 'Confirmada' && (
                  <span className="badge bg-light text-muted border">
                    {c.estado === 'Completada' ? 'Cita Completada' : 'Cita Anulada'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
