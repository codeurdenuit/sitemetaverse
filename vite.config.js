import { defineConfig } from 'vite';

export default defineConfig({
  root:'./client',
  mode:'development',
  publicDir: '../public',
  build: {
    outDir: '../.dist',
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    }
  },
});
