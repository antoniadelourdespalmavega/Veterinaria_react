import { useMemo, useState } from 'react';
import ModalUsuario from '../components/admin/ModalUsuario';
import ReportesAdmin from '../components/admin/ReportesAdmin';
import TablaUsuarios from '../components/admin/TablaUsuarios';
import MetricCard from '../components/paneles/MetricCard';
import PanelLayout from '../components/paneles/PanelLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Panel del Administrador: aquí crea, edita y desactiva usuarios, les asigna el rol y ve los reportes.
export default function PanelAdmin() {
  // Quién está conectado (para no dejarlo desactivarse a sí mismo)
  const { usuario, actualizarSesion } = useAuth();
  // Los datos y las acciones los saco del DataContext
  const { usuarios, citas, fichas, crearUsuario, editarUsuario, alternarActivo } = useData();

  // Texto que escribe en el buscador
  const [busqueda, setBusqueda] = useState('');
  // Controla la ventana de crear/editar: si está abierta y qué usuario edita (null = crear uno nuevo)
  const [modal, setModal] = useState({ abierto: false, usuario: null }); // usuario = null -> creación

  // Filtro los usuarios por nombre o correo según lo que se escribió en el buscador
  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return usuarios.filter((u) => u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }, [usuarios, busqueda]);

  // Se ejecuta al enviar el formulario del modal: edita o crea según corresponda.
  // Si hay error lo devuelvo para que el modal lo muestre.
  const guardar = (datos) => {
    const error = modal.usuario
      ? editarUsuario(modal.usuario.correo, datos)
      : crearUsuario(datos);
    if (error) return error;

    // Si el administrador edita su propio usuario, actualizo también su sesión para que arriba se vea el cambio
    if (modal.usuario && usuario.correo.toLowerCase() === modal.usuario.correo.toLowerCase()) {
      actualizarSesion({ nombre: datos.nombre.trim(), correo: datos.correo.trim().toLowerCase(), rol: datos.rol });
    }
    setModal({ abierto: false, usuario: null });
    return null;
  };

  // Antes de desactivar o reactivar una cuenta pregunto si está seguro (confirm)
  const alternar = (u) => {
    const accion = u.activo ? 'desactivar' : 'reactivar';
    if (window.confirm(`¿Deseas ${accion} la cuenta de ${u.nombre} (${u.correo})?`)) alternarActivo(u.correo);
  };

  return (
    // PanelLayout es el marco común de los paneles (barra de arriba, pie de página)
    <PanelLayout marca="Panel de Control" cargo="Cargo: Administrador" icono="bi-person-circle" pie="Todos los derechos reservados.">
      {/* Título y botón para crear un usuario */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-0">Resumen y Gestión General</h3>
          <p className="text-muted small mb-0">Crea, edita y desactiva usuarios, asigna roles y revisa los reportes del sistema.</p>
        </div>
        <button className="btn btn-primary-custom rounded-pill px-4 fw-bold shadow-sm" onClick={() => setModal({ abierto: true, usuario: null })}>
          <i className="bi bi-person-plus-fill me-1"></i> Crear Usuario
        </button>
      </div>

      <div className="row g-3 mb-4">
        {/* Tarjetas con números. Cada una calcula su valor filtrando la lista de usuarios. */}
        <MetricCard columnas="col-12 col-md-6 col-xl-3" icono="bi-people-fill" color="primary" etiqueta="Total Cuentas" valor={usuarios.length} />
        <MetricCard columnas="col-12 col-md-6 col-xl-3" icono="bi-heart-pulse-fill" color="info" etiqueta="Equipo Médico" valor={usuarios.filter((u) => u.rol === 'veterinario').length} />
        <MetricCard columnas="col-12 col-md-6 col-xl-3" icono="bi-person-badge-fill" color="success" etiqueta="Clientes Registrados" valor={usuarios.filter((u) => u.rol === 'cliente').length} />
        <MetricCard columnas="col-12 col-md-6 col-xl-3" icono="bi-person-slash" color="secondary" etiqueta="Cuentas Desactivadas" valor={usuarios.filter((u) => !u.activo).length} />
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="fw-bold mb-0">Directorio de Usuarios del Sistema</h5>
          <input
            type="text" className="form-control form-control-sm w-auto" placeholder="Buscar por nombre o correo..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="card-body px-4 pb-4">
          {/* La tabla recibe los usuarios filtrados y me avisa cuando presionan editar o activar/desactivar */}
          <TablaUsuarios
            usuarios={filtrados}
            correoSesion={usuario.correo}
            onEditar={(u) => setModal({ abierto: true, usuario: u })}
            onAlternar={alternar}
          />
        </div>
      </div>

      {/* Reportes de todo el sistema */}
      <ReportesAdmin usuarios={usuarios} citas={citas} fichas={fichas} />

      {/* Ventana para crear o editar (se abre cuando modal.abierto es true) */}
      <ModalUsuario
        show={modal.abierto}
        usuario={modal.usuario}
        onHide={() => setModal({ abierto: false, usuario: null })}
        onGuardar={guardar}
      />
    </PanelLayout>
  );
}
