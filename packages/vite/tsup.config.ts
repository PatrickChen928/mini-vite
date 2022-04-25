import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/node/index.ts', 'src/client/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vite/dist/client/index.mjs'],
  format: ['cjs', 'esm'],
  target: 'es2018'
})
