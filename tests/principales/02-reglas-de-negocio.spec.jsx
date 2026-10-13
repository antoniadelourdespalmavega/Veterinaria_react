import { act, render } from '@testing-library/react';
import { DataProvider, useData } from '../../src/context/DataContext';
import { crearSonda, fechaFutura, proximoDomingo } from '../ayudas/envoltorio';

// =====================================================================
// PRUEBAS PRINCIPALES - Parte 2: reglas de negocio (usuarios y citas)
//
// Aquí pruebo la lógica más importante del sistema, que vive en DataContext.
// Para probar un contexto uso una "sonda": un componente invisible que me deja
// llamar a las funciones del contexto y ver el resultado, sin dibujar una pantalla.
// act() le avisa a React que voy a cambiar el estado, para que se actualice antes de verificar.
// =====================================================================

describe('Reglas de negocio (DataContext)', () => {
  let sonda;

  // Datos de ejemplo para crear una cita presencial
  const citaPresencial = (extra = {}) => ({
    dueno: 'Ana Prueba', telefono: '+56 9 1111 2222', correo: 'ana@gmail.com', mascota: 'Toby',
    especie: 'Canino', raza: 'Mestizo', doctor: 'Dr. Daniel Morales', fecha: fechaFutura(7),
    hora: '09:00 - 09:30', motivo: 'Control general', ...extra,
  });

  // Antes de CADA prueba: limpio el navegador (para partir con los datos base) y dibujo el contexto
  beforeEach(() => {
    localStorage.clear();
    sonda = crearSonda(() => useData());
    render(
      <DataProvider>
        <sonda.Sonda />
      </DataProvider>
    );
  });

  // PRUEBA 5
  it('NO permite agendar dos citas del mismo veterinario en el mismo día y hora', () => {
    act(() => { sonda.actual().agendarCitaPresencial(citaPresencial()); }); // la primera entra bien

    let resultado;
    // Intento otra cita con el mismo veterinario, fecha y bloque
    act(() => { resultado = sonda.actual().agendarCitaPresencial(citaPresencial({ mascota: 'Otra' })); });

    expect(resultado).toContain('ya tiene una cita reservada'); // devuelve un mensaje de error
    expect(sonda.actual().citas.length).toBe(4); // 3 citas base + la primera. La segunda no entró
  });

  // PRUEBA 6
  it('una solicitud de cliente nace Pendiente y, al confirmarla, pasa a Confirmada con veterinario', () => {
    // 1) El cliente solicita la cita desde la web
    act(() => {
      sonda.actual().solicitarCita({
        dueno: 'Ana', correo: 'ana@gmail.com', mascota: 'Toby', fecha: fechaFutura(5), hora: '12:30', motivo: 'Vacunación',
      });
    });
    const nueva = sonda.actual().citas[0]; // las citas nuevas se agregan al principio
    expect(nueva.estado).toBe('Pendiente');
    expect(nueva.doctor).toBe('Por asignar');

    // 2) Recepción la confirma asignándole veterinario, fecha y bloque
    let resultado;
    act(() => {
      resultado = sonda.actual().gestionarCita(nueva.idCita, { doctor: 'Dr. Kevin Silva', fecha: fechaFutura(5), hora: '10:00 - 10:30' }, 'confirmar');
    });

    const confirmada = sonda.actual().citas.find((c) => c.idCita === nueva.idCita);
    expect(resultado).toBeNull(); // null significa "no hubo error"
    expect(confirmada.estado).toBe('Confirmada');
    expect(confirmada.doctor).toBe('Dr. Kevin Silva');
  });

  // PRUEBA 7
  it('NO permite confirmar una cita en domingo (la clínica no atiende)', () => {
    act(() => {
      sonda.actual().solicitarCita({ dueno: 'Ana', correo: 'ana@gmail.com', mascota: 'Toby', fecha: fechaFutura(5), hora: '12:30', motivo: 'Control' });
    });
    const id = sonda.actual().citas[0].idCita;

    let resultado;
    act(() => {
      resultado = sonda.actual().gestionarCita(id, { doctor: 'Dr. Kevin Silva', fecha: proximoDomingo(), hora: '10:00 - 10:30' }, 'confirmar');
    });

    expect(resultado).toContain('domingos');
  });

  // PRUEBA 8
  it('el administrador puede desactivar una cuenta sin borrarla', () => {
    act(() => sonda.actual().alternarActivo('pedro.pascal@gmail.com'));

    expect(sonda.actual().buscarUsuario('pedro.pascal@gmail.com').activo).toBe(false);
    expect(sonda.actual().usuarios.length).toBe(8); // sigue en la lista: no se borró
  });

  // PRUEBA 9
  it('NO permite crear un usuario con un correo que ya existe', () => {
    let resultado;
    act(() => {
      resultado = sonda.actual().crearUsuario({ nombre: 'Otro Admin', correo: 'admin@sanmarcos.cl', rol: 'administrador', clave: 'Clave1234' });
    });

    expect(resultado).toContain('Ya existe');
    expect(sonda.actual().usuarios.length).toBe(8); // no se agregó nadie
  });
});
