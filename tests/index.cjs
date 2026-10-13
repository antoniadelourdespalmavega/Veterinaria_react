// Archivo de entrada de las pruebas PRINCIPALES (es el que corre "npm test").
// Karma solo carga ESTE archivo (es .cjs porque el proyecto usa módulos ES y aquí necesito require.context).
// Aquí le digo que busque solo en la carpeta "principales": las pruebas principales y complementarias.
// Así, cuando creo una prueba nueva en esa carpeta no tengo que registrarla en ningún lado.
const contexto = require.context('./principales', true, /\.spec\.jsx?$/);

// Ejecuto (importo) cada archivo de pruebas encontrado
contexto.keys().forEach(contexto);
