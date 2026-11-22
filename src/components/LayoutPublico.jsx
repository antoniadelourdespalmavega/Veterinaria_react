import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CarritoOffcanvas from './CarritoOffcanvas';
import FooterPublico from './FooterPublico';
import NavbarPublica from './NavbarPublica';

// Este es el "marco" de las páginas públicas: barra de arriba + el contenido de cada ruta + pie de página + carrito.
// Así no repito la barra y el pie en cada página.
export default function LayoutPublico() {
  // pathname es la ruta actual (ej: /servicios) y hash es el ancla (ej: #tienda)
  const { pathname, hash } = useLocation();

  // Cada vez que cambia la ruta o el ancla: si hay ancla (como /#equipo) bajo hasta ese elemento,
  // y si no, subo al principio de la página.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      {/* Barra de navegación de arriba */}
      <NavbarPublica />
      <main>
        {/* Outlet es el espacio donde React Router pone la página que corresponde a la ruta */}
        <Outlet />
      </main>
      {/* Pie de página y panel lateral del carrito */}
      <FooterPublico />
      <CarritoOffcanvas />
    </>
  );
}
