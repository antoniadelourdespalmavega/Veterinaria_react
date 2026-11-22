import { Modal } from 'react-bootstrap';

// Ventana con el diagnóstico y las indicaciones médicas de una mascota (se puede imprimir).
export default function ModalReceta({ show, onHide, mascota }) {
  return (
    // Ventana (modal)
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 shadow-lg overflow-hidden">
      <Modal.Header closeButton className="bg-light border-0 py-3">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2">
            <i className="bi bi-file-earmark-medical-fill fs-5"></i>
          </div>
          <div>
            <Modal.Title className="fw-bold mb-0 fs-5">Indicaciones de Tratamiento Veterinario</Modal.Title>
            <small className="text-muted">Clínica Veterinaria San Marcos</small>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        {/* Solo dibujo el contenido si hay una mascota seleccionada */}
        {mascota && (
          <>
            <div className="row g-3 p-3 bg-light rounded-4 mb-3 border">
              <div className="col-12 col-md-6">
                <span className="small text-muted text-uppercase fw-semibold">Paciente</span>
                <h4 className="fw-bold text-primary mb-0">{mascota.mascota}</h4>
                <div className="small text-secondary">{mascota.especie} - {mascota.raza} | Peso: {mascota.peso} | Edad: {mascota.edad}</div>
              </div>
              <div className="col-12 col-md-6">
                <span className="small text-muted text-uppercase fw-semibold">Condiciones Preexistentes</span>
                <div className="fw-semibold text-dark mt-1">{mascota.condiciones || 'Sin antecedentes reportados'}</div>
                <div className="mt-2">
                  {mascota.estado === 'Finalizado' ? (
                    <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Tratamiento Completado / Alta Médica</span>
                  ) : (
                    <span className="badge bg-warning text-dark"><i className="bi bi-clock-history me-1"></i>Tratamiento en Curso</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="fw-bold text-dark small text-uppercase mb-1">
                <i className="bi bi-search-heart text-danger me-1"></i> Diagnóstico Médico:
              </label>
              <div className="p-3 rounded-3 bg-white border border-danger-subtle text-dark">{mascota.problema || 'Control general'}</div>
            </div>

            <div className="mb-3">
              <label className="fw-bold text-dark small text-uppercase mb-1">
                <i className="bi bi-prescription2 text-success me-1"></i> Tratamiento, Fármacos y Cuidados en Casa:
              </label>
              <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success-subtle text-dark fs-6 lh-base fw-medium">
                {mascota.tratamiento || 'Sin tratamiento médico registrado'}
              </div>
            </div>

            <div className="alert alert-info py-2 small mb-0 rounded-3">
              <i className="bi bi-info-circle-fill me-1"></i> Siga al pie de la letra las dosis y horarios prescritos. En caso de vómitos, apatía o empeoramiento acuda de urgencia a la veterinaria.
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 bg-light py-2">
        <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onHide}>Cerrar</button>
        <button type="button" className="btn btn-outline-primary rounded-pill px-3" onClick={() => window.print()}>
          <i className="bi bi-printer me-1"></i> Imprimir Receta
        </button>
      </Modal.Footer>
    </Modal>
  );
}
