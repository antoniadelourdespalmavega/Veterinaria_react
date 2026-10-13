// =====================================================================
// Configuración de Karma (el "ejecutor" de mis pruebas)
//
// - Jasmine: es la librería con la que ESCRIBO las pruebas (describe, it, expect).
// - Karma:   es el programa que ABRE un navegador real, corre las pruebas ahí
//            y me muestra qué pasó y qué falló.
// - Webpack: junta mis archivos de prueba y de código en un solo paquete para que
//            el navegador los pueda cargar.
// =====================================================================

// Apago los avisos de "deprecated" (cosas antiguas) que salen de las librerías de Karma
// y no tienen nada que ver con mi proyecto: así la consola queda limpia.
process.noDeprecation = true;

// Digo que estoy en modo "test" (Babel usa esto para activar la cobertura)
process.env.NODE_ENV = 'test';
process.env.BABEL_ENV = 'test';

// Ruta de Chrome en este computador. Si tengo la variable CHROME_BIN la uso, si no, uso esta ruta.
process.env.CHROME_BIN = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

module.exports = function (config) {
  config.set({
    // Carpeta base: la raíz del proyecto
    basePath: '',

    // Herramientas que uso: Jasmine para las pruebas y webpack para empaquetarlas
    frameworks: ['jasmine', 'webpack'],

    // Plugins que Karma necesita cargar
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-coverage'),
    ],

    // Archivos que Karma carga:
    // 1) tests/index.cjs: la entrada que se encarga de cargar mis pruebas
    // 2) mis imágenes de la carpeta public: solo las "sirvo" (included: false) para que
    //    los componentes que piden /img/logo.png no llenen la consola de avisos 404
    files: [
      { pattern: 'tests/index.cjs', watched: false },
      { pattern: 'public/img/**/*', included: false, served: true, watched: false },
    ],

    // Los componentes piden las imágenes como /img/...; aquí le digo a Karma dónde están de verdad
    proxies: { '/img/': '/base/public/img/' },

    // Antes de ejecutarlo, pasa por webpack (que usa Babel para traducir el JSX)
    preprocessors: {
      'tests/index.cjs': ['webpack'],
    },

    webpack: {
      mode: 'development',
      devtool: false,
      // Solo muestro mensajes de webpack si hay un error (así la consola queda limpia)
      stats: 'errors-only',
      module: {
        rules: [
          {
            // Todos los .js y .jsx (menos node_modules) se traducen con Babel
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: 'babel-loader',
            // Mi proyecto usa módulos ES ("type": "module"), y por eso webpack exigiría escribir
            // la extensión en cada import. Con esto le digo que no es necesario (como en Vite).
            resolve: { fullySpecified: false },
          },
        ],
      },
      // Así puedo escribir import './archivo' sin poner .jsx al final
      resolve: { extensions: ['.js', '.jsx'] },
    },

    // Cómo muestro los resultados:
    // - "progress": una línea corta con el resumen, por ejemplo "Executed 25 of 25 SUCCESS" y "TOTAL: 25 SUCCESS"
    // - "coverage": el informe de cobertura. Mide cuánto de mi código ejecutaron las pruebas y lo guarda
    //   en la carpeta "coverage" (se abre coverage/html/index.html). Se genera SIEMPRE que corro las pruebas.
    // Si quiero ver una línea por cada prueba (✓ pasó, ✗ falló) uso: npm run test:detallado
    reporters: ['progress', 'coverage'],

    // No muestro los console.log / console.warn del navegador (por ejemplo los avisos
    // de React Router), para que la consola quede limpia
    client: { captureConsole: false },

    specReporter: {
      suppressSkipped: true,
      showSpecTiming: false,
    },

    // Dónde guardo el informe de cobertura (carpeta "coverage")
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text-summary' }, // resumen en la consola
        { type: 'html', subdir: 'html' }, // informe para abrir en el navegador
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' }, // los mismos números en formato de datos (JSON)
      ],
    },

    // Uso Chrome sin ventana ("headless"): corre las pruebas sin que se abra nada en pantalla
    browsers: ['ChromeSinVentana'],
    customLaunchers: {
      ChromeSinVentana: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },

    // Si una prueba se demora mucho, Karma la corta (en milisegundos)
    browserNoActivityTimeout: 60000,

    // Con "npm test" corre una vez y termina. Con "npm run test:watch" queda vigilando cambios.
    singleRun: true,
    autoWatch: false,
  });
};
