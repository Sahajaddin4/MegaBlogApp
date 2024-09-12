import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
     proxy:{
      '/api': {
        target: 'http://localhost:3000', // Change this to your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the /api prefix if needed
      },
     }
  } ,
  plugins: [react()],
})
