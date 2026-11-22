import { Link } from 'react-router-dom';

export default function FooterPublico() {
  return (
    // Pie de página con 3 columnas: la clínica, los enlaces y el contacto
    <footer className="text-white pt-5 pb-4">
        <div className="container">
            <div className="row g-4">
                {/* Columna 1: logo y descripción */}
                <div className="col-12 col-md-4">
                    <h5 className="fw-bold text-uppercase mb-3 d-flex align-items-center gap-2">
                        <img src="/img/logo.png" alt="Logo San Marcos" className="footer-logo" style={{ height: '32px' }} />
                        <span>San Marcos</span>
                    </h5>
                    <p className="text-light-50 small" style={{ color: '#cbd5e1' }}>
                        Clínica Veterinaria dedicada a la salud y bienestar animal en la ciudad de Rancagua. Atención personalizada y fichas clínicas digitales.
                    </p>
                </div>

                {/* Columna 2: enlaces a las páginas del sitio */}
                <div className="col-6 col-md-2">
                    <h6 className="fw-bold text-uppercase mb-3 text-light">Enlaces</h6>
                    <ul className="list-unstyled small d-flex flex-column gap-2">
                        <li><Link to="/" className="text-light text-decoration-none hover-link">Inicio</Link></li>
                        <li><Link to="/#nosotros" className="text-light text-decoration-none hover-link">Nosotros</Link></li>
                        <li><Link to="/#equipo" className="text-light text-decoration-none hover-link">Especialistas</Link></li>
                        <li><Link to="/servicios" className="text-light text-decoration-none hover-link">Servicios</Link></li>
                        <li><Link to="/servicios#tienda" className="text-light text-decoration-none hover-link">Tienda</Link></li>
                        <li><Link to="/solicitar-cita" className="text-light text-decoration-none hover-link">Pedir Cita</Link></li>
                        <li><Link to="/contacto" className="text-light text-decoration-none hover-link">Ubicación</Link></li>
                    </ul>
                </div>

                {/* Columna 3: accesos al portal (todos llevan al login) */}
                <div className="col-6 col-md-2">
                    <h6 className="fw-bold text-uppercase mb-3 text-light">Accesos</h6>
                    <ul className="list-unstyled small d-flex flex-column gap-2">
                        <li><Link to="/mi-portal" className="text-light text-decoration-none hover-link">Portal Dueños</Link></li>
                        <li><Link to="/mi-portal" className="text-light text-decoration-none hover-link">Acceso Recepción</Link></li>
                        <li><Link to="/mi-portal" className="text-light text-decoration-none hover-link">Portal Médicos</Link></li>
                    </ul>
                </div>

                {/* Columna 4: datos de contacto */}
                <div className="col-12 col-md-4">
                    <h6 className="fw-bold text-uppercase mb-3 text-light">Contacto</h6>
                    <ul className="list-unstyled small text-light d-flex flex-column gap-2">
                        <li><i className="bi bi-geo-alt me-2 icon-accent"></i> Av. San Martín #1234, Rancagua</li>
                        <li><i className="bi bi-telephone me-2 icon-accent"></i> +56 72 234 5678</li>
                        <li><i className="bi bi-envelope me-2 icon-accent"></i> contacto@veterinariasanmarcos.cl</li>
                    </ul>
                </div>
            </div>

            <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }} />

            <div className="row align-items-center">
                <div className="col-md-6 text-center text-md-start small" style={{ color: '#cbd5e1' }}>
                    &copy; 2026 Veterinaria San Marcos. Todos los derechos reservados.
                </div>
                <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                    <a href="#" className="text-light me-3 fs-5 hover-link" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="text-light me-3 fs-5 hover-link" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="text-light fs-5 hover-link" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a>
                </div>
            </div>
        </div>
    </footer>
  );
}
