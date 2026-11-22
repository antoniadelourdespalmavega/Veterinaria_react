import { Link } from 'react-router-dom';
import TarjetaProducto from '../components/TarjetaProducto';
import { useCarrito } from '../context/CarritoContext';
import { catalogoServicios, categoriasTienda, serviciosMedicos } from '../data/productos';

// Secciones del catálogo (el id lo usan los botones "Ver Opciones" para bajar hasta ahí)
const SECCIONES = [
  { clave: 'canina', id: 'comida-canina-detalle', titulo: 'Opciones para Perros', icono: 'bi-box-seam' },
  { clave: 'felina', id: 'comida-felina-detalle', titulo: 'Opciones para Gatos', icono: 'bi-tag' },
  { clave: 'conejos', id: 'comida-conejos-detalle', titulo: 'Opciones para Conejos', icono: 'bi-flower2' },
  { clave: 'aves', id: 'comida-aves-detalle', titulo: 'Opciones para Aves', icono: 'bi-feather' },
  { clave: 'juguetes', id: 'juguetes-detalle', titulo: 'Juguetes Interactivos', icono: 'bi-controller' },
  { clave: 'premios', id: 'premios-detalle', titulo: 'Premios y Snacks', icono: 'bi-gift' },
];

// Tarjeta de un servicio médico (nombre, precio, descripción y botón para agendar)
function TarjetaServicio({ servicio }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm p-3">
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '50px', height: '50px', flexShrink: 0 }}
            >
              <i className={`bi ${servicio.icono} fs-4`}></i>
            </div>
            <div>
              <h4 className="card-title fw-bold mb-0">{servicio.nombre}</h4>
              <span className="fs-5 fw-bold text-success">{servicio.precio}</span>
            </div>
          </div>
          <p className="card-text text-muted flex-grow-1">{servicio.descripcion}</p>
          <Link to="/solicitar-cita" className="btn btn-primary-custom w-100 fw-bold mt-3">
            <i className="bi bi-calendar-event me-2"></i>Agendar Cita
          </Link>
        </div>
      </div>
    </div>
  );
}

// Tarjeta de una categoría de la tienda. El botón baja hasta esa sección con un ancla (#)
function TarjetaCategoria({ categoria, ancha }) {
  return (
    <div className={ancha ? 'col-md-6' : 'col-md-6 col-lg-3'}>
      <div className="card h-100 border-0 shadow-sm p-3">
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '50px', height: '50px', flexShrink: 0 }}
            >
              <i className={`bi ${categoria.icono} fs-4`}></i>
            </div>
            <div>
              <h5 className="card-title fw-bold mb-0">{categoria.nombre}</h5>
              <span className="fs-6 fw-bold text-success">{categoria.desde}</span>
            </div>
          </div>
          <p className="card-text text-muted small flex-grow-1">{categoria.descripcion}</p>
          <a href={`#${categoria.ancla}`} className="btn btn-primary-custom w-100 fw-bold mt-3">
            <i className="bi bi-eye me-1"></i> Ver Opciones
          </a>
        </div>
      </div>
    </div>
  );
}

// Página de Servicios: servicios médicos arriba y la tienda (alimentos, juguetes y premios) abajo
export default function Servicios() {
  // agregar sirve para meter un producto al carrito
  const { agregar } = useCarrito();

  return (
    <div className="py-5 bg-light">
      <div className="container">
        {/* Título de la página */}
        <div className="text-center mb-5">
          <h1 className="fw-bold section-title">Nuestros Servicios Médicos</h1>
          <p className="text-muted">Conoce nuestras prestaciones, precios y agenda la atención de tu mascota en un solo clic.</p>
        </div>

        <div className="row g-4">
          {/* Una tarjeta por cada servicio médico (los datos están en productos.js) */}
          {serviciosMedicos.map((s) => (
            <TarjetaServicio key={s.nombre} servicio={s} />
          ))}
        </div>

        {/* Parte 2: la tienda */}
        <hr className="my-5" />

        <div className="text-center mb-5" id="tienda">
          <h2 className="fw-bold section-title">Tienda Pet Shop</h2>
          <p className="text-muted">Alimentos, premios y juguetes para perros, gatos, conejos y aves.</p>
        </div>

        <div className="row g-4">
          {/* Tarjetas de categorías (las 2 últimas, juguetes y premios, son más anchas) */}
          {categoriasTienda.map((c, i) => (
            <TarjetaCategoria key={c.nombre} categoria={c} ancha={i >= 4} />
          ))}
        </div>

        {/* Parte 3: el catálogo con todos los productos */}
        <hr className="my-5" id="seccion-comidas" />

        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">Opciones de Alimentos y Catálogo</h2>
          <p className="text-muted">Elige la variedad específica según el tipo de mascota e incorpórala a tu pedido.</p>
        </div>

        <div className="row g-4">
          {/* Una sección por cada categoría */}
          {SECCIONES.map((sec) => (
            <div className="col-12" id={sec.id} key={sec.id}>
              <div className="card border-0 shadow-sm p-4">
                <h3 className="h4 fw-bold text-primary mb-4">
                  <i className={`bi ${sec.icono} me-2`}></i>
                  {sec.titulo}
                </h3>
                <div className="row g-4">
                  {/* Una tarjeta por cada producto de la categoría */}
                  {catalogoServicios[sec.clave].map((prod) => (
                    <TarjetaProducto key={prod.imagen} producto={prod} onAgregar={agregar} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
