import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente protege las páginas internas: solo deja pasar a alguien con sesión
// y con alguno de los roles que le indique.
export default function RutaProtegida({ roles, children }) {
  // Veo quién está conectado
  const { usuario } = useAuth();

  // Si no hay sesión, lo mando al login
  if (!usuario) return <Navigate to="/mi-portal" replace />;
  // Si tiene sesión pero su rol no está permitido, lo mando al login con un aviso
  if (!roles.includes(usuario.rol)) {
    return <Navigate to="/mi-portal" replace state={{ aviso: 'No tienes permiso para ver esa sección.' }} />;
  }
  // Si todo está bien, muestro la página que me pasaron dentro (children)
  return children;
}
