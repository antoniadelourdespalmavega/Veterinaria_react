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
// El orden de los proveedores importa: AuthProvider va primero porque
// DataProvider necesita saber quién está conectado para pedirle los datos al backend.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter me permite tener varias "páginas" (rutas) sin recargar el navegador */}
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
