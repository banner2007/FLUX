
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const init = () => {
  console.log("Flux Studio: Iniciando montaje...");
  const container = document.getElementById('root');
  
  if (!container) {
    console.error("No se pudo encontrar el contenedor #root");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Flux Studio: Montaje completado.");
  } catch (error) {
    console.error("Error crítico durante el montaje de React:", error);
    container.innerHTML = `<div style="padding: 2rem; color: white; background: #991b1b; border-radius: 1rem; margin: 2rem;">
      <h1 style="font-size: 1.5rem; font-weight: bold;">Error Crítico</h1>
      <p>No se pudo cargar la aplicación. Por favor, revisa la consola del desarrollador.</p>
    </div>`;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
