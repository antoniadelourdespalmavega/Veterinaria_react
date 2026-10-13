import { act, render } from '@testing-library/react';
import { useAuth } from '../../src/context/AuthContext';
import { useCarrito } from '../../src/context/CarritoContext';
import { useData } from '../../src/context/DataContext';
import { Proveedores, crearSonda } from '../ayudas/envoltorio';

// =====================================================================
// PRUEBAS PRINCIPALES - Parte 3: inicio de sesión y carrito de compras
//
// Uso la misma técnica de la "sonda" de la parte 2. Proveedores le entrega a la sonda
// todos los contextos juntos (datos, sesión y carrito), igual que en la aplicación real.
// =====================================================================

describe('Inicio de sesión (AuthContext)', () => {
  let sonda;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    sonda = crearSonda(() => ({ auth: useAuth(), data: useData() }));
    render(
      <Proveedores>
        <sonda.Sonda />
      </Proveedores>
    );
  });

  // Atajo para intentar iniciar sesión dentro de act() y devolver el resultado
  const intentar = (correo, clave) => {
    let resultado;
    act(() => { resultado = sonda.actual().auth.iniciarSesion(correo, clave); });
    return resultado;
  };

  // PRUEBA 10
  it('con datos correctos inicia sesión y lleva al panel de su rol', () => {
    const res = intentar('camila.recepcion@sanmarcos.cl', 'Recep2026*');

    expect(res.ok).toBe(true);
    expect(res.destino).toBe('/panel-recepcion'); // la secretaria va al panel de recepción
    expect(sonda.actual().auth.usuario.rol).toBe('secretaria');

    // Al cerrar sesión, nadie queda conectado
    act(() => sonda.actual().auth.cerrarSesion());
    expect(sonda.actual().auth.usuario).toBeNull();
  });

  // PRUEBA 11
  it('NO deja entrar con una contraseña incorrecta ni con una cuenta desactivada', () => {
    // Caso 1: contraseña incorrecta
    const claveMala = intentar('admin@sanmarcos.cl', 'ClaveMala1');
    expect(claveMala.ok).toBe(false);
    expect(claveMala.errores[0]).toContain('incorrecta');
    expect(sonda.actual().auth.usuario).toBeNull(); // nadie quedó conectado

    // Caso 2: cuenta desactivada. Primero la desactivo, como lo haría el administrador
    act(() => sonda.actual().data.alternarActivo('pedro.pascal@gmail.com'));
    const desactivada = intentar('pedro.pascal@gmail.com', 'Cliente123*'); // la clave es correcta

    expect(desactivada.ok).toBe(false);
    expect(desactivada.errores[0]).toContain('desactivada');
  });
});

describe('Carrito de compras (CarritoContext)', () => {
  // PRUEBA 12
  it('agregar suma los productos y el total; quitar elimina solo el producto indicado', () => {
    localStorage.clear();
    const sonda = crearSonda(() => useCarrito());
    render(
      <Proveedores>
        <sonda.Sonda />
      </Proveedores>
    );

    // Agrego dos productos: el carrito calcula el total
    act(() => sonda.actual().agregar('Producto A', 1000));
    act(() => sonda.actual().agregar('Producto B', 2500));
    expect(sonda.actual().items.length).toBe(2);
    expect(sonda.actual().total).toBe(3500);

    // Quito el primero: solo desaparece ese y el total baja
    const idDeA = sonda.actual().items[0].id;
    act(() => sonda.actual().quitar(idDeA));
    expect(sonda.actual().items.length).toBe(1);
    expect(sonda.actual().items[0].nombre).toBe('Producto B');
    expect(sonda.actual().total).toBe(2500);
  });
});
