import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // build: {
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //     },
  //   },
  //   cssMinify: 'lightningcss'
  // },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
