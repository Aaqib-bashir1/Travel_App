import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // This tells Vite to listen on all network interfaces
    port: 5173, // Ensure the port is correct (use whatever port you want)
  },
  plugins: [react()],
})

