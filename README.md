# Veterinaria San Marcos – Frontend en React

Migración del sitio web de la Veterinaria San Marcos (HTML + JavaScript puro) a una
aplicación **React** con **Vite**, **React Router** y **Bootstrap 5**.

## Cómo ejecutarlo

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
npm run build    # genera la versión de producción en /dist
```

Requiere Node.js 18 o superior.

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@sanmarcos.cl | Admin2026* |
| Recepción | camila.recepcion@sanmarcos.cl | Recep2026* |
| Veterinario | daniel.morales@sanmarcos.cl | Vet2026* |
| Cliente | pedro.pascal@gmail.com | Cliente123* |

(Los datos se guardan en `localStorage`; es un proyecto académico sin servidor.)

---

## 1. Cómo se usó el framework moderno (React)

El proyecto original eran 12 páginas HTML con 9 archivos JavaScript que manipulaban el DOM con
`innerHTML` y variables globales. En React cada pantalla es una **página** formada por
**componentes** reutilizables, y la pantalla se vuelve a dibujar sola cuando cambia el **estado**.

Herramientas:

- **React 18**: componentes funcionales y hooks (`useState`, `useEffect`, `useMemo`, `useContext`).
- **Vite**: servidor de desarrollo y empaquetado.
- **React Router**: una ruta por pantalla y rutas protegidas por rol.
- **Bootstrap 5 + react-bootstrap**: estilos y componentes responsivos (Navbar, Modal, Offcanvas, Accordion).

### Estructura

```
src/
├── main.jsx            Arranque: Router + proveedores de contexto
├── App.jsx             Mapa de rutas (públicas y protegidas)
├── context/            Estado global: DataContext, AuthContext, CarritoContext
├── pages/              Una página por ruta (Inicio, Servicios, Tienda, paneles...)
├── components/         Componentes reutilizables
│   ├── paneles/        PanelLayout, MetricCard, Badges
│   ├── admin/          TablaUsuarios, ModalUsuario, ReportesAdmin
│   ├── recepcion/      TablaCitas, ModalGestionCita, ModalFicha, Caja ...
│   ├── veterinario/    ModalFichaClinica, ModalIngresoPaciente
│   └── cliente/        TarjetaMascota, ModalReceta
├── data/               Datos base (usuarios, citas, fichas) y catálogo de productos
├── utils/              Validaciones, formato de moneda, acceso a localStorage
└── styles/             CSS propio (paleta de la clínica)
```

---

## 2. Proceso de desarrollo de componentes, propiedades (props) y estados

### Paso 1 – Identificar piezas repetidas
Cada HTML repetía el mismo bloque (navbar, footer, carrito, tarjetas, tablas, modales).
Esos bloques se convirtieron en componentes.

### Paso 2 – Props: personalizar un componente desde afuera
Un componente recibe datos y funciones por **props**, y no conoce de dónde vienen.

```jsx
// MetricCard recibe icono, color, etiqueta y valor → se reutiliza en los 4 paneles
<MetricCard icono="bi-hourglass-split" color="warning"
            etiqueta="Solicitudes por Confirmar" valor={pendientes} />
```

```jsx
// TablaCitas muestra citas y avisa con funciones cuando el usuario actúa
<TablaCitas citas={citasFiltradas}
            onConfirmar={(c) => setGestion({ cita: c, modo: 'confirmar' })}
            onReagendar={(c) => setGestion({ cita: c, modo: 'reagendar' })}
            onAnular={anular} />
