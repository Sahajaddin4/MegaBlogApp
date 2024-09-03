import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
   '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }, 
  } ,
  plugins: [react()],
})
