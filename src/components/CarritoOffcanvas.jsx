import { Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { clp } from '../utils/formato';

// Panel lateral del carrito (aparece por la derecha). Si está abierto o no lo controla el CarritoContext.
export default function CarritoOffcanvas() {
  // Saco del carrito lo que necesito: productos, total, función para quitar y si está abierto
  const { items, total, quitar, abierto, cerrar } = useCarrito();

  return (
    // show dice si se ve o no; onHide se ejecuta cuando lo cierran (clic afuera o en la X)
    <Offcanvas show={abierto} onHide={cerrar} placement="end" className="border-0 shadow-lg">
      <Offcanvas.Header closeButton closeVariant="white" className="bg-primary text-white py-3">
        <Offcanvas.Title className="fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-cart3"></i> Carrito de Compras
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-4">
        <div className="flex-grow-1 overflow-auto mb-3">
          {/* Si no hay productos muestro el mensaje de carrito vacío; si hay, la lista */}
          {items.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-cart-x fs-1 opacity-50"></i>
              <p className="mt-2">Tu carrito está vacío.</p>
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {/* Dibujo un renglón por cada producto. La "key" ayuda a React a identificar cada uno. */}
              {items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                  <div>
                    <h6 className="my-0 fw-bold text-dark">{item.nombre}</h6>
                    <span className="text-success fw-bold small">{clp(item.precio)}</span>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => quitar(item.id)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total y botón para ir a pagar (se deshabilita si el carrito está vacío) */}
        <div className="border-top pt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold text-dark">Total:</span>
            <span className="fs-4 fw-bold text-success">{clp(total)}</span>
          </div>
          <Link
            to="/pago"
            onClick={cerrar}
            className={'btn btn-primary w-100 fw-bold py-2 rounded-3 shadow-sm' + (items.length === 0 ? ' disabled' : '')}
          >
            <i className="bi bi-credit-card me-2"></i>Proceder al Pago
          </Link>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
