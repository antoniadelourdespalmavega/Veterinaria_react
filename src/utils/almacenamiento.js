// Aquí guardo las funciones para leer y escribir en el navegador (localStorage y sessionStorage).
// Las dejo en un solo archivo para no repetir el try/catch en todos lados.

// Los nombres con los que guardo cada cosa. Los puse juntos para no equivocarme escribiéndolos a mano.
export const CLAVES = {
  usuarios: 'usuariosPersonalizados',
  citas: 'citasSanMarcos',
  fichas: 'fichasClinicasSanMarcos',
  carrito: 'carrito_san_marcos',
  sesion: 'usuarioActivo',
};

// Lee algo de localStorage. Si no existe (o hay un error) devuelve el valor por defecto que le paso.
export function leerLocal(clave, porDefecto) {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo === null ? porDefecto : JSON.parse(crudo);
  } catch {
    return porDefecto;
  }
}

// Guarda cualquier valor en localStorage convertido a texto (JSON)
export function guardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* almacenamiento no disponible */
  }
}

// Borra una clave de localStorage (la uso para vaciar el carrito)
export function quitarLocal(clave) {
  try {
    localStorage.removeItem(clave);
  } catch {
    /* nada */
  }
}

// La sesión del usuario la guardo en sessionStorage: se borra al cerrar la pestaña.
// Esta función la lee; si no hay sesión devuelve null.
export function leerSesion() {
  try {
    const crudo = sessionStorage.getItem(CLAVES.sesion);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

// Guarda la sesión al iniciar sesión, o la borra si le paso null (cerrar sesión)
export function guardarSesion(usuario) {
  try {
    if (usuario) sessionStorage.setItem(CLAVES.sesion, JSON.stringify(usuario));
    else sessionStorage.removeItem(CLAVES.sesion);
  } catch {
    /* nada */
  }
}
