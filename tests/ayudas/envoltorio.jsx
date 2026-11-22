import { act, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { CarritoProvider } from '../../src/context/CarritoContext';
import { DataProvider } from '../../src/context/DataContext';

// ---------------------------------------------------------------------
// Ayudas para mis pruebas. Este archivo NO es una prueba: solo guarda
// funciones que reutilizo en varios archivos de prueba.
// ---------------------------------------------------------------------

// Muchos de mis componentes necesitan "contextos" (usuarios, sesión, carrito) y un router.
// Este componente les entrega todo eso, igual que lo hace main.jsx en la aplicación real
// (AuthProvider va primero porque DataProvider necesita saber quién está conectado).
// MemoryRouter es un router de mentira que guarda la ruta en memoria (no toca la barra del navegador).
// "ruta" puede ser un texto ('/mi-portal') o un objeto con estado ({ pathname: '/mi-portal', state: {...} }).
export function Proveedores({ children, ruta = '/' }) {
  return (
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <DataProvider>
          <CarritoProvider>{children}</CarritoProvider>
        </DataProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Dibuja un componente dentro de los proveedores de arriba.
// Me devuelve lo mismo que render() de Testing Library (container, rerender, etc.)
export function renderizarConProveedores(ui, { ruta = '/' } = {}) {
  return render(<Proveedores ruta={ruta}>{ui}</Proveedores>);
}

// Deja que terminen las peticiones al backend falso (son promesas) y que React actualice la pantalla.
// Lo uso después de dibujar un componente que carga datos, y antes de verificar.
export const vaciarPromesas = () =>
  act(async () => {
    for (let i = 0; i < 40; i++) await Promise.resolve();
  });

// Espera (reintentando) hasta que se cumpla una condición, por ejemplo: esperarQue(() => metrica('X') === '9').
// Lo uso en vez de waitFor(() => expect(...)): el expect de Jasmine NO lanza error cuando falla,
// y por eso waitFor creería que ya se cumplió y no reintentaría.
export const esperarQue = (condicion) =>
  waitFor(() => {
    if (!condicion()) throw new Error('La condición todavía no se cumple');
  });

// "Sonda": un componente invisible que copia lo que devuelve un hook o contexto.
// Me sirve para probar la lógica de los contextos sin tener que dibujar una pantalla.
// Uso: const sonda = crearSonda(() => useData());  ...  sonda.actual().usuarios
export function crearSonda(usarHook) {
  let ultimoValor;
  function Sonda() {
    // Cada vez que el componente se vuelve a dibujar, guardo el valor más reciente
    ultimoValor = usarHook();
    return null;
  }
  return { Sonda, actual: () => ultimoValor };
}

// Convierte una fecha a AAAA-MM-DD usando la hora LOCAL (toISOString usa UTC y de noche
// puede dar un día distinto al que getDay() revisa).
function aTextoLocal(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

// Devuelve una fecha futura en formato AAAA-MM-DD que NUNCA cae domingo.
// La necesito porque la clínica no atiende domingos y no se puede agendar en el pasado.
// "dias" es cuántos días después de hoy quiero la fecha.
export function fechaFutura(dias = 7) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  if (fecha.getDay() === 0) fecha.setDate(fecha.getDate() + 1); // si cae domingo, paso al lunes
  return aTextoLocal(fecha);
}

// Devuelve la próxima fecha que cae domingo (para probar que se rechaza)
export function proximoDomingo() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  while (fecha.getDay() !== 0) fecha.setDate(fecha.getDate() + 1);
  return aTextoLocal(fecha);
}
