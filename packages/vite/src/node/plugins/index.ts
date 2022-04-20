import { resolvePlugin } from './resolvePlugin'
import { cssPlugin } from './cssPlugin'
import esbuild from 'rollup-plugin-esbuild'
import type { ViteConfig } from '../server'

export function getPlugins(isDev: boolean, config: ViteConfig) {
  return [
    ...(isDev ? [resolvePlugin(config.root!), cssPlugin()] : []),
    esbuild({
      format: 'esm',
      minify: !isDev
    })
  ]
}
