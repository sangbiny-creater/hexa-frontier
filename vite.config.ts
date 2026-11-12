import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages(하위 경로)에서도 동작하도록 상대 경로로 빌드
  base: './',
  plugins: [react()],
  server: { port: 5181, host: true },
  test: { include: ['tests/**/*.test.ts'] },
} as any);
