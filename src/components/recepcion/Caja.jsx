import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ARANCELES, METODOS_PAGO } from '../../data/datosBase';
import { clp } from '../../utils/formato';
import { BadgePago } from '../paneles/Badges';

// Caja: tabla con los tratamientos para cobrar, la ventana de pago y el comprobante.
// Recibe todas las fichas, el nombre de quien cobra y la función onPagar.
export default function Caja({ fichas, cajero, onPagar }) {
  // Ficha que se está cobrando ahora (null = ventana de cobro cerrada)
  const [fichaCobro, setFichaCobro] = useState(null);
  // Datos del comprobante que se muestra después de pagar (null = cerrado)
  const [comprobante, setComprobante] = useState(null);
  // Concepto, monto y medio de pago elegidos
  const [form, setForm] = useState({ concepto: ARANCELES[0].concepto, monto: ARANCELES[0].monto, metodo: METODOS_PAGO[0] });
  // Mensaje de error del monto
  const [error, setError] = useState('');

  // Cada vez que abro el cobro de una ficha reinicio el formulario con el primer arancel
  useEffect(() => {
    if (fichaCobro) {
      setError('');
      setForm({ concepto: ARANCELES[0].concepto, monto: ARANCELES[0].monto, metodo: METODOS_PAGO[0] });
    }
  }, [fichaCobro]);

  // Al cambiar el concepto del cobro pongo automáticamente el monto que le corresponde (se puede modificar)
  const cambiarConcepto = (e) => {
    const arancel = ARANCELES.find((a) => a.concepto === e.target.value);
    setForm((f) => ({ ...f, concepto: e.target.value, monto: arancel ? arancel.monto : f.monto }));
  };

  // Al confirmar: valido el monto, armo el detalle del pago, se lo paso a quien me llamó
  // (que marca la ficha como pagada) y abro el comprobante
  const confirmar = (e) => {
    e.preventDefault();
    if (!form.monto || parseFloat(form.monto) <= 0) {
      setError('El monto a pagar debe ser mayor a 0.');
      return;
    }
    const detalle = {
      monto: String(form.monto), metodo: form.metodo, concepto: form.concepto,
      fechaPago: new Date().toLocaleString('es-CL'), atendidoPor: cajero,
    };
    onPagar(fichaCobro.id, detalle);
    setComprobante({ ficha: fichaCobro, ...detalle });
    setFichaCobro(null);
  };

  return (
    <>
      {/* Tabla de cobros: una fila por cada ficha */}
      <div className="table-responsive">
        <table className="table align-middle table-hover mb-0">
          <thead className="table-light text-muted small text-uppercase">
            <tr>
              <th>Paciente / Dueño</th>
              <th>Diagnóstico Doctor</th>
              <th>Tratamiento / Receta</th>
              <th>Estado Médico</th>
              <th>Estado Pago</th>
              <th className="text-center">Cobrar</th>
            </tr>
          </thead>
          <tbody>
            {fichas.length === 0 && (
              <tr><td colSpan="6" className="text-center py-4 text-muted">No hay tratamientos médicos emitidos por doctores aún.</td></tr>
            )}
            {fichas.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="fw-bold text-dark">{p.mascota}</div>
                  <small className="text-muted">{p.dueno} ({p.telefono})</small>
                </td>
                <td><div className="small fw-semibold text-truncate" style={{ maxWidth: '180px' }}>{p.problema}</div></td>
                <td><div className="small text-muted text-truncate" style={{ maxWidth: '220px' }} title={p.tratamiento}>{p.tratamiento}</div></td>
                <td>
                  {p.estado === 'Finalizado' ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle text-uppercase fw-semibold px-2 py-1">Finalizado</span>
                  ) : (
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle text-uppercase fw-semibold px-2 py-1">En Tratamiento</span>
                  )}
                </td>
                <td><BadgePago pagado={p.pagado} /></td>
                <td className="text-center">
                  {p.pagado ? (
                    <span className="badge bg-light text-muted border">Comprobante OK</span>
                  ) : (
                    <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={() => setFichaCobro(p)}>
                      <i className="bi bi-cash-stack me-1"></i> Cobrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de cobro */}
      <Modal show={!!fichaCobro} onHide={() => setFichaCobro(null)} centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold"><i className="bi bi-receipt-cutoff me-1 text-primary"></i> Cobro en Recepción</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {fichaCobro && (
            <form onSubmit={confirmar}>
              <div className="p-3 bg-light rounded-4 mb-3 border">
                <div className="d-flex justify-content-between">
                  <span className="small text-muted">Paciente:</span>
                  <strong className="text-dark">{fichaCobro.mascota} ({fichaCobro.especie})</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="small text-muted">Propietario:</span>
                  <span className="fw-semibold text-dark">{fichaCobro.dueno} - {fichaCobro.telefono}</span>
                </div>
                <hr className="my-2" />
                <small className="text-muted d-block">Tratamiento Indicado por el Doctor:</small>
                <span className="small fst-italic text-secondary">{fichaCobro.tratamiento}</span>
              </div>

              <div className="mb-3">
                <label htmlFor="pagoConcepto" className="form-label small fw-semibold">Tipo de Cobro / Arancel</label>
                <select className="form-select" id="pagoConcepto" value={form.concepto} onChange={cambiarConcepto}>
                  {ARANCELES.map((a) => (
                    <option key={a.concepto} value={a.concepto}>{a.etiqueta}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="pagoMonto" className="form-label small fw-semibold">Total a Pagar (CLP) <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold">$</span>
                  <input type="number" className="form-control fw-bold fs-5 text-dark" id="pagoMonto" min="1000" step="500" required
                    value={form.monto} onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))} />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="pagoMetodo" className="form-label small fw-semibold">Medio de Pago</label>
                <select className="form-select" id="pagoMetodo" value={form.metodo} onChange={(e) => setForm((f) => ({ ...f, metodo: e.target.value }))}>
                  {METODOS_PAGO.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-dark fw-bold rounded-pill shadow-sm py-2">
                  <i className="bi bi-printer me-1"></i> Registrar Cobro y Emitir Comprobante
                </button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>

      {/* Comprobante de pago */}
      <Modal show={!!comprobante} onHide={() => setComprobante(null)} centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold"><i className="bi bi-check-circle-fill me-1 text-success"></i> Comprobante de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {comprobante && (
            <div className="border rounded-4 p-3 bg-light small">
              <div className="text-center fw-bold mb-2">CLÍNICA VETERINARIA SAN MARCOS</div>
              <div><strong>Paciente:</strong> {comprobante.ficha.mascota}</div>
              <div><strong>Dueño:</strong> {comprobante.ficha.dueno}</div>
              <div><strong>Concepto:</strong> {comprobante.concepto}</div>
              <div><strong>Medio de Pago:</strong> {comprobante.metodo}</div>
              <div><strong>Total Pagado:</strong> {clp(comprobante.monto)} CLP</div>
              <div><strong>Cajera/Recepcionista:</strong> {comprobante.atendidoPor}</div>
              <div><strong>Fecha:</strong> {comprobante.fechaPago}</div>
              <div className="text-center fw-semibold text-success mt-2">¡Pago registrado exitosamente!</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button className="btn btn-outline-primary rounded-pill px-3" onClick={() => window.print()}><i className="bi bi-printer me-1"></i>Imprimir</button>
          <button className="btn btn-light rounded-pill px-4" onClick={() => setComprobante(null)}>Cerrar</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
