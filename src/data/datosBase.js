// ==========================================================================
// DATOS BASE: son los datos con los que parte el sistema (la "semilla").
// Solo se usan cuando todavía no hay nada guardado en el navegador.
// ==========================================================================

// A qué panel mando a cada rol después de iniciar sesión
export const RUTA_POR_ROL = {
  administrador: '/panel-admin',
  veterinario: '/panel-veterinario',
  secretaria: '/panel-recepcion',
  cliente: '/panel-cliente',
};

// Cómo escribo el nombre de cada rol cuando lo muestro en pantalla
export const ETIQUETA_ROL = {
  administrador: 'Administrador',
  veterinario: 'Veterinario/a',
  secretaria: 'Secretaría / Recepción',
  cliente: 'Cliente',
};

// Usuarios que ya existen de fábrica (equipo de la clínica y 2 clientes de ejemplo)
export const USUARIOS_BASE = [
  { nombre: 'Dr. Daniel Morales', correo: 'daniel.morales@sanmarcos.cl', clave: 'Vet2026*', rol: 'veterinario', tipo: 'Base', activo: true },
  { nombre: 'Dra. Karla Fuentes', correo: 'karla.fuentes@sanmarcos.cl', clave: 'Vet2026*', rol: 'veterinario', tipo: 'Base', activo: true },
  { nombre: 'Dr. Kevin Silva', correo: 'kevin.silva@sanmarcos.cl', clave: 'Vet2026*', rol: 'veterinario', tipo: 'Base', activo: true },
  { nombre: 'Dr. Kevinne Navarro', correo: 'kevinne.navarro@sanmarcos.cl', clave: 'Vet2026*', rol: 'veterinario', tipo: 'Base', activo: true },
  { nombre: 'Camila Morales', correo: 'camila.recepcion@sanmarcos.cl', clave: 'Recep2026*', rol: 'secretaria', tipo: 'Base', activo: true },
  { nombre: 'Vicente Julio Zapata', correo: 'admin@sanmarcos.cl', clave: 'Admin2026*', rol: 'administrador', tipo: 'Base', activo: true },
  { nombre: 'Pedro Pascal', correo: 'pedro.pascal@gmail.com', clave: 'Cliente123*', rol: 'cliente', tipo: 'Base', activo: true },
  { nombre: 'Camila Vallejo', correo: 'camila.vallejo@veterinaria.cl', clave: 'Cliente123*', rol: 'cliente', tipo: 'Base', activo: true },
];

// Los 4 veterinarios con su especialidad, días de atención, turno y bloques de horario
export const DOCTORES = [
  {
    nombre: 'Dr. Daniel Morales',
    especialidad: 'Cirugía y Medicina General',
    dias: 'Lunes a Viernes',
    jornada: '09:00 a 14:00 hrs',
    bloques: ['09:00', '10:00', '11:30', '13:00'],
    color: 'primary',
  },
  {
    nombre: 'Dra. Karla Fuentes',
    especialidad: 'Dermatología y Alergias',
    dias: 'Lunes a Jueves',
    jornada: '14:00 a 19:00 hrs',
    bloques: ['14:30', '16:00', '17:30', '18:30'],
    color: 'info',
  },
  {
    nombre: 'Dr. Kevin Silva',
    especialidad: 'Traumatología y Rehabilitación',
    dias: 'Martes, Jueves y Sábados',
    jornada: '10:00 a 16:00 hrs',
    bloques: ['10:00', '11:30', '14:00', '15:30'],
    color: 'secondary',
  },
  {
    nombre: 'Dr. Kevinne Navarro',
    especialidad: 'Medicina Felina y Consulta Preventiva',
    dias: 'Lunes a Viernes',
    jornada: '11:00 a 18:00 hrs',
    bloques: ['11:00', '12:30', '15:00', '17:00'],
    color: 'success',
  },
];

// Bloques horarios que Recepción puede asignar al agendar o reagendar una cita
export const BLOQUES_HORARIOS = [
  '09:00 - 09:30',
  '10:00 - 10:30',
  '11:30 - 12:00',
  '14:30 - 15:00',
  '16:00 - 16:30',
  '17:30 - 18:00',
];

// Precios de los cobros que hace Recepción en la caja (concepto + monto + texto para el select)
export const ARANCELES = [
  { concepto: 'Consulta General + Tratamiento Básico', monto: 22000, etiqueta: 'Consulta Médica + Curación / Fármacos Básicos ($22.000)' },
  { concepto: 'Consulta Especialista + Tratamiento Extendido', monto: 30000, etiqueta: 'Consulta Especialidad + Tratamiento ($30.000)' },
  { concepto: 'Vacunación y Desparasitación', monto: 18500, etiqueta: 'Vacunación y Ficha Preventiva ($18.500)' },
  { concepto: 'Procedimiento de Urgencia', monto: 45000, etiqueta: 'Atención de Urgencia y Estabilización ($45.000)' },
];

// Formas de pago disponibles en la caja
export const METODOS_PAGO = [
  'Tarjeta de Débito (Redcompra)',
  'Tarjeta de Crédito',
  'Efectivo en Caja',
  'Transferencia Electrónica',
];

