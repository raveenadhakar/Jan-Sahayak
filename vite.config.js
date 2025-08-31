import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // This is from the previous fix
    port: 5173,
    allowedHosts: [
      'jan-sahayak.onrender.com', // Add your domain here
    ],
  },
})
