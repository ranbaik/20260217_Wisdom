import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'pdf-vendor': ['html2canvas', 'jspdf'],
          'ai-vendor': ['@google/generative-ai'],
          'lunar-vendor': ['lunar-javascript'],
        },
      },
    },
  },
});
