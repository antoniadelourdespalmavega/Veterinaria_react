import { Modal } from 'react-bootstrap';
import { DOCTORES } from '../../data/datosBase';

// Ventana informativa: muestra los días, turnos y bloques de atención de cada veterinario.
// La secretaria la usa para saber a quién asignar cada cita. No guarda nada.
export default function ModalHorarios({ show, onHide }) {
  return (
    // Ventana (modal)
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold"><i className="bi bi-clock-history me-1 text-primary"></i> Horarios de Atención - Equipo Veterinario</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <div className="row g-3">
          {/* Una tarjeta por cada veterinario (los datos vienen de datosBase.js) */}
          {DOCTORES.map((doc) => (
            <div className="col-12 col-md-6" key={doc.nombre}>
              <div className="card h-100 border rounded-4 p-3 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className={`rounded-circle p-2 bg-${doc.color} bg-opacity-10 text-${doc.color}`}>
                    <i className="bi bi-person-check-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{doc.nombre}</h6>
                    <small className="text-muted">{doc.especialidad}</small>
                  </div>
                </div>
                <div className="small mb-1"><strong>Días:</strong> {doc.dias}</div>
                <div className="small mb-2"><strong>Turno:</strong> {doc.jornada}</div>
                <div className="small fw-semibold text-muted mb-1">Bloques para Citas:</div>
                <div>
                  {doc.bloques.map((b) => (
                    <span key={b} className="badge bg-light text-dark border me-1 mb-1">{b} hrs</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>Cerrar</button>
      </Modal.Footer>
    </Modal>
  );
}
