import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BLOQUES_HORARIOS, DOCTORES } from '../../data/datosBase';
import { hoyISO } from '../../utils/validaciones';

// Ventana para confirmar una solicitud pendiente o reagendar una cita confirmada.
// En ambos casos la secretaria elige veterinario, fecha y bloque horario.
// onGuardar devuelve un texto de error (ej: choque de horario) o null si salió bien.
export default function ModalGestionCita({ show, onHide, cita, modo, onGuardar }) {
  // Valores elegidos en el formulario
  const [form, setForm] = useState({ doctor: DOCTORES[0].nombre, fecha: hoyISO(), hora: BLOQUES_HORARIOS[0] });
  // Mensaje de error (si el horario está ocupado, la fecha es inválida, etc.)
  const [error, setError] = useState('');

  // Al abrir la ventana cargo los datos actuales de la cita. Si la fecha ya pasó, propongo hoy.
  useEffect(() => {
    if (show && cita) {
      setError('');
      setForm({
        doctor: DOCTORES.some((d) => d.nombre === cita.doctor) ? cita.doctor : DOCTORES[0].nombre,
        fecha: cita.fecha >= hoyISO() ? cita.fecha : hoyISO(),
        hora: BLOQUES_HORARIOS.includes(cita.hora) ? cita.hora : BLOQUES_HORARIOS[0],
      });
    }
  }, [show, cita]);

  // Actualiza el campo que se está escribiendo
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Al enviar, le paso los datos a quien me llamó; si me devuelve un error lo muestro
  const enviar = (e) => {
    e.preventDefault();
    const res = onGuardar(form);
    if (res) setError(res);
  };

  // Cambia los textos según si estoy confirmando o reagendando
  const confirmando = modo === 'confirmar';

  return (
    // Ventana (modal)
    <Modal show={show} onHide={onHide} centered contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">{confirmando ? 'Confirmar Solicitud de Cita' : 'Reagendar Cita'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {/* Solo dibujo el formulario si hay una cita seleccionada */}
        {cita && (
          <form onSubmit={enviar}>
            <div className="p-3 bg-light rounded-4 mb-3 border small">
              {cita.mascota} - {cita.dueno} | Solicitado: {cita.fecha} {cita.hora} | Motivo: {cita.motivo}
            </div>
            <div className="mb-3">
              <label htmlFor="gestionDoctor" className="form-label small fw-semibold">Médico Veterinario</label>
              <select className="form-select" id="gestionDoctor" name="doctor" value={form.doctor} onChange={cambiar}>
                {DOCTORES.map((d) => (
                  <option key={d.nombre} value={d.nombre}>{d.nombre} ({d.especialidad})</option>
                ))}
              </select>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label htmlFor="gestionFecha" className="form-label small fw-semibold">Fecha</label>
                <input type="date" className="form-control" id="gestionFecha" name="fecha" min={hoyISO()} value={form.fecha} onChange={cambiar} />
              </div>
              <div className="col-6">
                <label htmlFor="gestionHora" className="form-label small fw-semibold">Bloque Horario</label>
                <select className="form-select" id="gestionHora" name="hora" value={form.hora} onChange={cambiar}>
                  {BLOQUES_HORARIOS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>Cancelar</button>
              <button type="submit" className="btn btn-primary-custom fw-bold rounded-pill px-4 shadow-sm">
                {confirmando ? 'Confirmar Cita' : 'Guardar Nuevo Horario'}
              </button>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}
