import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        // The six-chapter guided presentation (unchanged).
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        // Standalone classroom lesson page with the IBM video.
        lesson: fileURLToPath(new URL('./lesson.html', import.meta.url)),
      },
    },
  },
});
