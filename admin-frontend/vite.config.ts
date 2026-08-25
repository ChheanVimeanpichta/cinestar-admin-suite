import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendPort = env.BACKEND_PORT || '5000';
  const target =
    env.VITE_API_TARGET ||
    env.VITE_API_BASE_URL ||
    `http://localhost:${backendPort}`;

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: target.startsWith('http') ? target : `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
