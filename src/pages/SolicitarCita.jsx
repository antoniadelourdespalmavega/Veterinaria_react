import { useState } from 'react';
import AlertaErrores from '../components/AlertaErrores';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { PATRON_SOLO_TEXTO, correoValido, esDomingo, hoyISO } from '../utils/validaciones';

// Servicios que se pueden elegir en el select
const SERVICIOS = [
  { valor: 'consulta', texto: 'Consulta General' },
  { valor: 'vacunacion', texto: 'Vacunación' },
  { valor: 'cirugia', texto: 'Cirugía Menor' },
  { valor: 'desparasitacion', texto: 'Desparasitación' },
  { valor: 'peso', texto: 'Control de Peso' },
];

// Formulario para solicitar una cita. Si hay un cliente con sesión iniciada, le relleno su nombre y correo.
// La solicitud queda "Pendiente" hasta que Recepción la confirme.
export default function SolicitarCita() {
  // Veo si hay alguien conectado
  const { usuario } = useAuth();
  // solicitarCita guarda la cita y horarioOcupado revisa si esa hora ya está tomada
  const { solicitarCita, horarioOcupado } = useData();

  // Valores con que parte el formulario (precargados si el usuario es cliente)
  const inicial = {
    dueno: usuario?.rol === 'cliente' ? usuario.nombre : '',
    correo: usuario?.rol === 'cliente' ? usuario.correo : '',
    mascota: '', servicio: '', fecha: '', hora: '',
  };
  // Lo que se va escribiendo
  const [form, setForm] = useState(inicial);
  // Lista de errores
  const [errores, setErrores] = useState([]);
  // Datos de la cita agendada para mostrar el mensaje verde
  const [exito, setExito] = useState(null);

  // Actualiza el campo que se está escribiendo
  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Valida todo el formulario y devuelve la lista de errores
  const validar = () => {
    const errs = [];
    // Regla para los nombres: obligatorios, solo letras y mínimo 3 caracteres
    const nombreOk = (valor, etiqueta) => {
      if (!valor.trim()) errs.push(`El campo "${etiqueta}" es obligatorio.`);
      else if (!PATRON_SOLO_TEXTO.test(valor.trim())) errs.push(`"${etiqueta}" solo debe contener letras.`);
      else if (valor.trim().length < 3) errs.push(`"${etiqueta}" debe tener al menos 3 letras.`);
    };
    nombreOk(form.dueno, 'Nombre del Dueño');

    if (!form.correo.trim()) errs.push('El campo "Correo Electrónico" es obligatorio.');
    else if (!correoValido(form.correo)) errs.push('Correo inválido (debe incluir "@" y terminar en ".cl" o ".com").');

    nombreOk(form.mascota, 'Nombre de la Mascota');
    if (!form.servicio) errs.push('Selecciona el tipo de servicio.');

    if (!form.fecha) errs.push('El campo "Fecha de Atención" es obligatorio.');
    else if (form.fecha < hoyISO()) errs.push('La fecha no puede ser en el pasado.');
    else if (esDomingo(form.fecha)) errs.push('La clínica no atiende los domingos (Lunes a Sábado).');

    if (!form.hora) errs.push('El campo "Hora de Atención" es obligatorio.');
    else {
      const [h, m] = form.hora.split(':').map(Number);
      if (h < 9 || h > 18 || (h === 18 && m > 30)) {
        errs.push('Horario fuera de atención (Atención de 09:00 a 19:00 hrs, última hora 18:30).');
      }
    }

    // Reviso si ya hay otra cita en ese día y hora (solo si lo demás está bien)
    if (form.fecha && form.hora && errs.length === 0) {
      const ocupada = horarioOcupado(form.fecha, form.hora);
      if (ocupada) {
        errs.push(`¡HORA NO DISPONIBLE! El día ${form.fecha} a las ${form.hora} ya está reservado por ${ocupada.dueno} (Mascota: ${ocupada.mascota}). Elige otro horario.`);
      }
    }
    return errs;
  };

  // Al presionar Agendar: valido y, si no hay errores, guardo la solicitud como Pendiente
  const agendar = () => {
    const errs = validar();
    setErrores(errs);
    if (errs.length > 0) {
      setExito(null);
      return;
    }
    const servicio = SERVICIOS.find((s) => s.valor === form.servicio);
    solicitarCita({
      dueno: form.dueno.trim(), correo: form.correo.trim(), mascota: form.mascota.trim(),
      fecha: form.fecha, hora: form.hora, motivo: servicio ? servicio.texto : 'Consulta',
    });
    setExito({ ...form });
  };

  // Vacía el formulario y los mensajes
  const limpiar = () => {
    setForm({ dueno: '', correo: '', mascota: '', servicio: '', fecha: '', hora: '' });
    setErrores([]);
    setExito(null);
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4">
              <h2 className="fw-bold section-title mb-3"><i className="bi bi-calendar2-plus me-2"></i>Agendar Cita</h2>

              {/* Formulario (los campos son controlados: su valor viene del estado "form") */}
              <form onSubmit={(e) => e.preventDefault()} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="dueno">Nombre del Dueño</label>
                    <input id="dueno" name="dueno" type="text" className="form-control" placeholder="Nombre del Dueño" value={form.dueno} onChange={cambiar} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="correo">Correo Electrónico</label>
                    <input id="correo" name="correo" type="email" className="form-control" placeholder="Correo Electrónico" value={form.correo} onChange={cambiar} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="mascota">Nombre de la Mascota</label>
                    <input id="mascota" name="mascota" type="text" className="form-control" placeholder="Nombre de la Mascota" value={form.mascota} onChange={cambiar} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="servicio">Tipo de Servicio</label>
                    <select id="servicio" name="servicio" className="form-select" value={form.servicio} onChange={cambiar}>
                      <option value="">Selecciona un servicio</option>
                      {SERVICIOS.map((s) => (
                        <option key={s.valor} value={s.valor}>{s.texto}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="fecha">Fecha de Atención</label>
                    <input id="fecha" name="fecha" type="date" className="form-control" min={hoyISO()} value={form.fecha} onChange={cambiar} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="hora">Hora de Atención</label>
                    <input id="hora" name="hora" type="time" className="form-control" value={form.hora} onChange={cambiar} />
                  </div>

                  <div className="col-12">
                    {/* Errores de validación */}
                    <AlertaErrores errores={errores} />
                    {/* Mensaje de éxito con el resumen de la cita */}
                    {exito && (
                      <div className="alert alert-success mt-3">
                        <strong>¡Cita agendada con éxito!</strong><br />
                        Dueño: {exito.dueno} ({exito.correo}) | Mascota: {exito.mascota}<br />
                        Día: {exito.fecha} a las {exito.hora} hrs.<br />
                        <small className="text-muted">Tu solicitud quedó <strong>pendiente</strong>: Recepción la confirmará y podrás ver su estado en tu portal.</small>
                      </div>
                    )}
                  </div>

                  <div className="col-12 d-flex gap-3 mt-3">
                    <button type="button" className="btn btn-primary-custom fw-bold px-4 py-2" onClick={agendar}>
                      <i className="bi bi-calendar2-check me-1"></i> Agendar
                    </button>
                    <button type="button" className="btn btn-secondary fw-bold px-4 py-2" onClick={limpiar}>
                      <i className="bi bi-eraser me-1"></i> Limpiar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