```

`TarjetaProducto` recibe un `producto` y la función `onAgregar`, y se repite con `.map()` para todo el catálogo. `PanelLayout` recibe `marca`, `cargo`, `color` y `children`, por eso
sirve para los cuatro paneles.

### Paso 3 – Estado local con `useState`
Cada pantalla guarda solo lo que cambia en su interfaz:

- `ModalUsuario`: campos del formulario y mensaje de error.
- `Registro`, `MiPortal`, `SolicitarCita`: valores del formulario, errores y mensaje de éxito
  (formularios **controlados**: el valor del campo vive en el estado).
- `PanelRecepcion`: pestaña activa, texto de búsqueda y qué modal está abierto.

### Paso 4 – Estado compartido con Context
Cuando varias pantallas necesitan los mismos datos se usa **Context** (evita pasar props por muchos niveles):

| Contexto | Qué guarda | Quién lo usa |
|---|---|---|
| `DataContext` | usuarios, citas y fichas clínicas + acciones (confirmar cita, crear ficha, desactivar usuario...) | los 4 paneles y el formulario de citas |
| `AuthContext` | usuario con sesión, `iniciarSesion`, `cerrarSesion` | login, navbar, rutas protegidas |
| `CarritoContext` | productos, total y si el panel lateral está abierto | tienda, servicios, navbar, pago |

Si Recepción confirma una cita, el cliente la ve actualizada al instante porque ambos leen el mismo estado.
Cada cambio se guarda en `localStorage` con `useEffect`.

### Paso 5 – Estado derivado con `useMemo`
Las listas filtradas y los reportes se calculan a partir del estado en lugar de guardarse aparte:

```jsx
const citasFiltradas = useMemo(
  () => citas.filter((c) => c.dueno.toLowerCase().includes(q)), [citas, q]);
```

### Paso 6 – Rutas protegidas
```jsx
<Route path="/panel-recepcion"
  element={<RutaProtegida roles={['secretaria', 'administrador']}><PanelRecepcion /></RutaProtegida>} />
