import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@upward/design-tokens': path.resolve(__dirname, '../../packages/design-tokens/src/index.ts'),
      '@upward/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@upward/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@upward/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@upward/ui': path.resolve(__dirname, '../../packages/ui/src/index.tsx')
    }
  }
});
