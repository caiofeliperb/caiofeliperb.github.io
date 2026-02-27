import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Garante que caminhos (assets/js/css) funcionem no GitHub Pages e pastinhas
})
