import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Для GitHub Pages: base должен быть '/repository-name/'
  // Если репозиторий называется test_task_STEK, оставьте '/test_task_STEK/'
  // Если репозиторий имеет другое имя, измените base соответственно
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.VITE_BASE_URL || '/test_task_STEK/') 
    : '/',
})
