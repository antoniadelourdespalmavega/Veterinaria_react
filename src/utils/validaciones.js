// Aquí junto todas las reglas de validación que uso en los formularios,
// para no repetir el mismo código en cada pantalla.

// Correo válido: texto + "@" + dominio, y tiene que terminar en .cl o .com
export const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(cl|com)$/i;
// Celular chileno: +56 9 y después 8 números (con o sin espacios)
export const PATRON_TELEFONO_CL = /^\+56\s?9\s?\d{4}\s?\d{4}$|^\+56\s?9\s?\d{8}$/;
// Solo letras y espacios (lo uso para nombres de personas y mascotas)
export const PATRON_SOLO_TEXTO = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

// Estas dos funciones aplican el patrón de arriba y devuelven true o false
export const correoValido = (v) => PATRON_CORREO.test(String(v).trim());
export const telefonoValido = (v) => PATRON_TELEFONO_CL.test(String(v).trim());

// Convierto lo que escribe el usuario ("12,5 kg", "8.5") en un número.
// Si no se puede convertir devuelvo NaN, y así sé que el peso es inválido.
export function parsearPeso(valor) {
  const limpio = String(valor).toLowerCase().replace('kg', '').replace(',', '.').trim();
  if (limpio === '' || isNaN(limpio)) return NaN;
  return parseFloat(limpio);
}

// Me devuelve la fecha de hoy como AAAA-MM-DD (el formato que usan los input de fecha)
export const hoyISO = () => new Date().toISOString().split('T')[0];

// Reviso si la fecha cae domingo (0 = domingo), porque la clínica atiende de lunes a sábado
export const esDomingo = (fechaISO) => new Date(fechaISO + 'T00:00:00').getDay() === 0;
