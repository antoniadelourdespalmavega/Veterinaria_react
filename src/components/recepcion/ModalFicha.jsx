import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { correoValido, parsearPeso, telefonoValido } from '../../utils/validaciones';

// Formulario vacío (el teléfono parte con +56 9 para ahorrarle tiempo a quien escribe)
const VACIO = { dueno: '', telefono: '+56 9 ', correo: '', mascota: '', especie: 'Canino', raza: '', edad: '', peso: '', condiciones: '', motivo: '' };

// Ventana para registrar una ficha nueva o editar los datos administrativos de una existente
// (dueño y mascota). El diagnóstico y el tratamiento los define el veterinario, no la secretaria.
// Si me pasan una ficha es edición; si es null, es una ficha nueva.
export default function ModalFicha({ show, onHide, ficha, onGuardar }) {
  const [form, setForm] = useState(VACIO);
  // Errores por campo
  const [errores, setErrores] = useState({});

  // Al abrir la ventana: si es edición cargo los datos de la ficha, si no, dejo todo vacío
  useEffect(() => {
    if (show) {
      setErrores({});
      setForm(
        ficha
          ? {
              dueno: ficha.dueno, telefono: ficha.telefono, correo: ficha.correo, mascota: ficha.mascota,
              especie: ficha.especie, raza: ficha.raza, edad: ficha.edad, peso: parsearPeso(ficha.peso) || '',
              condiciones: ficha.condiciones || '', motivo: ficha.problema,
            }
          : VACIO
      );
    }
  }, [show, ficha]);

  // Actualiza el campo que se está escribiendo
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    // Valido todos los campos antes de guardar
    const err = {};
    const peso = parsearPeso(form.peso);
    if (form.dueno.trim().length < 3) err.dueno = 'Nombre del dueño obligatorio (mín. 3 caracteres).';
    if (!telefonoValido(form.telefono)) err.telefono = 'Teléfono chileno inválido (ej: +56 9 1234 5678).';
    if (!correoValido(form.correo)) err.correo = 'Correo inválido (debe tener @ y terminar en .cl o .com).';
    if (form.mascota.trim().length < 2) err.mascota = 'Nombre de la mascota obligatorio.';
    if (form.raza.trim().length < 2) err.raza = 'Indique la raza (o Mestizo).';
    if (!String(form.edad).trim()) err.edad = 'Indique la edad (ej: 3 años).';
    if (!(peso > 0 && peso < 150)) err.peso = 'Peso inválido (en kg, mayor a 0).';
    if (form.motivo.trim().length < 5) err.motivo = 'Indique el motivo de ingreso (mín. 5 caracteres).';
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    // Si todo está bien entrego los datos ya limpios (peso como número + " kg", correo en minúsculas, etc.)
    onGuardar({
      dueno: form.dueno.trim(), telefono: form.telefono.trim(), correo: form.correo.trim().toLowerCase(),
      mascota: form.mascota.trim(), especie: form.especie, raza: form.raza.trim(), edad: String(form.edad).trim(),
      peso: peso + ' kg', condiciones: form.condiciones.trim(), problema: form.motivo.trim(),
    });
  };

  // Borde rojo para los campos con error
  const borde = (c) => (errores[c] ? { borderColor: 'red' } : undefined);
  // Función auxiliar para no repetir el HTML de cada campo de texto
  const campo = (id, etiqueta, nombre, extra = {}) => (
    <>
      <label htmlFor={id} className="form-label small fw-semibold">{etiqueta}</label>
      <input className="form-control" id={id} name={nombre} value={form[nombre]} onChange={cambiar} style={borde(nombre)} {...extra} />
    </>
  );

  return (
    // Ventana (modal) grande
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">{ficha ? `Editar Ficha ${ficha.id}` : 'Registrar Nueva Ficha de Paciente'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <form onSubmit={enviar} noValidate>
          {/* Parte 1: datos del dueño */}
          <h6 className="fw-bold text-secondary mb-2">1. Datos del Dueño</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">{campo('fichaDueno', 'Nombre Completo *', 'dueno')}</div>
            <div className="col-12 col-md-4">{campo('fichaTelefono', 'Teléfono Móvil *', 'telefono', { placeholder: '+56 9 1234 5678' })}</div>
            <div className="col-12 col-md-4">{campo('fichaCorreo', 'Correo *', 'correo', { placeholder: 'cliente@correo.cl' })}</div>
          </div>

          {/* Parte 2: datos de la mascota */}
          <h6 className="fw-bold text-secondary mb-2">2. Datos de la Mascota</h6>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-3">{campo('fichaMascota', 'Nombre *', 'mascota')}</div>
            <div className="col-12 col-md-3">
              <label htmlFor="fichaEspecie" className="form-label small fw-semibold">Especie</label>
              <select className="form-select" id="fichaEspecie" name="especie" value={form.especie} onChange={cambiar}>
                <option value="Canino">Canino</option>
                <option value="Felino">Felino</option>
                <option value="Exótico">Exótico / Ave</option>
              </select>
            </div>
            <div className="col-12 col-md-6">{campo('fichaRaza', 'Raza *', 'raza', { placeholder: 'Ej: Golden Retriever, Mestizo' })}</div>
            <div className="col-6 col-md-3">{campo('fichaEdad', 'Edad *', 'edad', { placeholder: 'Ej: 3 años' })}</div>
            <div className="col-6 col-md-3">{campo('fichaPeso', 'Peso (kg) *', 'peso', { type: 'number', step: '0.1', min: '0.1' })}</div>
            <div className="col-12 col-md-6">{campo('fichaCondiciones', 'Condiciones / Alergias Previas', 'condiciones', { placeholder: 'Opcional' })}</div>
          </div>

          <div className="mb-3">
            <label htmlFor="fichaMotivo" className="form-label small fw-semibold">Motivo de Ingreso *</label>
            <textarea className="form-control" id="fichaMotivo" name="motivo" rows="2" value={form.motivo} onChange={cambiar} style={borde('motivo')} />
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
              <i className="bi bi-save-fill me-1"></i> Guardar Ficha
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
