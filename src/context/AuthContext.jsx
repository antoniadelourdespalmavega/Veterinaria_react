import { createContext, useCallback, useContext, useState } from 'react';
import { RUTA_POR_ROL } from '../data/datosBase';
import { guardarSesion, leerSesion } from '../utils/almacenamiento';
import { correoValido } from '../utils/validaciones';
import { useData } from './DataContext';

// Aquí manejo la sesión: quién está conectado, el inicio de sesión y el cierre de sesión.
// La sesión se guarda en sessionStorage, así que se pierde al cerrar la pestaña.
// Creo el "contexto": una caja compartida a la que cualquier pantalla puede pedirle el usuario
const AuthContext = createContext(null);

// Este componente envuelve toda la app (lo uso en main.jsx) y entrega la sesión a todas las pantallas
export function AuthProvider({ children }) {
  // Le pido a DataContext la función que busca un usuario por correo
  const { buscarUsuario } = useData();
  // Estado con el usuario conectado. Al abrir la página intento recuperar la sesión guardada.
  const [usuario, setUsuario] = useState(() => leerSesion());

  // Valida el correo y la clave. Si todo está bien guarda la sesión y devuelve ok: true.
  // Si algo falla devuelve ok: false con la lista de errores para mostrarlos en pantalla.
  const iniciarSesion = useCallback(
    (correo, clave) => {
      // Voy juntando aquí todos los errores que encuentre
      const errores = [];
      // Limpio los datos: sin espacios y el correo en minúsculas
      const mail = correo.trim().toLowerCase();
      const pass = clave.trim();

      // Primero reviso que los campos estén bien escritos (obligatorios, formato, largo mínimo)
      if (!mail) errores.push('El campo "Correo Electrónico" es obligatorio.');
      else if (!correoValido(mail)) errores.push('Correo inválido (debe incluir "@" y terminar en ".cl" o ".com").');

      if (!pass) errores.push('El campo "Contraseña" es obligatorio.');
      else if (pass.length < 4) errores.push('La contraseña debe tener al menos 4 caracteres.');

      // Si el formato está bien, recién ahí busco al usuario y comparo la contraseña
      if (errores.length === 0) {
        const candidato = buscarUsuario(mail);
        if (!candidato) errores.push(`El correo "${mail}" no se encuentra registrado en el sistema.`);
        else if (candidato.clave !== pass) errores.push('La contraseña ingresada es incorrecta.');
        // Si el administrador desactivó la cuenta, no lo dejo entrar aunque la clave esté bien
        else if (!candidato.activo) errores.push('Esta cuenta está desactivada. Contacta al administrador de la clínica.');
        else {
          // Guardo en la sesión solo lo necesario (nombre, correo y rol). La contraseña nunca la guardo.
          const sesion = { nombre: candidato.nombre, correo: candidato.correo, rol: candidato.rol };
          guardarSesion(sesion);
          setUsuario(sesion);
          return { ok: true, usuario: sesion, destino: RUTA_POR_ROL[candidato.rol] };
        }
      }
      return { ok: false, errores };
    },
    [buscarUsuario]
  );

  // Cerrar sesión: borro la sesión guardada y dejo el usuario en null
  const cerrarSesion = useCallback(() => {
    guardarSesion(null);
    setUsuario(null);
  }, []);

  // La uso cuando el administrador edita su propio usuario,
  // para que el nombre de arriba se actualice al tiro.
  const actualizarSesion = useCallback((cambios) => {
    setUsuario((actual) => {
      const nueva = { ...actual, ...cambios };
      guardarSesion(nueva);
      return nueva;
    });
  }, []);

  return (
    // Todo lo que pongo en "value" queda disponible para cualquier pantalla
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, actualizarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Atajo para usar la sesión en cualquier componente: const { usuario } = useAuth();
// Si lo usan fuera del AuthProvider tiro un error para darme cuenta rápido.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
