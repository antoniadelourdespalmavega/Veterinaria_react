import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

// ==========================================================================
// DataContext: aquí tengo los datos principales del sistema (usuarios, citas y fichas clínicas).
// Los datos ya NO viven en el navegador: están en la base de datos del backend (Spring Boot).
// Este archivo los pide a la API REST y la API los guarda. Todos los paneles leen este mismo estado,
// entonces si Recepción confirma una cita, el cliente la ve actualizada.
// Las reglas de negocio (choque de horarios, domingos, correo repetido...) las valida el BACKEND.
// Cada acción devuelve un texto con el error si algo salió mal, o null si salió bien.
// ==========================================================================

// Creo la caja compartida de datos
const DataContext = createContext(null);

// Este componente envuelve la app y reparte los datos y las acciones a todas las pantallas
export function DataProvider({ children }) {
  // Quién está conectado: según su rol pido unos datos u otros
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [fichas, setFichas] = useState([]);

  // Pide a la API las citas y fichas (el cliente solo recibe las suyas) y, si es administrador, los usuarios.
  const recargar = useCallback(async () => {
    if (!usuario) return;
    try {
      const [listaCitas, listaFichas, listaUsuarios] = await Promise.all([
        api('/api/citas'),
        api('/api/fichas'),
        usuario.rol === 'administrador' ? api('/api/usuarios') : Promise.resolve([]),
      ]);
      setCitas(listaCitas);
      setFichas(listaFichas);
      setUsuarios(listaUsuarios);
    } catch {
      /* si falla (sin conexión o sesión vencida) se mantienen los datos actuales */
    }
  }, [usuario]);

  // Al iniciar sesión (o recargar la página con la sesión activa) cargo los datos desde la base de datos.
  // Al cerrar sesión vacío todo, para no dejar datos de otra persona en memoria.
  useEffect(() => {
    if (usuario) {
      recargar();
    } else {
      setUsuarios([]);
      setCitas([]);
      setFichas([]);
    }
  }, [usuario, recargar]);

  // Ejecuta una petición, actualiza la lista de datos y devuelve null si salió bien o el mensaje de error
  const ejecutar = useCallback(
    async (peticion) => {
      try {
        await peticion();
        await recargar();
        return null;
      } catch (e) {
        return e.message;
      }
    },
    [recargar]
  );

  // Acciones sobre USUARIOS (las usa el panel del administrador y el registro)
  // ------------------------------------------------------------------ USUARIOS
  // Busca un usuario por correo sin importar mayúsculas (dentro de la lista que recibí)
  const buscarUsuario = useCallback(
    (correo) => usuarios.find((u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase()),
    [usuarios]
  );

  // Crea un usuario con cualquier rol (lo usa el administrador)
  const crearUsuario = useCallback(
    ({ nombre, correo, rol, clave, tipo }) =>
      ejecutar(() => api('/api/usuarios', { metodo: 'POST', cuerpo: { nombre, correo, rol, clave, tipo } })),
    [ejecutar]
  );

  // Registro de un cliente nuevo desde la pantalla "Crear Cuenta". Siempre queda con rol cliente.
  // Es público: no necesita sesión.
  const registrarCliente = useCallback(async ({ nombre, telefono, correo, clave }) => {
    try {
      await api('/api/auth/registro', { metodo: 'POST', cuerpo: { nombre, telefono, correo, clave } });
      return null;
    } catch (e) {
      return e.message;
    }
  }, []);

  // Edita nombre, correo y rol de un usuario. La contraseña y el estado (activo) se mantienen.
  const editarUsuario = useCallback(
    (correoOriginal, { nombre, correo, rol }) => {
      const original = buscarUsuario(correoOriginal);
      if (!original) return Promise.resolve('No se encontró el usuario.');
      return ejecutar(() => api(`/api/usuarios/${original.id}`, { metodo: 'PUT', cuerpo: { nombre, correo, rol } }));
    },
    [buscarUsuario, ejecutar]
  );

  // Desactiva o reactiva una cuenta. No la borro, solo cambio "activo".
  // Una cuenta desactivada no puede iniciar sesión.
  const alternarActivo = useCallback(
    (correo) => {
      const u = buscarUsuario(correo);
      if (!u) return Promise.resolve('No se encontró el usuario.');
      return ejecutar(() => api(`/api/usuarios/${u.id}/activo`, { metodo: 'PATCH' }));
    },
    [buscarUsuario, ejecutar]
  );

  // Acciones sobre CITAS (las usan Recepción, el cliente y el formulario de agendar)
  // -------------------------------------------------------------------- CITAS
  // Pregunta al backend si ya hay algo reservado ese día y hora (las citas anuladas liberan el horario).
  // Devuelve true o false.
  const horarioOcupado = useCallback(async (fecha, horaInicio) => {
    try {
      const horas = await api(`/api/citas/horarios-ocupados?fecha=${encodeURIComponent(fecha)}`);
      return horas.includes(String(horaInicio).substring(0, 5));
    } catch {
      return false;
    }
  }, []);

  // Solicitud que hace un cliente desde la web. Queda "Pendiente" hasta que Recepción la confirme,
  // y todavía sin veterinario asignado. Es pública: no necesita sesión.
  const solicitarCita = useCallback(
    async ({ dueno, correo, mascota, fecha, hora, motivo }) => {
      try {
        await api('/api/citas/solicitud', { metodo: 'POST', cuerpo: { dueno, correo, mascota, fecha, hora, motivo } });
        await recargar();
        return null;
      } catch (e) {
        return e.message;
      }
    },
    [recargar]
  );

  // Cita que crea Recepción cuando el cliente va en persona. Nace "Confirmada";
  // el backend revisa que el veterinario no tenga otra cita en ese bloque.
  const agendarCitaPresencial = useCallback(
    (datos) => ejecutar(() => api('/api/citas', { metodo: 'POST', cuerpo: datos })),
    [ejecutar]
  );

  // Sirve para dos cosas: confirmar una solicitud pendiente o reagendar una cita ya confirmada.
  // El backend valida fecha obligatoria, no pasada, no domingo y sin choque de horario.
  const gestionarCita = useCallback(
    (idCita, { doctor, fecha, hora }, modo) =>
      ejecutar(() => api(`/api/citas/${idCita}/gestion`, { metodo: 'PUT', cuerpo: { doctor, fecha, hora, modo } })),
    [ejecutar]
  );

  // Anula o rechaza una cita (cambio el estado a Cancelada, no la borro)
  const anularCita = useCallback((idCita) => ejecutar(() => api(`/api/citas/${idCita}/anular`, { metodo: 'PATCH' })), [ejecutar]);

  // Acciones sobre FICHAS clínicas de los pacientes
  // ------------------------------------------------------------------- FICHAS
  // Crea una ficha nueva (el backend le pone el id PAC-xxx y la deja no pagada)
  const crearFicha = useCallback((datos) => ejecutar(() => api('/api/fichas', { metodo: 'POST', cuerpo: datos })), [ejecutar]);

  // Actualiza solo los campos que le paso en "cambios": los junto con la ficha actual y envío la ficha completa
  const actualizarFicha = useCallback(
    (id, cambios) => {
      const actual = fichas.find((f) => f.id === id);
      return ejecutar(() => api(`/api/fichas/${id}`, { metodo: 'PUT', cuerpo: { ...actual, ...cambios } }));
    },
    [fichas, ejecutar]
  );

  // Aquí junto todo lo que quiero que puedan usar las pantallas: datos y acciones
  const valor = {
    usuarios, citas, fichas,
    buscarUsuario, crearUsuario, registrarCliente, editarUsuario, alternarActivo,
    horarioOcupado, solicitarCita, agendarCitaPresencial, gestionarCita, anularCita,
    crearFicha, actualizarFicha, recargar,
  };

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

// Atajo para usar los datos en cualquier componente: const { citas, anularCita } = useData();
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
