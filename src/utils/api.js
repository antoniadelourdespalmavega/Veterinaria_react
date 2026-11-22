import { guardarTokens, leerTokens } from './almacenamiento';

// ==========================================================================
// Aquí está TODA la comunicación con el backend (Spring Boot).
// El resto de la app no usa fetch directamente: llama a "api(...)".
// - Agrega el token JWT a cada petición.
// - Si el token venció (401), pide uno nuevo con el token de renovación y repite la petición.
// - Si no se puede renovar, avisa que la sesión venció para que se cierre.
// ==========================================================================

// Dirección del backend. Se puede cambiar con la variable VITE_API_URL (archivo .env)
export const URL_API = import.meta.env?.VITE_API_URL || 'http://localhost:8080';

// Evento que se dispara cuando la sesión ya no se puede renovar (AuthContext lo escucha)
export const EVENTO_SESION_VENCIDA = 'sesion-vencida';

// Intenta obtener un token de acceso nuevo. Devuelve true si lo logró.
async function renovarToken() {
  const { tokenRenovacion } = leerTokens();
  if (!tokenRenovacion) return false;
  try {
    const resp = await fetch(`${URL_API}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenRenovacion }),
    });
    if (!resp.ok) return false;
    guardarTokens(await resp.json());
    return true;
  } catch {
    return false;
  }
}

// Hace una petición al backend.
// - ruta: por ejemplo '/api/citas'
// - opciones.metodo: GET (por defecto), POST, PUT, PATCH o DELETE
// - opciones.cuerpo: objeto que se envía como JSON
// Devuelve los datos de la respuesta. Si el backend responde con error, lanza un Error con su mensaje.
export async function api(ruta, { metodo = 'GET', cuerpo, reintentar = true } = {}) {
  const { token } = leerTokens();
  const headers = {};
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let resp;
  try {
    resp = await fetch(`${URL_API}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
  }

  // Token vencido: lo renuevo una vez y repito la petición. Si no se puede (o no hay token), la sesión venció.
  // (En el login un 401 solo significa "clave incorrecta", por eso no cuenta.)
  if (resp.status === 401 && reintentar && ruta !== '/api/auth/login') {
    if (token && (await renovarToken())) return api(ruta, { metodo, cuerpo, reintentar: false });
    window.dispatchEvent(new Event(EVENTO_SESION_VENCIDA));
  }

  const datos = resp.status === 204 ? null : await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(datos?.mensaje || 'Ocurrió un error en el servidor.');
  return datos;
}
