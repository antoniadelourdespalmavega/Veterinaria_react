import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { clp } from '../utils/formato';

// Simula una pasarela de pago (como Webpay): espera 2 segundos y responde.
// Si el monto es mayor a 0 aprueba el pago; si no, lo rechaza.
function simularApiTransaccion({ montoTotal }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (montoTotal > 0) {
        resolve({ estado: 'APROBADO', numeroTransaccion: 'TXN-' + Math.floor(100000 + Math.random() * 900000) });
      } else {
        reject({ estado: 'RECHAZADO', mensaje: 'Error en el monto de la transacción.' });
      }
    }, 2000);
  });
}

// Pantalla de pago: resumen del carrito + datos del comprador + pago simulado
export default function Pago() {
  // El carrito viene del CarritoContext
  const { items, total, vaciar } = useCarrito();
  // Para volver al inicio después de pagar
  const navigate = useNavigate();
  // Datos del comprador y del método de pago
  const [form, setForm] = useState({ nombre: '', correo: '', metodo: 'tarjeta', tarjeta: '', vencimiento: '', cvv: '' });
  // En qué etapa está el pago: inicial, procesando, aprobado o error
  const [estado, setEstado] = useState('inicial'); // inicial | procesando | aprobado | error
  // Respuesta de la pasarela (código de transacción o mensaje de error)
  const [resultado, setResultado] = useState(null);
  // Para volver al inicio a los 4 segundos de pagar
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Actualiza el campo que se está escribiendo
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Al presionar Pagar: espero la respuesta de la pasarela (await).
  // Si se aprueba vacío el carrito y vuelvo al inicio; si falla muestro el error.
  const pagar = async (e) => {
    e.preventDefault();
    if (total === 0) {
      alert('El carrito está vacío.');
      return;
    }
    setEstado('procesando');
    try {
      const respuesta = await simularApiTransaccion({ montoTotal: total });
      setResultado({ ...respuesta, nombre: form.nombre, correo: form.correo });
      setEstado('aprobado');
      vaciar();
      temporizador.current = setTimeout(() => navigate('/'), 4000);
    } catch (err) {
      setResultado(err);
      setEstado('error');
    }
  };

  return (
    <div className="bg-light flex-grow-1">
      {/* Encabezado simple (sin menú) para que se concentre en pagar */}
      <header className="bg-white shadow-sm py-3 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold brand-title d-flex align-items-center gap-2" to="/">
            <img src="/img/logo.png" alt="Logo Veterinaria San Marcos" className="nav-logo" style={{ maxHeight: '40px' }} />
            <span>San Marcos <small className="fs-6 text-muted">| Finalizar Compra</small></span>
          </Link>
          <Link to="/servicios#tienda" className="btn btn-outline-secondary btn-sm fw-semibold">
            <i className="bi bi-arrow-left me-1"></i> Volver a la Tienda
          </Link>
        </div>
      </header>

      <main className="container py-4">
        <div className="row g-4">
          {/* Columna del resumen de la orden (en celular queda arriba y en escritorio a la derecha) */}
          <div className="col-md-5 order-md-2 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 fw-bold"><i className="bi bi-receipt me-2"></i>Resumen de la Orden</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {items.length === 0 ? (
                    <p className="text-muted small my-3">No hay productos ni servicios seleccionados.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {items.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 small">
                          <span>{item.nombre}</span>
                          <span className="fw-bold text-success">{clp(item.precio)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
                  <span>Total a pagar:</span>
                  <span className="text-success">{clp(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna del formulario de pago */}
          <div className="col-md-7 order-md-1">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="mb-3 fw-bold text-primary"><i className="bi bi-credit-card me-2"></i>Detalles de Pago</h4>

              <form onSubmit={pagar}>
                <h6 className="fw-bold text-secondary mb-3">1. Datos del Comprador</h6>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label htmlFor="nombre_pago" className="form-label small fw-bold">Nombre Completo</label>
                    <input type="text" className="form-control" id="nombre_pago" name="nombre" placeholder="Ej: Pedro Pascal" required value={form.nombre} onChange={cambiar} />
                  </div>
                  <div className="col-12">
                    <label htmlFor="correo_pago" className="form-label small fw-bold">Correo Electrónico</label>
                    <input type="email" className="form-control" id="correo_pago" name="correo" placeholder="ejemplo@correo.cl" required value={form.correo} onChange={cambiar} />
                  </div>
                </div>

                <h6 className="fw-bold text-secondary mb-3">2. Método de Pago</h6>
                <div className="mb-3">
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="metodo" id="tarjeta" value="tarjeta" checked={form.metodo === 'tarjeta'} onChange={cambiar} />
                    <label className="form-check-label fw-semibold" htmlFor="tarjeta"><i className="bi bi-credit-card-2-front me-1"></i> Tarjeta Débito/Crédito</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="metodo" id="transferencia" value="transferencia" checked={form.metodo === 'transferencia'} onChange={cambiar} />
                    <label className="form-check-label fw-semibold" htmlFor="transferencia"><i className="bi bi-bank me-1"></i> Transferencia</label>
                  </div>
                </div>

                {/* Los datos de la tarjeta solo se piden si elige pagar con tarjeta */}
                {form.metodo === 'tarjeta' && (
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label htmlFor="num_tarjeta" className="form-label small fw-bold">Número de Tarjeta</label>
                      <input type="text" className="form-control" id="num_tarjeta" name="tarjeta" placeholder="1234 5678 9012 3456" maxLength={19} value={form.tarjeta} onChange={cambiar} />
                    </div>
                    <div className="col-6">
                      <label htmlFor="exp_tarjeta" className="form-label small fw-bold">Vencimiento (MM/AA)</label>
                      <input type="text" className="form-control" id="exp_tarjeta" name="vencimiento" placeholder="12/28" maxLength={5} value={form.vencimiento} onChange={cambiar} />
                    </div>
                    <div className="col-6">
                      <label htmlFor="cvv_tarjeta" className="form-label small fw-bold">CVV</label>
                      <input type="password" className="form-control" id="cvv_tarjeta" name="cvv" placeholder="123" maxLength={4} value={form.cvv} onChange={cambiar} />
                    </div>
                  </div>
                )}

                {/* Mensaje verde si el pago fue aprobado */}
                {estado === 'aprobado' && resultado && (
                  <div className="alert alert-success mt-3">
                    <strong><i className="bi bi-check-circle-fill me-2"></i>¡Pago Aprobado!</strong><br />
                    Código de Transacción: <code>{resultado.numeroTransaccion}</code><br />
                    Gracias por tu compra, {resultado.nombre}. Se ha enviado la boleta a <strong>{resultado.correo}</strong>.
                  </div>
                )}
                {estado === 'error' && resultado && (
                  <div className="alert alert-danger mt-3">
                    <strong><i className="bi bi-x-circle-fill me-2"></i>Error al procesar el pago:</strong><br />
                    {resultado.mensaje}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 fw-bold text-uppercase"
                  disabled={estado === 'procesando' || estado === 'aprobado' || items.length === 0}
                >
                  {/* El texto del botón cambia según la etapa del pago */}
                  {estado === 'procesando' && (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando con el banco...</>)}
                  {estado === 'aprobado' && (<><i className="bi bi-check-lg me-2"></i> Transacción Completada</>)}
                  {estado === 'error' && (<><i className="bi bi-lock-fill me-2"></i> Reintentar Pago</>)}
                  {estado === 'inicial' && (<><i className="bi bi-lock-fill me-2"></i> Pagar Ahora</>)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
