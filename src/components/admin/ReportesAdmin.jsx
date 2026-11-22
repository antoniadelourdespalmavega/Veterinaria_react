import { useMemo } from 'react';
import { ETIQUETA_ROL } from '../../data/datosBase';
import { clp } from '../../utils/formato';

// Cuenta cuántos elementos hay por cada valor de un campo.
// Ejemplo: contarPor(citas, "estado") -> { Confirmada: 3, Pendiente: 1 }
function contarPor(lista, campo) {
  const conteo = {};
  lista.forEach((x) => {
    const k = x[campo] || 'Sin dato';
    conteo[k] = (conteo[k] || 0) + 1;
  });
  return conteo;
}

// Una tarjeta de reporte: un título y una tabla chica con concepto y valor
function TarjetaReporte({ titulo, icono, datos, vacio }) {
  const filas = Object.entries(datos);
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className="card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body">
          <h6 className="fw-bold mb-3"><i className={`bi ${icono} me-2 text-primary`}></i>{titulo}</h6>
          <table className="table table-sm mb-0">
            <tbody>
              {filas.length === 0 && (
                <tr><td colSpan="2" className="text-muted text-center">{vacio}</td></tr>
              )}
              {filas.map(([concepto, valor]) => (
                <tr key={concepto}>
                  <td>{concepto}</td>
                  <td className="text-end fw-bold">{valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Icono de cada tarjeta de reporte
const ICONOS = {
  'Usuarios por rol': 'bi-people-fill',
  'Estado de citas': 'bi-calendar2-check-fill',
  'Citas vigentes por veterinario': 'bi-heart-pulse-fill',
  'Pacientes por especie': 'bi-shield-heart-fill',
  'Ingresos y cobranza': 'bi-cash-coin',
  Cuentas: 'bi-person-check-fill',
};

// Mensaje que muestro cuando un reporte no tiene datos
const VACIOS = {
  'Estado de citas': 'Sin citas registradas',
  'Citas vigentes por veterinario': 'Sin citas asignadas',
  'Pacientes por especie': 'Sin fichas registradas',
};

// Sección de reportes del administrador: usuarios por rol, estado de las citas,
// citas por veterinario, pacientes por especie, ingresos y cuentas activas.
// Recibe usuarios, citas y fichas, y con eso calculo todos los números.
export default function ReportesAdmin({ usuarios, citas, fichas }) {
  // Calculo todos los resúmenes. Uso useMemo para que solo se recalculen cuando cambian los datos.
  const reportes = useMemo(() => {
    const porRol = {};
    usuarios.forEach((u) => {
      const k = ETIQUETA_ROL[u.rol] || u.rol;
      porRol[k] = (porRol[k] || 0) + 1;
    });
    const activos = usuarios.filter((u) => u.activo).length;
    // Las fichas pagadas son las que tienen detalle de pago; sumo sus montos para el total recaudado
    const pagadas = fichas.filter((f) => f.pagado && f.detallePago);
    const ingresos = pagadas.reduce((t, f) => t + (parseInt(f.detallePago.monto, 10) || 0), 0);

    return {
      'Usuarios por rol': porRol,
      'Estado de citas': contarPor(citas, 'estado'),
      'Citas vigentes por veterinario': contarPor(citas.filter((c) => c.estado !== 'Cancelada'), 'doctor'),
      'Pacientes por especie': contarPor(fichas, 'especie'),
      'Ingresos y cobranza': {
        'Pagos registrados': pagadas.length,
        'Cuentas por cobrar': fichas.filter((f) => !f.pagado).length,
        'Total recaudado': clp(ingresos),
      },
      Cuentas: {
        Activas: activos,
        Desactivadas: usuarios.length - activos,
        'Pacientes en tratamiento': fichas.filter((f) => f.estado === 'En Tratamiento').length,
      },
    };
  }, [usuarios, citas, fichas]);

  // Genera un archivo CSV (se abre en Excel) con todos los reportes y lo descarga.
  // Creo un enlace invisible, le hago clic y lo borro.
  const exportarCSV = () => {
    const filas = [['Sección', 'Concepto', 'Valor']];
    Object.entries(reportes).forEach(([seccion, datos]) => {
      Object.entries(datos).forEach(([k, v]) => filas.push([seccion, k, v]));
    });
    // Armo el texto del CSV: cada valor entre comillas y separado por punto y coma
    const csv = filas.map((f) => f.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
    // El \uFEFF del inicio es para que Excel muestre bien las tildes y la ñ
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'reporte_san_marcos_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  };

  return (
    <>
      {/* Título de la sección y botón para exportar */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h5 className="fw-bold mb-0">Reportes del Sistema</h5>
          <p className="text-muted small mb-0">Resumen de usuarios, citas, pacientes e ingresos de toda la clínica.</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4 fw-semibold shadow-sm" onClick={exportarCSV}>
          <i className="bi bi-download me-1"></i> Exportar CSV
        </button>
      </div>
      <div className="row g-3 mb-4">
        {/* Una tarjeta por cada reporte calculado */}
        {Object.entries(reportes).map(([titulo, datos]) => (
          <TarjetaReporte key={titulo} titulo={titulo} icono={ICONOS[titulo]} datos={datos} vacio={VACIOS[titulo] || 'Sin datos'} />
        ))}
      </div>
    </>
  );
}
