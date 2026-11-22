import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Marco común de los 4 paneles (Admin, Recepción, Veterinario y Cliente):
// barra de arriba con el usuario conectado y el botón Salir, el contenido y el pie de página.
// Recibe: marca (texto junto al logo), cargo, color e icono del avatar, pie (texto del footer)
// y children (lo que va adentro, que es el contenido de cada panel).
export default function PanelLayout({ marca, cargo, color = 'primary', icono = 'bi-person-circle', pie, children }) {
  // Necesito el usuario (para mostrar su nombre) y la función de cerrar sesión
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  // Al presionar Salir cierro la sesión y vuelvo al login
  const salir = () => {
    cerrarSesion();
    navigate('/mi-portal');
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1">
      {/* Barra de arriba: se queda fija al hacer scroll (sticky-top) */}
      <header className="sticky-top shadow-sm bg-white border-bottom">
        <nav className="navbar navbar-expand-lg py-2">
          <div className="container-fluid px-4">
            <Link className="navbar-brand fw-bold brand-title d-flex align-items-center gap-2" to="/">
              <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="nav-logo" style={{ height: '38px' }} />
              <span>San Marcos <small className="fs-6 text-muted d-none d-md-inline">| {marca}</small></span>
            </Link>

            <div className="d-flex align-items-center gap-3 ms-auto">
              <div className="d-flex align-items-center gap-2 border-end pe-3">
                <div
                  className={`rounded-circle bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center shadow-sm`}
                  style={{ width: '42px', height: '42px', fontSize: '1.3rem' }}
                >
                  <i className={`bi ${icono}`}></i>
                </div>
                <div className="text-start d-none d-sm-block">
                  <div className="fw-bold small text-dark lh-sm">{usuario?.nombre}</div>
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>{cargo}</small>
                </div>
              </div>

              <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold" onClick={salir}>
                <i className="bi bi-box-arrow-right me-1"></i> Salir
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Aquí se muestra el contenido propio de cada panel */}
      <main className="container-fluid px-4 py-4 flex-grow-1">{children}</main>

      {/* Pie de página */}
      <footer className="text-white py-3 mt-auto" style={{ backgroundColor: '#1e293b' }}>
        <div className="container text-center small text-light-50">&copy; 2026 Veterinaria San Marcos. {pie}</div>
      </footer>
    </div>
  );
}
