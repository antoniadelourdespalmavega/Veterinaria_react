import { fireEvent, render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import MetricCard from '../../src/components/paneles/MetricCard';
import RutaProtegida from '../../src/components/RutaProtegida';
import TablaCitas from '../../src/components/recepcion/TablaCitas';
import TablaUsuarios from '../../src/components/admin/TablaUsuarios';
import TarjetaProducto from '../../src/components/TarjetaProducto';
import { renderizarConProveedores } from '../ayudas/envoltorio';

// =====================================================================
// PRUEBAS PRINCIPALES - Parte 4: componentes React
//
// Cada prueba de componente sigue estos pasos:
//   1. render(<Componente />)            -> dibujo el componente
//   2. screen.getByText('...')           -> busco algo en la pantalla
//   3. expect(...).toBeTruthy()          -> compruebo que exista
//
// Además uso MOCKS: jasmine.createSpyObj crea un objeto con funciones "espía" que reemplazan
// a las funciones reales. No hacen nada, pero me dicen si el componente las llamó y con qué datos.
// =====================================================================

describe('Componentes', () => {
  // PRUEBA 13
  it('MetricCard muestra la etiqueta y el valor que recibe por props', () => {
    render(<MetricCard icono="bi-star" etiqueta="Citas para Hoy" valor={7} />);

    expect(screen.getByText('Citas para Hoy')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
  });

  // PRUEBA 14
  it('TarjetaProducto: al presionar "Añadir" avisa con el producto y su precio', () => {
    // Mock: un objeto con la función onAgregar espiada
    const acciones = jasmine.createSpyObj('acciones', ['onAgregar']);
    const producto = {
      imagen: '/img/comida_perro1.png', alt: 'Alimento', nombre: 'Old Prince Senior (3kg)',
      descripcion: 'Cuida articulaciones.', precio: 12500, nombreCarrito: 'Old Prince Senior 3kg',
    };
    render(<TarjetaProducto producto={producto} onAgregar={acciones.onAgregar} />);

    expect(screen.getByText('$12.500')).toBeTruthy(); // el precio aparece formateado
    fireEvent.click(screen.getByText('Añadir al Carrito')); // simulo el clic del usuario

    expect(acciones.onAgregar).toHaveBeenCalledTimes(1);
    expect(acciones.onAgregar).toHaveBeenCalledWith('Old Prince Senior 3kg', 12500);
  });

  // PRUEBA 15
  it('TablaCitas: una cita Pendiente ofrece Confirmar y llama a onConfirmar', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onConfirmar', 'onReagendar', 'onAnular']);
    const pendiente = {
      idCita: 'C-1', estado: 'Pendiente', fecha: '2026-11-10', hora: '10:00 - 10:30', dueno: 'Ana',
      telefono: '+56 9 1111 2222', mascota: 'Toby', especie: 'Canino', raza: 'Mestizo',
      doctor: 'Por asignar', motivo: 'Control',
    };
    render(<TablaCitas citas={[pendiente]} {...acciones} />);

    expect(screen.queryByText('Reagendar')).toBeNull(); // una pendiente NO se reagenda todavía
    fireEvent.click(screen.getByText('Confirmar'));

    expect(acciones.onConfirmar).toHaveBeenCalledWith(pendiente);
  });

  // PRUEBA 16
  it('TablaUsuarios: el usuario conectado NO tiene botón para desactivarse a sí mismo', () => {
    const admin = { nombre: 'Vicente Zapata', correo: 'admin@sanmarcos.cl', rol: 'administrador', tipo: 'Base', activo: true };
    const vet = { nombre: 'Dr. Daniel Morales', correo: 'daniel@sanmarcos.cl', rol: 'veterinario', tipo: 'Base', activo: true };
    const acciones = jasmine.createSpyObj('acciones', ['onEditar', 'onAlternar']);
    render(<TablaUsuarios usuarios={[admin, vet]} correoSesion="admin@sanmarcos.cl" {...acciones} />);

    // Hay 2 usuarios pero solo 1 botón de desactivar: el del veterinario, no el del administrador conectado
    expect(screen.getAllByTitle('Desactivar usuario').length).toBe(1);
  });

  // PRUEBA 17
  it('RutaProtegida: sin sesión manda al login y NO muestra el contenido privado', () => {
    sessionStorage.clear();
    renderizarConProveedores(
      <Routes>
        <Route path="/panel" element={<RutaProtegida roles={['administrador']}><div>Contenido secreto</div></RutaProtegida>} />
        <Route path="/mi-portal" element={<div>Pantalla de login</div>} />
      </Routes>,
      { ruta: '/panel' }
    );

    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.queryByText('Contenido secreto')).toBeNull();
  });
});