```
`RutaProtegida` reemplaza las validaciones de sesión que antes se repetían en cada archivo JS.

### Permisos por rol

- **Administrador**: crea, edita y desactiva usuarios, asigna roles y ve todos los reportes (exportables a CSV).
- **Recepción**: ve, confirma y reagenda citas; registra y edita fichas de pacientes; cobra tratamientos. No gestiona usuarios.
- **Cliente**: solicita citas, ve su estado y el historial clínico de sus mascotas. Solo ve datos de su correo.
- **Veterinario**: ve pacientes, edita diagnóstico y tratamiento, e ingresa atenciones presenciales.

---

## 3. Diseño responsivo con Bootstrap

El diseño se adapta con el **sistema de grillas** (12 columnas) y las clases por tamaño de pantalla
(`sm` ≥576px, `md` ≥768px, `lg` ≥992px, `xl` ≥1200px).

| Técnica | Dónde se usa | Efecto |
|---|---|---|
| `<Navbar expand="lg">` + `Navbar.Toggle` | `NavbarPublica` | En pantallas pequeñas el menú se colapsa en una hamburguesa |
| `col-12 col-md-6 col-lg-4` | Tarjetas de productos y servicios | 1 columna en celular, 2 en tablet, 3 en escritorio |
| `col-12 col-sm-6 col-xl-3` | Métricas de los paneles | Las 4 tarjetas se apilan en celular y quedan en una fila en pantallas grandes |
| `table-responsive` | Todas las tablas | La tabla se desplaza horizontalmente en vez de romper el diseño |
| `d-none d-sm-inline`, `d-md-inline` | Textos del header | Oculta textos secundarios en pantallas pequeñas |
| `Offcanvas` / `Modal` (react-bootstrap) | Carrito y formularios | Panel lateral y ventanas que se ajustan al ancho del dispositivo |
| `flex-wrap`, `gap-*` | Botones de acción | Los botones pasan a otra línea cuando falta espacio |

**Comprobación realizada**: se revisaron todas las páginas en un ancho de 375 px (celular) y no hay desplazamiento
horizontal. Para ver ejemplos en distintos dispositivos: abrir la app, presionar `F12` y activar
el *modo dispositivo* (`Ctrl+Shift+M`); probar iPhone SE (375 px), iPad (768 px) y escritorio (1280 px).

---

## 4. Pruebas unitarias del frontend (Jasmine + Karma)

```bash
npm test                # corre las 39 pruebas y genera el informe de cobertura (salida corta)
npx karma start         # equivale a "npm test": Karma encuentra solo el archivo karma.conf.js
npm run test:detallado  # lo mismo, pero mostrando una línea por cada prueba (✓ / ✗)
npm run test:watch      # queda vigilando y vuelve a correr al guardar un archivo
```

La salida de `npm test` es corta: termina con `Executed 39 of 39 SUCCESS`, `TOTAL: 39 SUCCESS` y un resumen de cobertura.
Cada ejecución actualiza la carpeta `coverage/` (abrir `coverage/html/index.html` para ver el detalle por archivo).

Necesita Google Chrome instalado (Karma lo abre sin ventana). Si está en otra ruta, definir la variable `CHROME_BIN`.

### 4.1 Herramientas y configuración del entorno

| Herramienta | Para qué la uso |
|---|---|
| **Jasmine** | Librería para ESCRIBIR las pruebas (`describe`, `it`, `expect`, `spyOn`, reloj falso). |
| **Karma** | Ejecutor: abre un Chrome real sin ventana, corre las pruebas y muestra los resultados. |
| **Webpack + Babel** | Empaquetan mis archivos y traducen el JSX para que el navegador de pruebas los entienda. |
| **Testing Library** | Dibuja componentes React y permite simular lo que hace una persona (escribir, hacer clic). |
| **Istanbul (karma-coverage)** | Mide qué porcentaje de mi código ejecutaron las pruebas. |

Archivos de configuración:

- `karma.conf.cjs`: navegador, reporteros, cobertura y empaquetado.
- `babel.config.cjs`: traducción de JSX y marcas de cobertura.
- `tests/index.cjs`: punto de entrada; encuentra solo todos los archivos `*.spec.js(x)`.

### 4.2 Cómo escribí las pruebas

Cada prueba sigue el patrón **Preparar → Actuar → Verificar**:

```jsx
it('al presionar Confirmar llama a onConfirmar con esa cita', () => {
  dibujar([pendiente]);                                // 1. Preparar: dibujo el componente
  fireEvent.click(screen.getByText('Confirmar'));      // 2. Actuar: simulo el clic
  expect(onConfirmar).toHaveBeenCalledWith(pendiente); // 3. Verificar el resultado
});
```

Escribí **39 pruebas** (carpeta `tests/principales/`): las 25 primeras protegen lo que más puede romper el
sistema y las 14 siguientes (archivo 06) recorren los casos que faltaban para subir la cobertura. Están ordenadas en 6 archivos, del caso más simple al más completo:

| Archivo | Qué prueba | Pruebas |
|---|---|---|
| `01-funciones.spec.js` | Funciones simples: validación de correo, teléfono y peso, formato de precios | 4 (n.º 1 a 4) |
| `02-reglas-de-negocio.spec.jsx` | Reglas del sistema: no chocar horarios, solicitud y confirmación de citas, no agendar domingos, desactivar y no duplicar usuarios | 5 (n.º 5 a 9) |
| `03-sesion-y-carrito.spec.jsx` | Inicio de sesión (2 pruebas) y carrito de compras (1 prueba) | 3 (n.º 10 a 12) |
| `04-componentes.spec.jsx` | Componentes React con mocks: `MetricCard`, `TarjetaProducto`, `TablaCitas`, `TablaUsuarios`, `RutaProtegida` | 5 (n.º 13 a 17) |
| `05-pantallas.spec.jsx` | Pantallas completas (integración): login con redirección, privacidad del cliente, Recepción (confirmar, agendar, ficha y cobro), Administrador, solicitud de cita del cliente y pago asíncrono | 8 (n.º 18 a 25) |
| `06-cobertura-componentes.spec.jsx` | Casos complementarios: `RutaProtegida` con roles, todos los estados de `TablaCitas`, `TablaFichas`, `TarjetaMascota`, `ModalReceta` (incluye mock de `window.print`) y `PanelLayout` | 14 (n.º 26 a 39) |

Cada prueba está numerada en el código (`// PRUEBA 7`) y comentada paso a paso.

