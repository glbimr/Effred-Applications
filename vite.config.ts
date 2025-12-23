import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Use '.' instead of process.cwd() to avoid TS error where Process type is missing cwd property
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // By default, Vite doesn't define `process.env` in the browser.
      // We explicitly define it here so your existing code using process.env.API_KEY works.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});