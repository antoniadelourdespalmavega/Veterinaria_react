import { fireEvent, render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import ModalReceta from '../../src/components/cliente/ModalReceta';
import TarjetaMascota from '../../src/components/cliente/TarjetaMascota';
import PanelLayout from '../../src/components/paneles/PanelLayout';
import TablaFichas from '../../src/components/recepcion/TablaFichas';
import TablaCitas from '../../src/components/recepcion/TablaCitas';
import RutaProtegida from '../../src/components/RutaProtegida';
import { CLAVES } from '../../src/utils/almacenamiento';
import { renderizarConProveedores } from '../ayudas/envoltorio';

// =====================================================================
// PRUEBAS COMPLEMENTARIAS - Parte 6: más casos para subir la cobertura
//
// Aquí pruebo los caminos que las pruebas principales no recorren:
// - roles permitidos y no permitidos en RutaProtegida
// - todos los estados de una cita en TablaCitas
// - tablas vacías, tarjetas y ventanas con datos distintos
// Siguen el mismo patrón: dibujo el componente, simulo la acción y compruebo con expect(...).
// =====================================================================

// Cita de ejemplo; cada prueba cambia solo lo que necesita
const citaBase = {
  idCita: 'C-9', estado: 'Pendiente', fecha: '2026-11-10', hora: '10:00 - 10:30', dueno: 'Ana',
  telefono: '+56 9 1111 2222', mascota: 'Toby', especie: 'Canino', raza: 'Mestizo',
  doctor: 'Por asignar', motivo: 'Control',
};

// Ficha de mascota de ejemplo
const fichaBase = {
  id: 'F-1', mascota: 'Luna', especie: 'Felino', raza: 'Siamés', edad: '3 años', peso: '4 kg',
  dueno: 'Pedro', telefono: '+56 9 3333 4444', correo: 'pedro@gmail.com', condiciones: '',
  problema: 'Control anual', tratamiento: 'Vacuna anual cada 12 meses', estado: 'En tratamiento',
};

// Dibuja RutaProtegida dentro de rutas de mentira para ver a dónde me manda
function dibujarRuta(usuario, roles) {
  sessionStorage.clear();
  if (usuario) sessionStorage.setItem(CLAVES.sesion, JSON.stringify(usuario));
  renderizarConProveedores(
    <Routes>
      <Route path="/panel" element={<RutaProtegida roles={roles}><div>Contenido secreto</div></RutaProtegida>} />
      <Route path="/mi-portal" element={<div>Pantalla de login</div>} />
    </Routes>,
    { ruta: '/panel' }
  );
}

describe('RutaProtegida (roles)', () => {
  afterEach(() => sessionStorage.clear());

  // PRUEBA 26
  it('deja pasar a un usuario cuyo rol está permitido', () => {
    dibujarRuta({ nombre: 'Vicente', rol: 'administrador' }, ['administrador']);

    expect(screen.getByText('Contenido secreto')).toBeTruthy();
  });

  // PRUEBA 27
  it('manda al login a un usuario con sesión pero con un rol no permitido', () => {
    dibujarRuta({ nombre: 'Pedro', rol: 'cliente' }, ['administrador']);

    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.queryByText('Contenido secreto')).toBeNull();
  });
});

describe('TablaCitas (estados)', () => {
  // PRUEBA 28
  it('una cita Confirmada ofrece Reagendar y Anular y llama a las funciones correctas', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onConfirmar', 'onReagendar', 'onAnular']);
    const confirmada = { ...citaBase, estado: 'Confirmada' };
    render(<TablaCitas citas={[confirmada]} {...acciones} />);

    expect(screen.queryByText('Confirmar')).toBeNull(); // ya está confirmada
    fireEvent.click(screen.getByText('Reagendar'));
    fireEvent.click(screen.getByText('Anular'));

    expect(acciones.onReagendar).toHaveBeenCalledWith(confirmada);
    expect(acciones.onAnular).toHaveBeenCalledWith(confirmada);
  });

  // PRUEBA 29
  it('una cita Pendiente se puede Rechazar (llama a onAnular)', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onConfirmar', 'onReagendar', 'onAnular']);
    render(<TablaCitas citas={[citaBase]} {...acciones} />);

    fireEvent.click(screen.getByText('Rechazar'));

    expect(acciones.onAnular).toHaveBeenCalledWith(citaBase);
  });

  // PRUEBA 30
  it('las citas Completada y Anulada no tienen botones, solo una etiqueta', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onConfirmar', 'onReagendar', 'onAnular']);
    const citas = [
      { ...citaBase, idCita: 'C-1', estado: 'Completada' },
      { ...citaBase, idCita: 'C-2', estado: 'Anulada' },
    ];
    render(<TablaCitas citas={citas} {...acciones} />);

    expect(screen.getByText('Cita Completada')).toBeTruthy();
    expect(screen.getByText('Cita Anulada')).toBeTruthy();
    expect(screen.queryAllByRole('button').length).toBe(0);
  });

  // PRUEBA 31
  it('sin citas muestra el mensaje de tabla vacía, y una reagendada muestra la fecha anterior', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onConfirmar', 'onReagendar', 'onAnular']);
    const { rerender } = render(<TablaCitas citas={[]} {...acciones} />);
    expect(screen.getByText('No se registran citas agendadas con este criterio.')).toBeTruthy();

    rerender(<TablaCitas citas={[{ ...citaBase, estado: 'Confirmada', fechaAnterior: '2026-11-01' }]} {...acciones} />);
    expect(screen.getByText(/antes: 2026-11-01/)).toBeTruthy();
  });
});

