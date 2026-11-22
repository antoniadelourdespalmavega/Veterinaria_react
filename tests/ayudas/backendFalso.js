import { CITAS_BASE, FICHAS_BASE, USUARIOS_BASE } from '../../src/data/datosBase';

// ---------------------------------------------------------------------
// BACKEND FALSO para las pruebas. Este archivo NO es una prueba.
//
// La aplicación real le pide los datos a la API de Spring Boot con fetch. En las pruebas no quiero
// depender de que el backend esté encendido (ni ensuciar su base de datos), así que reemplazo
// window.fetch por una función espía (MOCK) que responde como lo haría la API:
// mismas rutas, mismos mensajes de error y las mismas reglas de negocio (choque de horario,
// domingos, correo repetido...). Los datos viven en memoria y se reinician en cada prueba.
// ---------------------------------------------------------------------

let db;

// Copia profunda de los datos iniciales (así una prueba no ensucia a la siguiente)
const copiar = (x) => JSON.parse(JSON.stringify(x));

// Arma los datos iniciales. "extra" permite que una prueba parta con datos distintos (por ejemplo,
// una cita pendiente): { usuarios, citas, fichas } reemplazan a los datos base.
function datosIniciales(extra = {}) {
  return {
    usuarios: copiar(extra.usuarios || USUARIOS_BASE).map((u, i) => ({ id: i + 1, tipo: 'Base', activo: true, ...u })),
    citas: copiar(extra.citas || CITAS_BASE),
    fichas: copiar(extra.fichas || FICHAS_BASE),
    pedidos: [],
    contadorCitas: 0,
  };
}

// Respuesta falsa con la misma forma que usa utils/api.js (status, ok y json()).
// Devuelve una COPIA de los datos, como hace una API real al convertirlos a JSON: si devolviera la misma
// lista en memoria, React no notaría el cambio (compara por referencia) y no volvería a dibujar.
const responder = (estado, cuerpo) => ({
  status: estado,
  ok: estado >= 200 && estado < 300,
  json: async () => copiar(cuerpo),
});
const error = (estado, mensaje) => responder(estado, { mensaje });

// ---------------------------------------------------------------- reglas (las mismas del backend)
const fechaHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const esDomingo = (f) => new Date(f + 'T00:00:00').getDay() === 0;

function validarFecha(fecha) {
  if (!fecha) return 'Seleccione una fecha.';
  if (fecha < fechaHoy()) return 'La fecha no puede estar en el pasado.';
  if (esDomingo(fecha)) return 'La clínica no atiende los domingos (Lunes a Sábado).';
  return null;
}

const horasOcupadas = (fecha) =>
  db.citas.filter((c) => c.fecha === fecha && c.estado !== 'Cancelada').map((c) => String(c.hora).substring(0, 5));

const hayChoque = (doctor, fecha, hora, idPropio) =>
  db.citas.some((c) => c.idCita !== idPropio && c.estado === 'Confirmada' && c.doctor === doctor && c.fecha === fecha && c.hora === hora);

const nuevoIdFicha = () => {
  const max = db.fichas.reduce((m, f) => Math.max(m, parseInt(String(f.id).replace(/\D/g, ''), 10) || 0), 100);
  return 'PAC-' + String(max + 1).padStart(3, '0');
};

