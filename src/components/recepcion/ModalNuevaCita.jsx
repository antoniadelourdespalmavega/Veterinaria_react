import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BLOQUES_HORARIOS, DOCTORES } from '../../data/datosBase';
import { correoValido, hoyISO, telefonoValido } from '../../utils/validaciones';

// Formulario vacío. Es función para que la fecha de hoy se calcule cada vez que se abre.
const VACIO = () => ({
  dueno: '', telefono: '+56 9 ', correo: '', mascota: '', especie: 'Canino', raza: '',
  doctor: DOCTORES[0].nombre, fecha: hoyISO(), hora: BLOQUES_HORARIOS[0], motivo: '',
});

// Ventana para que Recepción agende una cita presencial (cuando el cliente viene en persona).
// La cita queda confirmada al tiro.
// onGuardar devuelve un error si el veterinario ya tiene esa hora ocupada.
export default function ModalNuevaCita({ show, onHide, onGuardar }) {
  const [form, setForm] = useState(VACIO());
  // Guardo los errores por campo para pintar de rojo el borde de cada uno
  const [errores, setErrores] = useState({});

  // Cada vez que se abre la ventana dejo el formulario limpio
  useEffect(() => {
    if (show) {
      setForm(VACIO());
      setErrores({});
    }
  }, [show]);

  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    // Valido cada campo; si hay problema guardo el mensaje con el nombre del campo
    const err = {};
    if (form.dueno.trim().length < 3) err.dueno = 'Nombre completo del cliente obligatorio (mín. 3 caracteres).';
    if (!telefonoValido(form.telefono)) err.telefono = 'Teléfono chileno inválido (ej: +56 9 1234 5678).';
    if (!correoValido(form.correo)) err.correo = 'Correo inválido (debe tener @ y terminar en .cl o .com).';
    if (form.mascota.trim().length < 2) err.mascota = 'Nombre de la mascota obligatorio.';
    if (!form.raza.trim()) err.raza = 'Indique la raza (o Mestizo).';
    if (!form.fecha) err.fecha = 'Seleccione una fecha válida para la atención.';
    if (form.motivo.trim().length < 5) err.motivo = 'Indique el motivo de la consulta (mín. 5 caracteres).';

    // Si todo está bien intento guardar. Si el veterinario ya tiene esa hora, recibo un error de choque.
    if (Object.keys(err).length === 0) {
      const choque = onGuardar({
        ...form, dueno: form.dueno.trim(), mascota: form.mascota.trim(), raza: form.raza.trim(),
        motivo: form.motivo.trim(), telefono: form.telefono.trim(),
      });
      if (choque) err.choque = choque;
    }
    setErrores(err);
  };

  // Devuelve el borde rojo si ese campo tiene error
  const borde = (campo) => (errores[campo] ? { borderColor: 'red' } : undefined);

  return (
    // Ventana (modal) grande
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold"><i className="bi bi-calendar2-plus-fill me-1 text-primary"></i> Agendar Cita para Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <form onSubmit={enviar} noValidate>
          {/* Parte 1: datos del cliente */}
          <h6 className="fw-bold text-secondary mb-2">1. Datos del Cliente</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label htmlFor="citaDueno" className="form-label small fw-semibold">Nombre Cliente <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="citaDueno" name="dueno" placeholder="Ej: Gonzalo Martínez" value={form.dueno} onChange={cambiar} style={borde('dueno')} />
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="citaTelefono" className="form-label small fw-semibold">Teléfono Móvil (Chile) <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="citaTelefono" name="telefono" placeholder="+56 9 1234 5678" value={form.telefono} onChange={cambiar} style={borde('telefono')} />
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="citaCorreo" className="form-label small fw-semibold">Correo Electrónico <span className="text-danger">*</span></label>
              <input type="email" className="form-control" id="citaCorreo" name="correo" placeholder="cliente@correo.cl" value={form.correo} onChange={cambiar} style={borde('correo')} />
            </div>
          </div>

          {/* Parte 2: datos de la mascota */}
          <h6 className="fw-bold text-secondary mb-2">2. Datos de la Mascota</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label htmlFor="citaMascota" className="form-label small fw-semibold">Nombre Mascota <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="citaMascota" name="mascota" placeholder="Ej: Toby" value={form.mascota} onChange={cambiar} style={borde('mascota')} />
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="citaEspecie" className="form-label small fw-semibold">Especie <span className="text-danger">*</span></label>
              <select className="form-select" id="citaEspecie" name="especie" value={form.especie} onChange={cambiar}>
                <option value="Canino">Canino</option>
                <option value="Felino">Felino</option>
                <option value="Exótico">Exótico / Ave</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="citaRaza" className="form-label small fw-semibold">Raza <span className="text-danger">*</span></label>
              <input type="text" className="form-control" id="citaRaza" name="raza" placeholder="Ej: Golden Retriever, Mestizo" value={form.raza} onChange={cambiar} style={borde('raza')} />
            </div>
          </div>

          {/* Parte 3: veterinario, fecha y bloque horario */}
          <h6 className="fw-bold text-secondary mb-2">3. Asignación Médica y Horario</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <label htmlFor="citaDoctor" className="form-label small fw-semibold">Médico Veterinario <span className="text-danger">*</span></label>
              <select className="form-select" id="citaDoctor" name="doctor" value={form.doctor} onChange={cambiar}>
                {DOCTORES.map((d) => (
                  <option key={d.nombre} value={d.nombre}>{d.nombre} ({d.especialidad})</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="citaFecha" className="form-label small fw-semibold">Fecha de Atención <span className="text-danger">*</span></label>
              <input type="date" className="form-control" id="citaFecha" name="fecha" min={hoyISO()} value={form.fecha} onChange={cambiar} style={borde('fecha')} />
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="citaHora" className="form-label small fw-semibold">Bloque Horario <span className="text-danger">*</span></label>
              <select className="form-select" id="citaHora" name="hora" value={form.hora} onChange={cambiar}>
                {BLOQUES_HORARIOS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="citaMotivo" className="form-label small fw-semibold">Motivo de la Cita / Síntomas <span className="text-danger">*</span></label>
            <textarea className="form-control" id="citaMotivo" name="motivo" rows="2" placeholder="Describa el motivo por el cual acude el cliente..." value={form.motivo} onChange={cambiar} style={borde('motivo')} />
          </div>

          {Object.keys(errores).length > 0 && (
            <div className="alert alert-danger py-2 small mb-3">
              <strong>Corrija los siguientes campos:</strong>
              {Object.values(errores).map((m, i) => (
                <div key={i}>* {m}</div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>Cancelar</button>
            <button type="submit" className="btn btn-primary-custom fw-bold rounded-pill px-4 shadow-sm">
              <i className="bi bi-check-circle-fill me-1"></i> Confirmar Cita
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
