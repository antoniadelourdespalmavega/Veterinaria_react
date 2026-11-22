// Configuración de Vite (el programa que arma y levanta mi proyecto React).
// Aquí solo le digo que use el plugin de React para poder escribir JSX.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
