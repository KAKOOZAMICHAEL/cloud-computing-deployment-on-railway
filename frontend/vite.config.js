import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Railway/Express production serving expects this folder.
    outDir: 'build',
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Make local `/api/*` calls hit the Express backend.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

