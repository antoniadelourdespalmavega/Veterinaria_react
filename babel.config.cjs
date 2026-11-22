// Configuración de Babel: es el "traductor" que usan mis pruebas.
// Karma corre dentro de un navegador y no entiende JSX ni la sintaxis moderna directamente,
// así que Babel lo convierte antes de ejecutar las pruebas.
// (Vite no usa este archivo: para armar la página usa su propio traductor.)
module.exports = (api) => {
  // Le digo a Babel que guarde el resultado en memoria para que sea más rápido
  api.cache(true);

  return {
    presets: [
      // Convierte JavaScript moderno a algo que Chrome entienda sin problemas
      ['@babel/preset-env', { targets: { chrome: '100' } }],
      // Convierte el JSX (<div>...</div>) en JavaScript normal
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    env: {
      // Esto solo se aplica cuando corro las pruebas (NODE_ENV=test)
      test: {
        plugins: [
          // Istanbul "marca" cada línea de mi código para saber cuáles ejecutaron las pruebas.
          // Con eso se arma el informe de cobertura. No mido los archivos de pruebas en sí.
          ['istanbul', { exclude: ['tests/**', '**/*.spec.js', '**/*.spec.jsx'] }],
        ],
      },
    },
  };
};
