import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  CITAS_BASE,
  CITAS_RESERVADAS_FIJAS,
  FICHAS_BASE,
  USUARIOS_BASE,
} from '../data/datosBase';
import { CLAVES, guardarLocal, leerLocal } from '../utils/almacenamiento';
import { correoValido, esDomingo, hoyISO } from '../utils/validaciones';

// ==========================================================================
// DataContext: aquí guardo los datos principales del sistema (usuarios, citas y fichas clínicas).
// Todos los paneles leen este mismo estado, entonces si Recepción confirma una cita,
// el cliente la ve actualizada al tiro. Cada cambio se guarda solo en localStorage.
// ==========================================================================

// Creo la caja compartida de datos
const DataContext = createContext(null);

// Junto los usuarios que vienen de fábrica con los que cambió el administrador.
// Si un correo está en las dos listas, gana el de localStorage (el modificado).
// Los marcados como "eliminado" no se muestran.
// Uso un Map con el correo como clave: si el correo se repite, el último reemplaza al primero
function combinarUsuarios(locales) {
  const mapa = new Map();
  USUARIOS_BASE.concat(locales).forEach((u) => mapa.set(u.correo.toLowerCase(), { ...u }));
  return [...mapa.values()]
    .filter((u) => !u.eliminado)
    .map((u) => ({ ...u, tipo: u.tipo || 'Registro Web', activo: u.activo !== false }));
}

// Contador para que cada id de cita sea único, aunque se creen varias en el mismo instante
let contadorId = 0;

