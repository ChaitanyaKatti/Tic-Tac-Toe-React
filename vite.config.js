import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    // Customize CSS minification separately if needed
    cssMinify: 'lightningcss' 
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
