import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { RUTA_POR_ROL } from '../data/datosBase';

// Barra de navegación de arriba. Es responsiva: en pantallas chicas (menos de "lg")
// se esconde y aparece el botón de hamburguesa.
export default function NavbarPublica() {
  // Del carrito necesito la cantidad de productos (para el numerito rojo) y la función que abre el panel
  const { items, abrir } = useCarrito();
  // Si hay alguien conectado, "Mi Portal" lo lleva directo a su panel; si no, al login
  const { usuario } = useAuth();
  const rutaPortal = usuario ? RUTA_POR_ROL[usuario.rol] : '/mi-portal';

  return (
    <header className="sticky-top shadow-sm bg-white">
      {/* Navbar de react-bootstrap: expand="lg" significa que se muestra completa desde pantallas grandes */}
      <Navbar expand="lg" className="py-2">
        <Container>
          {/* Logo y nombre de la clínica (el texto largo se oculta en celulares con d-none) */}
          <Navbar.Brand as={Link} to="/" className="fw-bold brand-title d-flex align-items-center gap-2">
            <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="nav-logo" style={{ height: '38px' }} />
            <span>
              San Marcos <small className="fs-6 text-muted d-none d-sm-inline">| Clínica Veterinaria</small>
            </span>
          </Navbar.Brand>

          {/* Botón de hamburguesa (solo se ve en pantallas chicas) */}
          <Navbar.Toggle aria-controls="navbarPrincipal" className="border-0" />

          <Navbar.Collapse id="navbarPrincipal">
            {/* Enlaces del menú. NavLink marca como activo el enlace de la página donde estoy. */}
            <Nav className="ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <Nav.Link as={NavLink} to="/" end className="fw-semibold">Inicio</Nav.Link>
              {/* Estos dos enlaces llevan a una sección de la página de inicio (por eso el #) */}
              <Nav.Link as={Link} to="/#nosotros" className="fw-semibold">Nosotros</Nav.Link>
              <Nav.Link as={Link} to="/#equipo" className="fw-semibold">Especialistas</Nav.Link>
              <Nav.Link as={NavLink} to="/servicios" className="fw-semibold">Servicios</Nav.Link>
              <Nav.Link as={NavLink} to="/contacto" className="fw-semibold">Contacto y Mapa</Nav.Link>
              <Nav.Link as={Link} to={rutaPortal} className="fw-semibold">Mi Portal</Nav.Link>

              <div className="ms-lg-2 mt-2 mt-lg-0 position-relative">
                {/* Botón del carrito: abre el panel lateral y muestra cuántos productos hay */}
                <Button
                  variant="outline-dark"
                  className="rounded-pill px-3 fw-bold shadow-sm position-relative"
                  onClick={abrir}
                >
                  <i className="bi bi-cart3 me-1"></i> Carrito
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {items.length}
                  </Badge>
                </Button>
              </div>

              <div className="ms-lg-2 mt-2 mt-lg-0">
                {/* Botón para agendar una cita */}
                <Link to="/solicitar-cita" className="btn btn-primary-custom rounded-pill px-4 fw-bold shadow-sm">
                  <i className="bi bi-calendar2-plus me-1"></i> Agendar Cita
                </Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