// ---------------------------------------------------------------- rutas de la API
function atender(metodo, ruta, cuerpo, quien) {
  const [camino, consulta] = ruta.split('?');
  const partes = camino.split('/').filter(Boolean); // ['api', 'citas', 'CIT-1', 'gestion']
  const [, recurso, id, accion] = partes;

  // ---- Autenticación
  if (recurso === 'auth') {
    if (id === 'login') {
      const u = db.usuarios.find((x) => x.correo.toLowerCase() === String(cuerpo.correo).toLowerCase());
      if (!u) return error(401, `El correo "${cuerpo.correo}" no se encuentra registrado en el sistema.`);
      if (u.clave !== cuerpo.clave) return error(401, 'La contraseña ingresada es incorrecta.');
      if (!u.activo) return error(403, 'Esta cuenta está desactivada. Contacta al administrador de la clínica.');
      return responder(200, { token: 'token-falso:' + u.correo, tokenRenovacion: 'renovacion-falsa', usuario: { nombre: u.nombre, correo: u.correo, rol: u.rol } });
    }
    if (id === 'registro') {
      if (db.usuarios.some((x) => x.correo.toLowerCase() === String(cuerpo.correo).toLowerCase())) {
        return error(409, 'Ya existe una cuenta asociada a este correo. Intenta iniciar sesión.');
      }
      const nuevo = { id: db.usuarios.length + 1, ...cuerpo, correo: cuerpo.correo.toLowerCase(), rol: 'cliente', tipo: 'Registro Web', activo: true };
      db.usuarios.push(nuevo);
      return responder(201, nuevo);
    }
  }

  // ---- Usuarios
  if (recurso === 'usuarios') {
    if (metodo === 'GET') return responder(200, db.usuarios.map(({ clave, ...resto }) => resto));
    if (metodo === 'POST') {
      if (db.usuarios.some((x) => x.correo.toLowerCase() === String(cuerpo.correo).toLowerCase())) return error(409, 'Ya existe un usuario con ese correo.');
      const nuevo = { id: db.usuarios.length + 1, tipo: cuerpo.tipo || 'Personal Clínico', ...cuerpo, correo: cuerpo.correo.toLowerCase(), activo: true };
      db.usuarios.push(nuevo);
      return responder(201, nuevo);
    }
    const u = db.usuarios.find((x) => String(x.id) === id);
    if (!u) return error(404, 'No se encontró el usuario.');
    if (metodo === 'PUT') {
      Object.assign(u, { nombre: cuerpo.nombre, correo: cuerpo.correo.toLowerCase(), rol: cuerpo.rol });
      return responder(200, u);
    }
    if (metodo === 'PATCH' && accion === 'activo') {
      u.activo = !u.activo;
      return responder(200, u);
    }
  }

  // ---- Citas
  if (recurso === 'citas') {
    if (metodo === 'GET' && id === 'horarios-ocupados') return responder(200, horasOcupadas(new URLSearchParams(consulta).get('fecha')));
    // Igual que el backend: el cliente solo recibe SUS citas (por su correo); el personal recibe todas
    if (metodo === 'GET') return responder(200, quien?.rol === 'cliente' ? db.citas.filter((c) => c.correo === quien.correo) : db.citas);
    if (metodo === 'POST' && id === 'solicitud') {
      const msg = validarFecha(cuerpo.fecha);
      if (msg) return error(400, msg);
      if (horasOcupadas(cuerpo.fecha).includes(String(cuerpo.hora).substring(0, 5))) {
        return error(409, `¡HORA NO DISPONIBLE! El día ${cuerpo.fecha} a las ${cuerpo.hora} ya está reservado. Elige otro horario.`);
      }
      const nueva = {
        ...cuerpo, idCita: 'CIT-T-' + ++db.contadorCitas, telefono: 'Sin registrar', correo: cuerpo.correo.toLowerCase(),
        especie: 'Por definir', raza: 'Por definir', doctor: 'Por asignar', estado: 'Pendiente',
      };
      db.citas.unshift(nueva);
      return responder(201, nueva);
    }
    if (metodo === 'POST') {
      const msg = validarFecha(cuerpo.fecha);
      if (msg) return error(400, msg);
      if (hayChoque(cuerpo.doctor, cuerpo.fecha, cuerpo.hora)) {
        return error(409, `${cuerpo.doctor} ya tiene una cita reservada el día ${cuerpo.fecha} en el bloque ${cuerpo.hora}. Seleccione otro bloque o doctor.`);
      }
      const nueva = { ...cuerpo, idCita: 'CIT-T-' + ++db.contadorCitas, correo: cuerpo.correo.toLowerCase(), estado: 'Confirmada' };
      db.citas.unshift(nueva);
      return responder(201, nueva);
    }
    const c = db.citas.find((x) => x.idCita === id);
    if (!c) return error(404, 'No se encontró la cita.');
    if (metodo === 'PUT' && accion === 'gestion') {
      const msg = validarFecha(cuerpo.fecha);
      if (msg) return error(400, msg);
      if (hayChoque(cuerpo.doctor, cuerpo.fecha, cuerpo.hora, id)) {
        return error(409, `${cuerpo.doctor} ya tiene una cita reservada el día ${cuerpo.fecha} en el bloque ${cuerpo.hora}. Seleccione otro bloque o doctor.`);
      }
      if (cuerpo.modo === 'reagendar') c.fechaAnterior = `${c.fecha} ${c.hora} con ${c.doctor}`;
      Object.assign(c, { doctor: cuerpo.doctor, fecha: cuerpo.fecha, hora: cuerpo.hora, estado: 'Confirmada' });
      return responder(200, c);
    }
    if (metodo === 'PATCH' && accion === 'anular') {
      c.estado = 'Cancelada';
      return responder(200, c);
    }
  }

  // ---- Pedidos (compras de la tienda)
  if (recurso === 'pedidos') {
    if (metodo === 'POST') {
      if (!cuerpo.items || cuerpo.items.length === 0) return error(400, 'El pedido debe tener al menos un producto.');
      const nuevo = { ...cuerpo, id: db.pedidos.length + 1, total: cuerpo.items.reduce((t, i) => t + i.precio, 0) };
      db.pedidos.push(nuevo);
      return responder(201, nuevo);
    }
    if (metodo === 'GET') return responder(200, db.pedidos);
  }

  // ---- Fichas
  if (recurso === 'fichas') {
    // Igual que el backend: el cliente solo recibe las fichas de SUS mascotas
    if (metodo === 'GET') return responder(200, quien?.rol === 'cliente' ? db.fichas.filter((x) => x.correo === quien.correo) : db.fichas);
    if (metodo === 'POST') {
      const nueva = { ...cuerpo, id: nuevoIdFicha(), pagado: false };
      db.fichas.unshift(nueva);
      return responder(201, nueva);
    }
    const i = db.fichas.findIndex((f) => f.id === id);
    if (i < 0) return error(404, 'No se encontró la ficha.');
    if (metodo === 'PUT') {
      db.fichas[i] = { ...cuerpo, id };
      return responder(200, db.fichas[i]);
    }
  }

  return error(404, 'Ruta no encontrada en el backend falso: ' + metodo + ' ' + ruta);
}

// ---------------------------------------------------------------- uso desde las pruebas
// Reemplaza window.fetch por el backend falso y parte con los datos base (o los que le pase).
// Jasmine deshace el espía solo al terminar cada prueba.
export function instalarBackendFalso(extra) {
  db = datosIniciales(extra);
  spyOn(window, 'fetch').and.callFake(async (url, opciones = {}) => {
    const ruta = String(url).replace(/^https?:\/\/[^/]+/, '');
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : undefined;
    // El token falso lleva el correo de quien pidió: 'Bearer token-falso:correo'
    const correoToken = String(opciones.headers?.Authorization || '').replace('Bearer token-falso:', '');
    const quien = db.usuarios.find((u) => u.correo === correoToken);
    return atender(opciones.method || 'GET', ruta, cuerpo, quien);
  });
}

// Cambia los datos del backend falso a mitad de una prueba (por ejemplo, para dejar una cita pendiente)
export function precargarBackendFalso(extra) {
  db = datosIniciales(extra);
}

// Lo que hay guardado "en la base de datos" falsa (sirve para comprobar que algo se guardó)
export const datosGuardados = () => db;
