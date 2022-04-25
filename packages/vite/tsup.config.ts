import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/node/index.ts'],
    outDir: './dist/node',
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['vite/dist/client/index.mjs'],
    format: ['cjs']
  },
  {
    entry: ['src/client/index.ts'],
    outDir: './dist/client',
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['esm'],
    target: 'es2020'
  }
])