// Este componente envuelve la app y reparte los datos y las acciones a todas las pantallas
export function DataProvider({ children }) {
  // Los tres estados principales. Si no hay nada guardado todavía, parto con los datos base (semilla).
  const [usuariosLocales, setUsuariosLocales] = useState(() => leerLocal(CLAVES.usuarios, []));
  const [citas, setCitas] = useState(() => leerLocal(CLAVES.citas, CITAS_BASE));
  const [fichas, setFichas] = useState(() => leerLocal(CLAVES.fichas, FICHAS_BASE));

  // Cada vez que cambia uno de estos estados lo guardo en localStorage, así no se pierde al recargar
  useEffect(() => guardarLocal(CLAVES.usuarios, usuariosLocales), [usuariosLocales]);
  useEffect(() => guardarLocal(CLAVES.citas, citas), [citas]);
  useEffect(() => guardarLocal(CLAVES.fichas, fichas), [fichas]);

  // Lista final de usuarios (base + modificados). Solo se recalcula si cambian los usuarios locales.
  const usuarios = useMemo(() => combinarUsuarios(usuariosLocales), [usuariosLocales]);

  // Acciones sobre USUARIOS (las usa el panel del administrador y el registro)
  // ------------------------------------------------------------------ USUARIOS
  // Busca un usuario por correo sin importar mayúsculas
  const buscarUsuario = useCallback(
    (correo) => usuarios.find((u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase()),
    [usuarios]
  );

  // Crea un usuario con cualquier rol (lo usa el administrador).
  // Devuelve un texto con el error si algo está mal, o null si se guardó bien.
  const crearUsuario = useCallback(
    ({ nombre, correo, rol, clave, tipo }) => {
      const mail = correo.trim().toLowerCase();
      // Valido los datos antes de guardar
      if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
      if (!correoValido(mail)) return 'El correo debe ser válido (@ y terminar en .cl o .com).';
      if (clave.trim().length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
      if (buscarUsuario(mail)) return 'Ya existe un usuario con ese correo.';

      setUsuariosLocales((prev) => [
        ...prev.filter((u) => u.correo.toLowerCase() !== mail),
        { nombre: nombre.trim(), correo: mail, clave: clave.trim(), rol, tipo: tipo || (rol === 'cliente' ? 'Creado por Admin' : 'Personal Clínico'), activo: true },
      ]);
      return null;
    },
    [buscarUsuario]
  );

  // Registro de un cliente nuevo desde la pantalla "Crear Cuenta". Siempre queda con rol cliente.
  const registrarCliente = useCallback(
    ({ nombre, telefono, correo, clave }) => {
      const mail = correo.trim().toLowerCase();
      if (buscarUsuario(mail)) return 'Ya existe una cuenta asociada a este correo. Intenta iniciar sesión.';
      setUsuariosLocales((prev) => [
        ...prev,
        { nombre: nombre.trim(), telefono: telefono.trim(), correo: mail, clave, rol: 'cliente', tipo: 'Registro Web', activo: true },
      ]);
      return null;
    },
    [buscarUsuario]
  );

  // Edita nombre, correo y rol de un usuario. La contraseña y el estado (activo) se mantienen.
  const editarUsuario = useCallback(
    (correoOriginal, { nombre, correo, rol }) => {
      const nuevoCorreo = correo.trim().toLowerCase();
      const original = buscarUsuario(correoOriginal);
      if (!original) return 'No se encontró el usuario.';
      if (!correoValido(nuevoCorreo)) return 'El correo debe ser válido (@ y terminar en .cl o .com).';
      if (nuevoCorreo !== correoOriginal.toLowerCase() && buscarUsuario(nuevoCorreo)) {
        return 'Ya existe otro usuario con ese correo.';
      }

      // Reviso si el usuario es uno de los de fábrica
      const eraBase = USUARIOS_BASE.some((u) => u.correo.toLowerCase() === correoOriginal.toLowerCase());
      setUsuariosLocales((prev) => {
        let lista = prev.filter(
          (u) => u.correo.toLowerCase() !== correoOriginal.toLowerCase() && u.correo.toLowerCase() !== nuevoCorreo
        );
        // Si le cambian el correo a un usuario de fábrica, dejo el correo antiguo marcado como eliminado
        // para que no aparezca duplicado.
        if (eraBase && nuevoCorreo !== correoOriginal.toLowerCase()) {
          lista = [...lista, { correo: correoOriginal, eliminado: true }];
        }
        return [
          ...lista,
          {
            nombre: nombre.trim(),
            correo: nuevoCorreo,
            rol,
            clave: original.clave,
            tipo: original.tipo !== 'Base' ? original.tipo : 'Modificado',
            activo: original.activo,
          },
        ];
      });
      return null;
    },
    [buscarUsuario]
  );

  // Desactiva o reactiva una cuenta. No la borro, solo cambio "activo".
  // Una cuenta desactivada no puede iniciar sesión.
  const alternarActivo = useCallback(
    (correo) => {
      const u = buscarUsuario(correo);
      if (!u) return;
      setUsuariosLocales((prev) => [
        ...prev.filter((x) => x.correo.toLowerCase() !== u.correo.toLowerCase()),
        { ...u, activo: !u.activo },
      ]);
    },
    [buscarUsuario]
  );

  // Acciones sobre CITAS (las usan Recepción, el cliente y el formulario de agendar)
  // -------------------------------------------------------------------- CITAS
  // Revisa si el veterinario ya tiene una cita confirmada en ese día y bloque.
  // Si paso un id lo ignoro, para poder reagendar una cita sin chocar conmigo misma.
  const hayChoque = useCallback(
    (doctor, fecha, hora, exceptoId) =>
      citas.some(
        (c) => c.idCita !== exceptoId && c.estado === 'Confirmada' && c.doctor === doctor && c.fecha === fecha && c.hora === hora
      ),
    [citas]
  );

  // Revisa si ya hay algo reservado en ese día y hora (miro las citas fijas y las guardadas).
  // Las citas anuladas no cuentan, porque liberan el horario.
  const horarioOcupado = useCallback(
    (fecha, horaInicio) => {
      const fija = CITAS_RESERVADAS_FIJAS.find((c) => c.fecha === fecha && c.hora === horaInicio);
      if (fija) return fija;
      return citas.find(
        (c) => c.estado !== 'Cancelada' && c.fecha === fecha && String(c.hora).substring(0, 5) === horaInicio
      );
    },
    [citas]
  );

  // Genero un id para la cita usando los últimos números de la hora actual.
  // Le agrego un contador (contadorId, declarado afuera del componente para que no se reinicie)
  // porque mis pruebas descubrieron que dos citas creadas en el mismo milisegundo
  // recibían el mismo id y se confundían entre ellas.
  const nuevoIdCita = () => 'CIT-' + Date.now().toString().slice(-6) + '-' + ++contadorId;

  // Solicitud que hace un cliente desde la web. Queda "Pendiente" hasta que Recepción la confirme,
  // y todavía sin veterinario asignado.
  const solicitarCita = useCallback(({ dueno, correo, mascota, fecha, hora, motivo }) => {
    setCitas((prev) => [
      {
        idCita: nuevoIdCita(), fecha, hora, dueno, telefono: 'Sin registrar', correo: correo.toLowerCase(),
        mascota, especie: 'Por definir', raza: 'Por definir', doctor: 'Por asignar', motivo, estado: 'Pendiente',
      },
      ...prev,
    ]);
  }, []);

  // Cita que crea Recepción cuando el cliente va en persona. Nace "Confirmada",
  // así que primero reviso que el veterinario no tenga otra cita en ese bloque.
  const agendarCitaPresencial = useCallback(
    (datos) => {
      if (hayChoque(datos.doctor, datos.fecha, datos.hora)) {
        return `El ${datos.doctor} ya tiene una cita reservada el día ${datos.fecha} en el bloque ${datos.hora}. Seleccione otro bloque o doctor.`;
      }
      setCitas((prev) => [{ ...datos, idCita: nuevoIdCita(), correo: datos.correo.toLowerCase(), estado: 'Confirmada' }, ...prev]);
      return null;
    },
    [hayChoque]
  );

  // Sirve para dos cosas: confirmar una solicitud pendiente o reagendar una cita ya confirmada.
  // Devuelve un texto de error o null si salió bien.
  const gestionarCita = useCallback(
    (idCita, { doctor, fecha, hora }, modo) => {
      // Validaciones: fecha obligatoria, no puede ser pasada, no domingo y sin choque de horario
      if (!fecha) return 'Seleccione una fecha.';
      if (fecha < hoyISO()) return 'La fecha no puede estar en el pasado.';
      if (esDomingo(fecha)) return 'La clínica no atiende los domingos (Lunes a Sábado).';
      if (hayChoque(doctor, fecha, hora, idCita)) return `${doctor} ya tiene una cita confirmada el ${fecha} en el bloque ${hora}.`;

      setCitas((prev) =>
        prev.map((c) => {
          if (c.idCita !== idCita) return c;
          const cambios = { doctor, fecha, hora, estado: 'Confirmada' };
          // Si reagendo, guardo dónde estaba antes para mostrar el aviso "Reagendada"
          if (modo === 'reagendar') cambios.fechaAnterior = `${c.fecha} ${c.hora} con ${c.doctor}`;
          return { ...c, ...cambios };
        })
      );
      return null;
    },
    [hayChoque]
  );

  // Anula o rechaza una cita (cambio el estado a Cancelada, no la borro)
  const anularCita = useCallback((idCita) => {
    setCitas((prev) => prev.map((c) => (c.idCita === idCita ? { ...c, estado: 'Cancelada' } : c)));
  }, []);

  // Acciones sobre FICHAS clínicas de los pacientes
  // ------------------------------------------------------------------- FICHAS
  // Los IDs nuevos parten desde PAC-101 para no chocar con las fichas base (PAC-001 a PAC-006).
  // Busco el número más grande que exista y le sumo 1.
  const nuevoIdFicha = (lista) => {
    const max = lista.reduce((m, f) => {
      const n = parseInt(String(f.id).replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 100);
    return 'PAC-' + String(max + 1).padStart(3, '0');
  };

  // Crea una ficha nueva al principio de la lista (no pagada por defecto)
  const crearFicha = useCallback((datos) => {
    setFichas((prev) => [{ pagado: false, ...datos, id: nuevoIdFicha(prev) }, ...prev]);
  }, []);

  // Actualiza solo los campos que le paso en "cambios" en la ficha con ese id
  const actualizarFicha = useCallback((id, cambios) => {
    setFichas((prev) => prev.map((f) => (f.id === id ? { ...f, ...cambios } : f)));
  }, []);

  // Aquí junto todo lo que quiero que puedan usar las pantallas: datos y acciones
  const valor = {
    usuarios, citas, fichas,
    buscarUsuario, crearUsuario, registrarCliente, editarUsuario, alternarActivo,
    hayChoque, horarioOcupado, solicitarCita, agendarCitaPresencial, gestionarCita, anularCita,
    crearFicha, actualizarFicha,
  };

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

// Atajo para usar los datos en cualquier componente: const { citas, anularCita } = useData();
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de <DataProvider>');
  return ctx;
}
