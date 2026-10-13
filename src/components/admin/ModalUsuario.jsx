import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

// Roles que se pueden asignar
const ROLES = [
  { valor: 'veterinario', texto: 'Veterinario/a' },
  { valor: 'secretaria', texto: 'Secretaría / Recepción' },
  { valor: 'administrador', texto: 'Administrador' },
  { valor: 'cliente', texto: 'Cliente / Dueño de mascota' },
];

// Ventana (modal) para crear un usuario nuevo o editar uno existente.
// Si me pasan un usuario es edición; si es null, es creación.
// onGuardar devuelve un texto de error si algo salió mal, o null si se guardó bien.
export default function ModalUsuario({ show, onHide, usuario, onGuardar }) {
  // true si estoy editando, false si estoy creando
  const edicion = !!usuario;
  // Estado con lo que va escribiendo el usuario en el formulario
  const [form, setForm] = useState({ nombre: '', correo: '', rol: 'veterinario', clave: 'Vet2026*' });
  // Mensaje de error para mostrar abajo (vacío si no hay error)
  const [error, setError] = useState('');

  // Cada vez que se abre la ventana cargo los datos del usuario (si edito) o dejo el formulario vacío
  useEffect(() => {
    if (show) {
      setError('');
      setForm(
        usuario
          ? { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, clave: '' }
          : { nombre: '', correo: '', rol: 'veterinario', clave: 'Vet2026*' }
      );
    }
  }, [show, usuario]);

  // Cuando se escribe en un campo actualizo solo ese campo en el estado (uso el name del input)
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Al enviar el formulario le paso los datos a quien me llamó; si devuelve un error lo muestro
  const enviar = (e) => {
    e.preventDefault();
    const res = onGuardar(form);
    if (res) setError(res);
  };

  return (
    // Modal de react-bootstrap: show dice si se ve y onHide qué hacer al cerrar
    <Modal show={show} onHide={onHide} centered contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">{edicion ? 'Modificar Datos de Usuario' : 'Crear Nuevo Usuario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <form onSubmit={enviar}>
          <div className="mb-3">
            <label htmlFor="usrNombre" className="form-label fw-semibold small">Nombre Completo</label>
            <input type="text" className="form-control" id="usrNombre" name="nombre" required value={form.nombre} onChange={cambiar} placeholder="Ej: Dr. Matías Ramos" />
          </div>
          <div className="mb-3">
            <label htmlFor="usrCorreo" className="form-label fw-semibold small">Correo Electrónico</label>
            <input type="email" className="form-control" id="usrCorreo" name="correo" required value={form.correo} onChange={cambiar} placeholder="nombre@sanmarcos.cl" />
          </div>
          <div className="mb-3">
            <label htmlFor="usrRol" className="form-label fw-semibold small">Rol en el Sistema</label>
            <select className="form-select" id="usrRol" name="rol" value={form.rol} onChange={cambiar}>
              {ROLES.map((r) => (
                <option key={r.valor} value={r.valor}>{r.texto}</option>
              ))}
            </select>
          </div>
          {/* La contraseña temporal solo se pide al crear (al editar se mantiene la que ya tiene) */}
          {!edicion && (
            <div className="mb-3">
              <label htmlFor="usrClave" className="form-label fw-semibold small">Contraseña Temporal</label>
              <input type="text" className="form-control" id="usrClave" name="clave" required value={form.clave} onChange={cambiar} />
            </div>
          )}
          {/* Si hay error lo muestro en un cuadro rojo */}
          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary-custom fw-bold rounded-pill shadow-sm">
              {edicion ? 'Guardar Cambios' : 'Crear Usuario y Asignar Acceso'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
