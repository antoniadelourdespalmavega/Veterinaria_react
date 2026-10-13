import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { parsearPeso } from '../../utils/validaciones';

// Ventana de la ficha clínica: aquí el veterinario revisa al paciente y edita peso, condiciones,
// diagnóstico, tratamiento y estado (En Tratamiento o Finalizado).
export default function ModalFichaClinica({ show, onHide, paciente, onGuardar }) {
  // Valores del formulario
  const [form, setForm] = useState({ condiciones: '', peso: '', problema: '', tratamiento: '', estado: 'En Tratamiento' });
  // Errores por campo
  const [errores, setErrores] = useState({});

  // Al abrir la ventana cargo los datos actuales del paciente seleccionado
  useEffect(() => {
    if (show && paciente) {
      setErrores({});
      setForm({
        condiciones: paciente.condiciones || '',
        peso: paciente.peso || '',
        problema: paciente.problema || '',
        tratamiento: paciente.tratamiento || '',
        estado: paciente.estado || 'En Tratamiento',
      });
    }
  }, [show, paciente]);

  // Actualiza el campo que se está escribiendo
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    // Valido antes de guardar: peso numérico, condiciones, diagnóstico y tratamiento con un largo mínimo
    const err = {};
    const peso = parsearPeso(form.peso);
    if (!(peso > 0)) err.peso = 'El peso debe ser un número positivo válido (ej: 4.5 o 12.5 kg). Texto no permitido.';
    if (form.condiciones.trim().length < 3) err.condiciones = 'Registre las condiciones o escriba "Ninguna" / "Sin antecedentes".';
    if (form.problema.trim().length < 5) err.problema = 'Diagnóstico obligatorio (mínimo 5 caracteres).';
    if (form.tratamiento.trim().length < 6) err.tratamiento = 'Detalle la receta o tratamiento (mínimo 6 caracteres).';
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    // Si todo está bien guardo los cambios en la ficha de ese paciente (por su id)
    onGuardar(paciente.id, {
      peso: peso + ' kg', condiciones: form.condiciones.trim(), problema: form.problema.trim(),
      tratamiento: form.tratamiento.trim(), estado: form.estado,
    });
  };

  // Borde rojo para los campos con error
  const borde = (c) => (errores[c] ? { borderColor: 'red' } : undefined);

  return (
    // Ventana (modal) grande
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold"><i className="bi bi-clipboard2-pulse me-1 text-primary"></i> Ficha Clínica y Tratamiento</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {/* Solo dibujo el formulario si hay un paciente seleccionado */}
        {paciente && (
          <form onSubmit={enviar} noValidate>
            <div className="row g-3 p-3 bg-light rounded-4 mb-3">
              <div className="col-12 col-md-6">
                <div className="text-muted small fw-semibold text-uppercase">Datos de la Mascota</div>
                <h5 className="fw-bold text-primary mb-1">{paciente.mascota}</h5>
                <div className="small text-secondary">{paciente.especie} - {paciente.raza} | {paciente.edad}</div>
              </div>
              <div className="col-12 col-md-6">
                <div className="text-muted small fw-semibold text-uppercase">Datos del Propietario</div>
                <div className="fw-bold text-dark">{paciente.dueno}</div>
                <div className="small text-muted">{paciente.telefono} | {paciente.correo}</div>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="fichaCondiciones" className="form-label fw-semibold small">Condiciones Preexistentes / Alergias <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="fichaCondiciones" name="condiciones" placeholder="Ej: Sin antecedentes, Ninguna" value={form.condiciones} onChange={cambiar} style={borde('condiciones')} />
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="fichaPeso" className="form-label fw-semibold small">Peso Actual (kg) <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="fichaPeso" name="peso" placeholder="Ej: 4.5 o 12.5 kg" value={form.peso} onChange={cambiar} style={borde('peso')} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="fichaProblema" className="form-label fw-semibold small">Diagnóstico / Problemas Detectados <span className="text-danger">*</span></label>
              <textarea className="form-control" id="fichaProblema" name="problema" rows="2" placeholder="Describa síntomas y diagnóstico actual..." value={form.problema} onChange={cambiar} style={borde('problema')} />
            </div>

            <div className="mb-3">
              <label htmlFor="fichaTratamiento" className="form-label fw-semibold small">Tratamiento e Indicaciones Médicas <span className="text-danger">*</span></label>
              <textarea className="form-control" id="fichaTratamiento" name="tratamiento" rows="3" placeholder="Detallar medicamentos, dosis, frecuencia y cuidados generales..." value={form.tratamiento} onChange={cambiar} style={borde('tratamiento')} />
            </div>

            <div className="mb-3">
              <label htmlFor="fichaEstado" className="form-label fw-semibold small">Estado del Paciente</label>
              <select className="form-select" id="fichaEstado" name="estado" value={form.estado} onChange={cambiar}>
                <option value="En Tratamiento">En Tratamiento</option>
                <option value="Finalizado">Atención Finalizada / Alta Médica</option>
              </select>
            </div>

            {Object.keys(errores).length > 0 && (
              <div className="alert alert-danger py-2 small mb-3">
                <strong>Se encontraron datos incompletos:</strong>
                {Object.values(errores).map((m, i) => (
                  <div key={i}>* {m}</div>
                ))}
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>Cancelar</button>
              <button type="submit" className="btn btn-primary-custom fw-bold rounded-pill px-4 shadow-sm">
                <i className="bi bi-floppy-fill me-1"></i> Guardar Ficha y Tratamiento
              </button>
            </div>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}
