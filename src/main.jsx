import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Estilos: primero Bootstrap, después los iconos y al final mis estilos propios
// (van al final para poder sobreescribir lo de Bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/styles.css';
// Mi aplicación y los "contextos" (el estado que comparten todas las pantallas)
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import { DataProvider } from './context/DataContext';

// Aquí arranca la aplicación: la dibujo dentro del <div id="root"> del index.html.
// El orden de los proveedores importa: DataProvider va primero porque
// AuthProvider necesita los usuarios que él guarda.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter me permite tener varias "páginas" (rutas) sin recargar el navegador */}
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
