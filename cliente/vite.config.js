import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Necesario para detectar cambios en el volumen montado desde Windows
    watch: { usePolling: true },
  },
})
