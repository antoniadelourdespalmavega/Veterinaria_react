// Esta función me sirve para mostrar los precios como pesos chilenos.
// Ejemplo: le paso 12500 y me devuelve "$12.500".
// Si el valor no es un número, uso 0 para que no se rompa la pantalla.
export const clp = (n) => '$' + (Number(n) || 0).toLocaleString('es-CL');
