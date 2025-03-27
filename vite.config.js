// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // 예: 특정 라이브러리를 미리 번들링
    include: ["lodash"],
  },
  build: {
    // Rollup의 세부 옵션 설정 가능
    rollupOptions: {
      output: {
        // 코드 스플리팅, 청크 이름 설정 등 추가 최적화 옵션
      },
    },
  },
});
