import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Читаем .env файл из родительской директории
  // В Docker: /app/.env (родитель /app/frontend)
  // Локально: D:\projects\chemical\.env (родитель frontend/)
  envDir: '..',
})
