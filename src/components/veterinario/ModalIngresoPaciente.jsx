import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { correoValido, parsearPeso, telefonoValido } from '../../utils/validaciones';

// Formulario vacío
const VACIO = {
  dueno: '', telefono: '+56 9 ', correo: '', mascota: '', especie: 'Canino', raza: '', edad: '',
  peso: '', condiciones: '', problema: '', tratamiento: '', estado: 'En Tratamiento',
};

// Ventana del veterinario para ingresar un paciente que llegó en persona, ya con diagnóstico y receta.
// A diferencia de la ficha de Recepción, aquí sí se piden el diagnóstico y el tratamiento.
export default function ModalIngresoPaciente({ show, onHide, onGuardar }) {
  // Lo que va escribiendo el veterinario
  const [form, setForm] = useState(VACIO);
  // Errores por campo (para pintar el borde rojo y listar los mensajes)
  const [errores, setErrores] = useState({});

  // Cada vez que se abre la ventana dejo el formulario limpio
  useEffect(() => {
    if (show) {
      setForm(VACIO);
      setErrores({});
    }
  }, [show]);

  // Actualiza el campo que se está escribiendo
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    // Valido todos los campos; los que fallen quedan en "err" con su mensaje
    const err = {};
    const peso = parsearPeso(form.peso);
    if (form.dueno.trim().length < 3) err.dueno = 'Ingrese el nombre completo del dueño (mín. 3 letras).';
    if (!telefonoValido(form.telefono)) err.telefono = 'Teléfono chileno inválido (ej: +56 9 1234 5678).';
    if (!correoValido(form.correo)) err.correo = 'Correo inválido (debe incluir "@" y terminar en .cl o .com).';
    if (form.mascota.trim().length < 2) err.mascota = 'Nombre de la mascota obligatorio.';
    if (!form.raza.trim()) err.raza = 'Raza obligatoria (indicar Mestizo si aplica).';
    if (!form.edad.trim()) err.edad = 'Ingrese la edad de la mascota.';
    if (!(peso > 0)) err.peso = 'Peso debe ser un valor numérico mayor a 0 (ej: 4.5). No se admite texto.';
    if (!form.condiciones.trim()) err.condiciones = 'Indique condiciones o escriba "Ninguna".';
    if (form.problema.trim().length < 5) err.problema = 'Ingrese el diagnóstico o motivo de la consulta (mín. 5 caracteres).';
    if (form.tratamiento.trim().length < 6) err.tratamiento = 'Detalle la receta o tratamiento médico (mín. 6 caracteres).';
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    // Si no hay errores entrego los datos limpios (peso como número + " kg", correo en minúsculas, etc.)
    onGuardar({
      dueno: form.dueno.trim(), telefono: form.telefono.trim(), correo: form.correo.trim().toLowerCase(),
      mascota: form.mascota.trim(), especie: form.especie, raza: form.raza.trim(), edad: form.edad.trim(),
      peso: peso + ' kg', condiciones: form.condiciones.trim(), problema: form.problema.trim(),
      tratamiento: form.tratamiento.trim(), estado: form.estado,
    });
  };

  // Borde rojo para los campos con error
  const borde = (c) => (errores[c] ? { borderColor: 'red' } : undefined);
  // Función auxiliar para no repetir el HTML de cada campo de texto
  const input = (id, etiqueta, nombre, extra = {}) => (
    <>
      <label htmlFor={id} className="form-label small fw-semibold">{etiqueta} <span className="text-danger">*</span></label>
      <input className="form-control" id={id} name={nombre} value={form[nombre]} onChange={cambiar} style={borde(nombre)} {...extra} />
    </>
  );

  return (
    // Ventana (modal) grande
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold"><i className="bi bi-person-plus-fill me-1 text-primary"></i> Registrar Atención Presencial / Mascota</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <form onSubmit={enviar} noValidate>
          {/* Parte 1: datos del propietario */}
          <h6 className="fw-bold text-secondary mb-2">1. Datos del Propietario</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">{input('nuevoDueno', 'Nombre Propietario', 'dueno', { placeholder: 'Ej: Marcela Soto' })}</div>
            <div className="col-12 col-md-4">{input('nuevoTelefono', 'Teléfono', 'telefono', { placeholder: '+56 9 1234 5678' })}</div>
            <div className="col-12 col-md-4">{input('nuevoCorreo', 'Correo Electrónico', 'correo', { type: 'email', placeholder: 'correo@ejemplo.cl' })}</div>
          </div>

          {/* Parte 2: datos de la mascota */}
          <h6 className="fw-bold text-secondary mb-2">2. Datos de la Mascota</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-3">{input('nuevaMascota', 'Nombre Mascota', 'mascota', { placeholder: 'Ej: Thor' })}</div>
            <div className="col-12 col-md-3">
              <label htmlFor="nuevaEspecie" className="form-label small fw-semibold">Especie <span className="text-danger">*</span></label>
              <select className="form-select" id="nuevaEspecie" name="especie" value={form.especie} onChange={cambiar}>
                <option value="Canino">Canino</option>
                <option value="Felino">Felino</option>
                <option value="Exótico">Exótico / Ave</option>
              </select>
            </div>
            <div className="col-12 col-md-3">{input('nuevaRaza', 'Raza', 'raza', { placeholder: 'Ej: Mestizo, Beagle...' })}</div>
            <div className="col-12 col-md-3">{input('nuevaEdad', 'Edad', 'edad', { placeholder: 'Ej: 2 años' })}</div>
          </div>

          {/* Parte 3: peso, condiciones, diagnóstico, tratamiento y estado */}
          <h6 className="fw-bold text-secondary mb-2">3. Diagnóstico y Receta Médica</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">{input('nuevoPeso', 'Peso Actual (kg)', 'peso', { placeholder: 'Ej: 8.5 kg' })}</div>
            <div className="col-12 col-md-6">{input('nuevasCondiciones', 'Condiciones / Alergias', 'condiciones', { placeholder: 'Ej: Sin antecedentes, Ninguna' })}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="nuevoProblema" className="form-label small fw-semibold">Diagnóstico / Motivo <span className="text-danger">*</span></label>
            <textarea className="form-control" id="nuevoProblema" name="problema" rows="2" placeholder="Describa el diagnóstico clínico..." value={form.problema} onChange={cambiar} style={borde('problema')} />
          </div>
          <div className="mb-3">
            <label htmlFor="nuevoTratamiento" className="form-label small fw-semibold">Tratamiento e Indicaciones Médicas <span className="text-danger">*</span></label>
            <textarea className="form-control" id="nuevoTratamiento" name="tratamiento" rows="3" placeholder="Fármacos, dosis, indicaciones de cuidado..." value={form.tratamiento} onChange={cambiar} style={borde('tratamiento')} />
          </div>
          <div className="mb-3">
            <label htmlFor="nuevoEstado" className="form-label small fw-semibold">Estado de la Atención</label>
            <select className="form-select" id="nuevoEstado" name="estado" value={form.estado} onChange={cambiar}>
              <option value="En Tratamiento">En Tratamiento</option>
              <option value="Finalizado">Atención Finalizada / Alta Médica</option>
            </select>
          </div>

          {Object.keys(errores).length > 0 && (
            <div className="alert alert-danger py-2 small mb-3">
              <strong>Corrija los campos señalados:</strong>
              {Object.values(errores).map((m, i) => (
                <div key={i}>* {m}</div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>Cancelar</button>
            <button type="submit" className="btn btn-primary-custom fw-bold rounded-pill px-4 shadow-sm">
              <i className="bi bi-save2-fill me-1"></i> Ingresar Paciente
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