`tests/ayudas/envoltorio.jsx` no es una prueba: guarda funciones de apoyo que reutilizo (los proveedores de
contexto, la "sonda" para probar contextos y generadores de fechas).

### 4.3 Qué verifican las pruebas (casos de uso)

- **Lógica**: reglas de validación (correo, teléfono, peso), que no se puedan agendar dos citas del mismo veterinario a la misma hora, que no se agende en domingo ni en el pasado, y que una cuenta desactivada no pueda entrar.
- **Comportamiento de componentes**: los botones de `TablaCitas` cambian según el estado de la cita; `TablaUsuarios` no deja que el administrador se desactive a sí mismo.
- **Manipulación del DOM**: busco elementos en pantalla (`getByText`, `getByLabelText`), simulo clics y escritura (`fireEvent`) y compruebo que la pantalla cambie.
- **Seguridad y permisos**: un cliente solo ve sus propias mascotas y citas; `RutaProtegida` bloquea los roles no permitidos.
- **Casos límite**: formularios vacíos, valores inválidos, listas vacías, JSON dañado en `localStorage`.

### 4.4 Mocks (reemplazos de prueba)

Un **mock** es una pieza falsa que reemplaza a una real para controlar la prueba:

- `jasmine.createSpyObj('acciones', ['onConfirmar', 'onAnular'])`: objeto con funciones espía que recuerdan si las llamaron y con qué datos.
- `spyOn(window, 'confirm').and.returnValue(true)`: simula que el usuario responde "Sí" a la pregunta "¿está seguro?" sin abrir un cuadro real.
- `spyOn(Storage.prototype, 'setItem').and.throwError(...)`: simula un navegador con el almacenamiento lleno.
- `jasmine.clock()`: reloj falso para adelantar los 2 segundos de redirección del login sin esperar.
- `MemoryRouter`: router en memoria que reemplaza a la barra de direcciones del navegador.
- Cada prueba limpia `localStorage` y `sessionStorage` para que ninguna dependa de otra.

### 4.5 Análisis de resultados

Última ejecución de `npm test`: **39 pruebas, 39 correctas, 0 fallidas** (demora menos de 1 segundo). Se repitió
varias veces porque Jasmine usa orden aleatorio, y así se comprobó que ninguna prueba depende de otra.

Cobertura del código que alcanzan las pruebas (informe en `coverage/html/index.html`):

| Métrica | Resultado |
|---|---|
| Líneas | 85,9 % |
| Sentencias | 82,5 % |
| Funciones | 80,4 % |
| Ramas (if/else) | 71,6 % |

Con 39 pruebas se cubre más del 85 % de las líneas medidas, porque las pruebas de pantallas completas
ejecutan muchos componentes a la vez. Los porcentajes son sobre los 32 archivos que las pruebas cargan; los otros
14 (páginas informativas, navegación, datos estáticos, registro y panel del veterinario) no se miden.
El detalle por archivo y la lista de lo no cubierto están en el documento de cobertura de testing (entregado aparte, junto al proyecto).

**Un error real que encontraron las pruebas**: dos citas creadas en el mismo milisegundo recibían el mismo id y se confundían entre ellas. Lo detectó una prueba que escribí durante el desarrollo sobre el choque de horarios. Se corrigió en `DataContext.jsx` agregando un contador al id (`contadorId`). Ese es justamente el valor de las pruebas: encontrar fallas antes de que las encuentre un usuario.

**Lo que no cubren**: las páginas públicas hechas solo de contenido (Inicio, Servicios, Contacto) y algunas ventanas de los paneles. Las pruebas son de frontend con datos en `localStorage`; no hay pruebas contra un servidor porque este proyecto no tiene backend.

---

## 5. Decisiones y límites

- **Sin backend**: los datos se guardan en `localStorage`; las contraseñas están en el código. Es adecuado para
  un trabajo académico, pero un sistema real necesita servidor y autenticación segura.
- Los datos de productos se extrajeron del HTML original a `src/data/productos.js`; ahora las tarjetas se
  generan con `.map()` desde ese arreglo (antes eran cientos de líneas de HTML repetido).
