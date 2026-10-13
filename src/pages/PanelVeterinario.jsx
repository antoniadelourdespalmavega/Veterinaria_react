import { useMemo, useState } from 'react';
import { BadgeEstadoMedico } from '../components/paneles/Badges';
import MetricCard from '../components/paneles/MetricCard';
import PanelLayout from '../components/paneles/PanelLayout';
import ModalFichaClinica from '../components/veterinario/ModalFichaClinica';
import ModalIngresoPaciente from '../components/veterinario/ModalIngresoPaciente';
import { useData } from '../context/DataContext';

// Panel del veterinario: ve el listado de pacientes, ingresa atenciones presenciales
// y edita la ficha clínica (diagnóstico, tratamiento y estado).
export default function PanelVeterinario() {
  // Las fichas y las acciones salen del DataContext
  const { fichas, crearFicha, actualizarFicha } = useData();
  // Texto del buscador
  const [busqueda, setBusqueda] = useState('');
  // true cuando la ventana de "Ingreso Presencial" está abierta
  const [ingreso, setIngreso] = useState(false);
  // Paciente cuya ficha se está editando (null = ventana cerrada)
  const [seleccionado, setSeleccionado] = useState(null);

  // Filtro por mascota, dueño, especie o raza según lo que se escribió
  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return fichas.filter(
      (p) =>
        p.mascota.toLowerCase().includes(q) || p.dueno.toLowerCase().includes(q) ||
        p.especie.toLowerCase().includes(q) || p.raza.toLowerCase().includes(q)
    );
  }, [fichas, busqueda]);

  // Guarda un paciente nuevo y cierra la ventana
  const guardarIngreso = (datos) => {
    crearFicha({ ...datos, pagado: false });
    setIngreso(false);
  };

  // Guarda los cambios de la ficha y cierra la ventana
  const guardarFicha = (id, cambios) => {
    actualizarFicha(id, cambios);
    setSeleccionado(null);
  };

  return (
    // PanelLayout es el marco común de los paneles
    <PanelLayout marca="Módulo Clínico" cargo="Médico Veterinario de Turno" color="success" icono="bi-heart-pulse" pie="Módulo Clínico.">
      {/* Título, buscador y botón de ingreso presencial */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-0">Agenda de Pacientes y Fichas Clínicas</h3>
          <p className="text-muted small mb-0">Revisa la información del dueño, historial del paciente y registra atenciones presenciales.</p>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <input
            type="text" className="form-control form-control-sm rounded-pill px-3" style={{ minWidth: '240px' }}
            placeholder="Buscar por mascota o dueño..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-primary-custom rounded-pill px-4 fw-bold shadow-sm" onClick={() => setIngreso(true)}>
            <i className="bi bi-plus-circle-fill me-1"></i> Ingreso Presencial
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Tarjetas con números calculados desde la lista de fichas */}
        <MetricCard icono="bi-calendar-check-fill" color="primary" etiqueta="Pacientes Agendados" valor={fichas.length} />
        <MetricCard icono="bi-hourglass-split" color="warning" etiqueta="En Tratamiento / Pendientes" valor={fichas.filter((p) => p.estado === 'En Tratamiento').length} />
        <MetricCard icono="bi-check2-circle" color="success" etiqueta="Atenciones Finalizadas" valor={fichas.filter((p) => p.estado === 'Finalizado').length} />
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
          <h5 className="fw-bold mb-0">Pacientes Asignados a la Jornada</h5>
        </div>
        <div className="card-body px-4 pb-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th>Paciente (Mascota)</th>
                  <th>Especie / Raza</th>
                  <th>Peso / Edad</th>
                  <th>Dueño / Contacto</th>
                  <th>Estado Tratamiento</th>
                  <th className="text-center">Ficha Clínica</th>
                </tr>
              </thead>
              <tbody>
                {/* Mensaje cuando no hay pacientes que mostrar */}
                {filtrados.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No se encontraron pacientes registrados.</td></tr>
                )}
                {/* Una fila por cada paciente */}
                {filtrados.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-bold fs-6 text-dark">{p.mascota}</div>
                      <small className="text-muted">ID: {p.id}</small>
                    </td>
                    <td>
                      <div>
                        <i className={'bi me-1 ' + (p.especie.toLowerCase().includes('can') ? 'bi-shield-shaded text-primary' : 'bi-flower1 text-info')}></i>
                        {p.especie}
                      </div>
                      <small className="text-muted">{p.raza}</small>
                    </td>
                    <td>
                      <div className="fw-bold">{p.peso}</div>
                      <small className="text-muted">{p.edad}</small>
                    </td>
                    <td>
                      <div className="fw-semibold">{p.dueno}</div>
                      <small className="text-muted">{p.telefono}</small>
                    </td>
                    <td><BadgeEstadoMedico estado={p.estado} /></td>
                    <td className="text-center">
                      <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold" onClick={() => setSeleccionado(p)}>
                        <i className="bi bi-pencil-square me-1"></i> Ver / Recetar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ventanas (modals): se ven solo cuando su estado está activo */}
      <ModalIngresoPaciente show={ingreso} onHide={() => setIngreso(false)} onGuardar={guardarIngreso} />
      <ModalFichaClinica show={!!seleccionado} paciente={seleccionado} onHide={() => setSeleccionado(null)} onGuardar={guardarFicha} />
    </PanelLayout>
  );
}
