import { resolvePlugin } from './resolvePlugin'
import { cssPlugin } from './cssPlugin'
// import { importAnalysisPlugin } from './importAnalysis'
import esbuild from 'rollup-plugin-esbuild'
import type { ViteConfig } from '../config'

export function getPlugins(isDev: boolean, config: ViteConfig) {
  return [
    ...(isDev ? [resolvePlugin(config.root!), cssPlugin()] : []),
    // importAnalysisPlugin(config),
    esbuild({
      format: 'esm',
      minify: !isDev
    })
  ]
}
