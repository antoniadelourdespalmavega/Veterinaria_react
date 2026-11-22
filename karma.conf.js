// Este archivo existe para que el comando "npx karma start" funcione.
// Karma solo busca automáticamente un archivo llamado karma.conf.js, y mi configuración real
// está en karma.conf.cjs (es .cjs porque el proyecto usa módulos ES). Aquí solo la reutilizo.
import configuracion from "./karma.conf.cjs";

export default configuracion;
