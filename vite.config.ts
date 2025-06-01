// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SSL 인증서 경로
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
    https: httpsConfig,
    proxy: {
      // /users/** 프록시
      '/users': {
        target: 'https://api.thiscatthatcat.shop',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/users/, '/users'),
      },
      // /quests/** 프록시
      '/quests': {
        target: 'https://api.thiscatthatcat.shop',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/quests/, '/quests'),
      },
      // ─── /shop/** 요청을 모두 백엔드로 프록시 ───
      '/shop': {
        target: 'https://api.thiscatthatcat.shop',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/shop/, '/shop'),
      },
    },
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
      '/**/*.js': ['Content-Type: application/javascript'],
      '/**/*.ts': ['Content-Type: application/javascript'],
    },
  },
});
