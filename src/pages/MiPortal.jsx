import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AlertaErrores from '../components/AlertaErrores';
import CampoIcono from '../components/CampoIcono';
import { useAuth } from '../context/AuthContext';

// Pantalla de inicio de sesión. Guardo lo que escribe el usuario, los errores y si el login salió bien.
export default function MiPortal() {
  // La función que valida el login viene del AuthContext
  const { iniciarSesion } = useAuth();
  // navigate me sirve para cambiar de página por código (ir al panel después de iniciar sesión)
  const navigate = useNavigate();
  // Si RutaProtegida me mandó aquí, trae un aviso en "state" (ej: no tienes permiso)
  const { state } = useLocation();

  // Estados de los campos del formulario (formulario controlado: el valor vive en el estado)
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  // Lista de errores para mostrar
  const [errores, setErrores] = useState([]);
  // Si el login salió bien guardo aquí los datos; si no, queda en null
  const [exito, setExito] = useState(null); // { usuario, destino }
  // Guardo el temporizador de la redirección para poder cancelarlo si se van de la página
  const temporizador = useRef(null);

  // Si el usuario abandona la página antes de los 2 segundos, cancelo la redirección
  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Al presionar Ingresar: valido con el AuthContext. Si falla muestro los errores;
  // si sale bien muestro el mensaje de éxito y a los 2 segundos lo mando a su panel.
  const enviar = (e) => {
    e.preventDefault();
    const res = iniciarSesion(correo, clave);
    if (!res.ok) {
      setExito(null);
      setErrores(res.errores);
      return;
    }
    setErrores([]);
    setExito(res);
    temporizador.current = setTimeout(() => navigate(res.destino), 2000);
  };

  return (
    <div className="d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 bg-white">
              <div className="text-center mb-3">
                <div className="mx-auto d-flex align-items-center justify-content-center" style={{ width: '110px', height: '100px', overflow: 'hidden' }}>
                  <img
                    src="/img/Iconos Gatito y Perrito.png"
                    alt="Portal Veterinario San Marcos"
                    style={{ width: '100%', height: 'auto', transform: 'scale(3.6) translate(3%, -4%)' }}
                  />
                </div>
                <h3 className="fw-bold mb-1 mt-1">Mi Portal</h3>
                <p className="text-muted small mb-0">Ingresa tus datos para acceder a tu cuenta</p>
              </div>

              {/* Aviso que viene desde la ruta protegida (si lo hay) */}
              {state?.aviso && <div className="alert alert-warning py-2 small">{state.aviso}</div>}

              {/* Formulario: onSubmit llama a mi función enviar */}
              <form onSubmit={enviar} noValidate>
                <CampoIcono
                  id="email" label="Correo Electrónico" icono="bi-envelope" type="email"
                  placeholder="ejemplo@correo.cl" value={correo} onChange={(e) => setCorreo(e.target.value)}
                  error={errores.length > 0 && errores.some((x) => x.toLowerCase().includes('correo'))}
                />
                <CampoIcono
                  id="password" label="Contraseña" icono="bi-lock" type="password"
                  placeholder="••••••••" value={clave} onChange={(e) => setClave(e.target.value)}
                  error={errores.length > 0 && errores.some((x) => x.toLowerCase().includes('contraseña'))}
                />

                <div className="d-grid mb-3 mt-4">
                  <button type="submit" className="btn btn-primary-custom btn-lg fw-bold rounded-pill shadow-sm" disabled={!!exito}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Ingresar
                  </button>
                </div>

                {/* Cuadro rojo con los errores (si los hay) */}
                <AlertaErrores errores={errores} />

                {/* Mensaje verde de éxito */}
                {exito && (
                  <div className="alert alert-success mt-3">
                    <strong>¡Autenticación exitosa!</strong><br />
                    Bienvenido/a {exito.usuario.nombre}<br />
                    <span className="badge bg-primary text-uppercase mt-1">{exito.usuario.rol}</span><br />
                    <small className="text-muted">Redirigiendo a tu portal en 2 segundos...</small>
                  </div>
                )}

                <div className="text-center mt-3">
                  <p className="text-muted mb-1 small">¿No tienes cuenta?</p>
                  <Link to="/registro" className="fw-bold text-decoration-none icon-main">Crear una cuenta</Link>
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
