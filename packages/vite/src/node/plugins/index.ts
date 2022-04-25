import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { resolvePlugin } from './resolvePlugin'
import { cssPlugin } from './cssPlugin'
// import { importAnalysisPlugin } from './importAnalysis'
import type { ViteConfig } from '../config'

export function getPlugins(isDev: boolean, config?: ViteConfig) {
  return [
    ...(isDev
      ? [resolvePlugin(config!.root!), cssPlugin()]
      : [
          postcss({
            plugins: []
          })
        ]),
    // importAnalysisPlugin(config),
    esbuild({
      format: 'esm',
      minify: !isDev
    })
  ]
}
