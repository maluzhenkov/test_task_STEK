import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:
    process.env.NODE_ENV === 'production'
      ? process.env.VITE_BASE_URL || '/test_task_STEK/'
      : '/',
});
