import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hn-client/',
  plugins: [react()],
  esbuild: {
    keepNames: true,
  },
  css: {
    postcss: {
      plugins: [     
        require('tailwindcss'),
        require('autoprefixer'),
      ]
    },
  },
  optimizeDeps: {
    force: true,
  },
})
