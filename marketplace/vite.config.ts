import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // expõe em 0.0.0.0 — acessível via IP da rede local
    port: 5173,
  },
})
