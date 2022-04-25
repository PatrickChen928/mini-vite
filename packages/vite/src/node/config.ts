import { getPlugins } from './plugins'
import type { Plugin } from 'rollup'

export interface ViteConfig {
  root?: string
  plugins?: Plugin[]
  mode?: 'development' | 'production'
}

export function resolveConfig(inlineConfig: ViteConfig): ViteConfig {
  const root = process.cwd()
  const isProduction = inlineConfig.mode === 'production'
  const resolved = {
    root,
    isProduction,
    ...inlineConfig
  }

  resolved.plugins = [
    ...getPlugins(!isProduction, resolved),
    ...(inlineConfig.plugins || [])
  ]

  return resolved
}
