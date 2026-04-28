import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
    minify: 'esbuild', 
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    cssMinify: 'lightningcss' 
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