describe('TablaFichas', () => {
  // PRUEBA 32
  it('muestra las fichas y al presionar Editar entrega la ficha completa', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onEditar']);
    render(<TablaFichas fichas={[fichaBase]} {...acciones} />);

    expect(screen.getByText('Luna')).toBeTruthy();
    expect(screen.getByText('Sin antecedentes')).toBeTruthy(); // la ficha no tiene condiciones previas
    fireEvent.click(screen.getByText('Editar'));

    expect(acciones.onEditar).toHaveBeenCalledWith(fichaBase);
  });

  // PRUEBA 33
  it('sin fichas muestra el mensaje de tabla vacía', () => {
    render(<TablaFichas fichas={[]} onEditar={() => {}} />);

    expect(screen.getByText('No hay fichas de pacientes registradas.')).toBeTruthy();
  });
});

describe('TarjetaMascota', () => {
  // PRUEBA 34
  it('una mascota en tratamiento muestra su etiqueta y avisa con la ficha al ver indicaciones', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onVerReceta']);
    render(<TarjetaMascota mascota={fichaBase} {...acciones} />);

    expect(screen.getByText('En Tratamiento')).toBeTruthy();
    expect(screen.getByText(/Ninguna/)).toBeTruthy(); // sin condiciones previas
    fireEvent.click(screen.getByText(/Ver Indicaciones Médicas/));

    expect(acciones.onVerReceta).toHaveBeenCalledWith(fichaBase);
  });

  // PRUEBA 35
  it('una mascota con alta médica muestra la etiqueta "Alta Médica"', () => {
    const finalizada = { ...fichaBase, estado: 'Finalizado', especie: 'Canino' };
    render(<TarjetaMascota mascota={finalizada} onVerReceta={() => {}} />);

    expect(screen.getByText('Alta Médica')).toBeTruthy();
    expect(screen.queryByText('En Tratamiento')).toBeNull();
  });
});

describe('ModalReceta', () => {
  // PRUEBA 36
  it('muestra el diagnóstico y el tratamiento de la mascota y se cierra con el botón Cerrar', () => {
    const acciones = jasmine.createSpyObj('acciones', ['onHide']);
    render(<ModalReceta show={true} onHide={acciones.onHide} mascota={fichaBase} />);

    expect(screen.getByText('Control anual')).toBeTruthy();
    expect(screen.getByText('Vacuna anual cada 12 meses')).toBeTruthy();
    expect(screen.getByText(/Tratamiento en Curso/)).toBeTruthy();
    fireEvent.click(screen.getByText('Cerrar'));

    expect(acciones.onHide).toHaveBeenCalled();
  });

  // PRUEBA 37
  it('usa textos por defecto cuando faltan datos y marca el alta médica si terminó', () => {
    const sinDatos = { ...fichaBase, estado: 'Finalizado', problema: '', tratamiento: '', condiciones: '' };
    render(<ModalReceta show={true} onHide={() => {}} mascota={sinDatos} />);

    expect(screen.getByText('Control general')).toBeTruthy();
    expect(screen.getByText('Sin tratamiento médico registrado')).toBeTruthy();
    expect(screen.getByText('Sin antecedentes reportados')).toBeTruthy();
    expect(screen.getByText(/Alta Médica/)).toBeTruthy();
  });

  // PRUEBA 38
  it('el botón Imprimir llama a window.print (espía) sin abrir el diálogo real', () => {
    spyOn(window, 'print'); // mock: reemplaza window.print para que no abra nada
    render(<ModalReceta show={true} onHide={() => {}} mascota={fichaBase} />);

    fireEvent.click(screen.getByText(/Imprimir Receta/));

    expect(window.print).toHaveBeenCalledTimes(1);
  });
});

describe('PanelLayout', () => {
  afterEach(() => sessionStorage.clear());

  // PRUEBA 39
  it('muestra el usuario conectado, la marca y el contenido, y Salir cierra la sesión', () => {
    sessionStorage.setItem(CLAVES.sesion, JSON.stringify({ nombre: 'Camila Morales', rol: 'secretaria' }));
    renderizarConProveedores(
      <Routes>
        <Route path="/panel" element={<PanelLayout marca="Recepción" cargo="Secretaría" pie="Panel interno"><p>Contenido del panel</p></PanelLayout>} />
        <Route path="/mi-portal" element={<div>Pantalla de login</div>} />
      </Routes>,
      { ruta: '/panel' }
    );

    expect(screen.getByText('Camila Morales')).toBeTruthy();
    expect(screen.getByText('Contenido del panel')).toBeTruthy();
    fireEvent.click(screen.getByText(/Salir/));

    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(sessionStorage.getItem(CLAVES.sesion)).toBeNull(); // la sesión se borró
  });
});
