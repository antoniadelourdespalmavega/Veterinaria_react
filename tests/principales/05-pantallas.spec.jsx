import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import MiPortal from '../../src/pages/MiPortal';
import Pago from '../../src/pages/Pago';
import PanelAdmin from '../../src/pages/PanelAdmin';
import PanelCliente from '../../src/pages/PanelCliente';
import PanelRecepcion from '../../src/pages/PanelRecepcion';
import SolicitarCita from '../../src/pages/SolicitarCita';
import { fechaFutura, renderizarConProveedores } from '../ayudas/envoltorio';

// =====================================================================
// PRUEBAS PRINCIPALES - Parte 5: pantallas completas (pruebas de INTEGRACIÓN)
//
// Aquí ya no pruebo una pieza suelta: dibujo la pantalla entera con todos sus
// componentes y contextos, y simulo lo que haría una persona (escribir y hacer clic).
// Compruebo que todas las piezas funcionen bien JUNTAS.
// Las ventanas (modals) de Bootstrap tienen animación, por eso uso "await findBy..." y
// "waitFor": esperan a que aparezca (o desaparezca) algo en la pantalla.
// =====================================================================

describe('Pantallas completas', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => sessionStorage.clear());

  // Deja guardada la sesión de un usuario, como si ya hubiera iniciado sesión
  const iniciarSesionComo = (usuario) => sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  const secretaria = { nombre: 'Camila Morales', correo: 'camila.recepcion@sanmarcos.cl', rol: 'secretaria' };

  // Lee el número de una tarjeta de métrica a partir de su etiqueta
  const metrica = (etiqueta) => screen.getByText(etiqueta).nextSibling.textContent;

  // PRUEBA 18
  describe('login', () => {
    // Uso el reloj falso de Jasmine para no esperar 2 segundos de verdad: yo adelanto el tiempo
    beforeEach(() => jasmine.clock().install());
    afterEach(() => jasmine.clock().uninstall());

    it('un login correcto muestra la bienvenida y a los 2 segundos lleva al panel', () => {
      renderizarConProveedores(
        <Routes>
          <Route path="/mi-portal" element={<MiPortal />} />
          <Route path="/panel-admin" element={<div>Panel admin abierto</div>} />
        </Routes>,
        { ruta: '/mi-portal' }
      );

      // Simulo que el usuario escribe su correo y su clave y presiona Ingresar
      fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'admin@sanmarcos.cl' } });
      fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Admin2026*' } });
      fireEvent.click(screen.getByRole('button', { name: /Ingresar/ }));

      expect(screen.getByText('¡Autenticación exitosa!')).toBeTruthy();
      expect(screen.queryByText('Panel admin abierto')).toBeNull(); // todavía no pasaron los 2 segundos

      act(() => jasmine.clock().tick(2100)); // adelanto el reloj 2,1 segundos

      expect(screen.getByText('Panel admin abierto')).toBeTruthy();
    });
  });

  // PRUEBA 19
  it('PRIVACIDAD: un cliente solo ve SUS mascotas y puede abrir la receta de una de ellas', async () => {
    iniciarSesionComo({ nombre: 'Camila Vallejo', correo: 'camila.vallejo@veterinaria.cl', rol: 'cliente' });
    renderizarConProveedores(<PanelCliente />);

    expect(screen.getAllByText('Michi').length).toBeGreaterThan(0); // su mascota sí aparece
    // Las mascotas de Pedro Pascal NO deben aparecer (queryByText devuelve null si no existe)
    expect(screen.queryByText('Rocky')).toBeNull();
    expect(screen.queryByText('Max')).toBeNull();

    // Además puede abrir la receta médica de su mascota
    fireEvent.click(screen.getByRole('button', { name: /Ver Receta/ }));
    expect(await screen.findByText('Indicaciones de Tratamiento Veterinario')).toBeTruthy();
  });

  // PRUEBA 20
  it('Recepción confirma una solicitud pendiente y la cita pasa a Confirmada', async () => {
    // Dejo guardada una solicitud pendiente, como si un cliente la hubiera pedido desde la web
    localStorage.setItem('citasSanMarcos', JSON.stringify([{
      idCita: 'C-1', estado: 'Pendiente', fecha: fechaFutura(5), hora: '12:30', dueno: 'Ana Prueba',
      telefono: 'Sin registrar', correo: 'ana@gmail.com', mascota: 'Toby', especie: 'Por definir',
      raza: 'Por definir', doctor: 'Por asignar', motivo: 'Vacunación',
    }]));
    iniciarSesionComo(secretaria);
    renderizarConProveedores(<PanelRecepcion />);

    // La secretaria presiona Confirmar y elige veterinario en la ventana que se abre
    fireEvent.click(screen.getByText('Confirmar'));
    await screen.findByText('Confirmar Solicitud de Cita');

    fireEvent.change(screen.getByLabelText('Médico Veterinario'), { target: { value: 'Dr. Daniel Morales' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Cita' }));

    // La cita ya no está pendiente: el contador baja a 0 y ahora aparece el botón Reagendar
    await waitFor(() => expect(metrica('Solicitudes por Confirmar')).toBe('0'));
    expect(screen.getByText('Reagendar')).toBeTruthy();
  });

  // PRUEBA 21
  it('Recepción agenda una cita presencial, y rechaza una segunda en el mismo horario', async () => {
    iniciarSesionComo(secretaria);
    renderizarConProveedores(<PanelRecepcion />);

    // Atajo 1: abre la ventana de "Agendar Cita Presencial" y espera a que aparezca
    const abrirFormulario = async () => {
      fireEvent.click(screen.getByRole('button', { name: /Agendar Cita Presencial/ }));
      await screen.findByText('Agendar Cita para Paciente');
    };

    // Atajo 2: llena el formulario con datos válidos (mismo veterinario, día y bloque cada vez)
    const llenarFormulario = () => {
      fireEvent.change(screen.getByLabelText('Nombre Cliente *'), { target: { value: 'Ana Prueba' } });
      fireEvent.change(screen.getByLabelText('Teléfono Móvil (Chile) *'), { target: { value: '+56 9 1111 2222' } });
      fireEvent.change(screen.getByLabelText('Correo Electrónico *'), { target: { value: 'ana@gmail.com' } });
      fireEvent.change(screen.getByLabelText('Nombre Mascota *'), { target: { value: 'Toby' } });
      fireEvent.change(screen.getByLabelText('Raza *'), { target: { value: 'Mestizo' } });
      fireEvent.change(screen.getByLabelText('Médico Veterinario *'), { target: { value: 'Dr. Kevin Silva' } });
      fireEvent.change(screen.getByLabelText('Fecha de Atención *'), { target: { value: fechaFutura(5) } });
      fireEvent.change(screen.getByLabelText('Bloque Horario *'), { target: { value: '10:00 - 10:30' } });
      fireEvent.change(screen.getByLabelText('Motivo de la Cita / Síntomas *'), { target: { value: 'Control anual de salud' } });
    };

    const confirmar = () => fireEvent.click(screen.getByRole('button', { name: 'Confirmar Cita' }));

    // 1) Formulario casi vacío: muestra errores de validación y no guarda nada
    await abrirFormulario();
    confirmar();
    expect(screen.getByText('Corrija los siguientes campos:')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('citasSanMarcos')).length).toBe(3); // solo las 3 base

    // 2) Datos válidos: la cita queda confirmada y la ventana se cierra
    llenarFormulario();
    confirmar();
    // Espero a que la cita quede guardada (no espero a que la ventana desaparezca: sin el CSS de
    // Bootstrap, que no cargo en las pruebas, su animación de cierre no termina)
    await waitFor(() => expect(JSON.parse(localStorage.getItem('citasSanMarcos'))[0].estado).toBe('Confirmada'));

    // 3) Intento agendar OTRA cita con el mismo veterinario, día y bloque: el sistema la rechaza
    await abrirFormulario();
    llenarFormulario();
    confirmar();
    expect(await screen.findByText(/ya tiene una cita reservada/)).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('citasSanMarcos')).length).toBe(4); // 3 base + la primera
  });

  // PRUEBA 22
  it('Recepción registra una ficha de paciente y después cobra su tratamiento', async () => {
    iniciarSesionComo(secretaria);
    renderizarConProveedores(<PanelRecepcion />);

    // 1) Pestaña de fichas: intento guardar vacío y veo los errores
    fireEvent.click(screen.getByRole('button', { name: /Fichas de Pacientes/ }));
    fireEvent.click(screen.getByRole('button', { name: /Nueva Ficha/ }));
    await screen.findByText('Registrar Nueva Ficha de Paciente');
    fireEvent.click(screen.getByRole('button', { name: /Guardar Ficha/ }));
    expect(screen.getByText('Corrija los siguientes campos:')).toBeTruthy();

    // 2) Lleno el formulario con datos válidos y guardo
    fireEvent.change(screen.getByLabelText('Nombre Completo *'), { target: { value: 'Ana Prueba' } });
    fireEvent.change(screen.getByLabelText('Teléfono Móvil *'), { target: { value: '+56 9 1111 2222' } });
    fireEvent.change(screen.getByLabelText('Correo *'), { target: { value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Toby' } });
    fireEvent.change(screen.getByLabelText('Raza *'), { target: { value: 'Mestizo' } });
    fireEvent.change(screen.getByLabelText('Edad *'), { target: { value: '2 años' } });
    fireEvent.change(screen.getByLabelText('Peso (kg) *'), { target: { value: '8.5' } });
    fireEvent.change(screen.getByLabelText('Motivo de Ingreso *'), { target: { value: 'Vacuna anual' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar Ficha/ }));

    // La ficha aparece en la tabla, queda con el id PAC-101 y suma una cuenta por cobrar (3 base + 1)
    expect(await screen.findByText('Toby')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('fichasClinicasSanMarcos'))[0].id).toBe('PAC-101');
    expect(metrica('Cuentas por Cobrar')).toBe('4');

    // 3) Voy a la caja y cobro el tratamiento (la ficha nueva es la primera de la lista)
    fireEvent.click(screen.getByRole('button', { name: /Caja y Cobro/ }));
    // Ojo: el encabezado de la columna también dice "Cobrar", por eso busco solo los BOTONES con ese nombre
    fireEvent.click(screen.getAllByRole('button', { name: /Cobrar/ })[0]);
    await screen.findByText('Cobro en Recepción');
    fireEvent.click(screen.getByRole('button', { name: /Registrar Cobro y Emitir Comprobante/ }));

    // Aparece el comprobante y la cuenta por cobrar baja a 3 de nuevo
    expect(await screen.findByText('Comprobante de Pago')).toBeTruthy();
    expect(metrica('Cuentas por Cobrar')).toBe('3');
  });

  // PRUEBA 23
  it('el administrador crea un usuario desde su panel y luego lo desactiva', async () => {
    // MOCK: reemplazo window.confirm (la pregunta "¿está seguro?") para que responda que sí sin abrir un cuadro real
    spyOn(window, 'confirm').and.returnValue(true);
    iniciarSesionComo({ nombre: 'Vicente Julio Zapata', correo: 'admin@sanmarcos.cl', rol: 'administrador' });
    renderizarConProveedores(<PanelAdmin />);

    expect(metrica('Total Cuentas')).toBe('8');

    // 1) Creo un usuario nuevo con rol administrador
    fireEvent.click(screen.getByRole('button', { name: 'Crear Usuario' }));
    await screen.findByText('Crear Nuevo Usuario');
    fireEvent.change(screen.getByLabelText('Nombre Completo'), { target: { value: 'Matías Ramos' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'matias@sanmarcos.cl' } });
    fireEvent.change(screen.getByLabelText('Rol en el Sistema'), { target: { value: 'administrador' } });
    fireEvent.change(screen.getByLabelText('Contraseña Temporal'), { target: { value: 'Clave1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear Usuario y Asignar Acceso/ }));

    await waitFor(() => expect(metrica('Total Cuentas')).toBe('9'));

    // 2) Lo desactivo desde la tabla: queda en la lista pero marcado como Desactivado
    const fila = screen.getByText('matias@sanmarcos.cl').closest('tr');
    fireEvent.click(fila.querySelector('button[title="Desactivar usuario"]'));

    expect(window.confirm).toHaveBeenCalled();
    expect(metrica('Cuentas Desactivadas')).toBe('1');
    expect(screen.getByText('Desactivado')).toBeTruthy();
  });

  // PRUEBA 24
  it('un cliente solicita una cita: se valida el formulario, queda Pendiente y no se repite el horario', () => {
    iniciarSesionComo({ nombre: 'Pedro Pascal', correo: 'pedro.pascal@gmail.com', rol: 'cliente' });
    renderizarConProveedores(<SolicitarCita />);

    // Como hay un cliente conectado, el formulario le precarga su nombre y su correo
    expect(screen.getByLabelText('Nombre del Dueño').value).toBe('Pedro Pascal');

    const agendar = () => fireEvent.click(screen.getByRole('button', { name: /Agendar/ }));

    // 1) Si presiona Agendar sin completar el resto, ve los errores
    agendar();
    expect(screen.getByText(/Selecciona el tipo de servicio/)).toBeTruthy();

    // 2) Completa el formulario con datos válidos: la solicitud se guarda como Pendiente
    fireEvent.change(screen.getByLabelText('Nombre de la Mascota'), { target: { value: 'Rocky' } });
    fireEvent.change(screen.getByLabelText('Tipo de Servicio'), { target: { value: 'vacunacion' } });
    fireEvent.change(screen.getByLabelText('Fecha de Atención'), { target: { value: fechaFutura(5) } });
    fireEvent.change(screen.getByLabelText('Hora de Atención'), { target: { value: '12:30' } });
    agendar();

    expect(screen.getByText('¡Cita agendada con éxito!')).toBeTruthy();
    const guardada = JSON.parse(localStorage.getItem('citasSanMarcos'))[0];
    expect(guardada.estado).toBe('Pendiente'); // espera a que Recepción la confirme
    expect(guardada.motivo).toBe('Vacunación');

    // 3) Si intenta reservar el mismo día y hora otra vez, el sistema se lo impide
    agendar();
    expect(screen.getByText(/HORA NO DISPONIBLE/)).toBeTruthy();
  });

  // PRUEBA 25
  describe('pago', () => {
    beforeEach(() => jasmine.clock().install());
    afterEach(() => jasmine.clock().uninstall());

    it('el pago simulado (asíncrono) se aprueba y muestra el código de transacción', async () => {
      // Dejo un producto en el carrito antes de abrir la pantalla de pago
      localStorage.setItem('carrito_san_marcos', JSON.stringify([{ id: 1, nombre: 'Producto de prueba', precio: 12500 }]));
      renderizarConProveedores(
        <Routes>
          <Route path="/pago" element={<Pago />} />
          <Route path="/" element={<div>Inicio</div>} />
        </Routes>,
        { ruta: '/pago' }
      );

      fireEvent.change(screen.getByLabelText('Nombre Completo'), { target: { value: 'Pedro Pascal' } });
      fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'pedro@correo.cl' } });
      fireEvent.click(screen.getByRole('button', { name: /Pagar Ahora/ }));

      // Mientras el banco "responde" el botón muestra el estado de carga
      expect(screen.getByText(/Procesando con el banco/)).toBeTruthy();

      // La pasarela simulada tarda 2 segundos y responde con una Promesa (async).
      // Adelanto el reloj y dejo que la promesa termine con "await act(async ...)".
      await act(async () => {
        jasmine.clock().tick(2100);
      });

      expect(screen.getByText('¡Pago Aprobado!')).toBeTruthy();
      expect(screen.getByText(/TXN-/)).toBeTruthy(); // aparece el código de transacción
    });
  });
});
