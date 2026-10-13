import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertaErrores from '../components/AlertaErrores';
import CampoIcono from '../components/CampoIcono';
import { useData } from '../context/DataContext';
import { correoValido, telefonoValido } from '../utils/validaciones';

// Valores iniciales del formulario (el teléfono parte con +56 9 )
const FORMULARIO_VACIO = { nombre: '', telefono: '+56 9 ', email: '', password: '', confirmPassword: '' };

// Pantalla para crear una cuenta de cliente: valido los campos y guardo el usuario con el DataContext.
export default function Registro() {
  // La acción que crea el cliente viene del DataContext
  const { registrarCliente } = useData();
  const navigate = useNavigate();
  // Todos los campos del formulario en un solo objeto
  const [form, setForm] = useState(FORMULARIO_VACIO);
  // Errores por campo: { nombre: "mensaje", ... }
  const [errores, setErrores] = useState({}); // { campo: 'mensaje' }
  // Mensaje final: éxito o advertencia (ej: ese correo ya existe)
  const [aviso, setAviso] = useState(null); // { tipo, texto }
  // Para redirigir al login a los 2 segundos de registrarse
  const temporizador = useRef(null);

  // Si se van de la página antes de tiempo, cancelo la redirección
  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Actualiza solo el campo que se está escribiendo (uso el name del input)
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Reviso cada campo y armo un objeto con los errores que encuentre
  const validar = () => {
    const e = {};
    const nombre = form.nombre.trim();
    if (!nombre) e.nombre = 'El campo "Nombre Completo" es obligatorio.';
    else if (nombre.length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres.';

    if (!form.telefono.trim()) e.telefono = 'El campo "Teléfono" es obligatorio.';
    else if (!telefonoValido(form.telefono)) e.telefono = 'Formato de teléfono inválido (debe comenzar con "+56 9" seguido de 8 dígitos, ej: +56 9 1234 5678).';

    if (!form.email.trim()) e.email = 'El campo "Correo Electrónico" es obligatorio.';
    else if (!correoValido(form.email)) e.email = 'Correo inválido (debe incluir "@" y terminar en ".cl" o ".com").';

    if (!form.password.trim()) e.password = 'El campo "Contraseña" es obligatorio.';
    else if (form.password.trim().length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.';

    if (!form.confirmPassword.trim()) e.confirmPassword = 'Debe confirmar su contraseña.';
    else if (form.password.trim() !== form.confirmPassword.trim()) e.confirmPassword = 'Las contraseñas ingresadas no coinciden.';
    return e;
  };

  // Al enviar: si hay errores los muestro; si no, intento registrar al cliente
  const enviar = (ev) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) {
      setAviso(null);
      return;
    }

    // registrarCliente devuelve un error si el correo ya existe
    const error = registrarCliente({
      nombre: form.nombre, telefono: form.telefono, correo: form.email, clave: form.password.trim(),
    });
    if (error) {
      setAviso({ tipo: 'warning', texto: error });
      return;
    }
    setAviso({ tipo: 'success', texto: `Bienvenido/a ${form.nombre.trim()}. Tu cuenta de cliente ha sido creada.` });
    temporizador.current = setTimeout(() => navigate('/mi-portal'), 2000);
  };

  // Paso los errores a una lista de textos para mostrarlos
  const lista = Object.values(errores);

  return (
    <div className="d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 bg-white">
              <div className="text-center mb-4">
                <div className="mx-auto d-flex align-items-center justify-content-center" style={{ width: '130px', height: '135px', overflow: 'hidden' }}>
                  <img
                    src="/img/Iconos Conejo y Pajaro.png"
                    alt="Crear Cuenta Veterinaria San Marcos"
                    style={{ width: '100%', height: 'auto', transform: 'scale(2.6) translate(0%, 9%)' }}
                  />
                </div>
                <h3 className="fw-bold mb-1 mt-1">Crear Cuenta</h3>
                <p className="text-muted small mb-0">Regístrate para gestionar las fichas y citas de tus mascotas</p>
              </div>

              {/* Formulario. Cada CampoIcono es un campo con su icono (el error pinta el borde rojo) */}
              <form onSubmit={enviar} noValidate>
                <CampoIcono id="nombre" label="Nombre Completo" icono="bi-person" type="text" placeholder="Ej: Juan Pérez"
                  value={form.nombre} onChange={cambiar} error={!!errores.nombre} />
                <CampoIcono id="telefono" label="Teléfono Móvil (Chile)" icono="bi-telephone" type="tel" placeholder="+56 9 1234 5678"
                  value={form.telefono} onChange={cambiar} error={!!errores.telefono} ayuda="Formato requerido: +56 9 seguido de 8 dígitos." />
                <CampoIcono id="email" label="Correo Electrónico" icono="bi-envelope" type="email" placeholder="ejemplo@correo.cl"
                  value={form.email} onChange={cambiar} error={!!errores.email} />
                <CampoIcono id="password" label="Contraseña" icono="bi-lock" type="password" placeholder="Al menos 6 caracteres"
                  value={form.password} onChange={cambiar} error={!!errores.password} />
                <CampoIcono id="confirmPassword" label="Confirmar Contraseña" icono="bi-lock-fill" type="password" placeholder="Repite tu contraseña"
                  value={form.confirmPassword} onChange={cambiar} error={!!errores.confirmPassword} />

                <div className="d-grid mb-3 mt-4">
                  <button type="submit" className="btn btn-primary-custom btn-lg fw-bold rounded-pill shadow-sm" disabled={aviso?.tipo === 'success'}>
                    <i className="bi bi-person-plus-fill me-1"></i> Registrarme
                  </button>
                </div>

                {/* Cuadro con los errores y mensaje final */}
                <AlertaErrores errores={lista} />
                {aviso && (
                  <div className={`alert alert-${aviso.tipo} mt-3`}>
                    <strong>{aviso.tipo === 'success' ? '¡Registro completado con éxito!' : 'Atención:'}</strong> {aviso.texto}
                    {aviso.tipo === 'success' && <><br /><small className="text-muted">Redirigiendo a Mi Portal para iniciar sesión...</small></>}
                  </div>
                )}

                <div className="text-center mt-3">
                  <p className="text-muted mb-1 small">¿Ya tienes una cuenta?</p>
                  <Link to="/mi-portal" className="fw-bold text-decoration-none icon-main">Iniciar Sesión</Link>
                </div>

                <div className="text-center mt-3 pt-3 border-top">
                  <Link to="/" className="text-muted text-decoration-none small">
                    <i className="bi bi-arrow-left me-1"></i> Volver a la página principal
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
