import { defineConfig } from 'vite';

export default defineConfig({
  root:'./client',
  mode:'development',
  publicDir: '../public',
  build: {
    outDir: '../.dist',
    minify: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {},
        format: 'iife'
      }
    }
  },
});
