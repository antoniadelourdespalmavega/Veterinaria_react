import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { RUTA_POR_ROL } from '../data/datosBase';
import { api, EVENTO_SESION_VENCIDA } from '../utils/api';
import { guardarSesion, guardarTokens, leerSesion } from '../utils/almacenamiento';
import { correoValido } from '../utils/validaciones';

// Aquí manejo la sesión: quién está conectado, el inicio de sesión y el cierre de sesión.
// El login lo valida el BACKEND, que entrega un token JWT. El token y los datos del usuario
// se guardan en sessionStorage: sobreviven a recargar la página y se pierden al cerrar la pestaña.
// Creo el "contexto": una caja compartida a la que cualquier pantalla puede pedirle el usuario
const AuthContext = createContext(null);

// Este componente envuelve toda la app (lo uso en main.jsx) y entrega la sesión a todas las pantallas
export function AuthProvider({ children }) {
  // Estado con el usuario conectado. Al abrir la página (o recargarla) recupero la sesión guardada.
  const [usuario, setUsuario] = useState(() => leerSesion());

  // Valida el correo y la clave. Si todo está bien guarda la sesión y devuelve ok: true.
  // Si algo falla devuelve ok: false con la lista de errores para mostrarlos en pantalla.
  const iniciarSesion = useCallback(async (correo, clave) => {
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

    // Si el formato está bien, el backend busca al usuario, compara la contraseña y revisa que esté activo
    if (errores.length === 0) {
      try {
        const resp = await api('/api/auth/login', { metodo: 'POST', cuerpo: { correo: mail, clave: pass } });
        // Guardo los tokens y solo lo necesario del usuario (nombre, correo y rol). La contraseña nunca llega al frontend.
        guardarTokens(resp);
        guardarSesion(resp.usuario);
        setUsuario(resp.usuario);
        return { ok: true, usuario: resp.usuario, destino: RUTA_POR_ROL[resp.usuario.rol] };
      } catch (e) {
        errores.push(e.message);
      }
    }
    return { ok: false, errores };
  }, []);

  // Cerrar sesión: borro la sesión y los tokens guardados y dejo el usuario en null
  const cerrarSesion = useCallback(() => {
    guardarTokens(null);
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

  // Si el backend dice que la sesión venció y no se pudo renovar, cierro la sesión.
  // Como RutaProtegida mira "usuario", la persona vuelve sola al login.
  useEffect(() => {
    window.addEventListener(EVENTO_SESION_VENCIDA, cerrarSesion);
    return () => window.removeEventListener(EVENTO_SESION_VENCIDA, cerrarSesion);
  }, [cerrarSesion]);

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
