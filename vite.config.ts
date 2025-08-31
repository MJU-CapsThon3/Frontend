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
      output: {
        manualChunks: undefined, // 코드 스플리팅 완전 비활성화
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        // 단일 번들 강제
        inlineDynamicImports: true,
      },
    },
    // 청크 크기 경고 비활성화
    chunkSizeWarningLimit: Infinity,
  },
});
