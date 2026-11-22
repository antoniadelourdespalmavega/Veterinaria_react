import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ModalReceta from '../components/cliente/ModalReceta';
import TarjetaMascota from '../components/cliente/TarjetaMascota';
import { BadgeCita } from '../components/paneles/Badges';
import MetricCard from '../components/paneles/MetricCard';
import PanelLayout from '../components/paneles/PanelLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Portal del dueño de mascota. Solo muestra los datos asociados a SU correo,
// así que no puede ver información de otros clientes.
export default function PanelCliente() {
  // Usuario conectado
  const { usuario } = useAuth();
  // Todas las fichas y citas del sistema (más abajo me quedo solo con las suyas)
  const { fichas, citas } = useData();
  // Mascota cuya receta se está viendo (null = ventana cerrada)
  const [recetaDe, setRecetaDe] = useState(null);

  // Su correo es lo que uso para identificar qué es suyo
  const correo = usuario.correo.toLowerCase().trim();
  // Me quedo solo con las fichas cuyo correo coincide con el del usuario conectado
  const misMascotas = useMemo(
    () => fichas.filter((f) => f.correo && f.correo.toLowerCase().trim() === correo),
    [fichas, correo]
  );
  // Lo mismo con las citas
  const misCitas = useMemo(
    () => citas.filter((c) => c.correo && c.correo.toLowerCase().trim() === correo),
    [citas, correo]
  );

  return (
    // PanelLayout es el marco común de los paneles
    <PanelLayout marca="Portal del Propietario" cargo="Dueño / Propietario" color="primary" icono="bi-person-heart" pie="Todos los derechos reservados.">
      {/* Título y botón para agendar una cita nueva */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-0">Mis Mascotas y Fichas Médicas</h3>
          <p className="text-muted small mb-0">Revisa el historial de salud, diagnósticos veterinarios y tratamientos activos con sus medicamentos e indicaciones.</p>
        </div>
        <Link to="/solicitar-cita" className="btn btn-primary-custom rounded-pill px-4 fw-bold shadow-sm">
          <i className="bi bi-calendar2-plus me-1"></i> Agendar Nueva Cita
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {/* Tarjetas con números */}
        <MetricCard icono="bi-shield-heart-fill" color="primary" etiqueta="Mascotas Registradas" valor={misMascotas.length} />
        <MetricCard icono="bi-capsule-pill" color="warning" etiqueta="Tratamientos Activos" valor={misMascotas.filter((m) => m.estado === 'En Tratamiento').length} />
        <MetricCard icono="bi-clock-history" color="info" etiqueta="Citas Programadas" valor={misCitas.filter((c) => c.estado === 'Confirmada' || c.estado === 'Pendiente').length} />
      </div>

      {/* Tabla "Mis Citas": aquí ve el estado de cada solicitud (Pendiente, Confirmada...) */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
          <h5 className="fw-bold mb-0">Mis Citas</h5>
          <p className="text-muted small mb-0">Una solicitud queda "Pendiente" hasta que Recepción la confirma y te asigna veterinario.</p>
        </div>
        <div className="card-body px-4 pb-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Mascota</th>
                  <th>Veterinario</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {/* Mensaje si todavía no tiene citas */}
                {misCitas.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">Aún no tienes citas. Usa "Agendar Nueva Cita" para solicitar una.</td></tr>
                )}
                {/* Una fila por cada cita suya */}
                {misCitas.map((c) => (
                  <tr key={c.idCita}>
                    <td>
                      <div className="fw-bold">{c.fecha}</div>
                      <small className="text-muted"><i className="bi bi-clock me-1"></i>{c.hora}</small>
                      {c.fechaAnterior && (
                        <div className="small text-warning-emphasis"><i className="bi bi-arrow-repeat me-1"></i>Reagendada por la clínica</div>
                      )}
                    </td>
                    <td className="fw-semibold">{c.mascota}</td>
                    <td>{c.doctor}</td>
                    <td><div className="small">{c.motivo}</div></td>
                    <td><BadgeCita estado={c.estado} etiquetaPendiente="Pendiente de confirmación" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tarjetas de sus mascotas */}
      <h5 className="fw-bold mb-3">Tus Animales de Compañía</h5>
      <div className="row g-3 mb-4">
        {/* Mensaje si no tiene mascotas registradas */}
        {misMascotas.length === 0 && (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
              <h6 className="fw-bold mb-1">No se encontraron mascotas registradas</h6>
              <p className="text-muted small mb-0">Tus animales de compañía aparecerán aquí una vez ingresados en clínica.</p>
            </div>
          </div>
        )}
        {/* Una tarjeta por cada mascota */}
        {misMascotas.map((m) => (
          <TarjetaMascota key={m.id} mascota={m} onVerReceta={setRecetaDe} />
        ))}
      </div>

      {/* Tabla con el historial de tratamientos de sus mascotas */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
          <h5 className="fw-bold mb-0">Historial de Tratamientos y Medicamentos</h5>
          <p className="text-muted small mb-0">Haz clic en "Ver Receta" para revisar las dosis y horarios de cada tratamiento.</p>
        </div>
        <div className="card-body px-4 pb-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Mascota</th>
                  <th>Diagnóstico Clínico</th>
                  <th>Tratamiento e Indicaciones</th>
                  <th>Estado de Salud</th>
                  <th>Caja / Pago</th>
                  <th className="text-center">Receta Médica</th>
                </tr>
              </thead>
              <tbody>
                {misMascotas.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No se registran atenciones clínicas asociadas.</td></tr>
                )}
                {misMascotas.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-bold text-dark">{p.mascota}</div>
                      <small className="text-muted">{p.especie} ({p.raza})</small>
                    </td>
                    <td><div className="small fw-semibold text-dark text-truncate" style={{ maxWidth: '220px' }} title={p.problema}>{p.problema}</div></td>
                    <td><div className="small text-muted text-truncate" style={{ maxWidth: '250px' }} title={p.tratamiento}>{p.tratamiento}</div></td>
                    <td>
                      {p.estado === 'Finalizado' ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle text-uppercase fw-semibold px-2 py-1">Alta Médica</span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle text-uppercase fw-semibold px-2 py-1">En Tratamiento</span>
                      )}
                    </td>
                    <td>
                      {p.pagado ? (
                        <span className="badge bg-success text-uppercase fw-semibold"><i className="bi bi-check2-all me-1"></i>Pagado</span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-dark border text-uppercase fw-semibold">Por regularizar</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-primary-custom btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={() => setRecetaDe(p)}>
                        <i className="bi bi-file-earmark-medical me-1"></i> Ver Receta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ventana de la receta */}
      <ModalReceta show={!!recetaDe} mascota={recetaDe} onHide={() => setRecetaDe(null)} />
    </PanelLayout>
  );
}
