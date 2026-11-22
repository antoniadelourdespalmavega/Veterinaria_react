import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CLAVES, guardarLocal, leerLocal, quitarLocal } from '../utils/almacenamiento';

// Aquí manejo el carrito de compras: los productos, el total y si el panel lateral está abierto.
// Caja compartida del carrito (la usan Servicios, la barra de arriba y el pago)
const CarritoContext = createContext(null);

// Este componente envuelve la app y entrega el carrito a todas las pantallas
export function CarritoProvider({ children }) {
  // Los productos del carrito. Al empezar los recupero de localStorage para no perderlos si recargan.
  const [items, setItems] = useState(() => leerLocal(CLAVES.carrito, []));
  // Dice si el panel lateral del carrito está abierto o cerrado
  const [abierto, setAbierto] = useState(false);

  // Cada vez que cambia el carrito lo guardo en localStorage (si queda vacío, borro la clave)
  useEffect(() => {
    if (items.length === 0) quitarLocal(CLAVES.carrito);
    else guardarLocal(CLAVES.carrito, items);
  }, [items]);

  // Agrega un producto al carrito y abre el panel para que el usuario lo vea.
  // Le pongo un id único para poder borrar solo ese producto después.
  const agregar = useCallback((nombre, precio) => {
    setItems((prev) => [...prev, { id: Date.now() + Math.random(), nombre: String(nombre), precio: Number(precio) }]);
    setAbierto(true);
  }, []);

  // Quita un producto del carrito (dejo todos los que tengan un id distinto)
  const quitar = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  // Vacía todo el carrito (se usa cuando el pago sale aprobado)
  const vaciar = useCallback(() => setItems([]), []);

  // Total a pagar: sumo el precio de cada producto. useMemo lo recalcula solo cuando cambia el carrito.
  const total = useMemo(() => items.reduce((t, i) => t + (Number(i.precio) || 0), 0), [items]);

  return (
    // Aquí entrego todo lo que las pantallas pueden usar del carrito
    <CarritoContext.Provider value={{ items, total, agregar, quitar, vaciar, abierto, abrir: () => setAbierto(true), cerrar: () => setAbierto(false) }}>
      {children}
    </CarritoContext.Provider>
  );
}

// Atajo para usar el carrito: const { items, agregar } = useCarrito();
export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
}
