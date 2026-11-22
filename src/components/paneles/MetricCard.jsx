// Tarjeta con un número grande y un icono (ej: "Citas para Hoy: 3").
// La uso en los 4 paneles cambiando solo los datos que le paso.
// columnas dice cuánto ancho ocupa en la grilla de Bootstrap.
export default function MetricCard({ icono, color = 'primary', etiqueta, valor, columnas = 'col-12 col-md-4' }) {
  return (
    <div className={columnas}>
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
        <div className="d-flex align-items-center gap-3">
          {/* Círculo con el icono (el color cambia según la prop color) */}
          <div className={`rounded-circle p-3 bg-${color} bg-opacity-10 text-${color} fs-3`}>
            <i className={`bi ${icono}`}></i>
          </div>
          <div>
            <div className="text-muted small fw-semibold">{etiqueta}</div>
            <div className="fs-4 fw-bold">{valor}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
