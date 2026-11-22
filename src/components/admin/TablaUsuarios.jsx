import { ETIQUETA_ROL } from '../../data/datosBase';

// Color de la etiqueta de cada rol
const CLASE_ROL = {
  administrador: 'bg-danger',
  veterinario: 'bg-info text-dark',
  secretaria: 'bg-warning text-dark',
  cliente: 'bg-success',
};

// Tabla con todos los usuarios del sistema. No guarda datos propios, solo los muestra.
// Recibe la lista ya filtrada, el correo de quien está conectado (para que no pueda desactivarse a sí mismo)
// y dos funciones: onEditar y onAlternar (activar/desactivar), que se ejecutan al presionar los botones.
export default function TablaUsuarios({ usuarios, correoSesion, onEditar, onAlternar }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle table-hover mb-0">
        {/* Encabezados de la tabla */}
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th>Usuario</th>
            <th>Correo Electrónico</th>
            <th>Rol / Cargo</th>
            <th>Origen</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Si no hay usuarios (por ejemplo, una búsqueda sin resultados) muestro un mensaje */}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">No se encontraron usuarios coincidentes.</td>
            </tr>
          )}
          {usuarios.map((u) => {
            // Veo si esta fila es el usuario conectado: a él no le muestro el botón de desactivar
            const esSesion = correoSesion && u.correo.toLowerCase() === correoSesion.toLowerCase();
            return (
              // Una fila por cada usuario (el correo no se repite, por eso lo uso de key)
              <tr key={u.correo}>
                <td><div className="fw-bold">{u.nombre}</div></td>
                <td>{u.correo}</td>
                <td><span className={`badge ${CLASE_ROL[u.rol] || 'bg-secondary'} text-uppercase`}>{ETIQUETA_ROL[u.rol] || u.rol}</span></td>
                <td><span className="small text-muted">{u.tipo}</span></td>
                <td>
                  {/* Etiqueta verde si la cuenta está activa, gris si está desactivada */}
                  {u.activo ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle">Activo</span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary border">Desactivado</span>
                  )}
                </td>
                <td className="text-center">
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-primary" title="Editar usuario" onClick={() => onEditar(u)}>
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    {/* Botón para desactivar o reactivar (cambia de color y de icono según el estado) */}
                    {!esSesion && (
                      <button
                        className={u.activo ? 'btn btn-outline-danger' : 'btn btn-outline-success'}
                        title={u.activo ? 'Desactivar usuario' : 'Reactivar usuario'}
                        onClick={() => onAlternar(u)}
                      >
                        <i className={u.activo ? 'bi bi-person-slash' : 'bi bi-person-check-fill'}></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
