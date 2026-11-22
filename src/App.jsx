import { Navigate, Route, Routes } from 'react-router-dom';
import LayoutPublico from './components/LayoutPublico';
import RutaProtegida from './components/RutaProtegida';
import Contacto from './pages/Contacto';
import Inicio from './pages/Inicio';
import MiPortal from './pages/MiPortal';
import Pago from './pages/Pago';
import PanelAdmin from './pages/PanelAdmin';
import PanelCliente from './pages/PanelCliente';
import PanelRecepcion from './pages/PanelRecepcion';
import PanelVeterinario from './pages/PanelVeterinario';
import Registro from './pages/Registro';
import Servicios from './pages/Servicios';
import SolicitarCita from './pages/SolicitarCita';

// Este es el mapa de rutas: dice qué pantalla se muestra según la dirección (URL).
export default function App() {
  return (
    <Routes>
      {/* Páginas públicas: todas comparten la misma barra de arriba, el pie de página y el carrito */}
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/solicitar-cita" element={<SolicitarCita />} />
        <Route path="/mi-portal" element={<MiPortal />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      {/* Por si alguien guardó el enlace antiguo /tienda, lo mando a Servicios (ahí quedó la tienda) */}
      <Route path="/tienda" element={<Navigate to="/servicios" replace />} />
      {/* La pantalla de pago tiene su propio encabezado, por eso va fuera del layout público */}
      <Route path="/pago" element={<Pago />} />

      {/* Paneles internos: RutaProtegida deja pasar solo a los roles que indico.
         Si alguien sin permiso intenta entrar, lo manda al login. */}
      <Route path="/panel-admin" element={<RutaProtegida roles={['administrador']}><PanelAdmin /></RutaProtegida>} />
      <Route path="/panel-recepcion" element={<RutaProtegida roles={['secretaria', 'administrador']}><PanelRecepcion /></RutaProtegida>} />
      <Route path="/panel-veterinario" element={<RutaProtegida roles={['veterinario']}><PanelVeterinario /></RutaProtegida>} />
      <Route path="/panel-cliente" element={<RutaProtegida roles={['cliente']}><PanelCliente /></RutaProtegida>} />

      {/* Si escriben una dirección que no existe, los mando al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
