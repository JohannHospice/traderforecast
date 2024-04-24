import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // exclude: [...configDefaults.exclude],
    // deps: {
    //   experimentalOptimizer: {
    //     web: { enabled: true },
    //     ssr: { enabled: true },
    //   },
    // },
    // benchmark: { reporters: ['default'] },
    // reporters: ['default'],
    // passWithNoTests: true,
    // coverage: {
    //   provider: 'v8',
    // },
  },
});
