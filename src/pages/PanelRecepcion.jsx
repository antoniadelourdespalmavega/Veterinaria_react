import { useMemo, useState } from 'react';
import Caja from '../components/recepcion/Caja';
import ModalFicha from '../components/recepcion/ModalFicha';
import ModalGestionCita from '../components/recepcion/ModalGestionCita';
import ModalHorarios from '../components/recepcion/ModalHorarios';
import ModalNuevaCita from '../components/recepcion/ModalNuevaCita';
import TablaCitas from '../components/recepcion/TablaCitas';
import TablaFichas from '../components/recepcion/TablaFichas';
import MetricCard from '../components/paneles/MetricCard';
import PanelLayout from '../components/paneles/PanelLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { hoyISO } from '../utils/validaciones';

// Las 3 pestañas del panel
const PESTANAS = [
  { clave: 'citas', etiqueta: 'Agenda de Citas', icono: 'bi-calendar2-check-fill' },
  { clave: 'cobros', etiqueta: 'Caja y Cobro de Tratamientos', icono: 'bi-receipt-cutoff' },
  { clave: 'fichas', etiqueta: 'Fichas de Pacientes', icono: 'bi-folder2-open' },
];

// Panel de Recepción / Secretaría: aquí ve, confirma y reagenda las citas, registra y edita fichas
// y cobra los tratamientos. No gestiona usuarios.
export default function PanelRecepcion() {
  // Usuario conectado (su nombre sale en el comprobante como cajera)
  const { usuario } = useAuth();
  // Datos y acciones del DataContext
  const { citas, fichas, gestionarCita, anularCita, agendarCitaPresencial, crearFicha, actualizarFicha } = useData();

  // Estados de la pantalla: qué pestaña está activa, lo que escribieron en los buscadores y qué ventanas están abiertas
  const [pestana, setPestana] = useState('citas');
  const [busquedaCitas, setBusquedaCitas] = useState('');
  const [busquedaFichas, setBusquedaFichas] = useState('');
  const [verHorarios, setVerHorarios] = useState(false);
  const [nuevaCita, setNuevaCita] = useState(false);
  const [gestion, setGestion] = useState({ cita: null, modo: 'confirmar' });
  const [fichaModal, setFichaModal] = useState({ abierto: false, ficha: null });

  // Números de las tarjetas de arriba: los calculo contando sobre las listas de citas y fichas
  const hoy = hoyISO();
  const citasHoy = citas.filter((c) => c.fecha === hoy && (c.estado === 'Confirmada' || c.estado === 'Pendiente')).length;
  const pendientesConfirmar = citas.filter((c) => c.estado === 'Pendiente').length;
  const porCobrar = fichas.filter((f) => !f.pagado).length;
  const pagados = fichas.filter((f) => f.pagado).length;

  // Filtro las citas con lo que se escribió en el buscador (dueño, mascota, doctor o estado)
  const citasFiltradas = useMemo(() => {
    const q = busquedaCitas.toLowerCase().trim();
    return citas.filter(
      (c) =>
        c.dueno.toLowerCase().includes(q) || c.mascota.toLowerCase().includes(q) ||
        c.doctor.toLowerCase().includes(q) || (c.estado || '').toLowerCase().includes(q)
    );
  }, [citas, busquedaCitas]);

  // Lo mismo para las fichas (mascota, dueño o ID)
  const fichasFiltradas = useMemo(() => {
    const q = busquedaFichas.toLowerCase().trim();
    return fichas.filter(
      (f) => String(f.mascota).toLowerCase().includes(q) || String(f.dueno).toLowerCase().includes(q) || String(f.id).toLowerCase().includes(q)
    );
  }, [fichas, busquedaFichas]);

  // Anular o rechazar una cita, pidiendo confirmación antes
  const anular = (c) => {
    if (window.confirm('¿Estás seguro de que deseas anular o rechazar esta cita médica?')) anularCita(c.idCita);
  };

  // Confirmar o reagendar: llama a la acción del DataContext y, si no hubo error, cierra la ventana
  const guardarGestion = (datos) => {
    const error = gestionarCita(gestion.cita.idCita, datos, gestion.modo);
    if (!error) setGestion({ cita: null, modo: 'confirmar' });
    return error;
  };

  // Guardar una cita presencial nueva (si hay choque de horario devuelvo el error al formulario)
  const guardarCitaPresencial = (datos) => {
    const error = agendarCitaPresencial(datos);
    if (!error) setNuevaCita(false);
    return error;
  };

  // Guardar una ficha: si estoy editando actualizo la existente; si no, creo una nueva.
  // Las fichas nuevas parten con el tratamiento pendiente del veterinario.
  const guardarFicha = (datos) => {
    if (fichaModal.ficha) {
      actualizarFicha(fichaModal.ficha.id, datos);
    } else {
      crearFicha({
        ...datos,
        tratamiento: 'Pendiente de evaluación del médico veterinario.',
        estado: 'En Tratamiento',
        pagado: false,
      });
    }
    setFichaModal({ abierto: false, ficha: null });
  };

  // Marcar la ficha como pagada y guardar el detalle del pago
  const pagar = (id, detallePago) => actualizarFicha(id, { pagado: true, detallePago });

  return (
    // PanelLayout es el marco común de los paneles
    <PanelLayout marca="Recepción y Caja" cargo="Secretaría de Turno" color="warning" icono="bi-person-badge" pie="Módulo de Recepción y Cajas.">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-0">Módulo de Recepción, Citas y Cobranza</h3>
          <p className="text-muted small mb-0">Coordina la agenda médica, confirma solicitudes, registra fichas y procesa pagos de tratamientos.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-secondary rounded-pill px-3 fw-semibold shadow-sm" onClick={() => setVerHorarios(true)}>
            <i className="bi bi-clock-history me-1"></i> Ver Horarios Médicos
          </button>
          <button className="btn btn-primary-custom rounded-pill px-4 fw-bold shadow-sm" onClick={() => setNuevaCita(true)}>
            <i className="bi bi-calendar-plus-fill me-1"></i> Agendar Cita Presencial
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {/* Tarjetas de números (se ordenan de 1 a 4 columnas según el ancho de la pantalla) */}
        <MetricCard columnas="col-12 col-sm-6 col-xl-3" icono="bi-hourglass-split" color="warning" etiqueta="Solicitudes por Confirmar" valor={pendientesConfirmar} />
        <MetricCard columnas="col-12 col-sm-6 col-xl-3" icono="bi-calendar-week-fill" color="primary" etiqueta="Citas para Hoy" valor={citasHoy} />
        <MetricCard columnas="col-12 col-sm-6 col-xl-3" icono="bi-cash-coin" color="danger" etiqueta="Cuentas por Cobrar" valor={porCobrar} />
        <MetricCard columnas="col-12 col-sm-6 col-xl-3" icono="bi-check-circle-fill" color="success" etiqueta="Pagos Realizados" valor={pagados} />
      </div>

      <div className="mb-4">
        {/* Pestañas: al hacer clic cambio el estado "pestana" */}
        <div className="segmented-tabs-wrapper shadow-sm">
          <ul className="nav">
            {PESTANAS.map((p) => (
              <li className="nav-item" key={p.clave}>
                <button type="button" className={'nav-link' + (pestana === p.clave ? ' active' : '')} onClick={() => setPestana(p.clave)}>
                  <i className={`bi ${p.icono}`}></i> {p.etiqueta}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pestaña 1: agenda de citas */}
      {pestana === 'citas' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Citas Presenciales y Reservadas</h5>
            <input type="text" className="form-control form-control-sm w-auto" placeholder="Buscar por dueño, mascota o doctor..."
              value={busquedaCitas} onChange={(e) => setBusquedaCitas(e.target.value)} />
          </div>
          <div className="card-body px-4 pb-4">
            <TablaCitas
              citas={citasFiltradas}
              onConfirmar={(c) => setGestion({ cita: c, modo: 'confirmar' })}
              onReagendar={(c) => setGestion({ cita: c, modo: 'reagendar' })}
              onAnular={anular}
            />
          </div>
        </div>
      )}

      {/* Pestaña 2: caja y cobros */}
      {pestana === 'cobros' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
            <h5 className="fw-bold mb-0">Cobro de Tratamientos e Indicaciones Médicas</h5>
            <p className="text-muted small mb-0">Los tratamientos emitidos por los doctores se reflejan aquí para cobro en recepción.</p>
          </div>
          <div className="card-body px-4 pb-4">
            <Caja fichas={fichas} cajero={usuario.nombre} onPagar={pagar} />
          </div>
        </div>
      )}

      {/* Pestaña 3: fichas de pacientes */}
      {pestana === 'fichas' && (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-0">Fichas de Pacientes</h5>
              <p className="text-muted small mb-0">Registra pacientes nuevos y corrige los datos del dueño o de la mascota. El diagnóstico lo define el veterinario.</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <input type="text" className="form-control form-control-sm w-auto" placeholder="Buscar por mascota, dueño o ID..."
                value={busquedaFichas} onChange={(e) => setBusquedaFichas(e.target.value)} />
              <button className="btn btn-primary-custom btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={() => setFichaModal({ abierto: true, ficha: null })}>
                <i className="bi bi-plus-circle-fill me-1"></i> Nueva Ficha
              </button>
            </div>
          </div>
          <div className="card-body px-4 pb-4">
            <TablaFichas fichas={fichasFiltradas} onEditar={(f) => setFichaModal({ abierto: true, ficha: f })} />
          </div>
        </div>
      )}

      {/* Ventanas (modals): solo se ven cuando su estado está activo */}
      <ModalHorarios show={verHorarios} onHide={() => setVerHorarios(false)} />
      <ModalNuevaCita show={nuevaCita} onHide={() => setNuevaCita(false)} onGuardar={guardarCitaPresencial} />
      <ModalGestionCita
        show={!!gestion.cita}
        cita={gestion.cita}
        modo={gestion.modo}
        onHide={() => setGestion({ cita: null, modo: 'confirmar' })}
        onGuardar={guardarGestion}
      />
      <ModalFicha
        show={fichaModal.abierto}
        ficha={fichaModal.ficha}
        onHide={() => setFichaModal({ abierto: false, ficha: null })}
        onGuardar={guardarFicha}
      />
    </PanelLayout>
  );
}
