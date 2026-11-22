// Insignias (etiquetas de colores) para mostrar estados en las tablas.
// Las dejo aquí para que todos los paneles se vean igual.

// Para cada estado de cita: la clase de color y el texto que muestro
const ESTILOS_CITA = {
  Pendiente: ['bg-warning-subtle text-warning-emphasis border border-warning-subtle', 'Pendiente'],
  Confirmada: ['bg-success-subtle text-success border border-success-subtle', 'Confirmada'],
  Completada: ['bg-secondary-subtle text-secondary border', 'Completada'],
  Cancelada: ['bg-danger-subtle text-danger border border-danger-subtle', 'Anulada'],
};

// Insignia de estado de una cita. "etiquetaPendiente" me deja cambiar el texto de Pendiente
// (el cliente ve "Pendiente de confirmación").
export function BadgeCita({ estado, etiquetaPendiente }) {
  const [clase, texto] = ESTILOS_CITA[estado] || ESTILOS_CITA.Cancelada;
  return (
    <span className={`badge ${clase} text-uppercase fw-semibold px-2 py-1`}>
      {estado === 'Pendiente' && etiquetaPendiente ? etiquetaPendiente : texto}
    </span>
  );
}

// Insignia del estado médico del paciente (En Tratamiento o Finalizado)
export function BadgeEstadoMedico({ estado }) {
  return estado === 'Finalizado' ? (
    <span className="badge bg-success text-uppercase">Finalizado</span>
  ) : (
    <span className="badge bg-warning text-dark text-uppercase">En Tratamiento</span>
  );
}

// Insignia de pago (Pagado o Pendiente)
export function BadgePago({ pagado }) {
  return pagado ? (
    <span className="badge bg-success text-uppercase fw-semibold"><i className="bi bi-check2-all me-1"></i>Pagado</span>
  ) : (
    <span className="badge bg-danger text-uppercase fw-semibold"><i className="bi bi-clock me-1"></i>Pendiente</span>
  );
}
