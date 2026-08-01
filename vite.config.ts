import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [react(), analyzer()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
