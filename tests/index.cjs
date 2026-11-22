// Archivo de entrada de las pruebas PRINCIPALES (es el que corre "npm test").
// Karma solo carga ESTE archivo (es .cjs porque el proyecto usa módulos ES y aquí necesito require.context).
// Aquí le digo que busque solo en la carpeta "principales": las pruebas principales y complementarias.
// Así, cuando creo una prueba nueva en esa carpeta no tengo que registrarla en ningún lado.

// Antes de CADA prueba reemplazo fetch por el backend falso (ver ayudas/backendFalso.js):
// así ninguna prueba depende de que el backend real esté encendido.
const { instalarBackendFalso } = require('./ayudas/backendFalso');
beforeEach(() => instalarBackendFalso());
// Al terminar cada prueba espero un instante: así las peticiones que quedaron pendientes se resuelven con el
// backend falso y no llegan por error al backend real.
afterEach(() => new Promise((resolver) => setTimeout(resolver, 0)));

const contexto = require.context('./principales', true, /\.spec\.jsx?$/);

// Ejecuto (importo) cada archivo de pruebas encontrado
contexto.keys().forEach(contexto);
