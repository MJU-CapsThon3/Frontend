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
    https: httpsConfig, // 필요 시 HTTPS 옵션도 활성화
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      // 외부화할 패키지
      external: [
        'axios',
        'js-cookie',
        // 추가로 외부화할 모듈이 있으면 여기에 더 나열
      ],
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
