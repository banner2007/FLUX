import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://flux-production-593a.up.railway.app',
        changeOrigin: true,
        // Eliminamos "rewrite" por ahora para simplificar. 
        // Si el frontend llama a /api/generate, el proxy llamará a Target/api/generate.
        // Pero nuestro backend espera /generate. 
        // Así que debemos hacer rewrite de /api -> ""
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
})
