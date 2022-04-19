import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import TestPlugin from './vite-plugin-test.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TestPlugin(), vue()]
})
