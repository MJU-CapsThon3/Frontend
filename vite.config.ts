// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const keyPath = path.resolve(__dirname, 'ssl', 'server.key');
const certPath = path.resolve(__dirname, 'ssl', 'server.crt');

const httpsConfig =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    : undefined;

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  preview: {
    headers: {
      // .js 로 요청했을 때
      '/**/*.js': ['Content-Type: application/javascript'],
      // .ts 로 요청했을 때
      '/**/*.ts': ['Content-Type: application/javascript'],
    },
  },
});