// Citas que ya estaban agendadas al partir el sistema (sirven de ejemplo)
export const CITAS_BASE = [
  {
    idCita: 'CIT-101', fecha: '2026-09-07', hora: '10:00 - 10:30',
    dueno: 'Pedro Pascal', telefono: '+56 9 9123 4567', correo: 'pedro.pascal@gmail.com',
    mascota: 'Rocky', especie: 'Canino', raza: 'Bulldog Francés', doctor: 'Dra. Karla Fuentes',
    motivo: 'Control dermatológico de alergia cutánea.', estado: 'Confirmada',
  },
  {
    idCita: 'CIT-102', fecha: '2026-09-07', hora: '11:30 - 12:00',
    dueno: 'Camila Vallejo', telefono: '+56 9 8765 4321', correo: 'camila.vallejo@veterinaria.cl',
    mascota: 'Michi', especie: 'Felino', raza: 'Siamés', doctor: 'Dr. Kevinne Navarro',
    motivo: 'Revisión anual y refuerzo de antiparasitario.', estado: 'Confirmada',
  },
  {
    idCita: 'CIT-103', fecha: '2026-09-08', hora: '16:00 - 16:30',
    dueno: 'Jorge Carmona', telefono: '+56 9 5544 3322', correo: 'jorge@gm.cl',
    mascota: 'Coco', especie: 'Canino', raza: 'Poodle Toy', doctor: 'Dr. Daniel Morales',
    motivo: 'Limpieza y revisión de oídos por otitis.', estado: 'Confirmada',
  },
];

// Reservas antiguas que bloquean horarios en el formulario "Agendar Cita"
export const CITAS_RESERVADAS_FIJAS = [
  { dueno: 'Pedro Pascal', correo: 'pedro.pascal@gmail.com', mascota: 'Rocco', fecha: '2026-09-08', hora: '10:00' },
  { dueno: 'Camila Vallejo', correo: 'camila.vallejo@veterinaria.cl', mascota: 'Mimi', fecha: '2026-09-08', hora: '11:30' },
  { dueno: 'Alexis Sanchez', correo: 'alexis.sanchez@hotmail.com', mascota: 'Humber', fecha: '2026-09-09', hora: '15:00' },
  { dueno: 'Mon Laferte', correo: 'mon.laferte@musica.cl', mascota: 'Luna', fecha: '2026-09-10', hora: '16:30' },
];

// Fichas clínicas de ejemplo: las mascotas de Pedro Pascal, Camila Vallejo y otros clientes
export const FICHAS_BASE = [
  {
    id: 'PAC-001', mascota: 'Rocky', especie: 'Canino', raza: 'Bulldog Francés', edad: '3 años', peso: '12.5 kg',
    dueno: 'Pedro Pascal', telefono: '+56 9 9123 4567', correo: 'pedro.pascal@gmail.com',
    condiciones: 'Sensibilidad estomacal, intolerancia a granos.',
    problema: 'Dermatitis atópica con prurito en patas y zona abdominal.',
    tratamiento: 'Apoquel 5.4mg cada 12 hrs por 7 días. Baño con shampoo de clorhexidina 2 veces por semana.',
    estado: 'En Tratamiento', pagado: true,
  },
  {
    id: 'PAC-002', mascota: 'Max', especie: 'Canino', raza: 'Golden Retriever', edad: '5 años', peso: '31.2 kg',
    dueno: 'Pedro Pascal', telefono: '+56 9 9123 4567', correo: 'pedro.pascal@gmail.com',
    condiciones: 'Displasia de cadera leve en articulación izquierda.',
    problema: 'Dolor articular posterior tras ejercicio intenso.',
    tratamiento: 'Condroprotectores Artroflex 1 comprimido al día por 30 días. Reposo moderado y paseos suaves.',
    estado: 'En Tratamiento', pagado: false,
  },
  {
    id: 'PAC-003', mascota: 'Mia', especie: 'Felino', raza: 'Angora Turco', edad: '2 años', peso: '3.9 kg',
    dueno: 'Pedro Pascal', telefono: '+56 9 9123 4567', correo: 'pedro.pascal@gmail.com',
    condiciones: 'Esterilizada, vacunación séxtuple al día.',
    problema: 'Control de rutina y prevención de bolas de pelo.',
    tratamiento: 'Pasta de Malta felina 2 cm vía oral 3 veces por semana. Cepillado diario de pelaje.',
    estado: 'Finalizado', pagado: true,
  },
  {
    id: 'PAC-004', mascota: 'Michi', especie: 'Felino', raza: 'Siamés', edad: '5 años', peso: '4.2 kg',
    dueno: 'Camila Vallejo', telefono: '+56 9 8765 4321', correo: 'camila.vallejo@veterinaria.cl',
    condiciones: 'Sin antecedentes crónicos registrados.',
    problema: 'Control de rutina y vacunación anual antirrábica.',
    tratamiento: 'Se administra vacuna antirrábica y desparasitación interna con Pipeta Broadline.',
    estado: 'Finalizado', pagado: true,
  },
  {
    id: 'PAC-005', mascota: 'Coco', especie: 'Canino', raza: 'Poodle Toy', edad: '7 años', peso: '5.1 kg',
    dueno: 'Jorge Carmona', telefono: '+56 9 5544 3322', correo: 'jorge@gm.cl',
    condiciones: 'Soplo cardiaco grado I.',
    problema: 'Otitis externa bilateral con secreción ceruminosa.',
    tratamiento: 'Limpieza ótica con Otoclean + gotas Otovet 4 gotas cada 12 hrs por 10 días.',
    estado: 'En Tratamiento', pagado: false,
  },
  {
    id: 'PAC-006', mascota: 'Luna', especie: 'Felino', raza: 'Común Europeo', edad: '2 años', peso: '3.8 kg',
    dueno: 'Alex Cabeño', telefono: '+56 9 4433 2211', correo: 'poto@duocuc.cl',
    condiciones: 'Esterilizada, vacunas al día.',
    problema: 'Cojera leve en pata trasera derecha por salto accidental.',
    tratamiento: 'Meloxicam gotas (0.1mg/kg) por 3 días y reposo preventivo.',
    estado: 'En Tratamiento', pagado: false,
  },
];
