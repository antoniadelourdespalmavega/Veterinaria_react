import { clp } from '../utils/formato';

// Tarjeta de un producto (imagen, nombre, descripción, precio y botón para añadir).
// La dibujo una vez por cada producto del catálogo.
// Props:
//   producto  -> { imagen, alt, nombre, descripcion, precio, precioAnterior?, nombreCarrito }
//   onAgregar -> función que recibe (nombre, precio) cuando se presiona "Añadir"
export default function TarjetaProducto({ producto, onAgregar }) {
  // Saco los datos del producto para usarlos más abajo sin escribir "producto." cada vez
  const { imagen, alt, nombre, descripcion, precio, precioAnterior, nombreCarrito } = producto;
  // Al presionar el botón le aviso a quien me llamó (Servicios) qué producto y precio quiere agregar
  const agregar = () => onAgregar(nombreCarrito || nombre, precio);

  return (
      <div className="col-md-4">
        <div className="border rounded p-3 h-100 bg-white d-flex flex-column text-center">
          <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: '180px' }}>
            <img src={imagen} alt={alt} className="img-fluid mh-100 object-fit-contain" />
          </div>
          <h5 className="fw-bold fs-6">{nombre}</h5>
          <p className="text-muted small mb-2 flex-grow-1">{descripcion}</p>
          {/* Si el producto tiene descuento muestro el precio antiguo tachado y el nuevo; si no, solo el precio */}
          {precioAnterior ? (
            <div className="mb-3">
              <small className="text-muted text-decoration-line-through me-2">{clp(precioAnterior)}</small>
              <span className="fw-bold text-success fs-5">{clp(precio)}</span>
            </div>
          ) : (
            <span className="fw-bold text-success fs-5 d-block mb-3">{clp(precio)}</span>
          )}
          <button className="btn btn-sm btn-outline-primary w-100 fw-semibold mt-auto" onClick={agregar}>
            <i className="bi bi-cart-plus me-1"></i>Añadir al Carrito
          </button>
        </div>
      </div>
  );
}
